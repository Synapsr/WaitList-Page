# Build stage
FROM golang:1.21-alpine AS builder

WORKDIR /app

# Copy go mod files
COPY go.mod ./

# Download dependencies (none for now, but good practice)
RUN go mod download

# Copy source
COPY . .

# Build binary
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-w -s" -o waitlist .

# Final stage
FROM alpine:3.19

# Install ca-certificates for HTTPS requests (webhooks)
RUN apk --no-cache add ca-certificates

WORKDIR /app

# Copy binary from builder
COPY --from=builder /app/waitlist .

# Create data directory
RUN mkdir -p /data && chown -R nobody:nobody /data

# Use non-root user
USER nobody

# Expose default port
EXPOSE 3000

# Health check (uses PORT env var, defaults to 3000)
HEALTHCHECK --interval=10s --timeout=3s --start-period=5s --retries=3 \
    CMD sh -c 'wget --no-verbose --tries=1 --spider http://localhost:${PORT:-3000}/api/health || exit 1'

# Run
ENTRYPOINT ["/app/waitlist"]
