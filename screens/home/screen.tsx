"use client";

import { JobCard } from "@/components/cards";
import { useHomeScreen } from "./hook";
import { Input } from "@/components/ui/input";
import { Funnel } from "lucide-react";
import { Button } from "@/components/ui/button";

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
				</div>
			</div>
		</div>
	);
};

export default HomeScreen;
