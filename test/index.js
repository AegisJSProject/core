import { html, css, replaceStyles, getUniqueSelector } from '@shgysk8zer0/aegis';
import { reset, baseTheme, lightTheme, darkTheme } from './styles.js';
import { getComponent } from './component.js';
import './dad-joke.js';

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
