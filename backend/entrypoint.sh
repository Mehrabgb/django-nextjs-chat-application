#!/bin/sh

echo "Running migrations..."

python manage.py migrate

echo "Starting Daphne..."

exec python manage.py runserver 0.0.0.0:8000