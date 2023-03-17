# Sticky Notes Backend

Sticky Notes is a note app with the functions of creating, editing, archiving, and deleting notes. In addition, it allows you to assign a color to the notes allowing categorize and filter them, including the ability to search both by title and body of the note. Finally, the application has internationalization (English and Spanish) and a basic JWT-based authentication system.

&nbsp;

## Links

- [Repo](https://github.com/JoanR99/sticky-notes-server-fastify 'Sticky Notes Backend repo')
- [Frontend](https://github.com/JoanR99/sticky-notes-client-vue 'Sticky Notes Frontend repo')
- [Live Demo](https://sticky-notes-client-vue.vercel.app/ 'Live View')

&nbsp;

## Screenshots

![Home Page](/screenshots/sticky-notes.png 'Home Page')

![SignUp Page](/screenshots/sn-3.png 'SignUp Page')

![Create Note Modal](/screenshots/sn-4.png 'Create Note Modal')

![Note Modal](/screenshots/sn-5.png 'Note Modal')

&nbsp;

## Stack

![Node] ![Typescript] ![Fastify] ![Prisma] ![Postgres]

This repository contains the third backend version of Sticky Notes, developed with Node.js, Typescript and Fastify framework, using Prisma as ORM for a PostgreSQL database. I decided to build this version with Fastify because I wanted to practice with this framework and because it seems like a modern version of Express with default Typescript support.

&nbsp;

## How to install and run

### Prerequisites

1. You need to have Node.js installed in your machine.
2. A PostgreSQL database.

### Installation

1. Clone the repo

   ```sh
   git clone https://github.com/JoanR99/sticky-notes-server-fastify.git
   ```

2. Go to file

   ```sh
   cd sticky-notes-server-fastify
   ```

3. Install dependencies

   ```sh
   npm install
   ```

4. Add a .env file in the root directory with variables "DATABASE_URL" with the PostgreSQL URL you want to use, "PORT" equal to 3000, "HOST" equal to '0.0.0.0' and "JWT_SECRET" with a random string.
5. Create prisma-client.

   ```sh
   npm run p-generate
   ```

6. Build app.

   ```sh
   npm run build
   ```

7. Start server.

   ```sh
   npm run start
   ```

- Note: If you get cors errors on request try to comment or delete the cors plugin registration on app.ts and re-build the app.

  &nbsp;

## Author

**Joan Romero**

- [Profile](https://github.com/JoanR99 'Github Joan Romero')
- [Email](mailto:romerojoan1999@gmail.com?subject=Hi 'Hi!')
- [Linkedin](https://www.linkedin.com/in/joanr99/ 'Linkedin Joan Romero')
- [Portfolio](https://portfolio-joan-romero.vercel.app/ 'Portfolio Joan Romero')

[node]: https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white
[typescript]: https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white
[fastify]: https://img.shields.io/badge/fastify-%23000000.svg?style=for-the-badge&logo=fastify&logoColor=white
[prisma]: https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white
[postgres]: https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white
