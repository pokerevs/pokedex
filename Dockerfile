FROM node:6.3.0
MAINTAINER Erin <sylphofelectricity@gmail.com>

# Install dependencies
RUN apt-get update \
  && apt-get install -qy git build-essential \
  && rm -rf /var/lib/apt/lists/*

# Drop root.
USER app
WORKDIR /app

# Expose the app.
ENV PORT 9000
EXPOSE ${PORT}

# Install/ensure deps
ADD npm-shrinkwrap.json ./
ADD package.json ./
RUN npm update -g && \
	npm install --no-optional

ADD . ./

CMD ['npm', 'start']