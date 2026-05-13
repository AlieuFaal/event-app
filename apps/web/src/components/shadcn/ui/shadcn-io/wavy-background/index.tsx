"use client";

import type React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { createNoise3D } from "simplex-noise";
import { cn } from "@/lib/utils";

export interface WavyBackgroundProps {
	children?: React.ReactNode;
	className?: string;
	containerClassName?: string;
	colors?: string[];
	waveWidth?: number;
	backgroundFill?: string;
	blur?: number;
	speed?: "slow" | "fast";
	waveOpacity?: number;
	[key: string]: unknown;
}

const DEFAULT_WAVE_COLORS = [
	"#38bdf8",
	"#818cf8",
	"#c084fc",
	"#e879f9",
	"#22d3ee",
];

const getAnimationSpeed = (speed: WavyBackgroundProps["speed"]) => {
	switch (speed) {
		case "slow":
			return 0.001;
		case "fast":
			return 0.002;
		default:
			return 0.001;
	}
};

export const WavyBackground = ({
	children,
	className,
	containerClassName,
	colors,
	waveWidth,
	backgroundFill = "white",
	blur = 10,
	speed = "fast",
	waveOpacity = 0.5,
	...props
}: WavyBackgroundProps) => {
	const [isSafari, setIsSafari] = useState(false);
	const [isClient, setIsClient] = useState(false);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const _colorKey = (colors ?? DEFAULT_WAVE_COLORS).join("|");
	const waveColors = useMemo(
		() => (colors?.length ? colors : DEFAULT_WAVE_COLORS),
		[colors?.length, colors],
	);

	useEffect(() => {
		if (!isClient) {
			return;
		}

		const canvas = canvasRef.current;
		const ctx = canvas?.getContext("2d");

		if (!canvas || !ctx) {
			return;
		}

		const noise = createNoise3D();
		const speedValue = getAnimationSpeed(speed);
		const currentWaveWidth = waveWidth ?? 50;
		const currentWaveOpacity = waveOpacity ?? 0.5;
		const currentBackgroundFill = backgroundFill || "black";
		let width = 0;
		let height = 0;
		let noiseTime = 0;
		let animationId = 0;

		const resizeCanvas = () => {
			width = ctx.canvas.width = canvas.offsetWidth;
			height = ctx.canvas.height = canvas.offsetHeight;
			ctx.filter = isSafari ? "none" : `blur(${blur}px)`;
		};

		const drawWave = (waveCount: number) => {
			noiseTime += speedValue;

			for (let waveIndex = 0; waveIndex < waveCount; waveIndex++) {
				ctx.beginPath();
				ctx.lineWidth = currentWaveWidth;
				ctx.strokeStyle = waveColors[waveIndex % waveColors.length];

				for (let x = 0; x < width; x += 5) {
					const y = noise(x / 800, 0.3 * waveIndex, noiseTime) * 100;
					ctx.lineTo(x, y + height * 0.5);
				}

				ctx.stroke();
				ctx.closePath();
			}
		};

		const render = () => {
			ctx.globalAlpha = 1;
			ctx.fillStyle = currentBackgroundFill;
			ctx.fillRect(0, 0, width, height);

			ctx.globalAlpha = currentWaveOpacity;
			drawWave(5);
			ctx.globalAlpha = 1;

			animationId = requestAnimationFrame(render);
		};

		resizeCanvas();
		render();
		window.addEventListener("resize", resizeCanvas);

		return () => {
			cancelAnimationFrame(animationId);
			window.removeEventListener("resize", resizeCanvas);
		};
	}, [
		isClient,
		isSafari,
		blur,
		backgroundFill,
		waveOpacity,
		speed,
		waveWidth,
		waveColors,
	]);

	useEffect(() => {
		setIsClient(true);
		// I'm sorry but i have got to support it on safari.
		setIsSafari(
			typeof window !== "undefined" &&
				navigator.userAgent.includes("Safari") &&
				!navigator.userAgent.includes("Chrome"),
		);
	}, []);

	return (
		<div
			className={cn(
				"relative flex h-full w-full flex-col items-center justify-center",
				containerClassName,
			)}
		>
			<canvas
				className="absolute inset-0 z-0 h-full w-full"
				ref={canvasRef}
				style={{
					...(isClient && isSafari ? { filter: `blur(${blur}px)` } : {}),
				}}
			/>
			<div className={cn("relative z-10", className)} {...props}>
				{children}
			</div>
		</div>
	);
};
