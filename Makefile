ifeq ($(OS), Windows_NT)
init:
	@pip install -r requirements.txt
	@python manage.py collectstatic --noinput

migrate:
	@python manage.py makemigrations
	@python manage.py migrate

run:
	@python manage.py runserver 0.0.0.0:8000

reset:
	@python manage.py flush
	@python manage.py createsuperuser --email admin@bridgelabz.com

else
init:
	@pip3 install -r requirements.txt
	@python3 manage.py collectstatic --noinput

migrate:
	@python3 manage.py makemigrations
	@python3 manage.py migrate

run:
	@python3 manage.py runserver 0.0.0.0:8000
endif
