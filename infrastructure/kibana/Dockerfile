ARG ELK_VERSION

# https://www.docker.elastic.co/
FROM docker.elastic.co/kibana/kibana:${ELK_VERSION}

COPY /config /usr/share/kibana/config

# Add your kibana plugins setup here
# Example: RUN kibana-plugin install <name|url>