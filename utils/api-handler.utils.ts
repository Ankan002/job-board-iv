import { Prisma } from "@/db/prisma";
import { HttpError } from "@/types/error";
import { NextFetchEvent, NextRequest, NextResponse } from "next/server";

type Handler<TCtx = unknown> = (
	req: NextRequest,
	ctx?: TCtx & { params?: Record<string, string> },
	event?: NextFetchEvent,
) => Promise<Response> | Response;

type Options = {
	/** expose full error message to client (only recommended in dev) */
	exposeError?: boolean;
	/** custom logger (defaults to console.error) */
	logger?: (error: unknown, meta: Record<string, unknown>) => void;
	/** map arbitrary errors to HttpError (return null to skip) */
	mapError?: (error: unknown) => HttpError | null;
};

function isZodError(e: unknown): e is { issues: any[]; name: string } {
	return Boolean(
		e &&
			typeof e === "object" &&
			(e as any).name === "ZodError" &&
			Array.isArray((e as any).issues),
	);
}

function defaultMapError(e: unknown): HttpError | null {
	// 1) Already an HttpError
	if (e instanceof HttpError) return e;

	// 2) Zod validation error → 400
	if (isZodError(e)) {
		const issues = (e as any).issues;
		const msg = "Invalid request";
		return new HttpError(400, msg, "BAD_REQUEST", { issues });
	}

	// 3) Prisma known errors
	if (e instanceof Prisma.PrismaClientKnownRequestError) {
		// e.code examples: P2002 unique violation, P2025 record not found, etc.
		if (e.code === "P2025") {
			return new HttpError(404, "Resource not found", "NOT_FOUND");
		}
		if (e.code === "P2002") {
			return new HttpError(
				409,
				"Conflict (unique constraint)",
				"CONFLICT",
				{
					meta: e.meta,
				},
			);
		}
		return new HttpError(400, "Database error", e.code, { meta: e.meta });
	}
	if (e instanceof Prisma.PrismaClientValidationError) {
		return new HttpError(400, "Database validation error", "DB_VALIDATION");
	}

	// 4) Generic fallback (500)
	return null;
}

export function withErrorHandler<TCtx = unknown>(
	handler: Handler<TCtx>,
	opts: Options = {},
): Handler<TCtx> {
	const {
		exposeError = process.env.NODE_ENV !== "production",
		logger = console.error,
		mapError,
	} = opts;

	return async (req, ctx, event) => {
		const requestId =
			req.headers.get("x-request-id") ||
			(globalThis.crypto?.randomUUID?.() ?? "");
		const meta = {
			requestId,
			url: req.url,
			method: req.method,
			params: (ctx as any)?.params,
		};

		try {
			const res = await handler(req, ctx as any, event);
			// Ensure we always include request id
			const headers = new Headers(res.headers);
			if (requestId) headers.set("x-request-id", requestId);
			return new Response(res.body, {
				status: res.status,
				statusText: res.statusText,
				headers,
			});
		} catch (error: unknown) {
			// Map to HttpError if possible
			const mapped =
				(mapError ? mapError(error) : null) ||
				defaultMapError(error) ||
				new HttpError(500, "Internal server error", "INTERNAL_ERROR");

			// Log safely (always)
			logger(error, {
				...meta,
				status: mapped.status,
				code: mapped.code,
			});

			const body = {
				ok: false,
				error: {
					message: exposeError
						? mapped.message
						: mapped.status >= 500
							? "Something went wrong"
							: mapped.message,
					code: mapped.code ?? undefined,
					// Only expose details in dev
					details: exposeError ? mapped.details : undefined,
					requestId: requestId || undefined,
				},
			};

			return NextResponse.json(body, {
				status: mapped.status,
				headers: requestId ? { "x-request-id": requestId } : undefined,
			});
		}
	};
}
