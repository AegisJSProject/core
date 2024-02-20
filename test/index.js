import { html, css, replaceStyles, getUniqueSelector, createPolicy } from '@shgysk8zer0/aegis';
import { reset } from '@shgysk8zer0/aegis-styles/reset.js';
import { baseTheme, lightTheme, darkTheme } from '@shgysk8zer0/aegis-styles/theme.js';
import { getComponent } from '@shgysk8zer0/aegis-component';
import './dad-joke.js';

createPolicy('default', {
	createHTML: (input, ...args) => {
		const el = document.createElement(input);
		el.setHTML(input);
		console.log({ input, args });
		return el.innerHTML;
	},
	createScript: () => trustedTypes.emptyScript,
});

const scope = getUniqueSelector();

replaceStyles(document, reset, baseTheme, lightTheme, darkTheme, css`.${scope} {
	color: red;
}`);

const DadJoke = await getComponent('dad-joke');

document.body.append(
	html`<header>
		<h1 class="${scope}">Hello, World!</h1>
	</header>`,
	new DadJoke(),
);
