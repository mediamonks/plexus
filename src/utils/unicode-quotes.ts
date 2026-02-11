const QUOTE_REPLACEMENTS: [string, string][] = [
	['\u201E', '\\u201E'],
	['\u201C', '\\u201C'],
	['\u201D', '\\u201D'],
	['\u2018', '\\u2018'],
	['\u2019', '\\u2019'],
	['\u00AB', '\\u00AB'],
	['\u00BB', '\\u00BB'],
	['\u2039', '\\u2039'],
	['\u203A', '\\u203A'],
];

export function escapeUnicodeQuotes(text: string): string {
	let result = text;
	for (const [char, escaped] of QUOTE_REPLACEMENTS) {
		result = result.replaceAll(char, escaped);
	}
	return result;
}

export function unescapeUnicodeQuotes(text: string): string {
	let result = text;
	for (const [char, escaped] of QUOTE_REPLACEMENTS) {
		result = result.replaceAll(escaped, char);
	}
	return result;
}
