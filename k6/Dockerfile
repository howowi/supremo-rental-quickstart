FROM grafana/k6:master-with-browser
COPY protocol_loadtest_arm.js ./protocol_loadtest_arm.js
ARG grafana_token
ENV env_name $grafana_token
RUN k6 login cloud --token $grafana_token
CMD ["run","--out", "cloud","./protocol_loadtest_arm.js"]