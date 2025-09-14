# Startup
```
docker build -t amp-test:latest .
docker run -d --name amp-test -e COMMISSION=0.01 -e INTERVAL=10 -e PORT=3000 -p 3000:3000 amp-test:latest
```