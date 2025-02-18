#!/bin/bash
docker pull cliuzy1/gridape:v1
docker stop my_app || true
docker rm my_app || true
docker-compose up -d
