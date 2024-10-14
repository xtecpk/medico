import React, { Suspense, useEffect } from "react";
import ReactDOM, { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "./i18next";
import { store } from "./app/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import { GoogleOAuthProvider } from "@react-oauth/google";

const container = document.getElementById("root");
const root = createRoot(container);
let persistor = persistStore(store);

root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="201526337702-e2jadcscocsakfn40l0jn777iacrss9f.apps.googleusercontent.com">
      <Suspense fallback={<div>Loading...</div>}>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <App />
          </PersistGate>
        </Provider>
      </Suspense>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
