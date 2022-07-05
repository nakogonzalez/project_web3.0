import React from 'react'
import OnramperWidget from "@onramper/widget";

const OnRamp = () => {

    const wallets = {
        BTC: { address: "btcAddr" },
        BNB: { address: "bnbAddress", memo: "cryptoTag" },
      };
    const apiKey = "pk_test_1zj_2c5hDaRCy2RT14KA0jMMg9jSkkjYUA4bt39g4tM0"
    
      return (
        <div
          style={{
            width: "482px",
            height: "660px",
            background: "#0f0f14"
          }}
        >
          <OnramperWidget
            API_KEY={apiKey}
            defaultAddrs={wallets}
            darkMode={true}
          >
          </OnramperWidget>
        </div>
      );
}

export default OnRamp