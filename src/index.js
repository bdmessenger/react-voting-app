import React, {useState, useEffect} from 'react';
import ReactDOM from 'react-dom';
import './style.css';
import './favicon.ico';
import API from './API';

import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';

import App from './App';
import Home from './components/Home';
import Poll from './components/Poll';
import MyPolls from './components/MyPolls';
import CreatePoll from './components/CreatePoll';

const Index = () => {
  const [state, setState] = useState({
    user: {},
    error: null,
    isAuthenticated: false
  });

  const [isRequestCompleted, setRequestStatus] = useState(false);

  useEffect(() => {
      (async () => {
          await API.get('/auth/login/success')
            .then(res => {
              if(res.status === 200) {
                console.log('Authorization Valid.');
                setState({
                  isAuthenticated: true,
                  user: res.data.user
                });
                return true;
              }
              throw new Error('Failed to authenticate user.');
            })
            .catch(err => {
              console.log('Authorization Invalid.');
              setState({
                isAuthenticated: false,
                error: "Failed to authenticate user."
              });
          });
          setRequestStatus(true);
      })();
  }, []);

  return (
    <Router>
      <App state={state} isRequestCompleted={isRequestCompleted}>
        <Switch>
            <Route exact path="/">
              <Home/>
            </Route>
            <Route path="/poll/:id">
              <Poll user={state.user} isAuthenticated={state.isAuthenticated}/>
            </Route>
            <Route path="/my-polls">
              <MyPolls isAuthenticated={state.isAuthenticated} isRequestCompleted={isRequestCompleted}/>
            </Route>
            <Route path="/create-poll">
              <CreatePoll isAuthenticated={state.isAuthenticated} isRequestCompleted={isRequestCompleted}/>
            </Route>
            <Route path="/not-authorized">
              <div className="text-center p-8">
                <h3>Client not authorized.</h3>
                <a href={`${process.env.NODE_ENV === 'development' ? 'http://localhost:8080/' : '/'}auth/twitter`} className="underline text-blue-500 select-none cursor-pointer text-2xl">Click to Login</a>
              </div>
            </Route>
            <Route path="*">
              <h1 className="text-center p-8">404: Page Not Found</h1>
            </Route>
        </Switch>
      </App>
    </Router>
  )
}

ReactDOM.render(
  <React.StrictMode>
    <Index />
  </React.StrictMode>,
  document.getElementById('root')
);