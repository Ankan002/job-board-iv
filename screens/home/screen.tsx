"use client";

import { JobCard } from "@/components/cards";
import { useHomeScreen } from "./hook";
import { Input } from "@/components/ui/input";
import { Funnel } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";

const HomeScreen = () => {
	const {
		data,
		isFetching,
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
	} = useHomeScreen();

	return (
		<div className="w-full flex-col flex min-h-screen bg-background font-primary text-foreground">
			<div className="w-full flex flex-col items-center p-4">
				<div className="w-full flex flex-col max-w-[1200px]">
					<div className="w-full flex justify-end">
						<Input
							value={searchKeyword}
							onChange={onSearchKeywordChange}
							placeholder="Search Keyword"
							className="w-60"
						/>
					</div>
					<div className="w-full flex flex-wrap mt-4">
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
								<PaginationItem>
									<PaginationPrevious
										onClick={onDecrementPage}
										className="cursor-pointer"
									/>
								</PaginationItem>
								<PaginationItem>
									<PaginationNext
										onClick={onIncrementPage}
										className="cursor-pointer"
									/>
								</PaginationItem>
							</PaginationContent>
						</Pagination>
					</div>
				</div>
			</div>
		</div>
	);
};

export default HomeScreen;
