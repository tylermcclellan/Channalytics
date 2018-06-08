import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom'
import './index.css';
import MainRouter from './MainRouter';

ReactDOM.render(<HashRouter><MainRouter /></HashRouter>, document.getElementById('root'));
