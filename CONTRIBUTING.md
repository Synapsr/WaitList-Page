# Contributing

Thanks for your interest in contributing to Waitlist!

## Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Synapsr/WaitList-Page.git
   cd WaitList-Page
   ```

2. **Run locally with Docker**
   ```bash
   docker compose up --build
   ```

3. **Or run with Go** (requires Go 1.21+)
   ```bash
   go run .
   ```

4. Open http://localhost:3000

## Project Structure

```
waitlist/
├── main.go              # Entry point
├── config.go            # Environment configuration
├── handlers.go          # HTTP handlers
├── storage/
│   ├── storage.go       # Storage interface
│   ├── json.go          # JSON file storage
│   ├── webhook.go       # Webhook storage
│   ├── smtp.go          # SMTP notifications
│   └── multi.go         # Multi-backend storage
├── static/
│   └── index.html       # Frontend (embedded)
├── Dockerfile
└── docker-compose.yml
```

## Guidelines

### Code Style

- Follow standard Go conventions
- Keep it simple - avoid over-engineering
- Write self-documenting code

### Commits

- Use clear, descriptive commit messages
- One feature/fix per commit

### Pull Requests

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test locally with Docker
5. Commit your changes
6. Push to your fork
7. Open a Pull Request

### What We're Looking For

- Bug fixes
- Performance improvements
- New storage backends
- Documentation improvements
- UI/UX enhancements

### What We're NOT Looking For

- Features that add significant complexity
- Dependencies that increase the Docker image size
- Changes that break backwards compatibility

## Testing

```bash
# Build and run
docker compose up --build

# Test the API
curl http://localhost:3000/api/health
curl -X POST http://localhost:3000/api/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'
```

## Questions?

Open an issue and we'll help you out!
