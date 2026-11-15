# Project memory

## Product intent & audience

- Vite + React app that appears to support authentication, file uploads, and project reporting.
- Includes a generated PDF "Project Report" documenting the app itself: overview, tech stack, folder structure, app flow, database structure, and a use case diagram.
- Report PDF is a valid 2-page document.

## Brand personality & voice

- User-facing communication is direct and task-oriented (e.g., "Download Project Report (PDF)").
- Assistant tone is pragmatic and fixes-oriented.

## Visual design & UX direction

- Main screen layout, top-to-bottom: sign-in info → download button → upload area.
- Primary call-to-action rendered as a blue button.
- Report download button only appears after signing in.

## Decisions, constraints & rationale

- Framework: `vite-react`.
- Serving a static PDF from `public/` does NOT work in the preview environment — the preview server fails to serve the file, causing the browser to download an error page instead of the PDF ("Failed to load PDF document").
- Fix: PDF report data is embedded directly in app code and generated on click in the browser — no server fetch needed. Same download mechanism as the app's "Process PDF" button.
- Build verification is part of the fix workflow.

## Open questions & assumptions

- Auth implementation details and provider are unspecified.
- Upload functionality purpose and destination are unclear.
- Database structure mentioned in the report, but actual backend/data layer is unconfirmed.
- If embedded download still fails, likely a browser/extension blocking automatic downloads on the preview domain.