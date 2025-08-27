"use client";

import { useHomeScreen } from "./hook";

const HomeScreen = () => {
	const { data, isFetching, isLoading } = useHomeScreen();

	return (
		<div className="w-full flex-col flex min-h-screen bg-background font-primary text-foreground">
			This is the home!
		</div>
	);
};

export default HomeScreen;
