FROM node:lts
WORKDIR /app
COPY package*.json ./
RUN npm install 
copy . ./
CMD ["npm","start"]