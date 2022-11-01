import React from 'react';
import {
	HashRouter as Router,
	Route,
	Switch,
	Redirect
} from 'react-router-dom';
import {I18n} from 'aws-amplify'
import { withAuthenticator} from 'aws-amplify-react'

import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';

import Layout from './components/Layout/Layout'

import Dashboard from './pages/Dashboard/Dashboard'
import MapPage from './pages/MapPage/MapPage'
import ListPage from './pages/ListPage/ListPage'
import SensorPage from './pages/SensorPage/SensorPage'
import NotificationsPage from './pages/NotificationsPage/NotificationsPage'
import SettingsPage from './pages/SettingsPage/SettingsPage'

import {dict} from './translations'

I18n.setLanguage('en')
I18n.putVocabularies(dict);

const myEnv = dotenv.config()
dotenvExpand(myEnv);

const signUpConfig = {
  hideAllDefaults: true,
  signUpFields: [
    {
      label: 'Username',
      key: 'username',
      required: true,
      placeholder: 'Email',
      type: 'email',
      displayOrder: 1,
    },
    {
      label: 'Password',
      key: 'password',
      required: true,
      placeholder: 'Password',
      type: 'password',
      displayOrder: 2,
    },
  ],
}

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Switch>
            <Route exact path="/" component={Dashboard} />
            <Route exact path="/map" component={MapPage} />
            <Route exact path="/list" component={ListPage} />
            <Route exact path="/sensor/:id" component={SensorPage} />
            <Route exact path="/notifications" component={NotificationsPage} />
            <Route exact path="/settings" component={SettingsPage} />
            <Redirect to="/"/>
        </Switch>
      </Layout>
    </Router>
  );
}

export default withAuthenticator(App, false, [], null, null, signUpConfig);
