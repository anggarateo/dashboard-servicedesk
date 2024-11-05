FROM node:21 as builder
WORKDIR /app
COPY ["package.json", "package-lock.json", "./"]
RUN npm install

# Copy Source code
COPY . .

RUN npm run build

# Move to Alpine
FROM node:21-alpine
WORKDIR /app
COPY --from=builder /app /app

# Start App
CMD [ "npm", "run", "start"]