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

interface Props {
	job: job;
}

export const JobCard = (props: Props) => {
	const { job } = props;

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
						<div className="w-full flex items-center">
							<p>{job.company}</p>
							<BadgeCheck className="ml-1" size={14} />
						</div>
						<div className="w-full flex mt-1 items-center">
							<MapPin className="mr-1 text-xs" size={14} />
							<p>{job.location ?? "Not mentioned"}</p>
						</div>
					</div>

					<div className="flex flex-1 flex-col items-end">
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
