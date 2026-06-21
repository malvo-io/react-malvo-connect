## 0.1.0

- Initial release.
- `MalvoConnect` React component: renders the hosted Malvo Connect widget in an
  iframe modal and bridges `malvo:success` / `malvo:error` / `malvo:close`
  events to `onSuccess` / `onError` / `onClose` / `onEvent`.
- Open Finance OAuth authorizes in a top-level popup (iframes can't frame banks)
  and resumes automatically.
- API mirrors `react-pluggy-connect`.
