# Welcome to @wexio/messenger-widget-vue 👋

[![Version](https://img.shields.io/npm/v/@wexio/messenger-widget-vue.svg)](https://www.npmjs.com/package/@wexio/messenger-widget-vue)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![Documentation](https://img.shields.io/badge/docs-wexio.io-blue.svg)](https://learn.wexio.io/docs/web-widget)

Native Vue 3 component for the [Wexio](https://wexio.io) web messenger. Thin reactive wrapper around the underlying `<wexio-widget>` custom element — same `WidgetShell` runtime as the script-injected iframe and the React component. Same chat, same visitor identity, same backend; the only difference is **where the Vue tree mounts**.

🏠 [Website](https://wexio.io)
📚 [Developer Docs](https://learn.wexio.io/docs/web-widget)

## 📂 Description

- [Installation](#installation)
- [Quick start](#quick-start)
- [Build configuration](#build-configuration)
- [Identifying users](#identifying-users)
- [Props](#props)
- [Events](#events)
- [Types](#types)
- [SSR](#ssr)
- [Browser support](#browser-support)
- [Author](#author)
- [License](#-license)

## Installation

```bash
yarn add @wexio/messenger-widget-vue
```

or

```bash
npm install @wexio/messenger-widget-vue
```

`vue >= 3.3` is a peer dependency — the widget uses the host's Vue runtime.

## Quick start

```vue
<script setup lang="ts">
import { WexioWidget } from "@wexio/messenger-widget-vue";
</script>

<template>
  <main>
    <!-- your app -->
    <WexioWidget public-key="pk_live_..." />
  </main>
</template>
```

That's it — the widget mounts a floating launcher, handles its own theme/locale/state, and the operator dashboard sees the visitor immediately.

## Build configuration

Vue's template compiler warns about unknown DOM elements by default. Mark `wexio-widget` as a custom element so the warning is suppressed and Vue doesn't try to component-resolve it:

### Vite

```js
// vite.config.js
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag === "wexio-widget",
        },
      },
    }),
  ],
});
```

### Vue CLI

```js
// vue.config.js
module.exports = {
  chainWebpack: (config) => {
    config.module
      .rule("vue")
      .use("vue-loader")
      .tap((opts) => ({
        ...opts,
        compilerOptions: {
          isCustomElement: (tag) => tag === "wexio-widget",
        },
      }));
  },
};
```

### Nuxt 3

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  vue: {
    compilerOptions: {
      isCustomElement: (tag) => tag === "wexio-widget",
    },
  },
});
```

## Identifying users

Pass a verified `user` prop to log a known visitor in. Provide ONE proof — a Google FedCM `id_token`, a host-signed `jwt`, or the legacy `userId` + `userHash` HMAC pair:

```vue
<script setup lang="ts">
import { WexioWidget, type VisitorIdentity } from "@wexio/messenger-widget-vue";

const user: VisitorIdentity = {
  jwt: serverSignedJwt, // host-signed identity token (recommended)
  name: "Ada Lovelace",
  email: "ada@example.com",
};
</script>

<template>
  <WexioWidget public-key="pk_live_..." :user="user" />
</template>
```

> **Use a reactive `ref` for `user` when identity changes** — the wrapper watches it and re-runs `identify()` on change. Pass `null` to log the visitor out.

## Props

| Prop            | Type                          | Description                                                                                                                                |
| --------------- | ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `public-key`    | `string`                      | Wexio integration public key (`pk_live_...`). Omit to render in demo mode.                                                                |
| `locale`        | `string`                      | UI locale (BCP-47, e.g. `"en"`, `"pt-BR"`, `"uk"`). Overrides the operator's `localeStrategy`.                                            |
| `prefill-name`  | `string`                      | Unverified prechat prefill.                                                                                                                |
| `prefill-email` | `string`                      | Unverified prechat prefill.                                                                                                                |
| `prefill-phone` | `string`                      | Unverified prechat prefill.                                                                                                                |
| `user`          | `VisitorIdentity \| null`     | Known-user identity proof. Pass `null` to log out.                                                                                         |

## Events

| Event    | Payload                                | When                                                |
| -------- | -------------------------------------- | --------------------------------------------------- |
| `resize` | `{ width: number; height: number }`    | Panel dimensions changed (open ↔ closed). |
| `close`  | —                                      | Visitor closed the panel.                            |

```vue
<template>
  <WexioWidget
    public-key="pk_live_..."
    @resize="onResize"
    @close="onClose"
  />
</template>

<script setup lang="ts">
function onResize(size: { width: number; height: number }) {
  console.log(size.width, size.height);
}
function onClose() {
  console.log("visitor closed the panel");
}
</script>
```

## Types

### VisitorIdentity

```ts
interface VisitorIdentity {
  googleIdToken?: string;  // Google FedCM id_token (preferred)
  jwt?: string;            // Host-signed JWT
  userId?: string;         // Legacy HMAC pair…
  userHash?: string;       // …(HMAC-SHA256(userId, integrationSecret))
  name?: string;
  email?: string;
  phone?: string;
  attributes?: Record<string, unknown>;
}
```

## SSR

The wrapper renders an empty `<wexio-widget>` element on the server. The actual widget initialises on first client-side mount (`onMounted`). For Nuxt / SSR apps, no special handling is needed — the custom element runs only in the browser.

## Browser support

Modern evergreen browsers — anything that supports Shadow DOM and ES2020. Internet Explorer is not supported.

## Use with other frameworks

The underlying widget runtime is a Web Component, so it works in any modern framework:

- [`@wexio/messenger-widget-react`](https://www.npmjs.com/package/@wexio/messenger-widget-react) — React
- [`@wexio/messenger-widget-angular`](https://www.npmjs.com/package/@wexio/messenger-widget-angular) — Angular
- [`@wexio/messenger-widget-ember`](https://www.npmjs.com/package/@wexio/messenger-widget-ember) — Ember

## Author

👤 **Wexio** ([https://wexio.io](https://wexio.io))

## Show your support

Give a ⭐️ if this package helped you!

## 📝 License

This project is [MIT](./LICENSE) licensed.

---

_Created with ❤️ by [Wexio](https://wexio.io)_
