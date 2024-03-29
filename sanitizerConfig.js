/**
 * @copyright 2023-2024 Chris Zuber <admin@kernvalley.us>
 * @see https://wicg.github.io/sanitizer-api/#default-configuration-dictionary
 */

export const allowCustomElements = true;
export const allowUnknownMarkup = false;
export const allowComments = false;


/**
 * Tags listed on MDN, + a few deprecated / experimental ones
 * Selector: `#content table td > a[href^="/en-US/docs/Web/HTML/Element/"] > code`
 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element
 */
export const allowElements = [
	'html', 'head', 'link', 'meta', 'body', 'address', 'article', 'aside', 'footer',
	'header', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'hgroup', 'main', 'nav', 'section',
	'search', 'blockquote', 'cite', 'div', 'dd', 'dt', 'dl', 'figcaption', 'figure',
	'hr', 'li', 'ol', 'ul', 'menu', 'p', 'pre', 'a', 'abbr', 'b', 'bdi', 'bdo', 'br',
	'code', 'data', 'dfn', 'em', 'i', 'kbd', 'mark', 'q', 'rp', 'ruby', 'rt', 's',
	'del', 'ins', 'samp', 'small', 'span', 'strong', 'sub', 'sup', 'time', 'u',
	'var', 'wbr', 'area', 'audio', 'img', 'map', 'track', 'video', 'picture',
	'source', 'canvas', 'caption', 'col', 'colgroup', 'table', 'tbody', 'tr', 'td',
	'tfoot', 'th', 'thead', 'button', 'datalist', 'option', 'fieldset', 'label',
	'form', 'input', 'legend', 'meter', 'optgroup', 'select', 'output', 'progress',
	'textarea', 'details', 'summary', 'dialog', 'slot', 'template', 'dir',
	'strike', 'selectmenu', 'center',
];

export const allowAttributes = {
	'abbr': ['*'],
	'accept': ['*'],
	'accept-charset': ['*'],
	'accesskey': ['*'],
	// 'action': ['*'],
	'align': ['*'],
	'alink': ['*'],
	'allow': ['*'],
	'allowfullscreen': ['*'],
	'alt': ['*'],
	'anchor': ['*'],
	'archive': ['*'],
	'as': ['*'],
	'async': ['*'],
	'autocapitalize': ['*'],
	'autocomplete': ['*'],
	'autocorrect': ['*'],
	'autofocus': ['*'],
	'autopictureinpicture': ['*'],
	'autoplay': ['*'],
	'axis': ['*'],
	'background': ['*'],
	'behavior': ['*'],
	// 'bgcolor': ['*'],
	'border': ['*'],
	'bordercolor': ['*'],
	'capture': ['*'],
	'cellpadding': ['*'],
	'cellspacing': ['*'],
	'challenge': ['*'],
	'char': ['*'],
	'charoff': ['*'],
	'charset': ['*'],
	'checked': ['*'],
	'cite': ['*'],
	'class': ['*'],
	'classid': ['*'],
	'clear': ['*'],
	'code': ['*'],
	// 'codebase': ['*'],
	'codetype': ['*'],
	'color': ['*'],
	'cols': ['*'],
	'colspan': ['*'],
	'compact': ['*'],
	'content': ['*'],
	'contenteditable': ['*'],
	'controls': ['*'],
	'controlslist': ['*'],
	'conversiondestination': ['*'],
	'coords': ['*'],
	'crossorigin': ['*'],
	'csp': ['*'],
	'data': ['*'],
	'datetime': ['*'],
	'declare': ['*'],
	'decoding': ['*'],
	'default': ['*'],
	'defer': ['*'],
	'dir': ['*'],
	'direction': ['*'],
	'dirname': ['*'],
	'disabled': ['*'],
	'disablepictureinpicture': ['*'],
	'disableremoteplayback': ['*'],
	'disallowdocumentaccess': ['*'],
	'download': ['*'],
	'draggable': ['*'],
	'elementtiming': ['*'],
	'enctype': ['*'],
	'end': ['*'],
	'enterkeyhint': ['*'],
	// 'event': ['*'],
	'exportparts': ['*'],
	// 'face': ['*'],
	'for': ['*'],
	'form': ['*'],
	// 'formaction': ['*'],
	'formenctype': ['*'],
	'formmethod': ['*'],
	'formnovalidate': ['*'],
	'formtarget': ['*'],
	// 'frame': ['*'],
	'frameborder': ['*'],
	'headers': ['*'],
	'height': ['*'],
	'hidden': ['*'],
	'high': ['*'],
	'href': ['*'],
	'hreflang': ['*'],
	'hreftranslate': ['*'],
	'hspace': ['*'],
	// 'http-equiv': ['*'],
	'id': ['*'],
	'imagesizes': ['*'],
	'imagesrcset': ['*'],
	'importance': ['*'],
	'impressiondata': ['*'],
	'impressionexpiry': ['*'],
	'incremental': ['*'],
	'inert': ['*'],
	'inputmode': ['*'],
	'integrity': ['*'],
	'invisible': ['*'],
	'is': ['*'],
	'ismap': ['*'],
	'keytype': ['*'],
	'kind': ['*'],
	'label': ['*'],
	'lang': ['*'],
	'language': ['*'],
	'latencyhint': ['*'],
	'leftmargin': ['*'],
	'link': ['*'],
	'list': ['*'],
	'loading': ['*'],
	'longdesc': ['*'],
	'loop': ['*'],
	'low': ['*'],
	'lowsrc': ['*'],
	'manifest': ['*'],
	'marginheight': ['*'],
	'marginwidth': ['*'],
	'max': ['*'],
	'maxlength': ['*'],
	'mayscript': ['*'],
	'media': ['*'],
	'method': ['*'],
	'min': ['*'],
	'minlength': ['*'],
	'multiple': ['*'],
	'muted': ['*'],
	'name': ['*'],
	'nohref': ['*'],
	'nomodule': ['*'],
	// 'nonce': ['*'],
	'noresize': ['*'],
	'noshade': ['*'],
	'novalidate': ['*'],
	'nowrap': ['*'],
	'object': ['*'],
	'open': ['*'],
	'optimum': ['*'],
	'part': ['*'],
	'pattern': ['*'],
	'ping': ['*'],
	'placeholder': ['*'],
	'playsinline': ['*'],
	'policy': ['*'],
	'popover': ['*'],
	'popovertarget': ['*'],
	'poopovertargetaction': ['*'],
	'poster': ['*'],
	'preload': ['*'],
	'pseudo': ['*'],
	'readonly': ['*'],
	'referrerpolicy': ['*'],
	'rel': ['*'],
	'reportingorigin': ['*'],
	'required': ['*'],
	'resources': ['*'],
	'rev': ['*'],
	'reversed': ['*'],
	'role': ['*'],
	'rows': ['*'],
	'rowspan': ['*'],
	'rules': ['*'],
	'sandbox': ['*'],
	'scheme': ['*'],
	'scope': ['*'],
	'scopes': ['*'],
	'scrollamount': ['*'],
	'scrolldelay': ['*'],
	'scrolling': ['*'],
	'select': ['*'],
	'selected': ['*'],
	'shadowrootmode': ['*'],
	'shadowrootdelegatesfocus': ['*'],
	'shape': ['*'],
	'size': ['*'],
	'sizes': ['*'],
	'slot': ['*'],
	'span': ['*'],
	'spellcheck': ['*'],
	'src': ['*'],
	'srcdoc': ['*'],
	'srclang': ['*'],
	'srcset': ['*'],
	'standby': ['*'],
	'start': ['*'],
	'step': ['*'],
	// 'style': ['*'],
	'summary': ['*'],
	'tabindex': ['*'],
	'target': ['*'],
	'text': ['*'],
	'title': ['*'],
	'topmargin': ['*'],
	'translate': ['*'],
	'truespeed': ['*'],
	'trusttoken': ['*'],
	'type': ['*'],
	'usemap': ['*'],
	'valign': ['*'],
	'value': ['*'],
	'valuetype': ['*'],
	'version': ['*'],
	'virtualkeyboardpolicy': ['*'],
	'vlink': ['*'],
	'vspace': ['*'],
	'webkitdirectory': ['*'],
	'width': ['*'],
	'wrap': ['*'],
};

export const sanitizerConfig = {
	allowCustomElements, allowUnknownMarkup, allowComments, allowElements,
	allowAttributes,
};
