# OpenBudget API

A TypeScript-based Express API for the OpenBudget application.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory with the following variables:
```
PORT=3000
NODE_ENV=development
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/openbudget
```

## Development

### Local Development
Run the development server:
```bash
npm run dev
```

### Docker Development
1. Start the development environment:
```bash
docker-compose up --build
```

2. To run in detached mode:
```bash
docker-compose up -d
```

3. To stop the containers:
```bash
docker-compose down
```

### Production with Docker
1. Build and start the production containers:
```bash
NODE_ENV=production docker-compose up --build
```

2. To run in detached mode:
```bash
NODE_ENV=production docker-compose up -d
```

## Build

Build the project:
```bash
npm run build
```

## Production

Start the production server:
```bash
npm start
```

## Scripts

- `npm run dev`: Start development server with hot-reload
- `npm run build`: Build the project
- `npm start`: Start production server
- `npm run lint`: Run ESLint
- `npm test`: Run tests 