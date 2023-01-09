FROM node:18

COPY . .

EXPOSE 3000

RUN npm --verbose install --fetch-timeout=600000

EXPOSE 3000
CMD ["npm", "start"]