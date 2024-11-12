// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
 import Web3 from 'web3';
import { initWeb3 } from './utils/web3';
import contractABI from './contractABI';
import Home from './pages/Home';
import About from './pages/About';
import Properties from './pages/Properties';
import Dashboard from './pages/Dashboard';
import Voting from './pages/Voting';
import './App.css';
import Footer from './components/Footer'; // Import the Footer component


const CONTRACT_ADDRESS = '0x8A7e4172C0275B144dF2d7371BAC27831d16e3CF';

function App() {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);

  useEffect(() => {
    const init = async () => {
      const web3Instance = await initWeb3();
      setWeb3(web3Instance);

      if (web3Instance) {
        const contractInstance = new web3Instance.eth.Contract(contractABI, CONTRACT_ADDRESS);
        setContract(contractInstance);

        // const accounts = await web3Instance.eth.getAccounts();
        // setAccount(accounts[0]);

        // window.ethereum.on('accountsChanged', (accounts) => {
        //   setAccount(accounts[0]);
        // });
      }
    };

    init();
  }, []);

  const connectWallet = async () => {
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const accounts = await web3.eth.getAccounts();
      setAccount(accounts[0]);
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };

  return (
    <Router>
      <div className="app">
        <header className="app-header">
          <nav>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/properties">Properties</Link></li>
              <li><Link to="/dashboard">Dashboard</Link></li>
              <li><Link to="/voting">Voting</Link></li>
            </ul>
          </nav>
          {account ? (
            <p>Connected: {account.substring(0, 6)}...{account.substring(38)}</p>
          ) : (
            <button onClick={connectWallet}>Connect Wallet</button>
          )}
        </header>
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/properties" element={<Properties contract={contract} account={account} />} />
            <Route path="/dashboard" element={<Dashboard contract={contract} account={account} web3={web3} />} />
            <Route path="/voting" element={<Voting contract={contract} account={account} />} />
          </Routes>
          <Footer /> {/* Include the Footer here */}

        </main>
      </div>
    </Router>
  );
}

export default App; 