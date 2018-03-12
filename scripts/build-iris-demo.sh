#!/usr/bin/env bash

# Copyright 2018 Google LLC
#
# Use of this source code is governed by an MIT-style
# license that can be found in the LICENSE file or at
# https://opensource.org/licenses/MIT.
# =============================================================================


# Builds the Iris demo for TensorFlow.js Layers.
# Usage example: do under the root of the source repository:
#   ./scripts/build-iris-demo.sh
#
# Then open the demo HTML page in your browser, e.g.,
#   google-chrome demos/iris_demo.html &

set -e

SCRIPTS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Parse input arguments.
DEMO_PORT=8000
while true; do
  if [[ "$1" == "--port" ]]; then
    DEMO_PORT=$2
    shift 2
  elif [[ -z "$1" ]]; then
    break
  else
    echo "ERROR: Unrecognized argument: $1"
    exit 1
  fi
done

# Build TensorFlow.js Layers standalone.
"${SCRIPTS_DIR}/build-standalone.sh"  # TODO(cais): Restore.

DEMO_PATH="${SCRIPTS_DIR}/../dist/demo"
ARTIFACTS_DIR="${DEMO_PATH}/iris"
rm -rf "${ARTIFACTS_DIR}"

# Run Python script to generate the model and weights JSON files.
# The extension names are ".js" because they will later be converted into
# sourceable JavaScript files.
export PYTHONPATH="${SCRIPTS_DIR}/..:${SCRIPTS_DIR}/../node_modules/deeplearn-src/scripts:${PYTHONPATH}"
python "${SCRIPTS_DIR}/iris.py" --artifacts_dir "${ARTIFACTS_DIR}"

echo
echo "-----------------------------------------------------------"
echo "Once the HTTP server has started, you can view the demo at:"
echo "  http://localhost:${DEMO_PORT}/demos/iris_demo.html"
echo "-----------------------------------------------------------"
echo

cd "${SCRIPTS_DIR}/.."
node_modules/http-server/bin/http-server -p "${DEMO_PORT}"