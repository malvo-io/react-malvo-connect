# react-malvo-connect

React component for the **hosted Malvo Connect widget** (Open Finance Brasil),
talking to your own Malvo API.

It renders the hosted widget (`{baseUrl}/connect?token=...`) in an iframe modal
and bridges its `postMessage` events to your callbacks.

## Install

```bash
npm install react-malvo-connect
```

## Usage

The only required input is a **Connect Token** minted by *your* backend
(`POST /auth` → `apiKey` → `POST /connect_token` → `accessToken`, 30-min TTL).
Never ship your `clientId`/`clientSecret` to the browser.

```tsx
import { useState } from "react";
import { MalvoConnect } from "react-malvo-connect";

export function ConnectBankButton({ token }: { token: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)}>Conectar banco</button>
      {open && (
        <MalvoConnect
          connectToken={token}
          baseUrl="https://malvo.io"
          includeSandbox={process.env.NODE_ENV !== "production"}
          onSuccess={({ item }) => console.log("item", item.id)}
          onError={(err) => console.error(err.code, err.message)}
          onClose={() => setOpen(false)}
          onEvent={(e) => console.debug("event", e.type)}
        />
      )}
    </>
  );
}
```

Mounting opens the widget; unmounting closes it. All options are accepted as
props.

> **Webhooks are the source of truth.** `onSuccess` is best-effort UX — the user
> may close the tab first. Persist connections from the `item/created` /
> `item/updated` webhooks on your backend.

## Open Finance / OAuth

Banks reject iframe framing, so when an Open Finance connector is selected the
widget authorizes in a **top-level popup** and resumes automatically when it
returns. No extra setup is required; just don't block popups for your origin.

## Props

| Prop | Type | Notes |
|---|---|---|
| `connectToken` | `string` | **Required.** |
| `baseUrl` | `string` | malvo-web origin. Default `https://malvo.io`. |
| `includeSandbox` | `boolean` | Show sandbox connectors. |
| `updateItem` | `string` | Item id for an update flow. |
| `connectorTypes` / `connectorIds` / `countries` / `language` / `selectedConnectorId` | — | Filtering / UX hints. |
| `onSuccess` / `onError` / `onOpen` / `onClose` / `onEvent` | callbacks | Widget lifecycle callbacks. |
