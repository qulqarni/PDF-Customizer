# Project memory

## Product intent & audience

- Vite + React app that appears to support authentication, file uploads, and project reporting.
- Includes a generated PDF "Project Report" documenting the app itself: overview, tech stack, folder structure, app flow, database structure, and a use case diagram.

## Brand personality & voice

- User-facing communication is direct and task-oriented (e.g., "Download Project Report (PDF)").
- Assistant tone is pragmatic and fixes-oriented.

## Visual design & UX direction

- Main screen layout, top-to-bottom: sign-in info → download button → upload area.
- Primary call-to-action rendered as a blue button.
- Download target is a static PDF served from the app's `public` folder so it is accessible via browser preview.

## Decisions, constraints & rationale

- Framework: `vite-react`.
- PDF must be served through the app rather than only existing in project files, because users had no way to download files directly from the project workspace.
- PDF placed in `public/` and linked from the UI to enable browser-based download.
- Build verification is part of the fix workflow.

## Open questions & assumptions

- Auth implementation details and provider are unspecified.
- Upload functionality purpose and destination are unclear.
- Database structure mentioned in the report, but actual backend/data layer is unconfirmed.
- Whether the PDF is generated at build time or committed as a static asset is unspecified.