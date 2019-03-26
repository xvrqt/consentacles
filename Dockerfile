FROM node

RUN mkdir app
WORKDIR /app

COPY package.json . 
RUN npm install

COPY . .
RUN npm link

EXPOSE 3000
CMD ["npm", "test"]