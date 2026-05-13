import { useGSAP } from "@gsap/react";
import { createFileRoute, Link } from "@tanstack/react-router";
import gsap from "gsap";
import { ScrollToPlugin, ScrollTrigger } from "gsap/all";
import { useEffect, useMemo } from "react";
import { WavyBackground } from "src/components/shadcn/ui/shadcn-io/wavy-background";
import { PlaceholderImage2, PlaceholderImage3 } from "@/assets";
import { Button } from "@/components/shadcn/ui/button";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/shadcn/ui/card";
import { useTheme } from "@/components/Themeprovider";
import { m } from "@/paraglide/messages";
import { getServerMessage } from "@/services/get-server-message";

export const Route = createFileRoute("/")({
	loader: async ({ context }) => {
		getServerMessage({ data: "🎉" });
		const ctx = context;

		return { ctx };
	},
	component: App,
});

function App() {
	const { ctx } = Route.useLoaderData();
	const { resolvedTheme } = useTheme();

	// Calculate background color safely (no document access during SSR)
	const backgroundColor = useMemo(() => {
		return resolvedTheme === "dark" ? "#0f0f23" : "#ffffff";
	}, [resolvedTheme]);

	useEffect(() => {
		const previousBackgroundColor = document.body.style.backgroundColor;

		document.body.style.backgroundColor = backgroundColor;

		return () => {
			document.body.style.backgroundColor = previousBackgroundColor;
		};
	}, [backgroundColor]);

	// Only register GSAP plugins on client side, once
	useEffect(() => {
		if (typeof window !== "undefined") {
			gsap.registerPlugin(useGSAP, ScrollToPlugin, ScrollTrigger);
		}
	}, []);

	return (
		<div className="relative">
			<div>
				<div id="section1" className="overflow relative h-screen w-full">
					<WavyBackground
						backgroundFill={backgroundColor}
						colors={["#38bdf8", "#818cf8", "#c084fc", "#e879f9"]}
						waveWidth={30}
						blur={15}
						speed="fast"
						waveOpacity={1}
						containerClassName="h-full w-full"
						className="flex items-center justify-center"
					>
						<div className="z-10 px-4 text-center text-white">
							<h1 className="mb-4 font-bold text-4xl text-foreground md:text-5xl lg:text-6xl">
								VibeSpot
							</h1>
							<p className="text-foreground text-lg opacity-80 md:text-xl lg:text-2xl">
								Where music meets the moment
							</p>
							<div className="mt-6 flex justify-center">
								{ctx.IsAuthenticated ? (
									<Button className="rounded-full px-8 py-4 font-bold text-base transition-duration-300 hover:scale-105 hover:shadow-xl md:px-12 md:py-5 md:text-lg md:hover:scale-110 lg:px-14 lg:py-6 lg:text-xl">
										<Link to="/explore">{m.Home_Button2()}</Link>
									</Button>
								) : (
									<Button className="rounded-full px-8 py-4 font-bold text-base transition-duration-300 hover:scale-105 hover:shadow-xl md:px-12 md:py-5 md:text-lg md:hover:scale-110 lg:px-14 lg:py-6 lg:text-xl">
										<Link to="/signin">{m.Home_Button()}</Link>
									</Button>
								)}
							</div>
						</div>
					</WavyBackground>
				</div>
				<div
					id="section2"
					className="flex w-full flex-col border-t-1 border-b-1 text-center text-white"
				>
					<div>
						<Card className="m-4 bg-secondary p-8 shadow-lg transition-transform duration-300 md:m-8 md:p-12 lg:m-10 lg:p-20">
							<CardHeader>
								<CardTitle className="text-xl md:text-2xl lg:text-3xl">
									"VibeSpot isn't just an app, it's your gateway to
									unforgettable live music experiences. Discover events, connect
									with fellow music lovers, and let the rhythm of the city guide
									you to your next great adventure."
								</CardTitle>
								<CardDescription className="text-lg md:text-xl lg:text-2xl">
									- Alex R., Event Manager
								</CardDescription>
							</CardHeader>
						</Card>
					</div>
					<div className="flex flex-col items-center justify-between md:flex-row">
						<Card className="m-4 w-full bg-secondary p-6 shadow-lg md:m-8 md:w-1/2 md:p-8 lg:m-10 lg:p-10">
							<CardHeader>
								<CardTitle className="text-base md:text-lg lg:text-xl">
									Discover live music events happening around you with VibeSpot.
									Whether you're into rock, jazz, pop, or indie, our app helps
									you find the perfect event to match your vibe.
								</CardTitle>
								<CardDescription className="text-base md:text-lg lg:text-2xl"></CardDescription>
							</CardHeader>
						</Card>
						<div className="m-4 w-full md:m-8 md:w-1/4 lg:m-10">
							<img
								src={PlaceholderImage2}
								alt=""
								className="h-auto max-h-60 w-full rounded-2xl object-cover shadow-2xl md:h-47 md:max-h-none"
							/>
						</div>
					</div>
					<div className="flex flex-col items-center justify-between md:flex-row-reverse">
						<Card className="m-4 w-full bg-secondary p-6 shadow-lg md:m-8 md:w-1/2 md:p-8 lg:m-10 lg:p-10">
							<CardHeader>
								<CardTitle className="text-base md:text-lg lg:text-xl">
									"VibeSpot makes it easy to connect with friends and fellow
									music enthusiasts. Share events, plan meetups, and create
									unforgettable memories together."
								</CardTitle>
								<CardDescription className="text-sm md:text-base lg:text-lg">
									- Jamie L., Music Enthusiast
								</CardDescription>
							</CardHeader>
						</Card>
						<div className="m-4 w-full md:m-8 md:w-1/4 lg:m-10">
							<img
								src={PlaceholderImage3}
								alt=""
								className="h-auto max-h-60 w-full rounded-2xl object-cover shadow-2xl md:h-54 md:max-h-none"
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
