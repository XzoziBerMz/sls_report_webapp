# Stage 1: Build the Go application
FROM golang:1.20 AS build

# Set the working directory inside the container
WORKDIR /app

# Copy the source code into the container
COPY . .

# Build the Go application
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o sls-report-app .

# Stage 2: Create a smaller image using Alpine
FROM alpine:latest

# Set the working directory inside the container
WORKDIR /app

# Copy only the necessary files from the previous stage
COPY --from=build /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/ca-certificates.crt
COPY --from=build /app/sls-report-app .
COPY --from=build /app/views /app/views
COPY --from=build /app/static /app/static
COPY .env .env

# Expose the port the application will run on
EXPOSE 8000

# Command to run the application
CMD ["./sls-report-app"]
