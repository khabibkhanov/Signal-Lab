FROM cgr.dev/chainguard/node:latest-dev

ENTRYPOINT []

USER root

RUN apk add --no-cache openssl

WORKDIR /workspace/apps/backend

COPY apps/backend/package*.json ./
RUN npm install

COPY apps/backend ./
COPY prisma /workspace/apps/backend/prisma

EXPOSE 3001

CMD ["sh", "-c", "npm run prisma:generate && npm run prisma:migrate && npm run start:dev"]
