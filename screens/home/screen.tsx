"use client";

import { JobCard } from "@/components/cards";
import { useHomeScreen } from "./hook";

const HomeScreen = () => {
	const { data, isFetching, isLoading } = useHomeScreen();

	return (
		<div className="w-full flex-col flex min-h-screen bg-background font-primary text-foreground">
			<div className="w-full flex flex-col items-center p-4">
				<div className="w-full flex flex-col max-w-[1200px]">
					{data?.ok && data.data.jobs.length < 1 ? (
						<p className="text-center w-full text-3xl font-secondary">
							No data to show here!
						</p>
					) : (
						<div className="w-full grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
							{data?.ok &&
								data.data.jobs.map((job) => (
									<JobCard job={job} key={job.id} />
								))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default HomeScreen;
