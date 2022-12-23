FROM debian:bullseye-slim AS lama_base

RUN apt-get update && apt-get install -y curl gnupg2 sudo python3-minimal python3-venv
# install mongodb
RUN curl -LSs https://www.mongodb.org/static/pgp/server-4.4.asc | apt-key add -
RUN echo "deb http://repo.mongodb.org/apt/debian buster/mongodb-org/4.4 main" | tee /etc/apt/sources.list.d/mongodb-org-4.4.list
RUN apt-get update && apt-get install -y mongodb-org \
  && rm -rf /var/lib/apt/lists/*
# download node
RUN curl -LSsO https://nodejs.org/dist/v16.15.0/node-v16.15.0-linux-x64.tar.gz \
  && curl -LSsO https://nodejs.org/dist/v16.15.0/SHASUMS256.txt.asc
# verify and install
RUN gpg2 --keyserver hkps://keys.openpgp.org --recv-keys 74F12602B6F1C4E913FAA37AD3A89613643B6201 \
  && gpg2 --verify SHASUMS256.txt.asc \
  && sha256sum --ignore-missing -c SHASUMS256.txt.asc \
  && tar -xf node-v16.15.0-linux-x64.tar.gz --strip-components=1 -C /usr/local \
  && rm node-v16.15.0-linux-x64.tar.gz SHASUMS256.txt.asc

ENV USERNAME lama
ENV HOME /home/$USERNAME
RUN useradd --create-home --home-dir $HOME --shell /bin/bash $USERNAME \
  && chown -R $USERNAME:$USERNAME $HOME

COPY frontend/ $HOME/frontend/
COPY backend/ $HOME/backend/
COPY scripts/lamaherder.py scripts/reset_from_eventlog.py $HOME/scripts/

WORKDIR $HOME

RUN chown -R $USERNAME:$USERNAME frontend/ backend/ scripts/

USER $USERNAME

RUN python3 -m venv .venv && .venv/bin/pip install -e backend/
RUN sed -i 's/127\.0\.0\.1/0.0.0.0/' backend/lama/server.py
RUN .venv/bin/python scripts/lamaherder.py createuser admin --privileges a --password Wooly4711

RUN date --iso-8601=seconds | tee date.txt | sha256sum | cut -c1-4 | xargs printf "###%s\n" > git_revision.txt

RUN cd frontend/ && npm install
RUN cd frontend/ && bash -c 'LAMA_REVISION="$(<../git_revision.txt)" LAMA_DATE="$(<../date.txt)" API_URL="http://localhost:3333" WS_URL="ws://localhost:3333/ws" npm run build:production'

COPY docker-entrypoint.sh /

USER root
ENTRYPOINT ["/docker-entrypoint.sh"]

# empty LAMA:
# $ docker build --target=lama_base -t lama:empty .
# $ docker run -it --rm --name lamatest -p 127.0.0.1:3333:3333 -p 127.0.0.1:8080:8080 lama:empty
# or with persistent event log:
# $ docker run -it --rm --name lamatest -p 127.0.0.1:3333:3333 -p 127.0.0.1:8080:8080 -v <absolute path to sqlite file on host>:/home/lama/lama.db:rw lama:empty

FROM lama_base AS lama_tsdata

COPY scripts/replace_mongo_data.py $HOME/scripts/
RUN chown -R $USERNAME:$USERNAME scripts/replace_mongo_data.py
USER $USERNAME
RUN curl -LSsO https://github.com/tellingsounds/lama-data/raw/main/lama-data.json
# mongodb has not been started at this point, so we're unable to handle events!
RUN .venv/bin/python scripts/replace_mongo_data.py --store-only lama-data.json

USER root
ENTRYPOINT ["/docker-entrypoint.sh"]

# LAMA with TS data:
# $ docker build -t lama:tsdata .
# $ docker run -it --rm --name lamatest -p 127.0.0.1:3333:3333 -p 127.0.0.1:8080:8080 lama:tsdata

# XXX: for mounting volumes-case, we can't write stuff into sqlite during the build!!!
# this applies to both eventlog and userstore
# so all default actions need to be taken in the entrypoint script
