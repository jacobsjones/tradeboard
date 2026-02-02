# TradeBoard - Ticket Board for Trading

## Quick Start

### Backend
```bash
cd backend
npm install
npm run dev
```
Backend runs on http://localhost:3001

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on http://localhost:5173

## Default Login
- Username: `jacob`
- Password: `password`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/tickets | List all tickets |
| GET | /api/tickets/:id | Get single ticket |
| POST | /api/tickets | Create ticket |
| PUT | /api/tickets/:id | Update ticket |
| PATCH | /api/tickets/:id/status | Update status only |
| DELETE | /api/tickets/:id | Delete ticket |
| POST | /api/auth/login | Login |

## Features
- ✅ Desktop-optimized Kanban board
- ✅ 4 columns: Todo, In Progress, Hold, Done
- ✅ Drag-and-drop tickets
- ✅ Dark mode toggle
- ✅ Search and filter by priority
- ✅ Trading-focused pre-seeded data
- ✅ SQLite persistence
