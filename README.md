# Pokemon Card Battle Simulator

This project is a Pokemon Card Battle Simulator that allows users to explore various Pokemon cards, view their information, and simulate battles between them. The application consists of a backend API built with NestJS and a frontend user interface developed with React.

## Project Structure

The project has the following structure:

```
- /api: Contains the NestJS backend application.
- /frontend: Contains the React frontend application.
- package.json: The root-level package.json file for installing dependencies.
```

## Prerequisites

Before running the application, ensure that you have the following installed:

- Node.js (version 18 or above)
- npm 
- PostgreSQL database

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/sterrado/cook_unity.git
   ```

2. Navigate to the project root directory:

   ```bash
   cd cook_unity
   ```

3. Install the dependencies for both the backend and frontend:

   ```bash
   npm install
   ```

## Backend Setup

1. Navigate to the `/api` directory:

   ```bash
   cd api
   ```

2. Create a `.env` file in the `/api` directory based on the provided `.env.copy` file:

   ```bash
   cp .env.copy .env
   ```

3. Open the `.env` file and update the database connection details and any other necessary environment variables.

4. Create a new PostgreSQL database for the application

5. Run the database migrations:

   ```bash
   npm run typeorm migration:run
   ```

6. Start the backend server:

   ```bash
   npm run start:dev
   ```

   The backend API will be accessible at `http://localhost:3000`.

## Frontend Setup

1. Navigate to the `/frontend` directory:

   ```bash
   cd ../frontend
   ```

2. Create a `.env` file in the `/frontend` directory based on the provided `.env.copy` file:

   ```bash
   cp .env.copy .env
   ```

3. Open the `.env` file and update any necessary environment variables.

4. Start the frontend development server:

   ```bash
   npm run dev
   ```

   The frontend application will be accessible at `http://localhost:3001`.

## API Documentation

The API documentation for the backend can be found in the `/api` directory. You can access the Swagger documentation by running the backend server and visiting `http://localhost:3000/api` in your web browser.

## Usage

Once both the backend and frontend applications are running, you can access the Pokemon Card Battle Simulator by opening `http://localhost:3001` in your web browser.

- On the homepage, you will see a list of Pokemon cards displayed in a grid format.
- Use the search bar at the top right to search for cards by name.
- Use the type filter dropdown at the top right to filter cards by their type.
- Click on a card to navigate to the card details page.
- On the card details page, you can view the card's information, including its name, type, HP, attack, weakness, and resistance.
- To simulate a battle, select an opponent card from the dropdown and click on the "Battle" button.
- The battle result will be displayed in a modal, showing the winner and the damage dealt.
- To view the weaknesses and resistances of the card, click on the "Show Weaknesses/Resistances" button.
- Click on the "Back to Home" button to return to the homepage.

