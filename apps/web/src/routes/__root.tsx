import { createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import React, { useEffect } from "react";
import Footer from "@/components/Footer";
import { Header } from "@/components/Header.js";
import { ModeToggle } from "@/components/mode-toggle";
import { Toaster } from "@/components/shadcn/ui/sonner";
import { ThemeProvider } from "@/components/Themeprovider.js";
import { setLocale } from "@/paraglide/runtime";
import {
	getLocaleServerFn,
	getThemeServerFn,
} from "@/services/ThemeService.js";
import { getSessionUserFn } from "@/services/user-service";
import appCss from "../styles.css?url";

export const Route = createRootRoute({
	beforeLoad: async () => {
		try {
			const user = await getSessionUserFn();
			const isAuthenticated = !!user;

			return { currentUser: user, IsAuthenticated: isAuthenticated };
		} catch (error) {
			console.error("Error in root beforeLoad:", error);
			return { currentUser: null, IsAuthenticated: false };
		}
	},
	loader: async ({ context }) => {
		const ctx = context;

		return {
			ctx,
			theme: await getThemeServerFn(),
			locale: await getLocaleServerFn(),
		};
	},
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "VibeSpot - Discover and Share Events Near You",
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
		],
	}),
	// errorComponent: ({ error }) => (
	//   <div className="min-h-screen bg-gray-50 p-4">
	//     <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
	//       <h2 className="text-lg font-semibold text-red-800">Oops something went wrong! </h2>
	//       <p className="text-red-600">{error.message}</p>
	//       <details className="mt-2">
	//         <summary className="cursor-pointer text-sm text-red-700">Stack trace</summary>
	//         <pre className="mt-2 text-xs text-red-600 whitespace-pre-wrap">{error.stack}</pre>
	//       </details>
	//     </div>
	//   </div>
	// ),
	shellComponent: RootDocument,
});

const themeInitScript = `
(() => {
  const match = document.cookie.match(/(?:^|; )theme-preference=(light|dark|system)(?:;|$)/);
  const preference = match ? match[1] : "system";
  const resolved = preference === "system"
    ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
    : preference;

  document.documentElement.classList.remove("light", "dark");
  document.documentElement.classList.add(resolved);
  document.documentElement.dataset.themePreference = preference;
})();
`.trim();

function RootDocument({ children }: { children: React.ReactNode }) {
	const { ctx, theme, locale } = Route.useLoaderData();
	const [hideFooter, setHideFooter] = React.useState(false);

	useEffect(() => {
		setLocale(locale as "en" | "sv", { reload: false });
	}, [locale]);

	useEffect(() => {
		if (window.location.pathname === "/") {
			setHideFooter(false);
		}
	}, []);

	return (
		<ThemeProvider theme={theme}>
			<html
				lang={locale}
				className={theme === "system" ? undefined : theme}
				suppressHydrationWarning
			>
				<head>
					<script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
					<HeadContent />
				</head>
				<body className="mx-auto min-h--10 flex-1" suppressHydrationWarning>
					{ctx.IsAuthenticated && <Header currentUser={ctx.currentUser} />}
					{!ctx.IsAuthenticated && (
						<div className="fixed top-4 right-4 z-50">
							<ModeToggle />
						</div>
					)}
					<main>{children}</main>
					{hideFooter && <Footer />}
					<Toaster position="top-center" richColors={true} duration={1500} />
					<Scripts />
				</body>
			</html>
		</ThemeProvider>
	);
}
