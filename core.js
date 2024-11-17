/**
 * @copyright 2023-2024 Chris Zuber <admin@kernvalley.us>
 */

export {
	attachListeners, observeEvents, disconnectEventsObserver, EVENTS,
	setGlobalErrorHandler, registerEventAttribute,
} from '@aegisjsproject/callback-registry/events.js';

export {
	hasCallback, getCallback, listCallbacks, callCallback, createCallback,
	closeRegistration, registerCallback, getHost, FUNCS,
} from '@aegisjsproject/callback-registry/callbackRegistry.js';

export {
	text, createStyleSheet, createCSSParser, css, lightCSS, darkCSS ,
	styleSheetToFile, styleSheetToLink, createHTMLParser, html, doc,
	htmlUnsafe, docUnsafe, htmlToFile, xml, svg, json, math, url,
} from './parsers.js';

export {
	setProp, setAttr, isTrustPolicy, hasDefaultPolicy, getAttributeType,
	getPropertyType, isHTML, isScript, isScriptURL, isTrustedType, createHTML,
	createScript, createScriptURL, createPolicy, createSanitizerPolicy, getDefaultPolicy,
} from './trust.js';

export { DATE_FORMAT, formatDate, stringify, data, attr } from './stringify.js';

export {
	getUniqueSelector, replaceStyles, addStyles, appendTo, prependTo, replace,
	escape, escapeAttrVal,
} from './dom.js';

export {
	registerComponent, getRegisteredComponentTags, getRegisteredComponents,
} from './componentRegistry.js';

export { createComponent, clone } from './component.js';

export * from '@aegisjsproject/state/state.js';

export * from '@aegisjsproject/router/router.js';

export * from '@aegisjsproject/component/component.js';
