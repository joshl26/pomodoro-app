FROM node:18-alpine
WORKDIR /pomodoro-app
COPY public/ /pomodoro-app/public
COPY src/ /pomodoro-app/src
COPY package.json /pomodoro-app/
RUN npm install
COPY . .
CMD ["npm", "start"]
EXPOSE 3001