import React, { useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import { motion } from 'framer-motion';
import AnimatedCard from '../components/AnimatedCard';

function Dashboard({ contract, account, web3 }) {
  const [propertyId, setPropertyId] = useState('');
  const [amount, setAmount] = useState('');
  const [userTokens, setUserTokens] = useState([]);

  useEffect(() => {
    const fetchUserTokens = async () => {
      if (!contract || !account) return;
      try {
        const balance = await contract.methods.balanceOf(account).call();
        const tokens = [];
        for (let i = 0; i < balance; i++) {
          const tokenId = await contract.methods.tokenOfOwnerByIndex(account, i).call();
          const property = await contract.methods.properties(tokenId).call();
          tokens.push({ tokenId, ...property });
        }
        setUserTokens(tokens);
      } catch (error) {
        console.error("Error fetching user tokens:", error);
      }
    };

    fetchUserTokens();
  }, [contract, account]);

  const buyToken = async () => {
    if (!account) {
      alert('Please connect your wallet first.');
      return;
    }
    try {
      await contract.methods.buyToken(propertyId).send({ 
        from: account, 
        value: web3.utils.toWei(amount, 'ether')
      });
      alert('Token purchased successfully!');
    } catch (error) {
      console.error("Error buying token:", error);
      alert('Error buying token. Check console for details.');
    }
  };

  const sellToken = async (tokenId) => {
    if (!account) {
      alert('Please connect your wallet first.');
      return;
    }
    try {
      await contract.methods.sellToken(tokenId).send({ from: account });
      alert('Token sold successfully!');
    } catch (error) {
      console.error("Error selling token:", error);
      alert('Error selling token. Check console for details.');
    }
  };

  return (
    <div className="dashboard bg-ret-dark text-white p-6">
      <h1 className="text-3xl font-bold text-center mb-8">User Dashboard</h1>
      
      {/* Buy Token Form */}
      <div className="buy-token bg-ret-pink rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Buy Token</h2>
        <input 
          type="number" 
          value={propertyId} 
          onChange={(e) => setPropertyId(e.target.value)}
          placeholder="Property ID"
          className="w-full p-2 mb-4 border rounded bg-white text-ret-dark"
        />
        <input 
          type="number" 
          value={amount} 
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount (in ETH)"
          className="w-full p-2 mb-4 border rounded bg-white text-ret-dark"
        />
        <button 
          onClick={buyToken}
          className="w-full bg-ret-purple text-white py-2 px-4 rounded hover:bg-ret-dark transition duration-200"
        >
          Buy Token
        </button>
      </div>

      {/* User Tokens Section */}
      <div className="user-tokens">
        <h2 className="text-2xl font-semibold mb-4">Your Tokens</h2>
        {userTokens.length === 0 ? (
          <div className='text-ret-pink'>
            <p className="text-center text-gray-300">You don't own any tokens yet.</p>
            <p className="text-center text-gray-300">Once you own them you will be able to see your ownership here</p>

          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {userTokens.map((token, index) => (
              <motion.div
                key={token.tokenId}
                className="bg-ret-pink rounded-lg shadow-lg overflow-hidden"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="h-64">
                  <Canvas>
                    <Suspense fallback={null}>
                      <ambientLight intensity={0.5} />
                      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
                      <OrbitControls enableZoom={false} />
                      <AnimatedCard position={[0, 0, 0]} rotation={[0, 0, 0]} scale={[1, 1, 1]}>
                        <Text
                          position={[0, 0.6, 0.06]}
                          fontSize={0.1}
                          color="#FFFFFF"
                          anchorX="center"
                          anchorY="middle"
                        >
                          {token.addressInfo}
                        </Text>
                        <Text
                          position={[0, 0.4, 0.06]}
                          fontSize={0.05}
                          color="#FFFFFF"
                          anchorX="center"
                          anchorY="middle"
                        >
                          Token ID: {token.tokenId}
                        </Text>
                        <Text
                          position={[0, 0.3, 0.06]}
                          fontSize={0.05}
                          color="#FFFFFF"
                          anchorX="center"
                          anchorY="middle"
                        >
                          Year Built: {token.yearBuilt}
                        </Text>
                        <Text
                          position={[0, 0.2, 0.06]}
                          fontSize={0.05}
                          color="#FFFFFF"
                          anchorX="center"
                          anchorY="middle"
                        >
                          Lot Size: {token.lotSize} sq ft
                        </Text>
                        <Text
                          position={[0, 0.1, 0.06]}
                          fontSize={0.05}
                          color="#FFFFFF"
                          anchorX="center"
                          anchorY="middle"
                        >
                          Rooms: {token.numberOfRooms}
                        </Text>
                        <Text
                          position={[0, -0.1, 0.06]}
                          fontSize={0.08}
                          color="#FF00E2"
                          anchorX="center"
                          anchorY="middle"
                        >
                          Price: {token.price} ETH
                        </Text>
                      </AnimatedCard>
                    </Suspense>
                  </Canvas>
                </div>
                <div className="p-4">
                  <button 
                    onClick={() => sellToken(token.tokenId)}
                    className="w-full mt-4 bg-ret-dark text-white py-2 px-4 rounded hover:bg-ret-dark "
                  >
                    Sell Token
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
        
        {/* Sell Token Form (Always Visible) */}
        <div className="sell-token bg-ret-pink rounded-lg shadow-lg p-6 mt-8">
          <h2 className="text-2xl font-semibold mb-4">Sell Token</h2>
          {userTokens.length === 0 ? (
            <p className="text-center text-gray-300">You need to own tokens to sell them.</p>
          ) : (
            <p className="text-center text-gray-300">Select a token to sell from above.</p>
          )}
          <button 
            disabled={userTokens.length === 0} // Disable if no tokens
            className={`w-full bg-ret-blue text-white py-2 px-4 rounded hover:bg-ret-purple transition duration-200 ${userTokens.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Sell Token
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;