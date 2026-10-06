FROM python:3.12-alpine
WORKDIR /app
COPY app/ /app/
ENV PORT=8080 DATA_DIR=/data
RUN mkdir -p /data && chown 568:568 /data
USER 568:568
EXPOSE 8080
HEALTHCHECK --interval=60s --timeout=5s --start-period=30s --start-interval=2s CMD wget -qO- http://127.0.0.1:8080/api/ping || exit 1
CMD ["python", "/app/server.py"]
