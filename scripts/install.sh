#!/usr/bin/env bash
# get the script dir
script_path=$(cd $(dirname $0) && pwd -P)

# install all dep use custom npm registry
#npm --registry=http://ec2-18-221-5-8.us-east-2.compute.amazonaws.com:7001 --registryweb=http://ec2-18-221-5-8.us-east-2.compute.amazonaws.com:7002 install
yarn
# init with commitizen


npx commitizen init cz-conventional-changelog --save-dev --save-exact

if [ $? != "0" ]
then
    echo "init with commitizen failed..."
    exit 2
fi

# execute link command
$script_path/link.sh

if [ $? != "0" ]
then
    echo "link dep failed"
    exit 3
fi
echo "success!"

# use pod to install dep
which pod
if [ $? != "0" ]
then
    echo "please install cocoPods first"
    exit 3
fi

cd $script_path/../ios
pod install --repo-update
