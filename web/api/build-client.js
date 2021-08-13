import axios from 'axios';

//Next.js call get initial props this on server side
//But in navigating between routes it get called from browser
const buildClient = ({ req }) => {
  // we are on server
  if (typeof window === 'undefined') {
    //Call through ingress controller cross namespace url : http://SERVICE_NAME.NAMESPACE.SVC.CLUSTER.LOCAL/<SERVICE URL>
    //Also ingress rule is for host:ticketing.dev so we need to specify in options object
    return axios.create({
      baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
      headers: req.headers,
    });
  } else {
    //we are on browser
    //call through base URL and in browser it is empty i.e. domain name
    return axios.create({
      baseURL: '/',
    });
  }
};

export default buildClient;
