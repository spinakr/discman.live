#!/bin/bash

cd ../src/Web/

version=$(git describe --abbrev=0)
major="$(cut -d'.' -f1 <<<"$version")"
minor="$(cut -d'.' -f2 <<<"$version")"

nv="$major.$(($minor + 1))"

echo "Building version $nv"



eval "docker build -t sp1nakr/disclive:$nv . ; docker push sp1nakr/disclive:$nv"

cd ../../

echo "Tagging version $nv"
eval "git tag -a $nv -m 'New image version'"


cd ./infrastructure