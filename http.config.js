import { useDefaultCSP, addConnectSrc, addTrustedTypePolicy, lockCSP } from '@aegisjsproject/http-utils/csp.js';

addConnectSrc('https://icanhazdadjoke.com/');
addTrustedTypePolicy('aegis-router#html', 'default');
lockCSP();

export default {
	open: true,
	routes: {
		'/': '@aegisjsproject/dev-server',
		'/favicon.svg': '@aegisjsproject/dev-server/favicon.js'
	},
	responsePostprocessors: [useDefaultCSP()],
};
