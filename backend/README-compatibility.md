  - `HidrometroController.php` — returns placeholder JSON / 501 for unimplemented methods.
  - `OsExternaController.php` — `pdf()` returns 204 No Content placeholder.
 
 - NOTE: `HidrometroController.php` and `OsExternaController.php` skeletons were removed — their functionality is not used in the current SISAR scope. The legacy `config/sisar.php` file has also been removed.
 - Added API routes in `routes/web.php` under `/api` to match `sichs` naming surface for easy diffs and automated checks.

These are lightweight, non-destructive changes intended to make `sisar-dtceasro` a closer reference for comparisons. Implementations are intentionally minimal; replace placeholders with real logic as needed.
