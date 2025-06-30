###############   build stage   ###############
FROM rust:1.78 AS build

# 1. Prepare a new user for cleaner permissions (optional)
RUN useradd -m app
WORKDIR /home/app

# 2. Cache dependencies first
COPY Cargo.toml Cargo.lock ./
COPY edge-agent/Cargo.toml edge-agent/
COPY ledger/Cargo.toml      ledger/
COPY proof-engine/Cargo.toml proof-engine/
COPY lean/ffi/Cargo.toml     lean/ffi/
RUN cargo fetch --locked      # populates ~/.cargo/git and ~/.cargo/registry

# 3. Copy the full workspace and build all binaries
COPY . .
RUN cargo build --release --workspace --bins

###############   runtime stage   ###############
FROM debian:bookworm-slim

# 4. Minimal OS deps
RUN apt-get update && apt-get install -y ca-certificates && rm -rf /var/lib/apt/lists/*

# 5. Copy only the binaries you care about at runtime
COPY --from=build /home/app/target/release/proof-engine  /usr/local/bin/
# add more if you run edge-agent or ledger in other containers
# COPY --from=build /home/app/target/release/edge-agent   /usr/local/bin/
# COPY --from=build /home/app/target/release/ledger       /usr/local/bin/

ENV RUST_LOG=info
EXPOSE 8080
ENTRYPOINT [ "proof-engine", "--config", "/config/config.toml" ]