import {
	html, css, replaceStyles, getUniqueSelector, createPolicy, appendTo,
	createCallback, EVENTS, AEGIS_EVENT_HANDLER_CLASS, FUNCS,
} from '@aegisjsproject/core';
import { reset } from '@aegisjsproject/styles/reset.js';
import { baseTheme, lightTheme, darkTheme } from '@aegisjsproject/styles/theme.js';
import './dad-joke.js';

createPolicy('default', {
	createHTML: (input) => {
		const el = document.createElement(input);
		el.setHTML(input);
		return el.innerHTML;
	},
	createScript: () => trustedTypes.emptyScript,
});

const scope = getUniqueSelector();

replaceStyles(document, reset, baseTheme, lightTheme, darkTheme, css`.${scope} {
	color: red;
}`);

const DadJoke = await customElements.whenDefined('dad-joke');

appendTo(document.body, html`
	<header>
		<h1 class="${scope}">Hello, World!</h1>
	</header>`,
new DadJoke(),
html`
	<button href="./#foo" ${EVENTS.onClick}="${FUNCS.navigate.link}" class="${AEGIS_EVENT_HANDLER_CLASS}">Link</button>
	<button type="button" ${EVENTS.onClick}="${createCallback(() => alert('Testing!'))}" class="${AEGIS_EVENT_HANDLER_CLASS}">TEST</button>
	<button type="button" ${EVENTS.onClick}="${FUNCS.debug.log}" data-foo="bar" class="${AEGIS_EVENT_HANDLER_CLASS} btn btn-primary">Log</button>
	<button type="button" ${EVENTS.onClick}="${FUNCS.navigate.back}" class="${AEGIS_EVENT_HANDLER_CLASS} btn  btn-primary">Back</button>
	<button type="button" ${EVENTS.onClick}="${FUNCS.navigate.forward}" class="${AEGIS_EVENT_HANDLER_CLASS} btn  btn-primary">Forward</button>
	<button type="button" ${EVENTS.onClick}="${FUNCS.navigate.reload}" class="${AEGIS_EVENT_HANDLER_CLASS} btn  btn-primary">Reload</button>
	<button type="button" ${EVENTS.onClick}="${FUNCS.print}" class="${AEGIS_EVENT_HANDLER_CLASS} btn btn-primary">Print</button>
`);
