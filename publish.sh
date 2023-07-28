#!/bin/bash
docker save psm-front | bzip2 | pv | ssh falke docker load
ssh falke docker kill psm-front
ssh falke docker rm psm-front
ssh falke docker run -d --name psm-front -p 1043:3000 psm-front