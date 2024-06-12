import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App.jsx';
import './index.css';
import { PersistGate } from 'redux-persist/integration/react'; // Import PersistGate

import { Store, Persistor } from './Redux/Store';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={Store}>
      <PersistGate loading={null} persistor={Persistor}>
        <App/>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);