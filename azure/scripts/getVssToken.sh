#!/usr/bin/env bash

if [ -e azure/.azuredevops-token ]
then
    echo $(cat azure/.azuredevops-token)
else
    echo $AZURE_DEVOPS_TOKEN
fi