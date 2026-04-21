const EVENT_ACCENT_BY_COLOR = {
	Blue: "#60a5fa",
	Green: "#34d399",
	Red: "#f87171",
	Yellow: "#facc15",
	Purple: "#a78bfa",
	Orange: "#fb923c",
} as const;

const DEFAULT_ACCENT = EVENT_ACCENT_BY_COLOR.Blue;

function hexToRgb(hex: string) {
	const sanitizedHex = hex.replace("#", "");
	const normalizedHex =
		sanitizedHex.length === 3
			? sanitizedHex
					.split("")
					.map((char) => `${char}${char}`)
					.join("")
			: sanitizedHex;

	const hexValue = Number.parseInt(normalizedHex, 16);
	if (Number.isNaN(hexValue)) {
		return { r: 96, g: 165, b: 250 };
	}

	return {
		r: (hexValue >> 16) & 255,
		g: (hexValue >> 8) & 255,
		b: hexValue & 255,
	};
}

export function getEventAccent(color?: string) {
	const accentHex = EVENT_ACCENT_BY_COLOR[color as keyof typeof EVENT_ACCENT_BY_COLOR] ?? DEFAULT_ACCENT;
	const { r, g, b } = hexToRgb(accentHex);
	const rgba = (alpha: number) => `rgba(${r}, ${g}, ${b}, ${alpha})`;

	return {
		accent: accentHex,
		bgSoft: rgba(0.14),
		bgMuted: rgba(0.08),
		borderSoft: rgba(0.35),
		borderMuted: rgba(0.26),
		textStrong: "rgba(255, 255, 255, 0.95)",
		textMuted: "rgba(255, 255, 255, 0.75)",
		glow: rgba(0.78),
	};
}
