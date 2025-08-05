# Docker Setup for CAS Collections Explorer

This project is now containerized with Docker for easy deployment and development.

## Prerequisites

- Docker
- Docker Compose

## Quick Start

1. **Build and start all services:**
   ```bash
   docker-compose up --build
   ```

2. **Access your application:**
   - Frontend: http://localhost:3000
   - Backend (Convex): http://localhost:8000

## Services

### Frontend (React/Next.js)
- **Port:** 3000
- **Container:** react-frontend
- **Description:** Serves the React application with Nginx

### Backend (Convex)
- **Port:** 8000
- **Container:** convex-backend
- **Description:** Self-hosted Convex backend with persistent data storage

## Development

### Start services in detached mode:
```bash
docker-compose up -d
```

### View logs:
```bash
# All services
docker-compose logs

# Specific service
docker-compose logs frontend
docker-compose logs backend
```

### Stop services:
```bash
docker-compose down
```

### Rebuild after code changes:
```bash
docker-compose up --build
```

## Data Persistence

Convex data is stored in a Docker volume (`convex-data`) that persists between container restarts.

## Environment Variables

The following environment variables are configured:

- `NEXT_PUBLIC_CONVEX_URL`: Points to the self-hosted Convex backend
- `CONVEX_DATA_DIR`: Directory for Convex data storage
- `NODE_ENV`: Set to production

## Troubleshooting

### Port conflicts
If ports 3000 or 8000 are already in use, modify the `docker-compose.yml` file to use different ports.

### Build issues
If you encounter build issues, try:
```bash
docker-compose down
docker system prune -f
docker-compose up --build
```

### Convex data reset
To reset Convex data:
```bash
docker-compose down
docker volume rm cas-collections-explorer_convex-data
docker-compose up --build
```

## Production Deployment

For production deployment, consider:

1. Using a reverse proxy (like Traefik or Nginx)
2. Setting up SSL certificates
3. Configuring proper environment variables
4. Setting up monitoring and logging
5. Using Docker Swarm or Kubernetes for orchestration 