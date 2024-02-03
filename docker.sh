# #!/bin/bash

# scratch_create = "rc"
# create = "c"
# down = "d"


# if [$1 == $scratch_create]
# then
#     docker-compose -f docker-compose.prod.yml down -v
#     docker rmi -f $(docker images -aq)
#     docker-compose -f docker-compose.prod.yml --env-file .env.prod up -d
# elif [$1 == $create]
# then
#     docker-compose -f docker-compose.prod.yml --env-file .env.prod up -d
# elif [$1 == $down]
# then
#     docker-compose -f docker-compose.prod.yml down
# else
#     echo "Invalid arguments"
# fi

#!/bin/bash

scratch_create="rc"
create="c"
down="d"

if [ "$1" == "$scratch_create" ]; then
    docker-compose -f docker-compose.prod.yml down -v
    docker rmi -f $(docker images -aq)
    docker-compose -f docker-compose.prod.yml --env-file .env.prod up -d
elif [ "$1" == "$create" ]; then
    docker-compose -f docker-compose.prod.yml --env-file .env.prod up -d
elif [ "$1" == "$down" ]; then
    docker-compose -f docker-compose.prod.yml down
elif [ "$1" == "$fe" ]; then
    docker-compose -f GoogleKeep/docker-compose.angular.yml up -d
else
    echo "Invalid arguments"
fi
