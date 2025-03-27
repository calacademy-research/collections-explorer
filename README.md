# CAS Collections Explorer

The CAS collection explorer is a collaboration with the California Academy of Sciences to build web apps for their specimens database. The collections explorer allows for advanced search and beautiful presentation of the data.

The explorer is built in Next.js for the front end (React.js Framework), and Convex, an open source reactive backend great for web application and search use.

This repo is only the Next.js front end, and it uses Convex cloud hosting. However, Convex is capable of self hosting, and we will have a separate repository for fully self hosting and on-prem hosting.

## Get started

To start, install all the packages. We highly recommend using `yarn` for everything

```
yarn install
```

To start a dev instance, run

```
yarn dev
```

This will spin up your local instance of the Next.js front end and spin up sync with Convex cloud

## Setting up Convex Cloud

Reach out to Matthew to set up Convex Cloud. To set that up, Matthew will invite you to the convex CAS Explorers team and create a dev cloud instance. Matthew will then provide you env keys to hook up this project to a cloud Convex instance.

TEST