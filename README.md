# MG SLA


for dev:
docker build --target=builder -t mgsla:dev .


for production:
docker build -t mgsla .


# run
docker run -it --rm \
    -v log/:log/ \
    -v env/:env/ \
    mgsla \
    -d 2022-02-17 (opcional)
