export * from './core.js';
import './default-policy.js';
export const policy = 'trustedTypes' in globalThis ? trustedTypes.defaultPolicy : null;
