FROM public.ecr.aws/docker/library/node:16-slim
# set up working directory
WORKDIR /usr/src/app
# copy package.json for dependancies
COPY package*.json ./
# install dependancies
RUN npm ci --production --force
RUN npm install typescript -g

# copy application files into container
COPY . .
RUN npm run build-ts
# start application
CMD [ "node", "dist/index.js" ]
