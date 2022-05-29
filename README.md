- Install minikube [Minikube](https://minikube.sigs.k8s.io/docs/start/) and start `minikube start`
- Install kubectl from [K8s](https://kubernetes.io/docs/tasks/tools/install-kubectl-linux/)
- Install gcloud by `sudo snap install google-cloud-sdk --classic`
- Logged in with googe cloud `gcloud auth login`
- Configure by `gcloud init`
- Configure the k8s clusters `gcloud container clusters get-credentials ticketing-dev`
- Verify running pods `kubectl get pods` and this should resolves the `auth` and `mongo` pods
- Create ingress nginx using `kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.1.2/deploy/static/provider/cloud/deploy.yaml ` from [site](https://kubernetes.github.io/ingress-nginx/deploy/)
- Also configure for gke `kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.1.3/deploy/static/provider/cloud/deploy.yaml`
- Update the local computer host list by the gcp load balancer ip
- Update credentials for google code build `gcloud auth application-default login`
- When skaffold not found,
  - [Download](https://skaffold.dev/docs/install/) from here, using
  ```
  curl -Lo skaffold https://storage.googleapis.com/skaffold/releases/latest/skaffold-linux-amd64 && \
  sudo install skaffold /usr/local/bin/
  ```
- If we do not use google cloud, make sure all the docker images are build and publish in docker hub, because, scaffold expects to get the images from docker hub when google cloud is not being used
- Run app `skaffold dev`
- Open browser, go to `https://ticketing.dev/api/users/currentuser` and type `thisisunsafe`
- To run test, go to auth directory, install packages and run `yarn test`
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

- To open nats streaming server, first get the pod name using `kubectl get pods` and the pod should start with name `nats-depl-`. Now export port `4222` using `kubectl port-forward nats-depl-random)id 4222:4222`
- To clear all the testing message in nats, restart the nats pod. get the running nats pods by `kubectl get pods`. Delete the nats pods using `kubectl delete pod nats-depl-random_generated_id`

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

## Error 3

failed: getting cloudbuild client: google: could not find default credentials.

Run `gcloud auth application-default login`

## Error 4

In case ticket/order pod created before mongodb or redis pod, restart the ticket or order pod. To restart, get the pod list, `kubectl get pods`. Now delete the pod `kubectl delete pod pod_name`. This should simply restart the pod.

## Error 5

For error like `Non-string value passed to ts.resolveTypeReferenceDirective` update `ts-node-dev` to `^2.0.0`
