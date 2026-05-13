const workspacePaths = [
	"apps/web",
	"apps/mobile/vibespot",
	"apps/api",
	"packages/database",
	"packages/validation",
];

const shouldFix = Bun.argv.includes("--fix") || Bun.argv.includes("--write");
const biomeArgs = ["biome", "check", "."];

if (shouldFix) {
	biomeArgs.push("--write", "--unsafe");
}

for (const workspace of workspacePaths) {
	console.log(`\n==> Linting ${workspace}${shouldFix ? " (fix mode)" : ""}`);

	const lintResult = Bun.spawnSync({
		cmd: ["bun", "x", ...biomeArgs],
		cwd: workspace,
		stdout: "inherit",
		stderr: "inherit",
		stdin: "inherit",
	});

	if (lintResult.exitCode !== 0) {
		process.exit(lintResult.exitCode ?? 1);
	}
}

const anyCheckResult = Bun.spawnSync({
	cmd: ["bun", "scripts/check-no-explicit-any-authored.mjs"],
	stdout: "inherit",
	stderr: "inherit",
	stdin: "inherit",
});

process.exit(anyCheckResult.exitCode ?? 0);
