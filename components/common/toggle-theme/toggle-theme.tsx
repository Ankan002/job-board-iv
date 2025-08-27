"use client";

import { Button } from "@/components/ui/button";
import { useToggleTheme } from "./hook";
import { Moon, Sun } from "lucide-react";

const ToggleTheme = () => {
	const { theme, onToggleTheme } = useToggleTheme();

	return (
		<Button
			variant="secondary"
			size="icon"
			onClick={onToggleTheme}
			className="fixed bottom-3 right-3 cursor-pointer"
			aria-label="Toggle theme button"
		>
			{theme && theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
		</Button>
	);
};

export default ToggleTheme;
