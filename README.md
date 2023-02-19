# MG SLA


for dev:<br>
docker build --target=builder -t mgsla:dev .


for production:<br>
git clone https://github.com/thiagopazBR/curve_forward_energy.git<br>
docker build -t mgsla .<br>


# run
```console
docker run -it --rm \
    --env-file /opt/automated_scripts/dockerized_environment/env/.env \
    -v /opt/automated_scripts/dockerized_environment/log/:/usr/src/app/log/ \
    mgsla \
    build/index.js -d 2023-02-11
```

The last line is not required. If you don't specify a date, it will be D-1 (yesterday)
