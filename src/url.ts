import type { MalvoConnectOptions } from "./types";
import { DEFAULT_BASE_URL } from "./types";

/**
 * Builds `"{baseUrl}/connect?..."` for the given options. The hosted widget
 * reads `token` (and `resumeItemId`) today; filtering params are sent
 * forward-compatibly so they apply as soon as the widget honours them.
 */
export function buildConnectUrl(options: MalvoConnectOptions): string {
  const baseUrl = (options.baseUrl ?? DEFAULT_BASE_URL).replace(/\/+$/, "");
  const params = new URLSearchParams({ token: options.connectToken });

  if (options.includeSandbox) params.set("includeSandbox", "true");
  if (options.updateItem) params.set("updateItem", options.updateItem);
  if (options.connectorTypes?.length)
    params.set("connectorTypes", options.connectorTypes.join(","));
  if (options.connectorIds?.length)
    params.set("connectorIds", options.connectorIds.join(","));
  if (options.countries?.length)
    params.set("countries", options.countries.join(","));
  if (options.language) params.set("language", options.language);
  if (options.selectedConnectorId != null)
    params.set("selectedConnectorId", String(options.selectedConnectorId));

  return `${baseUrl}/connect?${params.toString()}`;
}

/** The widget origin, used to validate inbound postMessage events. */
export function widgetOrigin(baseUrl?: string): string {
  return new URL(baseUrl ?? DEFAULT_BASE_URL).origin;
}
