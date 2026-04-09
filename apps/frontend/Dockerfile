FROM node:20-alpine

WORKDIR /workspace/apps/frontend

COPY apps/frontend/package*.json ./
RUN npm install

COPY apps/frontend ./

EXPOSE 3000

CMD ["sh", "-c", "npm run dev"]
