FROM ghcr.io/grafana/xk6-dashboard:0.7.3-alpha.1
COPY protocol_loadtest_arm.js ./protocol_loadtest_arm.js
CMD ["run","--out", "dashboard","./protocol_loadtest_arm.js"]