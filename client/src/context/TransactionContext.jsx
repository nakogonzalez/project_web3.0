import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { Magic } from 'magic-sdk';
import { contractABI, contractAddress } from "../utils/constants";

export const TransactionContext = React.createContext();

const { ethereum } = window;

const magic = new Magic('pk_live_0E0EA162DC1B8A49',{
  network: 'rinkeby', // Supports "rinkeby", "ropsten", "kovan"
});
const magicProvider = new ethers.providers.Web3Provider(magic.rpcProvider);

const render = async () => {
  const isLoggedIn = await magic.user.isLoggedIn();
  
  /* Show login form if user is not logged in */
  let authHtml = `
    <div class="container">
      <h1>Please sign up or login</h1>
      <form onsubmit="handleLogin(event)">
        <input type="email" name="email" required="required" placeholder="Enter your email" />
        <button type="submit">Send</button>
      </form>
    </div>
  `;
  let userHtml = "";
  const target = document.querySelector("#app");
  if (isLoggedIn) {
    /* Get user metadata including email */
    const userMetadata = await magic.user.getMetadata();
    const signer = magicProvider.getSigner();
    const network = await magicProvider.getNetwork();
    const userAddress = await signer.getAddress();
    const userBalance = ethers.utils.formatEther(
      await magicProvider.getBalance(userAddress)
    );
    authHtml = `
      <div class="container">
        <h1>Current user: ${userMetadata.email}</h1>
        <button onclick="handleLogout()">Logout</button>
      </div>
    `;
    userHtml = `
      <div class="container">
        <h1>Ethereum address</h1>
        <div class="info">
          <a href="https://rinkeby.etherscan.io/address/${userAddress}" target="_blank">${userAddress}</a>
        </div>
        <h1>Network</h1>
        <div class="info">${network.name}</div>
        <h1>Balance</h1>
        <div class="info">${userBalance} ETH</div>
      </div>
    `;

  }
  target.innerHTML =
    authHtml + userHtml;
};

// Handle Submit
const handleLogin = async (e) => {
  e.preventDefault();
  const email = new FormData(e.target).get('email');
  const redirectURI = `${window.location.origin}/callback`; // 👈 This will be our callback URI
  console.log(email, redirectURI)
  if (email) {
    /* One-liner login 🤯 */
    await magic.auth.loginWithMagicLink({ email, redirectURI }); // 👈 Notice the additional parameter!
    render();
  }
};

const createEthereumContract = () => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const transactionsContract = new ethers.Contract(contractAddress, contractABI, signer);

  return transactionsContract;
};

export const TransactionsProvider = ({ children }) => {
  const [formData, setformData] = useState({ addressTo: "", amount: "", keyword: "", message: "" });
  const [currentAccount, setCurrentAccount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [transactionCount, setTransactionCount] = useState(localStorage.getItem("transactionCount"));
  const [transactions, setTransactions] = useState([]);

  const handleChange = (e, name) => {
    setformData((prevState) => ({ ...prevState, [name]: e.target.value }));
  };

  const getAllTransactions = async () => {
    try {
      if (ethereum) {
        const transactionsContract = createEthereumContract();

        const availableTransactions = await transactionsContract.getAllTransactions();

        const structuredTransactions = availableTransactions.map((transaction) => ({
          addressTo: transaction.receiver,
          addressFrom: transaction.sender,
          timestamp: new Date(transaction.timestamp.toNumber() * 1000).toLocaleString(),
          message: transaction.message,
          keyword: transaction.keyword,
          amount: parseInt(transaction.amount._hex) / (10 ** 18)
        }));

        console.log(structuredTransactions);

        setTransactions(structuredTransactions);
      } else {
        console.log("Ethereum is not present");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkIfWalletIsConnect = async () => {
    try {
      if (!ethereum) return alert("Please install MetaMask.");

      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length) {
        setCurrentAccount(accounts[0]);

        getAllTransactions();
      } else {
        console.log("No accounts found");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkIfTransactionsExists = async () => {
    try {
      if (ethereum) {
        const transactionsContract = createEthereumContract();
        const currentTransactionCount = await transactionsContract.getTransactionCount();

        window.localStorage.setItem("transactionCount", currentTransactionCount);
      }
    } catch (error) {
      console.log(error);

      throw new Error("No ethereum object");
    }
  };

  const connectWallet = async () => {
    try {
      if (!ethereum) return alert("Please install MetaMask.");

      const accounts = await ethereum.request({ method: "eth_requestAccounts", });

      setCurrentAccount(accounts[0]);
      window.location.reload();
    } catch (error) {
      console.log(error);

      throw new Error("No ethereum object");
    }
  };

  const sendTransaction = async () => {
    try {
      if (ethereum) {
        const { addressTo, amount, keyword, message } = formData;
        const transactionsContract = createEthereumContract();
        
        // Converting amount to hexadecimal
        const parsedAmount = ethers.utils.parseEther(amount);

        await ethereum.request({
          method: "eth_sendTransaction",
          params: [{
            from: currentAccount,
            to: addressTo,
            gas: "0x5208", // 21000 GWEI
            value: parsedAmount._hex,
          }],
        });

        const transactionHash = await transactionsContract.addToBlockchain(addressTo, parsedAmount, message, keyword);

        setIsLoading(true);
        console.log(`Loading - ${transactionHash.hash}`);
        await transactionHash.wait();
        console.log(`Success - ${transactionHash.hash}`);
        setIsLoading(false);

        const transactionsCount = await transactionsContract.getTransactionCount();

        setTransactionCount(transactionsCount.toNumber());
        window.location.reload();
      } else {
        console.log("No ethereum object");
      }
    } catch (error) {
      console.log(error);

      throw new Error("No ethereum object");
    }
  };

  useEffect(() => {
    checkIfWalletIsConnect();
    checkIfTransactionsExists();
  }, [transactionCount]);

  return (
    <TransactionContext.Provider
      value={{
        transactionCount,
        connectWallet,
        transactions,
        currentAccount,
        isLoading,
        sendTransaction,
        handleChange,
        formData,
        handleLogin
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
