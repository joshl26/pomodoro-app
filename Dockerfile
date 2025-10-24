FROM node:18-alpine

WORKDIR /pomodoro-app

COPY package.json package-lock.json* craco.config.js ./

RUN npm ci && npm install -g serve

COPY public ./public
COPY src ./src

RUN npm run build

EXPOSE 3051

CMD ["serve", "-s", "build", "-l", "3051"]