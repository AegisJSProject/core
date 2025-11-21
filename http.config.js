import { addConnectSrc } from '@aegisjsproject/dev-server/csp.js';

addConnectSrc('https://icanhazdadjoke.com/');

export default {
	open: true,
	routes: {
		'/': '@aegisjsproject/dev-server',
		'/favicon.svg': '@aegisjsproject/dev-server/favicon.js'
	}
};
