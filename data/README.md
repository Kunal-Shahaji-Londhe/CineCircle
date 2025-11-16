# Data Directory

This folder stores local JSON files used by the mock API routes.

It keeps the data persistent across dev server restarts, allowing you to test
cinegroups and cineboards without losing data during development.

## Files

- `cinegroups.json` - Stores all cinegroups (groups of users sharing movies)
- `cineboards.json` - Stores all cineboards (individual movie recommendations within groups)

## Note

These files are for development only. Once you integrate with a real backend
(Nest.js + database), these file-based APIs should be replaced with calls to
your backend endpoints.

