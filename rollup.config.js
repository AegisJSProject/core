import terser from '@rollup/plugin-terser';
import nodeResolve from '@rollup/plugin-node-resolve';

export default [{
	input: 'core.js',
	output: {
		file: 'core.cjs',
		format: 'cjs',
	},
	external: [
		'@aegisjsproject/sanitizer/config/base.js',
		'@aegisjsproject/sanitizer/config/mathml.js',
		'@aegisjsproject/sanitizer/config/svg.js',
		'@aegisjsproject/parsers/html.js',
		'@aegisjsproject/parsers/css.js',
		'@aegisjsproject/parsers/svg.js',
		'@aegisjsproject/parsers/math.js',
		'@aegisjsproject/parsers/xml.js',
		'@aegisjsproject/parsers/json.js',
	]
}, {
	input: 'bundle.js',
	plugins: [nodeResolve()],
	output: {
		file: 'bundle.min.js',
		format: 'module',
		plugins: [terser()],
	}
}];

