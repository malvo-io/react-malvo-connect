import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";
import type { MalvoConnectOptions, MalvoError } from "./types";
import { buildConnectUrl, widgetOrigin } from "./url";

/**
 * Renders the hosted Malvo Connect widget in a centered iframe modal and
 * bridges its `postMessage` events to your callbacks — the drop-in equivalent
 * of `react-pluggy-connect`'s `PluggyConnect`.
 *
 * Mounting opens the widget; unmounting closes it. The integrator typically
 * keeps it mounted behind a boolean:
 *
 * ```tsx
 * {open && (
 *   <MalvoConnect
 *     connectToken={token}
 *     onSuccess={({ item }) => console.log(item.id)}
 *     onClose={() => setOpen(false)}
 *   />
 * )}
 * ```
 *
 * Webhooks remain the source of truth; `onSuccess` is a best-effort UX hook.
 */
export function MalvoConnect(props: MalvoConnectOptions) {
  const { onSuccess, onError, onOpen, onClose, onEvent } = props;

  // Keep the latest callbacks without re-subscribing the message listener.
  const handlers = useRef({ onSuccess, onError, onOpen, onClose, onEvent });
  handlers.current = { onSuccess, onError, onOpen, onClose, onEvent };

  const src = buildConnectUrl(props);
  const origin = widgetOrigin(props.baseUrl);

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (event.origin !== origin) return;
      const data = event.data as { type?: unknown } | null;
      if (!data || typeof data.type !== "string") return;

      handlers.current.onEvent?.(data as { type: string });

      switch (data.type) {
        case "malvo:success":
          handlers.current.onSuccess?.({
            item: (data as { item: MalvoSuccessItem }).item,
          });
          break;
        case "malvo:error":
          handlers.current.onError?.(
            ((data as { error?: MalvoError }).error ?? {
              code: "UNKNOWN",
              message: "Erro desconhecido",
            }) as MalvoError,
          );
          break;
        case "malvo:close":
          handlers.current.onClose?.();
          break;
        default:
          break;
      }
    }

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [origin]);

  return (
    <div style={OVERLAY_STYLE} role="dialog" aria-modal="true">
      <iframe
        title="Malvo Connect"
        src={src}
        style={FRAME_STYLE}
        onLoad={() => {
          handlers.current.onOpen?.();
          handlers.current.onEvent?.({ type: "OPEN" });
        }}
        allow="clipboard-write; publickey-credentials-get"
      />
    </div>
  );
}

type MalvoSuccessItem = Record<string, unknown> & {
  id: string;
  status?: string;
};

const OVERLAY_STYLE: CSSProperties = {
  position: "fixed",
  inset: 0,
  zIndex: 2147483000,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "rgba(15, 23, 42, 0.55)",
  backdropFilter: "blur(2px)",
};

const FRAME_STYLE: CSSProperties = {
  width: "min(420px, 100%)",
  height: "min(720px, 100%)",
  maxHeight: "100dvh",
  border: "none",
  borderRadius: 16,
  boxShadow: "0 24px 60px rgba(2, 6, 23, 0.45)",
  background: "#fff",
};
