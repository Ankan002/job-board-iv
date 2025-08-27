import { useTheme } from "next-themes";

export const useToggleTheme = () => {
	const { setTheme, theme } = useTheme();

	const onToggleTheme = () => {
		setTheme(theme === "dark" ? "light" : "dark");
	};

	return {
		onToggleTheme,
		theme: theme ?? "dark",
	};
};
