#!/bin/bash
echo "Checking deployment of ${DRONE_COMMIT_SHA} from build ${DRONE_BUILD_PARENT} ${PRODUCTION_RELEASE_KEY} ${SECRET}"
if [ "${PRODUCTION_RELEASE_KEY}" == "${SECRET}" ]
  then
    echo "We are a go!"
  else
    echo "Invalid deployment key"
    exit 1
fi