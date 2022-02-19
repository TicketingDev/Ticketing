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

## Error 1

```
Deploy Failed. Could not connect to cluster due to "https://34.87.59.40/version?timeout=32s": error executing access token command "/snap/google-cloud-sdk/223/bin/gcloud config config-helper --format=json": err=fork/exec /snap/google-cloud-sdk/223/bin/gcloud: no such file or directory output= stderr=. Check your connection for the cluster.
```

Solution,

Get region and cluster name,

```bash
gcloud container clusters list
```

Now regenerate auth,

```bash
gcloud container clusters get-credentials ticketing-dev --zone=asia-southeast1-a
```

Ref: [Stackoverflow](https://stackoverflow.com/questions/56654149/error-executing-access-token-command-google-google-cloud-sdk-bin-gcloud-config)

## Error 2

While run the tests, it is possible to get error in first time.

Double check by running it twice.
