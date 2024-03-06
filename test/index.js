import {
	html, css, replaceStyles, getUniqueSelector, createPolicy, appendTo,
	createCallback, EVENTS, FUNCS,
} from '@aegisjsproject/core';
import { reset } from '@aegisjsproject/styles/reset.js';
import { baseTheme, lightTheme, darkTheme } from '@aegisjsproject/styles/theme.js';
import { btn } from '@aegisjsproject/styles/button.js';
import './dad-joke.js';

createPolicy('default', {
	createHTML: (input) => {
		const el = document.createElement('div');
		el.setHTML(input);
		return el.innerHTML;
	},
	createScript: () => trustedTypes.emptyScript,
});

const scope = getUniqueSelector();

replaceStyles(document, reset, baseTheme, lightTheme, darkTheme, btn, css`.${scope} {
	color: red;
}

.btn-container {
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	gap: 0.75rem;
	margin-block: 1.2rem;
}
`);

const DadJoke = await customElements.whenDefined('dad-joke');
const frag = document.createDocumentFragment();
const h1 = document.createElement('h1');

h1.classList.add(scope);
h1.textContent = 'Hello, World!';
frag.append(h1);

appendTo(document.body, html`
	<header>
		${frag}
	</header>
	${trustedTypes.defaultPolicy.createHTML('<hr />')}
	${new DadJoke()}
	<div class="flex row wrap btn-container">
		<a href="./#foo" ${EVENTS.onClick}="${FUNCS.navigate.link}" class="btn btn-primary">Link</a>
		<button type="button" ${EVENTS.onClick}="${createCallback(() => alert('Testing!'))}" class="btn btn-primary">TEST</button>
		<button type="button" ${EVENTS.onClick}="${FUNCS.debug.log}" data-foo="bar" class="btn btn-primary">Log</button>
		<button type="button" ${EVENTS.onClick}="${FUNCS.navigate.back}" class="btn  btn-primary">Back</button>
		<button type="button" ${EVENTS.onClick}="${FUNCS.navigate.forward}" class="btn  btn-primary">Forward</button>
		<button type="button" ${EVENTS.onClick}="${FUNCS.navigate.reload}" class="btn btn-primary">Reload</button>
		<button type="button" ${EVENTS.onClick}="${FUNCS.print}" class="btn btn-primary">Print</button>
	</div>
	${document.getElementById('tmp')}
	${css`.btn {font-size: 1.2em;}`}
`);
