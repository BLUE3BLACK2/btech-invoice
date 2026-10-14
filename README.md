This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

Copy `.env.example` to `.env.local` and fill in the values:

```bash
cp .env.example .env.local
```

| Variable | Description |
| --- | --- |
| `AUTH_USERNAME` | Username for the login page. |
| `AUTH_PASSWORD` | Password for the login page. Use a strong password. |
| `AUTH_SECRET` | Random string of at least 32 characters used to sign the session cookie, for example from `openssl rand -base64 48`. Changing it signs everyone out. |
| `INVOICE_DEFAULT_NOTES` | Default notes for new invoices, such as payment details. Use `\n` for line breaks. |
| `INVOICE_DEFAULT_SIGNATURE` | Default signature image for new invoices, as a `data:image/webp;base64,...` URL. Use a transparent image cropped to the signature. |
| `INVOICE_DEFAULT_SIGNATORY` | Default signatory name printed under the signature. |
| `DATABASE_URL` | PostgreSQL connection string where invoices are stored. |

Every page requires login. The app stays locked until `AUTH_USERNAME`, `AUTH_PASSWORD`, and `AUTH_SECRET` are set.

The invoice defaults are read on the server and sent only to signed-in users, so they never end up in the public JavaScript bundle. When a default is empty, new invoices reuse the value from the latest saved invoice.

## Database

Invoices are stored in PostgreSQL. Create or update the tables with:

```bash
npm run db:migrate
```

The script reads `DATABASE_URL` from `.env.local` and runs `db/schema.sql`, which is safe to run more than once. Run it again whenever the schema changes.

Each invoice gets an auto-incrementing id. New invoices get the next invoice number automatically: the app takes the prefix of the latest invoice and adds one to the highest number with that prefix, so `BTECH-CRM/AI-0001` is followed by `BTECH-CRM/AI-0002`. The number can still be changed before saving, and duplicate numbers are rejected.

Invoices saved in the browser by older versions show up as a banner on the invoice list with a button to move them into the database.

`.env.local` is ignored by git, so credentials and payment details never end up in the repository. Set the same variables in your hosting provider when deploying.

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
