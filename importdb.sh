#!/bin/bash
rm latest.dump
heroku pg:backups:capture --app flash-cardz
heroku pg:backups:download --app flash-cardz
pg_restore --verbose --clean --no-acl --no-owner -h localhost -d flash-cards_development latest.dump
rm latest.dump
echo Production Database Imported!
