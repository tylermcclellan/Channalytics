import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom'
import './index.css';
import MainController from './MainController';
import registerServiceWorker from './registerServiceWorker';

const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET

ReactDOM.render(<HashRouter><MainController clientId={CLIENT_ID} clientSecret={CLIENT_SECRET}/></HashRouter>, document.getElementById('root'));
registerServiceWorker();
