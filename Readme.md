Setup google cloud steps.

1 create google cloud account
2 enable Kubernetes services
3 Create new cluster of default number of nodes(3)
4 Install GCloud SDK
5 Initialize gcloud and create kubectl context for ticketing application
5.1 Login to gcloud SDK (_gcloud auth login_) and follow steps
5.2 Create new Context to use kubectl with GCloud application ticketing-dev (_gcloud container clusters get-credentials clustername_)
6 modify skaffold.yaml to point to gCloud
6.1 comment ou the Local push
6.2 Add google cloud build in build section with you project id (ticketing-dev-######)
6.3 Change image name to predefined google format (_us.gcr.io/project id/appname: e.g. auth_)
6.4 Change also the image name in Docker file
7- Configure ingress-nginx the commands are availabe for Google cloud on (https://kubernetes.github.io/ingress-nginx/deploy/#gce-gke)
8- Verify Load balancer created or not.
9- enable Cloud build API service
10- execute skaffold (_skaffold dev_)
10.1- if you recieve an error of authentication execute and login again (gcloud auth application-default login) and rerun the (_skaffold dev_)
11- get load balancer IP and define it on hosts file for ticketing-dev

Note: Delete the cluster if you need to use local machine
