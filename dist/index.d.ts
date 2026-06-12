import type { DefineComponent } from "vue";

/** Known-user identity proof. Provide ONE of `googleIdToken`, `jwt`,
 *  or the legacy `userId` + `userHash` pair. `name` / `email` /
 *  `phone` populate the People profile; `attributes` is an open bag
 *  of context fields. */
export interface VisitorIdentity {
  googleIdToken?: string;
  jwt?: string;
  userId?: string;
  userHash?: string;
  name?: string;
  email?: string;
  phone?: string;
  attributes?: Record<string, unknown>;
}

export interface WexioWidgetProps {
  /** Wexio integration public key (`pk_live_...`). Omit for demo mode. */
  publicKey?: string;
  /** UI locale (BCP-47, e.g. "en", "pt-BR", "uk"). Overrides the
   *  operator's `localeStrategy`. */
  locale?: string;
  /** Unverified prechat prefill. */
  prefillName?: string;
  /** Unverified prechat prefill. */
  prefillEmail?: string;
  /** Unverified prechat prefill. */
  prefillPhone?: string;
  /** Known-user identity proof. Pass `null` to log out. */
  user?: VisitorIdentity | null;
}

export interface WexioWidgetEmits {
  /** Fires every time panel dimensions change (open ↔ closed). */
  resize: [size: { width: number; height: number }];
  /** Fires when the visitor closes the panel. */
  close: [];
}

/**
 * Vue 3 wrapper around the `<wexio-widget>` web component.
 *
 * Forwards camelCase props to kebab-case attributes on the underlying
 * custom element; re-emits the element's `wexio:resize` / `wexio:close`
 * CustomEvents as Vue events.
 *
 * Importing this module SIDE-EFFECT registers `<wexio-widget>` — no
 * separate script tag needed.
 */
export declare const WexioWidget: DefineComponent<
  WexioWidgetProps,
  {},
  {},
  {},
  {},
  {},
  {},
  WexioWidgetEmits
>;

export default WexioWidget;
