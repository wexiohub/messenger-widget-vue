/**
 * `@wexio/messenger-widget-vue` — Vue 3 wrapper around the `<wexio-widget>`
 * web component.
 *
 * Mounts a Shadow-DOM-isolated Wexio messenger inside a Vue tree. Forwards
 * camelCase props to the underlying custom element's kebab-case
 * attributes, and re-emits the element's `wexio:resize` / `wexio:close`
 * CustomEvents as Vue events (with the `.detail` unwrapped).
 *
 * Importing this module side-effect registers `<wexio-widget>` as a
 * custom element. The web-component bundle ships in this package's
 * `dist/widget.js`; the consumer's bundler resolves it relative to
 * the package main.
 *
 * Vue treats `<wexio-widget>` as an unknown DOM element by default —
 * configure your build so the compiler skips it:
 *
 *   // vite.config.js
 *   import vue from "@vitejs/plugin-vue";
 *   export default defineConfig({
 *     plugins: [vue({
 *       template: { compilerOptions: { isCustomElement: (tag) => tag === "wexio-widget" } },
 *     })],
 *   });
 */

import {
  defineComponent,
  h,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from "vue";

import "./widget.js";

export const WexioWidget = defineComponent({
  name: "WexioWidget",
  props: {
    /** Wexio integration public key (`pk_live_...`). Omit for demo mode. */
    publicKey: { type: String, default: undefined },
    /** UI locale (BCP-47). Overrides the operator's `localeStrategy`. */
    locale: { type: String, default: undefined },
    /** Force the widget mode. Public consumers should not set this —
     *  it auto-resolves to `production` when `publicKey` is set,
     *  `demo` otherwise. */
    mode: { type: String, default: undefined },
    /** Unverified prechat prefill. */
    prefillName: { type: String, default: undefined },
    /** Unverified prechat prefill. */
    prefillEmail: { type: String, default: undefined },
    /** Unverified prechat prefill. */
    prefillPhone: { type: String, default: undefined },
    /** Known-user identity proof. Pass `null` to log out. */
    user: { type: [Object, null], default: undefined },
  },
  emits: {
    resize: (payload) =>
      payload &&
      typeof payload.width === "number" &&
      typeof payload.height === "number",
    close: () => true,
  },
  setup(props, { emit }) {
    const elRef = ref(null);

    const onResize = (event) => {
      if (event && event.detail) emit("resize", event.detail);
    };
    const onClose = () => emit("close");

    onMounted(() => {
      const el = elRef.value;
      if (!el) return;
      el.addEventListener("wexio:resize", onResize);
      el.addEventListener("wexio:close", onClose);
      if (props.user) el.identify?.(props.user);
    });

    onBeforeUnmount(() => {
      const el = elRef.value;
      if (!el) return;
      el.removeEventListener("wexio:resize", onResize);
      el.removeEventListener("wexio:close", onClose);
    });

    // Identity is set imperatively rather than as a reactive attribute —
    // mirrors the React component's `user` prop semantics. `null` /
    // `undefined` logs the visitor out.
    watch(
      () => props.user,
      (next) => {
        const el = elRef.value;
        if (!el || !el.identify) return;
        el.identify(next ?? null);
      },
    );

    return () =>
      h("wexio-widget", {
        ref: elRef,
        "public-key": props.publicKey,
        locale: props.locale,
        mode: props.mode,
        "prefill-name": props.prefillName,
        "prefill-email": props.prefillEmail,
        "prefill-phone": props.prefillPhone,
      });
  },
});

export default WexioWidget;
