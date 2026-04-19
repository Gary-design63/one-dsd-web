# Minimal static site container for Azure Container Apps / any OCI runtime.
# Single-file HTML app for the One DSD People, Culture and Equity Program.
FROM nginx:1.27-alpine

# Custom config (SPA fallback to /index.html)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# App content
COPY public/ /usr/share/nginx/html/

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s \
  CMD wget -q --spider http://localhost/ || exit 1
