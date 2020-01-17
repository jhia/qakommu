FROM node:12.13.0-slim
#Update repositories
RUN apt-get update
#build essentials
RUN apt-get install -y build-essential python
# use this directory to store files, run npm, and launch our app
WORKDIR /app
#Development Mode
RUN npm install
CMD npm run dev
# expose port 8000 once the container has launched
EXPOSE 8000
