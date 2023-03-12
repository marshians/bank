FROM node AS ui

COPY ui /ui
WORKDIR /ui
ENV NODE_OPTIONS=--openssl-legacy-provider
RUN yarn install && yarn build

FROM messense/rust-musl-cross:x86_64-musl AS rust

COPY . /src
WORKDIR /src
RUN cargo build --release --target x86_64-unknown-linux-musl --bin main

FROM scratch

COPY --from=ui /ui/build /ui
COPY --from=rust /src/target/x86_64-unknown-linux-musl/release/main /main

EXPOSE 8000

ENV ROCKET_ADDRESS "0.0.0.0"

ENTRYPOINT ["/main"]
