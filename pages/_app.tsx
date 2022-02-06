import cookie from "cookie";
import * as React from "react";
import type { IncomingMessage } from "http";
import type { AppProps, AppContext } from "next/app";

import { SSRKeycloakProvider, SSRCookies } from "@react-keycloak/ssr";

const keycloakCfg = {
  url: "http://localhost:8080/auth",
  realm: "samplerealm",
  clientId: "nextjs"
};

interface InitialProps {
  cookies: unknown;
}

console.log("_app");

const eventLogger = (event: unknown, error: unknown) => {
  console.log("onKeycloakEvent", event, error);
};

const tokenLogger = (tokens: unknown) => {
  console.log("onKeycloakTokens", tokens);
};

function MyApp({ Component, pageProps, cookies }: AppProps & InitialProps) {
  console.log("MyApp");
  return (
    <SSRKeycloakProvider
      keycloakConfig={keycloakCfg}
      persistor={SSRCookies(cookies)}
      onEvent={eventLogger}
      onTokens={tokenLogger}
    >
      <Component {...pageProps} />
    </SSRKeycloakProvider>
  );
}

function parseCookies(req?: IncomingMessage) {
  if (!req || !req.headers) {
    return {};
  }
  return cookie.parse(req.headers.cookie || "");
}

MyApp.getInitialProps = async (context: AppContext) => {
  // Extract cookies from AppContext
  return {
    cookies: parseCookies(context?.ctx?.req)
  };
};

export default MyApp;
