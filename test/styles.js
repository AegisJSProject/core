import { css, darkCSS, lightCSS } from '@shgysk8zer0/aegis';
import * as palette from './palette.js';

export function sheetToFile(sheet, {
	filename = 'styles.css',
} = {}) {
	return new File(Array.from(sheet.rules).map(rule => rule.cssText), filename, { type: 'text/css' });
}

export async function sheetToLink(sheet, {
	crossOrigin = 'anonymous',
	referrerPolicy = 'no-referrer',
	fetchPriority = 'auto',
	integrity,
	blocking,
} = {}) {
	const link = document.createElement('link');
	link.relList.add('stylesheet');
	link.referrerPolicy = referrerPolicy;
	link.fetchPriority = fetchPriority;

	if (typeof integrity === 'string') {
		link.integrity = integrity;
	}

	if (typeof crossOrigin === 'string') {
		link.crossOrigin = crossOrigin;
	}

	if (typeof blocking === 'string') {
		link.blocking = blocking;
	}

	if (typeof sheet.media === 'string') {
		link.media = sheet.media;
	}

	if (sheet.disabled) {
		link.disabled = true;
	}

	link.href = URL.createObjectURL(sheetToFile(sheet));

	return link;
}

export const reset = css`body {
	margin: 0;
}

*, ::before, *::after {
	box-sizing: border-box;
}`;

export const baseTheme = css`:root {
	color-scheme: light dark;
	color: ${palette.dark};
	background-color: ${palette.light};
	font-family: system-ui;
}

:root[data-theme="light"] {
	color-scheme: light;
	color: ${palette.dark};
	background-color: ${palette.light};
}

:root[data-theme="dark"] {
	color-scheme: dark;
	color: ${palette.light};
	background-color: ${palette.dark};
}`;

export const darkTheme = darkCSS`:root:not([data-theme="light"]) {
	color: ${palette.light};
	background-color: ${palette.dark};
}`;

export const lightTheme = lightCSS`:root:not([data-theme="dark"]) {
	color: ${palette.dark};
	background-color: ${palette.light};
}`;

export const componentBase = css`:host {
	display: block;
	color-scheme: light dark;
	color: ${palette.dark};
	background-color: ${palette.light};
	font-family: system-ui;
}

:host([theme="light"]) {
	color-scheme: light;
}

:host([theme="dark"]) {
	color-scheme: dark;
	color: ${palette.light};
	background-color: ${palette.dark};
}`;

export const componentDarkTheme = darkCSS`:host(:not([theme="light"])) {
	color-scheme: dark;
	color: ${palette.light};
	background-color: ${palette.dark};
}`;

export const componentLightTheme = lightCSS`:host(:not([theme="dark"])) {
	color-scheme: light;
	color: ${palette.dark};
	background-color: ${palette.light};
}`;

export const btn = css`.btn:not([hidden]) {
	cursor: pointer;
	appearance: button;
	display: inline-block;
	padding: 0.6em 1.3em;
	font-family: inherit;
	border-radius: 4px;
	text-decoration: none;
}

.btn.btn-primary {
	color: ${palette.light};
	background-color: ${palette.primary};
	border-width: 1px;
	border-style: solid;
	border-color: ${palette.blue[6]});
	transition: background-color 150ms ease-in-out, border-color 150ms ease-in-out;
}

.btn.btn-primary:hover {
	background-color: ${palette.blue[5]};
	border-color: ${palette.blue[7]};
}

.btn.btn-primary:active {
	background-color: ${palette.blue[6]};
	border-color: ${palette.blue[8]};
}`;
