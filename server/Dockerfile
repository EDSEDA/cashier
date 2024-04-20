FROM python:3.10-buster

WORKDIR /server
COPY server .

RUN apt-get install openssl \
    && pip install --upgrade pip \
    && pip install -r requirements.txt \
    && rm -rf ~/.cache
