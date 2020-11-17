#!/bin/bash
echo "Checking deployment secret of ${DRONE_COMMIT_SHA} from build ${DRONE_BUILD_PARENT}"
if [ "${PRODUCTION_RELEASE_KEY}" == "${SECRET}" ]
  then
    echo "Secret check PASSED"
  else
    echo "Secret check FAILED"
    exit 1
fi
now=$(date + '%d/%m/%Y')
echo "Checking deployment date of ${DRONE_COMMIT_SHA} from build ${DRONE_BUILD_PARENT} against ${now}"
if [ "${now}" == "${TODAY}" ]
  then
    echo "Date check PASSED"
  else
    echo "Date check FAILED"
    exit 1
fi
