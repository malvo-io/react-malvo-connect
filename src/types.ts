/** Shared option/callback types for the Malvo Connect React SDK. */

/** A successfully created/updated Item, as surfaced to `onSuccess`. */
export interface MalvoSuccess {
  /** The Item object — at minimum `id`, `status`, `connector`. */
  item: Record<string, unknown> & { id: string; status?: string };
}

/**
 * Error surfaced to `onError`. `code` includes item error codes
 * (`INVALID_CREDENTIALS`, `ACCOUNT_LOCKED`, `SITE_NOT_AVAILABLE`, ...) plus the
 * widget-specific `UNAUTHORIZED` and `TOKEN_EXPIRED`.
 */
export interface MalvoError {
  code: string;
  message: string;
  itemId?: string;
}

/** Fine-grained lifecycle payload surfaced to `onEvent`. */
export interface MalvoEvent {
  type: string;
  [key: string]: unknown;
}

export interface MalvoConnectOptions {
  /** The 30-minute Connect Token from your backend (`POST /connect_token`). */
  connectToken: string;
  /** Origin serving the hosted widget (the malvo-web `FRONTEND_URL`). */
  baseUrl?: string;
  /** Show sandbox connectors (development only). */
  includeSandbox?: boolean;
  /** Existing item id for an update flow (token must be minted with it). */
  updateItem?: string;
  connectorTypes?: string[];
  connectorIds?: number[];
  countries?: string[];
  language?: string;
  selectedConnectorId?: number;
  /** Connection (or update) succeeded. */
  onSuccess?: (data: MalvoSuccess) => void;
  /** Connection failed. */
  onError?: (error: MalvoError) => void;
  /** The widget finished its first load and is visible. */
  onOpen?: () => void;
  /** The widget was closed (user abort, success, or error). */
  onClose?: () => void;
  /** Every bridged message plus OPEN/SUCCESS/ERROR/CLOSE mirrors. */
  onEvent?: (event: MalvoEvent) => void;
}

export const DEFAULT_BASE_URL = "https://malvo.io";
