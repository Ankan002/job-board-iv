# Job Hunter

A mirror for [Weworkremotely](https://weworkremotely.com). Any job shown there shows here along with pagination. Please note, that this project was built as a part of my interview at [InterviewBeeAI](https://interviewbee.ai) and does not contain any intension to launch as a product!

![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)![Bun](https://img.shields.io/badge/Bun-%23000000.svg?style=for-the-badge&logo=bun&logoColor=white)![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)![Vercel](https://img.shields.io/badge/vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white)![Playwright](https://img.shields.io/badge/-playwright-%232EAD33?style=for-the-badge&logo=playwright&logoColor=white)![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)

[Live App](https://jb.ankn.dev)

### Technologies

- [Playwright](https://playwright.dev): Playwright is being used to scrape our job portal and saving the data to our database.
- [Neon](https://neon.tech): We are using Neon for database puposes. Its a serverless postgres hosted database. I chose Postgres here because there are certain future scope of expansion where multiple reads and writes could be handled seamlessly. Otherwise Sqlite along with Turso could have been a great choice.
- [NextJS](https://nextjs.org): We are have chosen this piece of tech as both of our frontend and backend. Backend because we had a pretty simple backend and using NextJS as api provider would not pose any issue. And it was our go to frontend because as the app would grow we might want to show static data or server side data, where SSR/SSG/on-demand ISR could be very handy.
- [ShadCN UI](https://ui.shadcn.com): We use it along with TailwindCSS to build the UI as our choice of UI Library.

### Features

- Using the CLI tool we can scrape the jobs from Weworkremotely.
- There is an UI where all the jobs gets listed.
- We have pagination implemented along with searching.
- Multi parameter based sorting is also available.
- To use filtering you can click on the company or location on the job card.
- We have also implemented a search light & dark mode option.

### Limitations & Future Scope

- We can implement a dedicated panel for filters with location & company.
- We can implement the home page with on demand ISR so that we can have a better SEO & performance.
- Implemeting a cron for automatic job fetching along with a job queue for retries.

### Special thanks

- [Weworkremotely](https://weworkremotely.com)
- [ShadCN UI](https://ui.shadcn.com)
- [Tanstack Query](https://tanstack.com/query)

### How to setup locally

- Clone the github repository

```bash
git clone git@github.com:Ankan002/job-board-iv.git
```

- Go to the correct directory

- Install all the packages

```bash
bun i
```

- Setup chromium

```bash
bun install:chromium
```

- Create an account on Neon and get a database URL

- Create the `.env` according to `.env.example`

- Now link the db using

```bash
bun db:push
```

- To scrape run:

```bash
bun scrape:job
```

- Now to start the local app use,

```bash
bun dev
```

### Performace

<img src="https://github.com/Ankan002/job-board-iv/blob/main/assets/readme/performance.png" alt="" />
