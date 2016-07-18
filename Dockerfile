FROM node:6.3.0
MAINTAINER Erin <sylphofelectricity@gmail.com>

# Install dependencies
RUN apt-get update \
  && apt-get install -qy git build-essential \
  && rm -rf /var/lib/apt/lists/*

# add an 'app' user
RUN groupadd --gid 1000 app && \
	useradd --home /home/app --create-home --uid 1000 -g app app

ENV APP_DIR /home/app/pokedex

# Drop root.
RUN mkdir ${APP_DIR}
WORKDIR ${APP_DIR}

# Expose the app.
ENV PORT 8080
EXPOSE ${PORT}

# Install/ensure deps
ADD npm-shrinkwrap.json /tmp/npm-shrinkwrap.json
ADD package.json /tmp/package.json
RUN cd /tmp && \
	npm install --no-optional

COPY . ${APP_DIR}
RUN chown -R app:app ${APP_DIR} && \
	rm -rf ${APP_DIR}/node_modules && \
	mv /tmp/node_modules ${APP_DIR}

USER app

ENV NODE_ENV production

CMD ["npm", "start"]