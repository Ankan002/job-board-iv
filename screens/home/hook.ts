import { useGetJobs } from "@/services/client/job";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const useHomeScreen = () => {
	const [page, setPage] = useState<number>(1);

	const { data, isFetching, isLoading, error } = useGetJobs({
		page,
		page_size: 15,
	});

	useEffect(() => {
		console.log(data);
	}, [data]);

	useEffect(() => {
		if (error) {
			toast(error.message);
		}
	}, [error]);

	return {
		data,
		isFetching,
		isLoading,
	};
};
