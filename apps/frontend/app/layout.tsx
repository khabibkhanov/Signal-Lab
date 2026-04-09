import type { Metadata } from "next";
import { IBM_Plex_Mono, Space_Grotesk } from "next/font/google";

import { Providers } from "./providers";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
	subsets: ["latin"],
	variable: "--font-space-grotesk",
});

const ibmPlexMono = IBM_Plex_Mono({
	subsets: ["latin"],
	weight: ["400", "500"],
	variable: "--font-ibm-plex-mono",
});

export const metadata: Metadata = {
	title: "Signal Lab",
	description: "Observability playground for scenario-driven signals",
};

export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang="en">
			<body
				className={`${spaceGrotesk.variable} ${ibmPlexMono.variable} font-sans antialiased`}
			>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
