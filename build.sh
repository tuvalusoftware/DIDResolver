# Delete old image
docker rmi resolver-service

# Build new image
docker build --pull -t resolver-service .