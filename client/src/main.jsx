import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import { TransactionsProvider } from "./context/TransactionContext";
import "./index.css";

ReactDOM.render(
  <TransactionsProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </TransactionsProvider>,
  document.getElementById("root"),
);
