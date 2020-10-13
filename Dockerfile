FROM node:10.15-slim

RUN mkdir /public

COPY package.json /app/package.json
WORKDIR /app
RUN npm --loglevel warn install --production
COPY . /app
RUN npm --loglevel warn run postinstall --production
RUN chown -R nodejs:nodejs /public

USER nodejs

CMD ["/app/run.sh"]
