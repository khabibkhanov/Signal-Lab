FROM node:20-bookworm-slim

RUN apt-get update \
	&& apt-get install -y --no-install-recommends openssl \
	&& rm -rf /var/lib/apt/lists/*

WORKDIR /workspace/apps/backend

COPY apps/backend/package*.json ./
RUN npm install

COPY apps/backend ./
COPY prisma /workspace/apps/backend/prisma

EXPOSE 3001

CMD ["sh", "-c", "npm run prisma:generate && npm run prisma:migrate && npm run start:dev"]
