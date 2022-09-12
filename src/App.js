import "./App.css";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";
import sigV4Client from "./libs/sigV4Client";

function App() {
  const apply = async () => {
    // Create Cognito UserPool
    const cognitoIdentityProvider = await fromCognitoIdentityPool({
      clientConfig: { region: process.env.REACT_APP_REGION },
      identityPoolId: process.env.REACT_APP_IDENTITY_POOL_ID,
      logins: {},
    });

    // Federate Identity (temp)
    const { accessKeyId, secretAccessKey, sessionToken } =
      await cognitoIdentityProvider.apply().then((result) => {
        return result;
      });

    // Create request To AWS GATEWAY API
    const signedRequest = await sigV4Client
      .newClient({
        accessKey: accessKeyId,
        secretKey: secretAccessKey,
        sessionToken: sessionToken,
        region: process.env.REACT_APP_REGION,
        endpoint: "https://vy43n4fiyh.execute-api.ca-central-1.amazonaws.com",
      })
      .signRequest({
        method: "POST",
        path: "/dev/restaurantConfig",
        headers: {},
        queryParams: {},
        body: {
          restaurantId: "testrestid1",
        },
      });

    // ! Call api using proxy for Cors origin reason
    const restauConfigRequest = await fetch("/api?restaurantId=testrestid1", {
      method: "POST",
      headers: signedRequest.headers,
    });

    console.log(restauConfigRequest);
  };

  return (
    <div className="App">
      <button type="button" onClick={apply}>
        Get Data
      </button>
    </div>
  );
}

export default App;
