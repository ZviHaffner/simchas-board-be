# Simchas Board API

## URL to API

`https://simchas-board-be.onrender.com/api/`

## Summary

The Simchas Board backend provides a RESTful API for managing Jewish celebration (simcha) event data. It supports endpoints for creating, reading, updating, and deleting information about users, events and significant persons.

Features:
- Event Management: Handle multiple event types, dates, times, and locations.
- Significant Persons Management: Efficiently associate a host (Ba'al Simcha), bride, relatives, and attendees with specific events.
- Database Integration: Built with PostgreSQL for structured and reliable data storage.
- API Documentation: Clear endpoints for seamless integration with the frontend.

More detailed information on each endpoint can be found at:
`https://be-project-nc-news.onrender.com/api`

## Getting Started

### Cloning the Repository

`git clone https://github.com/ZviHaffner/simchas-board-be.git`

### Installing Dependencies

Ensure you have Node.js and npm installed, then run:  
`npm install`

### Seeding the Local Database

To set up and seed the local database, run:  
`npm run setup-dbs`  
`npm run seed`

### Running Tests

To run the test suite, run:  
`npm test`

## Setup of Environment Variables

`.env.*` files have been set to be ignored by Git. Therefore, new `.env` files will have to be created to set up the environment variables required for the project to run.

Here are the steps to create and configure these files:

1. Create a `.env.test` file in the root directory of the project with the following content:

PGDATABASE=<database_name>\_test

2. Create a `.env.development` file in the root directory of the project with the following content:

PGDATABASE=<database_name>
