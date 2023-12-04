import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.jsx';
import { Provider } from 'react-redux';
import { MyProvider } from "./Context/Mycontext";
import { configureStore } from '@reduxjs/toolkit';
import datareducer from './store/Store.js';
import './main.css';

const store = configureStore({
  reducer: datareducer,
});

ReactDOM.render(
  <React.StrictMode>
    <MyProvider>
      <Provider store={store}>
        <App />
      </Provider>
    </MyProvider>

  </React.StrictMode>,
  document.getElementById('root')
);
