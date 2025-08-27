import { job } from "@/db/prisma";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

interface JobsQueryParamArgs {
	q?: string;
	type?: string;
	location?: string;
	company?: string;
	since_days?: number;
	sort_by?: "company" | "title" | "created_at" | "days_ago";
	sort?: "asc" | "desc";
	page?: number;
	page_size?: number;
}

type GetJobsResponse =
	| {
			ok: true;
			code: number;
			data: {
				jobs: job[];
				count: number;
			};
	  }
	| {
			ok: false;
			error: {
				message?: string;
			};
	  };

export const useGetJobs = (args: JobsQueryParamArgs) => {
	const qs = new URLSearchParams();

	const entries = Object.entries(args) as [
		keyof JobsQueryParamArgs,
		string,
	][];
	for (const [k, v] of entries) {
		if (v === undefined || v === null) continue;
		if (typeof v === "string" && v.trim() === "") continue;
		qs.set(k, String(v));
	}

	const url = `/api/jobs?${qs}`;

	return useQuery<GetJobsResponse>({
		queryKey: ["get-jobs", url],
		queryFn: async () => {
			const response = await fetch(url, {
				method: "GET",
				headers: {
					"content-type": "application/json",
				},
			});

			if (!response.ok) {
				const eData = (await response.json()) as GetJobsResponse;

				throw new Error(
					!eData.ok
						? (eData.error.message ?? "Something went wrong")
						: "Something went wrong",
				);
			}

			const data = await response.json();

			return data as GetJobsResponse;
		},
		retry: 0,
		placeholderData: keepPreviousData,
	});
};
