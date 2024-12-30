This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

Setup and Running Instructions

1. Create a .env.local file in the root directory of the project.
2. Add the following Supabase credentials in .env.local:

```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

3. Replace your-project-url and your-anon-key with your Supabase project's URL and anon key.
4. Create a database in Supabase named quizzes with the following table schema:

```
CREATE TABLE quizzes (
  id INT8 PRIMARY KEY,
  created_at TIMESTAMPTZ,
  title TEXT,
  total_questions INT8,
  type TEXT,
  questions JSONB,
  success_rate NUMERIC,
  duration INT8,
  time_taken INT8,
  user_id UUID DEFAULT auth.uid() REFERENCES auth.users(id)
);
```

5. After setting up your .env.local and the database, run the Next.js app as usual:

```
npm run dev
# or
yarn dev
# or
pnpm dev
```

6. This will start the app on http://localhost:3000.

   
## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
