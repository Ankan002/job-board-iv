import { DEFAULT_PAGE_SIZE } from "@/constants/configs";
import { useGetJobs } from "@/services/client/job";
import { onTextInputChange } from "@/utils/client-interactions.utils";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useDebounce, useDebouncedCallback } from "use-debounce";

export const useHomeScreen = () => {
	const [page, setPage] = useState<number>(1);

	const [searchKeyword, setSearchKeyword] = useState<string>("");
	const [totalPages, setTotalPages] = useState<number>(0);
	const [company, setCompany] = useState<string>("");
	const [location, setLocation] = useState<string>("");

	const [debouncedKeyword] = useDebounce(searchKeyword, 200);
	const onDebouncedKeywordChange = useDebouncedCallback(() => {
		setPage(1);
	}, 200);

	const { data, isFetching, isLoading, error } = useGetJobs({
		page,
		page_size: DEFAULT_PAGE_SIZE,
		q: debouncedKeyword,
		company,
		location,
	});

	const onIncrementPage = () => {
		if (page < totalPages) {
			setPage((prev) => prev + 1);
		}
	};

	const onDecrementPage = () => {
		if (page > 1) {
			setPage((prev) => prev - 1);
		}
	};

	const pickLocation = (location: string) => {
		setPage(1);
		setLocation(location);
	};

	const pickCompany = (company: string) => {
		setPage(1);
		setCompany(company);
	};

	useEffect(() => {
		if (data?.ok) {
			const count = data.data.count;

			const totalAvailablePages =
				count % DEFAULT_PAGE_SIZE === 0
					? Math.floor(count / DEFAULT_PAGE_SIZE)
					: Math.floor(count / DEFAULT_PAGE_SIZE) + 1;
			setTotalPages(totalAvailablePages);
		}
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
		onSearchKeywordChange: onTextInputChange(
			setSearchKeyword,
			onDebouncedKeywordChange,
		),
		debouncedKeyword,
		searchKeyword,
		onIncrementPage,
		onDecrementPage,
		location,
		pickLocation,
		company,
		pickCompany,
		page,
		totalPages,
	};
};
