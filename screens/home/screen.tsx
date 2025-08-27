"use client";

import { JobCard } from "@/components/cards";
import { useHomeScreen } from "./hook";
import { Input } from "@/components/ui/input";
import { ArrowDownZA, ArrowUpZA, Funnel, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { SORT_BY_SELECT_DATA } from "@/constants/configs";

const HomeScreen = () => {
	const {
		data,
		isLoading,
		onDecrementPage,
		onIncrementPage,
		onSearchKeywordChange,
		searchKeyword,
		company,
		pickCompany,
		location,
		pickLocation,
		page,
		totalPages,
		pickSortBy,
		toggleSort,
		sort,
		sortBy,
		isFetching,
	} = useHomeScreen();

	return (
		<div className="w-full flex-col flex min-h-screen bg-background font-primary text-foreground">
			<div className="w-full flex flex-col items-center p-4">
				<div className="w-full flex flex-col max-w-[1200px]">
					<div className="w-full flex justify-end items-center">
						{isFetching && (
							<Loader2 className="animate-spin mr-1.5" />
						)}
						<Select
							defaultValue={sortBy}
							onValueChange={pickSortBy}
						>
							<SelectTrigger className="mr-1.5 cursor-pointer min-w-20">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{SORT_BY_SELECT_DATA.map((o) => (
									<SelectItem
										value={o.value}
										className="cursor-pointer"
										key={o.value}
									>
										{o.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<Button
							size="icon"
							className="mr-1.5 cursor-pointer"
							onClick={toggleSort}
						>
							{sort === "asc" && <ArrowUpZA />}
							{sort === "desc" && <ArrowDownZA />}
						</Button>
						<Input
							value={searchKeyword}
							onChange={onSearchKeywordChange}
							placeholder="Search Keyword"
							className="lg:w-60 w-40"
						/>
					</div>
					<div className="w-full flex overflow-auto mt-4">
						<Button
							className="mr-1"
							size={"icon"}
							variant="secondary"
						>
							<Funnel />
						</Button>

						{company && (
							<Button
								className="mx-1 cursor-pointer"
								onClick={() => pickCompany("")}
							>
								Company: {company}
							</Button>
						)}
						{location && (
							<Button
								className="mx-1 cursor-pointer"
								onClick={() => pickLocation("")}
							>
								Location: {location}
							</Button>
						)}
					</div>
					{isLoading && !data && (
						<div className="w-full grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-4">
							{new Array(15).fill(0).map((_, i) => (
								<Skeleton className="w-full h-60" key={i} />
							))}
						</div>
					)}
					{data?.ok && data.data.jobs.length < 1 ? (
						<p className="text-center w-full text-3xl font-secondary mt-4">
							No data to show here!
						</p>
					) : (
						<div className="w-full grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-4">
							{data?.ok &&
								data.data.jobs.map((job) => (
									<JobCard
										job={job}
										key={job.id}
										onCompanyClick={pickCompany}
										onLocationClick={pickLocation}
									/>
								))}
						</div>
					)}
					<div className="w-full flex justify-center items-center mt-4">
						<Pagination>
							<PaginationContent>
								{page > 1 && (
									<PaginationItem>
										<PaginationPrevious
											onClick={onDecrementPage}
											className="cursor-pointer"
										/>
									</PaginationItem>
								)}
								{page < totalPages && (
									<PaginationItem>
										<PaginationNext
											onClick={onIncrementPage}
											className="cursor-pointer"
										/>
									</PaginationItem>
								)}
							</PaginationContent>
						</Pagination>
					</div>
				</div>
			</div>
		</div>
	);
};

export default HomeScreen;
