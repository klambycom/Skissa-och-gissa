import React from 'react';
import ReactDOM from 'react-dom';
import block from "bem-cn";
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import './index.css';

block.setup({
  el: "__",
  mod: "--",
  modValue: "-"
});

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
