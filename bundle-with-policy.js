export * from './bundle.js';
import './default-policy.js';
export const policy = 'trustedTypes' in globalThis ? trustedTypes.defaultPolicy : null;
