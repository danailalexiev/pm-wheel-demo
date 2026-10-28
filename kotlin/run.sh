#!/usr/bin/env bash
# Needs kotlinc on PATH (sdk install kotlin). Tested with Kotlin 2.1.20 / JDK 21.
set -e
kotlinc src -include-runtime -d build/app.jar 2>&1 | grep -v "^warning" || true
java -jar build/app.jar
