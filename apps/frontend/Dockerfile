FROM cgr.dev/chainguard/node:latest-dev

ENTRYPOINT []

USER root

WORKDIR /workspace/apps/frontend

COPY apps/frontend/package*.json ./
RUN npm ci --no-audit --no-fund

COPY apps/frontend ./

EXPOSE 3000

CMD ["sh", "-c", "npm run dev"]
