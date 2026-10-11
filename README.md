# EstateFlow Mini CRM

A UI-first real estate lead management demo built with Next.js App Router, React, TypeScript, Tailwind CSS 4, Lucide React and Recharts.

## Run locally

1. Extract the ZIP.
2. In the project folder run `npm install`.
3. Run `npm run dev`.
4. Open `http://localhost:3000`.

## Routes
- `/login` — demo login (any credentials work)
- `/leads` — list, search, filter, sort, pagination, add/edit/delete
- `/leads/[id]` — details, status updates and notes
- `/dashboard` — KPI metrics, source chart, status distribution and recent leads

## Demo notes
- Data is mock data held in React context state. Refreshing the browser resets changes to the initial dataset.
- Filters, sorting, search and pagination are encoded in the URL query string.
- No backend or real authentication is configured.
- The form has basic required fields and duplicate-phone feedback; this is not production validation.
