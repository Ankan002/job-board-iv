import type { Metadata } from "next";
import { Outfit, Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import { QueryProvider, ThemeProvider } from "@/components/providers";

const inter = Inter({
	variable: "--font-inter",
	subsets: ["latin"],
	weight: "400",
});

const outfit = Outfit({
	variable: "--font-outfit",
	subsets: ["latin"],
	weight: "400",
});

const spaceGrotesk = Space_Grotesk({
	variable: "--font-space-grotesk",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Job Hunter",
	description: "The job board from Weworkremotely!",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={`${outfit.variable} ${inter.variable} ${spaceGrotesk.variable} antialiased`}
			>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<QueryProvider>{children}</QueryProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
