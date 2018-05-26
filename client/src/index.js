import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom'
import './index.css';
import MainController from './MainController';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<HashRouter><MainController /></HashRouter>, document.getElementById('root'));
registerServiceWorker();
