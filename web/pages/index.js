import buildClient from '../api/build-client';

const landingPage = ({ currentUser }) => {
  return <h1>{currentUser ? 'you are signed in' : 'please sign in'}</h1>;
};

//Next.js call this on server side if . hard refresh, first call etc...
//But in navigating between routes it get called from browser
landingPage.getInitialProps = async context => {
  const { data } = await buildClient(context).get('/api/users/currentuser');
  return data;
};

export default landingPage;
