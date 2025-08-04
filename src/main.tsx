import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./App.css";
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: outputs.auth.user_pool_id,
      userPoolClientId: outputs.auth.user_pool_client_id,
      identityPoolId: outputs.auth.identity_pool_id,
      signUpVerificationMethod: 'code',
    }
  },
  API: {
    GraphQL: {
      endpoint: outputs.data.url,
      region: outputs.data.aws_region,
      defaultAuthMode: 'apiKey',
      apiKey: outputs.data.api_key
    }
  }
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Authenticator.Provider>
      <App />
    </Authenticator.Provider>
  </React.StrictMode>
);
