import { db } from "@/db/client";
import { Prisma } from "@/db/prisma";
import { withErrorHandler } from "@/utils/api-handler.utils";
import { NextResponse } from "next/server";
import z from "zod";

const QuerySchema = z.object({
	q: z.string().trim().optional().default(""),
	type: z.string().trim().optional().default(""),
	location: z.string().trim().optional().default(""),
	company: z.string().trim().optional().default(""),

	since_days: z.coerce.number().int().min(0).max(3650).optional().default(0),

	sort_by: z
		.enum(["company", "title", "created_at", "days_ago"])
		.optional()
		.default("created_at"),
	sort: z.enum(["asc", "desc"]).optional().default("desc"),

	page: z.coerce.number().int().min(1).optional().default(1),
	page_size: z.coerce.number().int().min(1).max(60).optional().default(15),
});

export const GET = withErrorHandler(async (request) => {
	const requestQuery = Object.fromEntries(
		request.nextUrl.searchParams.entries(),
	);

	const {
		company,
		location,
		page,
		page_size,
		q,
		since_days,
		sort_by,
		sort,
		type,
	} = QuerySchema.parse(requestQuery);

	const where: Prisma.jobWhereInput = {};

	if (q) {
		where.OR = [
			{ title: { contains: q, mode: "insensitive" } },
			{ company: { contains: q, mode: "insensitive" } },
			{ description: { contains: q, mode: "insensitive" } },
		];
	}

	if (type) where.type = { equals: type, mode: "insensitive" };
	if (location) where.location = { equals: location, mode: "insensitive" };
	if (company) where.company = { equals: company, mode: "insensitive" };

	if (since_days) {
		where.OR = [
			...(where.OR ?? []),
			{
				days_ago: {
					lte: since_days,
				},
			},
		];
	}

	const [jobs, count] = await Promise.all([
		db.job.findMany({
			where,
			orderBy: {
				[sort_by]: sort,
			},
			skip: (page - 1) * page_size,
			take: page_size,
		}),
		db.job.count({
			where,
		}),
	]);

	return NextResponse.json(
		{
			ok: true,
			code: 200,
			data: {
				jobs,
				count,
			},
		},
		{
			status: 200,
		},
	);
});
