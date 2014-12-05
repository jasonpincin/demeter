#!/usr/bin/env bash
dir=/tmp/demeter-test/$(node -pe 'Math.random().toString(16).slice(2)')
mkdir -p $dir
cd $dir

cat > package.json <<EOL
{
    "name": "demeter-good-test",
    "version": "0.0.0",
    "description": "Passing test",
    "main": "index.js",
    "scripts": {
        "test": "exit 0"
    },
    "devDependencies": {
        "through2": "~0.6.3"
    }
}
EOL

git init
git add package.json
git commit -m "initial commit"
git push "$1"
