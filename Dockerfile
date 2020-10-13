FROM node:14

RUN mkdir /public && \
    addgroup --system nodejs --gid 998 && \
    adduser --system nodejs --uid 999 --home /app/ && \
    chown -R 999:998 /app/

COPY package.json /app/package.json

WORKDIR /app

RUN npm --loglevel warn install --production --no-optional

COPY . /app

RUN npm --loglevel warn run postinstall --production && \
    chown -R 999:998 public && \
    chown -R 999:998 /app/

USER 999

CMD ["/app/run.sh"]

EXPOSE 8080