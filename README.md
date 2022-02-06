- When skaffold not found, `sudo snap install skaffold`
- If there is an issue for making the api call from postman
  - Stop local docker
  - In postman, from settings, disable `ssl` certificate validation
- To store secret in k8s cluster in dev,

```bash
kubectl create secret generic jwt-secret --from-literal=JWT_KEY=asdf
```

To get all secrets,

```bash
kubectl get secrets
```
