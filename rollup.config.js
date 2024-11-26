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
		'@aegisjsproject/url/url.js',
		'@aegisjsproject/state/state.js',
		'@aegisjsproject/router/router.js',
		'@aegisjsproject/component/component.js',
		'@aegisjsproject/callback-registry/callbackRegistry.js',
		'@aegisjsproject/callback-registry/events.js',
	]
}, {
	input: 'core.js',
	plugins: [nodeResolve()],
	output: {
		file: 'core.min.js',
		format: 'esm',
		plugins: [terser()],
		sourcemap: true,
	}
}, {
	input: 'bundle.js',
	plugins: [nodeResolve()],
	output: {
		file: 'bundle.min.js',
		format: 'module',
		plugins: [terser()],
		sourcemap: true,
	}
}, {
	input: 'bundle-with-policy.js',
	plugins: [nodeResolve()],
	output: {
		file: 'bundle-with-policy.min.js',
		format: 'module',
		plugins: [terser()],
		sourcemap: true,
	}
}];

