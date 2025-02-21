# Variables for Directories & Docker Images
CLIENT_DIR = client
SERVER_DIR = server
CLIENT_IMAGE = cake-denim-client
SERVER_IMAGE = cake-denim-server

# --- CLIENT TASKS ---
# Install dependencies
.PHONY: install-client
install-client:
	cd $(CLIENT_DIR) && npm install

# Lint client
.PHONY: lint-client
lint-client: install-client
	@echo "Linting client project..."
	cd $(CLIENT_DIR) && npm run lint

# Type check client
.PHONY: type-check-client
type-check-client: install-client
	@echo "Running TypeScript type check for client..."
	cd $(CLIENT_DIR) && npm run type-check

# Build client project
.PHONY: validate-client-build
validate-client-build: install-client
	@echo "Building client project..."
	cd $(CLIENT_DIR) && npm run build

# --- SERVER TASKS ---
# Install dependencies
.PHONY: install-server
install-server:
	cd $(SERVER_DIR) && npm install

# Lint server
.PHONY: lint-server
lint-server: install-server
	@echo "Linting server project..."
	cd $(SERVER_DIR) && npm run lint

# Type check server
.PHONY: type-check-server
type-check-server: install-server
	@echo "Running TypeScript type check for server..."
	cd $(SERVER_DIR) && npm run type-check

# Run server tests
.PHONY: test-server
test-server: install-server
	@echo "Running server tests..."
	cd $(SERVER_DIR) && npm run test

# Build server project
.PHONY: validate-server-build
validate-server-build: install-server
	@echo "Building server project..."
	cd $(SERVER_DIR) && npm run build

# --- VALIDATION TASKS ---
# Validate both client & server builds
.PHONY: validate-build
validate-build: validate-client-build validate-server-build
	@echo "Build validation completed successfully."

# Validate everything (Lint + Type Check + Tests + Build)
.PHONY: validate
validate: lint-client type-check-client validate-client-build lint-server type-check-server test-server validate-server-build
	@echo "All validation checks passed."

# --- PRE-PUSH TASKS ---
# Run full validation before pushing
.PHONY: pre-push
pre-push: validate
	@echo "All checks passed. Ready to push!"

# --- DOCKER TASKS ---
# Build client image
.PHONY: build-client
build-client:
	docker build -t $(CLIENT_IMAGE) -f Dockerfile.client .

# Build server image
.PHONY: build-server
build-server:
	docker build -t $(SERVER_IMAGE) -f Dockerfile.server .

# Validate client build inside Docker
.PHONY: validate-client-build-docker
validate-client-build-docker: build-client
	@echo "Building client project inside Docker..."
	docker run --rm $(CLIENT_IMAGE) npm run build

# Validate server build inside Docker
.PHONY: validate-server-build-docker
validate-server-build-docker: build-server
	@echo "Building server project inside Docker..."
	docker run --rm $(SERVER_IMAGE) npm run build

# --- DEPLOYMENT TASKS ---
# Deploy client to Vercel
.PHONY: deploy-vercel
deploy-vercel:
	@echo "Deploying client to Vercel..."
	cd $(CLIENT_DIR) && vercel --prod