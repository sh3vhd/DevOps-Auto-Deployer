import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles/tailwind.css';
import { store, persistor } from './store';
import Loader from './components/Loader';
import { configureApi } from './api/axios';
import { refreshSession, setTokens, clearAuth } from './store/slices/authSlice';
import { showToast } from './store/slices/uiSlice';

// Wire up global Axios interceptors before the first React render.
configureApi({
  getState: store.getState,
  refreshSession: () => store.dispatch(refreshSession()).unwrap(),
  onLogout: () => {
    store.dispatch(clearAuth());
    store.dispatch(
      showToast({
        title: 'Session expired',
        message: 'Please sign in again to continue.',
        type: 'danger'
      })
    );
  },
  onTokensUpdate: (payload) => store.dispatch(setTokens(payload))
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={<Loader fullscreen />} persistor={persistor}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
