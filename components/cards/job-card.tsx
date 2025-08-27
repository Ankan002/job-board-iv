"use client";

import { job } from "@/db/prisma";
import {
	Card,
	CardAction,
	CardContent,
	CardHeader,
	CardTitle,
} from "../ui/card";
import { BadgeCheck, MapPin, SquareArrowOutUpRight } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

interface Props {
	job: job;
	onLocationClick: (location: string) => void;
	onCompanyClick: (company: string) => void;
}

export const JobCard = (props: Props) => {
	const { job, onCompanyClick, onLocationClick } = props;

	return (
		<Card className="flex-1 w-full">
			<CardHeader>
				<CardTitle>{job.title}</CardTitle>
				<CardAction>
					<a href={job.apply_url} type="_blank">
						<SquareArrowOutUpRight size={15} />
					</a>
				</CardAction>
			</CardHeader>
			<CardContent className="mt-0">
				<div className="w-full flex">
					<div className="flex flex-1 flex-col">
						<div className="flex flex-1 items-center">
							<button
								className="underline underline-offset-2 cursor-pointer text-sm w-fit"
								onClick={() => onCompanyClick(job.company)}
							>
								{job.company}
							</button>
							<BadgeCheck className="ml-1" size={14} />
						</div>
						<div className="flex-1 flex mt-1 items-center">
							<button
								className="underline underline-offset-2 cursor-pointer text-sm w-fit"
								onClick={() =>
									job.location
										? onLocationClick(job.location)
										: undefined
								}
							>
								{job.location ?? "Not mentioned"}
							</button>
							<MapPin className="ml-1 text-xs" size={14} />
						</div>
					</div>

					<div className="flex flex-col items-end">
						<p className="text-end">
							{job.days_ago ? `${job.days_ago} D` : ""}
						</p>
					</div>
				</div>

				<div className="w-full flex flex-wrap mt-1">
					{(job.tags as unknown as string[] | undefined)?.map(
						(t, i) => (
							<Badge variant="outline" className="m-0.5" key={i}>
								{t}
							</Badge>
						),
					)}
				</div>
			</CardContent>
		</Card>
	);
};
