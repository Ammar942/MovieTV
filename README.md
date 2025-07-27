# Movie & TV Show Management System

A full-stack web application for managing movies and TV shows with search and filter capabilities.

## Features

- Add, edit, and delete movie/TV show entries
- Search functionality across titles, directors, and notes
- Filter by type (Movie/TV Show), director, and release year
- Responsive design with modern UI
- RESTful API with validation
- PostgreSQL database with Prisma ORM

## Tech Stack

### Backend

- Node.js with TypeScript
- Express.js
- Prisma ORM
- PostgreSQL
- Zod for validation
- CORS enabled

### Frontend

- React with TypeScript
- Vite
- Tailwind CSS
- Axios for API calls
- Responsive design

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database
- npm package manager

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd MovieTv
```

### 2. Backend Setup

```bash
cd backend
npm install
```

#### Environment Configuration

Create a `.env` file in the backend directory:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/movietv_db"
PORT=5000
```

Replace `username`, `password`, and database name with your PostgreSQL credentials.

#### Database Setup

1. Create a PostgreSQL database named `movietv_db`
2. Run Prisma migrations:

```bash
npx prisma migrate dev --name init
```

3. Generate Prisma client:

```bash
npx prisma generate
```

#### Start Backend Server

```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend
npm install
```

#### Start Frontend Development Server

```bash
npm run dev
```

The frontend will run on `http://localhost:5173` (or next available port)

## Database Schema

The application uses a single `Entry` model with the following structure:

```prisma
model Entry {
  id          Int      @id @default(autoincrement())
  title       String
  type        EntryType
  director    String
  releaseYear Int
  notes       String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

enum EntryType {
  Movie
  TV_Show
}
```

### Migration Commands

- Create new migration: `npx prisma migrate dev --name <migration_name>`
- Reset database: `npx prisma migrate reset`
- View database: `npx prisma studio`

## API Endpoints

### Entries

- `GET /api/entries` - Get all entries with pagination and filters
  - Query params: `page`, `limit`, `search`, `type`, `director`, `releaseYear`
- `POST /api/entries` - Create new entry
- `GET /api/entries/:id` - Get entry by ID
- `PUT /api/entries/:id` - Update entry
- `DELETE /api/entries/:id` - Delete entry

### Example API Usage

```bash
# Get all entries
curl http://localhost:5000/api/entries

# Search entries
curl "http://localhost:5000/api/entries?search=batman&type=Movie"

# Create new entry
curl -X POST http://localhost:5000/api/entries \
  -H "Content-Type: application/json" \
  -d '{
    "title": "The Dark Knight",
    "type": "Movie",
    "director": "Christopher Nolan",
    "releaseYear": 2008,
    "notes": "Excellent superhero movie"
  }'
```

## Project Structure

```
MovieTv/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── services/        # Business logic
│   │   ├── routes/          # API routes
│   │   ├── middlewares/     # Custom middleware
│   │   ├── utils/           # Utility functions
│   │   └── validationSchemas/ # Zod schemas
│   ├── prisma/
│   │   ├── schema.prisma    # Database schema
│   │   └── migrations/      # Database migrations
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API service functions
│   │   ├── types/           # TypeScript types
│   │   └── hooks/           # Custom React hooks
│   └── package.json
└── README.md
```

## Development

### Backend Development

- The backend uses `ts-node-dev` for hot reloading
- API validation is handled by Zod schemas
- Error handling is centralized with custom ApiError class
- CORS is configured for frontend communication

### Frontend Development

- Built with Vite for fast development
- Uses Tailwind CSS for styling
- Components are organized by feature
- API calls are centralized in the services directory

## Troubleshooting

### Common Issues

1. **Database Connection Error**

   - Verify PostgreSQL is running
   - Check DATABASE_URL in .env file
   - Ensure database exists

2. **Port Already in Use**

   - Backend: Change PORT in .env file
   - Frontend: Vite will automatically use next available port

3. **Prisma Issues**

   - Run `npx prisma generate` after schema changes
   - Use `npx prisma migrate reset` to reset database

4. **CORS Errors**
   - Ensure backend CORS is configured for frontend URL
   - Check if both servers are running

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests (if available)
5. Submit a pull request

## License

This project is licensed under the MIT License.
