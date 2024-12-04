# Variables for Docker images
CLIENT_IMAGE = cake-denim-client
SERVER_IMAGE = cake-denim-server

# Build client image
.PHONY: build-client
build-client:
	docker build -t $(CLIENT_IMAGE) -f Dockerfile.client .

# Build server image
.PHONY: build-server
build-server:
	docker build -t $(SERVER_IMAGE) -f Dockerfile.server .

# Lint client
.PHONY: lint-client
lint-client: build-client
	docker run --rm $(CLIENT_IMAGE)

# Lint server
.PHONY: lint-server
lint-server: build-server
	docker run --rm $(SERVER_IMAGE)

# Test server
.PHONY: test-server
test-server: build-server
	docker run --rm $(SERVER_IMAGE) npm run test

# Ensure everything is error-free
.PHONY: validate
validate: lint-client lint-server test-server

# Run everything (lint + test) before pushing
.PHONY: pre-push
pre-push: validate
	@echo "All checks passed. Ready to push!"