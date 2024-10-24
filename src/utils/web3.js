import Web3 from 'web3';

export const initWeb3 = async () => {
  if (window.ethereum) {
    const web3 = new Web3(window.ethereum);
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      return web3;
    } catch (error) {
      console.error("User denied account access");
    }
  }
  else if (window.web3) {
    return new Web3(window.web3.currentProvider);
  }
  else {
    console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
  }
  return null;
};