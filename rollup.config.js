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
		'@aegisjsproject/trusted-types/bundle.js',
		'@aegisjsproject/trusted-types/trusted-types.js',
		'@aegisjsproject/trusted-types/harden.js',
		'@aegisjsproject/parsers/html.js',
		'@aegisjsproject/parsers/css.js',
		'@aegisjsproject/parsers/svg.js',
		'@aegisjsproject/parsers/math.js',
		'@aegisjsproject/parsers/xml.js',
		'@aegisjsproject/parsers/json.js',
		'@aegisjsproject/parsers/url.js',
	]
}, {
	input: 'bundle.js',
	plugins: [nodeResolve()],
	output: {
		file: 'bundle.min.js',
		format: 'module',
		plugins: [terser()],
	}
}, {
	input: 'polyfill.js',
	plugins: [nodeResolve()],
	output: {
		file: 'polyfill.min.js',
		format: 'iife',
		plugins: [terser()],
	}
}, {
	input: 'polyfill-with-policy.js',
	plugins: [nodeResolve()],
	output: {
		file: 'polyfill-with-policy.min.js',
		format: 'iife',
		plugins: [terser()],
	}
}, {
	input: 'bundle-with-policy.js',
	plugins: [nodeResolve()],
	output: {
		file: 'bundle-with-policy.min.js',
		format: 'module',
		plugins: [terser()],
	}
}];

