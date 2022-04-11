import Web3 from "web3";

let web3;

if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
  //we are in the browser and metamask is running.
  window.ethereum.request({ method: "eth_requestAccounts" });

  web3 = new Web3(window.ethereum);
} else {
  //we are on the server OR the user is not running metamask
  const provider = new Web3.providers.HttpProvider(
    "https://rinkeby.infura.io/v3/d94a28bcfd1147c1947d5175b4ae14ee"
  );
  web3 = new Web3(provider);
}

export default web3;
