# pickItApp

Comprehensive documentation for the pickItApp React Native project (Expo + TypeScript). This README is intended to let you understand, run, and extend the project without reading other source files.

## Table of contents
- Project overview
- Tech stack & dependencies
- Project structure
- Key files and components
- Data & Firebase
- Environment & secrets
- Local development
- Building & deployment
- Testing
- Common tasks and tips
- Contributing

## Project overview

`pickItApp` is a small React Native application built with Expo and TypeScript. It uses the Expo Router for filesystem-based routes and Firebase (Firestore) as the backend to store lists and list elements. The app includes UI components, modals for adding and editing list items, and utilities for client-only rendering and theming.

The app aims to manage multiple shopping/lists with creation date and list items.

## Tech stack & dependencies

- Framework: Expo (see [app.json](app.json))
- Language: TypeScript
- UI: React Native
- Navigation / routing: `expo-router` (filesystem routing via `app/`)
- Backend: Firebase Firestore (via the `firebase` JS SDK)
- Fonts: `@expo-google-fonts/quicksand` + `expo-font`
- Key libraries (from `package.json`):
  - `expo` (~54)
  - `expo-router`
  - `firebase` (>=12)
  - `react-native-reanimated`, `react-native-gesture-handler`
  - `@react-navigation/native` (some deps present)

Refer to [package.json](package.json) for the full dependency list.

## Project structure

Top-level layout:

- `app/` - Expo Router pages and route layouts (entry point for the app screens)
  - `_layout.tsx` — global layout, tab setup and global providers
  - `index.tsx` — home screen
  - `newList.tsx` — screen to create a new list
  - `costs.tsx` — costs / summary screen
  - `lists/` — dynamic list routes (`[id].tsx` and index)
- `components/` - reusable UI components and hooks
- `assets/` - images and fonts used in the app
- `db/` - Firestore data access helper functions ([db/db.ts](db/db.ts))
- `firebase.config.ts` - Firebase initialization (exports `db`)
- `types.ts` - global TypeScript types used across the app
- `constants/` - small constants (colors, etc.)

Example: See the application entry and routes in [app/_layout.tsx](app/_layout.tsx).

## Key files and components

- `app/_layout.tsx` — Wraps routes with providers and defines tab bar & layout.
- `app/index.tsx` — The main landing screen.
- `app/newList.tsx` — UI for creating a new list.
- `app/lists/[id].tsx` — Single list screen (view and edit elements).
- `components/CustomTabBar.tsx` — Custom tab bar implementation for app navigation.
- `components/AddModal.tsx` / `components/EditModal.tsx` — Modals to add or edit elements.
- `components/ListItem.tsx` / `components/Element.tsx` — UI for each item in a list.
- `components/SaveRestoreControls.tsx` — Utilities for saving/restoring local data.
- `db/db.ts` — Encapsulates Firestore operations (getLists, getSingleList, createList, updateListElements, deleteList, seedDatabase). This module imports `db` from [firebase.config.ts](firebase.config.ts).
- `firebase.config.ts` — Initializes Firebase using environment variables and exports `db` (Firestore). It expects `EXPO_PUBLIC_FIREBASE_API_KEY` to be set for the API key.
- `types.ts` — Contains the `List` and related TypeScript types used across the codebase.

## Data model & Firestore

The Firestore collection used is `liste` (see [db/db.ts](db/db.ts)). Documents (lists) typically have the following structure:

```json
{
  "data_creazione": "dd/mm/yyyy",
  "elementi": [
    { "nome": "latte", "quantita": 1 },
    { "nome": "pane", "quantita": 3 }
  ]
}
```

Key functions in `db/db.ts`:
- `getLists()` — returns all lists.
- `getSingleList(id)` — returns a single list by document id.
- `createList(elementi, data_creazione?)` — creates a new list and returns the new doc id.
- `updateListElements(id, elementi)` — updates only the `elementi` field.
- `deleteList(id)` — removes a list document.
- `seedDatabase()` — creates a sample list (useful for local development).

All Firestore calls are asynchronous and may throw; the db functions wrap errors and log them.

## Environment & secrets

Sensitive values are not committed. `firebase.config.ts` reads the Firebase API key from an environment variable:

- `EXPO_PUBLIC_FIREBASE_API_KEY` — required for the Firebase web config.

When running locally, create an `.env` file or set environment variables via your shell/CI. With Expo, you can use `eas` or `app.config.js` to inject runtime env variables into the managed app, or use `expo-cli` with a `.env` + `dotenv` during bundling.

Important: Never commit production API keys to source control. For web builds, the Firebase config is visible to clients — secure your Firestore rules appropriately.

## Local development

Prerequisites:
- Node.js (recommended LTS >= 18)
- Yarn or npm
- Expo CLI (optional for some workflows): `npm install -g expo-cli`

Install dependencies:

```bash
# from project root
npm install
# or
yarn install
```

Start the app:

```bash
npm run start
# or open directly on a device/emulator
npm run android
npm run ios
npm run web
```

Notes:
- The project uses `expo-router` so routes are defined by `app/` files. Editing files in `app/` will update routes automatically.
- If you update native-unimodules or `react-native-reanimated`, follow their setup instructions (e.g., reanimated babel plugin) — current config in `package.json` is compatible with Expo SDK used.

## Building & deployment

This project is configured for Expo managed workflows. Typical workflows:

- Expo (classic): `expo build` or `eas build` (recommended) to build store binaries.
- Web: `npm run web` produces a static build; `app.json` sets `web.output` to `static`.

For production builds, ensure:
- Environment variables are set for Firebase.
- Firestore rules are tightened (no open read/write rules).

## Testing

- There is a small test under `components/__tests__/StyledText-test.js`. The project includes `react-test-renderer` and type definitions in `devDependencies`.
- To run tests (if you add a test runner), configure `jest` or `vitest` and add scripts in `package.json`.

## Code style & TypeScript

- `tsconfig.json` extends Expo's `tsconfig.base` and enables `strict` mode. Keep types accurate; many modules rely on `types.ts` for the `List` type.

## Assets (fonts & images)

- Fonts are loaded via `expo-font` and `@expo-google-fonts/quicksand` — entry points that load fonts are typically in the layout or a dedicated hook.
- Images like the app icon and splash are in `assets/images/` and referenced from [app.json](app.json).

## Common tasks & tips

- To seed local Firestore with a sample list, call `seedDatabase()` from `db/db.ts` while running in a development environment (careful not to seed production data).
- If Firebase errors occur, verify `EXPO_PUBLIC_FIREBASE_API_KEY` and other config fields and check Firestore rules.
- When debugging navigation, inspect `app/` routes and `CustomTabBar.tsx` for custom tab behaviors.

## Notes about production & privacy

- `EXPO_PUBLIC_` env variables are embedded into the JS bundle and visible in the client (by Expo design). Use Firestore security rules to protect data, and consider server-side APIs for sensitive operations.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add types and tests for new features
4. Open a PR with a clear description

## Where to find important code
- App routes & layout: [app/_layout.tsx](app/_layout.tsx)
- Firebase init: [firebase.config.ts](firebase.config.ts)
- Firestore helpers: [db/db.ts](db/db.ts)
- Dependency list & scripts: [package.json](package.json)
- Type definitions: [types.ts](types.ts)

---

If you want, I can also:
- add a small CONTRIBUTING.md or PR template,
- add example `.env.example` with the required env keys,
- or open a PR with these docs applied and a short checklist for production hardening.
