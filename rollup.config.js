export default {
	input: 'core.js',
	output: {
		file: 'core.cjs',
		format: 'cjs',
	},
	external: [
		'@aegisjsproject/sanitizer/config/base.js',
		'@aegisjsproject/sanitizer/config/mathml.js',
		'@aegisjsproject/sanitizer/config/svg.js',
	]
};

