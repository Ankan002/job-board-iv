"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

interface Props {
	children: React.ReactNode;
}

export const QueryProvider = (props: Props) => {
	const queryProvider = new QueryClient();

	return (
		<QueryClientProvider client={queryProvider}>
			{props.children}
		</QueryClientProvider>
	);
};
