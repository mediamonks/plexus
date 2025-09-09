#!/bin/bash
SCOPES=$(cat config/scopes.txt | tr '\n' ',' | sed 's/,$//')
gcloud auth application-default login --scopes=$SCOPES
gcloud auth application-default set-quota-project monks-plexus
