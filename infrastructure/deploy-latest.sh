#!/bin/bash

nv=$(git describe --abbrev=0)
major="$(cut -d'.' -f1 <<<"$nv")"
minor="$(cut -d'.' -f2 <<<"$nv")"

pv="$major.$(($minor - 1))"

sed -i '' "s/$pv/$nv/g" docker-compose.yml
echo "Re-deploying discman container with version $nv"
docker-compose up -d disclive
