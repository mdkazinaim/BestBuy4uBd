# Gemini Coding Assistant Rules - BestBuy4uBd

You are Gemini, an advanced AI coding assistant designed to help developers build and debug the `BestBuy4uBd` project. When you are assigned a task, follow these guidelines to optimize your workflow, minimize tokens, and maintain code cleanliness.

---

## 🚀 Pre-flight Context Checklist
Before writing any code or analyzing folders, follow these initial steps:
1. **Read the AI Guide:** Always read `AI_GUIDE.md` in the project root to understand the core abstractions of the project.
2. **Minimize Context Scans:** Avoid listing directories recursively or reading full files unless necessary. Instead, use target tools like `grep_search` and load specific line ranges using `StartLine` and `EndLine` in `view_file` to conserve tokens.

---

## 🎨 BestBuy4uBd Code Conventions

### 🔴 Typography Restriction (CRITICAL)
- **Rule:** **AVOID BOLD TYPOGRAPHY AND WEIGHT CLASSES.**
- **Action:** Do not use `font-bold`, `font-semibold`, `font-black`, `font-extrabold`, `font-medium`, or similar classes. Text should be rendered with normal font weight. Default to standard/regular weight for headings, badges, inputs, buttons, and layout titles.

### 1. Centralized Routing
- **Rule:** Never modify `src/routes/Routes.tsx`.
- **Action:** Define routes inside their respective config files:
  - `src/routes/PublicRoutes.tsx` - Unprotected public store pages.
  - `src/routes/AdminRoutes.tsx` - Protected admin pages.
  - `src/routes/UserRoutes.tsx` - Customer-specific dashboard pages.
- **Menu Hiding:** If a page is meant to be opened dynamically but hidden from the sidebar menu, omit the `label` parameter from its route object config.

### 2. Domain Host Configuration (`useGetHost`)
- **Rule:** Do not hardcode logos, titles, or site contact information (emails, phones).
- **Action:** Resolve metadata dynamically using `useGetHost()` from `@/utils/useGetHost`:
  ```typescript
  import { useGetHost } from "@/utils/useGetHost";
  const brand = useGetHost(); // Contains { title, logo, phone, email }
  ```

### 3. Redux & RTK Query
- **Rule:** Never define a new base query. All APIs must extend the core HTTP layer.
- **Action:** Use `baseApi.injectEndpoints` to append queries and mutations:
  ```typescript
  import baseApi from "./BaseApi/BaseApi";
  export const featureApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
      // Add endpoints here
    }),
  });
  ```
- **Type Colocation:** Store payload/response type interfaces inside corresponding type folders or sibling type files. Do not redefine types locally.
- **State Selection:** Access the global Redux store using the typed hooks:
  - Selector: `const data = useAppSelector((state) => state.sliceName);`
  - Dispatch: `const dispatch = useAppDispatch();`

### 4. Components & Pages Organization
- **Global UI Primitives:** Place Radix or custom UI components in `src/components/ui/`.
- **Page-Specific Components:** Place components specific to a single page in a local `Components/` subfolder next to that page (e.g. `src/pages/Admin/Product/Components/`). Do not clutter `src/components/` with single-use items.
- **Import Statements:** Always use `@/...` path aliasing for imports under `src/` (e.g., `import X from "@/components/X"`). Do not use relative directories (`../../`).

### 5. Styling with Tailwind CSS v4
- **Rule:** Adhere strictly to the design system configured in `src/index.css`.
- **Action:** Apply custom classes mapping to CSS themes:
  - Colors: Use `bg-background`, `text-primary`, `bg-brand-500`, `bg-bg-base`, `bg-bg-surface`.
  - Utility Classes: `rounded-component` for rounded containers/cards and `no-scrollbar` for hiding scrolls.
- **Themes:** Support theme customization by wrapping variables in their respective theme namespace (e.g., `.theme-emerald`).

---

## 🛠️ Tooling & Workspace Rules
- **Interactive Commands:** Use persistent terminals only if you need to retain variables. For testing compilation or building, use non-persistent commands.
- **Partial File Updates:** Use `replace_file_content` for precise block edits instead of rewriting the entire file. Preserve all existing comments and docstrings.
