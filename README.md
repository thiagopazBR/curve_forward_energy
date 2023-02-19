# MG SLA


for dev:<br>
docker build --target=builder -t mgsla:dev .


for production:<br>
git clone https://github.com/thiagopazBR/curve_forward_energy.git<br>
docker build -t mgsla .<br>


# run
docker run -it --rm \
    --env-file /opt/automated_scripts/dockerized_environment/env/.env \
    -v /opt/automated_scripts/dockerized_environment/log/:/usr/src/app/log/ \
    mgsla \
    build/index.js -d 2023-02-11 (opcional)
