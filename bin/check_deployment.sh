#!/bin/sh
echo "Checking deployment secret of ${DRONE_COMMIT_SHA} from build ${DRONE_BUILD_PARENT}"
if [ "${PRODUCTION_RELEASE_KEY}" == "${SECRET}" ]
  then
    echo "Secret check PASSED"
  else
    echo "Secret check FAILED"
    exit 1
fi
drone --version
