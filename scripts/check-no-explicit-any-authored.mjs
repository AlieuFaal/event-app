import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'

const EXCLUDED_FILES = new Set(['apps/web/src/routeTree.gen.ts'])
const EXCLUDED_PREFIXES = ['apps/web/src/paraglide/']
const TARGET_FILE_PATTERN = /\.(d\.ts|ts|tsx|js|jsx)$/

const EXPLICIT_ANY_PATTERNS = [
	/\bas\s+any\b/,
	/:\s*any\b/,
	/<\s*any\s*>/,
	/@type\s*\{\s*any\s*\}/,
]

const trackedFiles = execFileSync('git', ['ls-files', '-z'], {
	encoding: 'utf8',
})
	.split('\u0000')
	.filter(Boolean)
	.filter((file) => TARGET_FILE_PATTERN.test(file))
	.filter((file) => !EXCLUDED_FILES.has(file))
	.filter((file) => !EXCLUDED_PREFIXES.some((prefix) => file.startsWith(prefix)))

const matches = []

for (const file of trackedFiles) {
	if (!existsSync(file)) {
		continue
	}

	const lines = readFileSync(file, 'utf8').split('\n')

	lines.forEach((line, index) => {
		if (EXPLICIT_ANY_PATTERNS.some((pattern) => pattern.test(line))) {
			matches.push(`${file}:${index + 1}:${line.trim()}`)
		}
	})
}

if (matches.length > 0) {
	console.error('Found explicit `any` in authored files:\n')
	console.error(matches.join('\n'))
	process.exit(1)
}

console.log('No explicit `any` found in authored files.')
