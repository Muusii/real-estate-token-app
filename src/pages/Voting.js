import React, { useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import { motion } from 'framer-motion';
import AnimatedCard from '../components/AnimatedCard';

function Voting({ contract, account }) {
  const [proposals, setProposals] = useState([]);
  const [newProposal, setNewProposal] = useState('');
  const [userRewards, setUserRewards] = useState(0);

  useEffect(() => {
    const fetchProposals = async () => {
      if (!contract) return;
      try {
        const proposalCount = await contract.methods.proposalCount().call();
        const fetchedProposals = [];

        for (let i = 1; i <= proposalCount; i++) {
          const proposal = await contract.methods.proposals(i).call();
          fetchedProposals.push(proposal);
        }

        setProposals(fetchedProposals);
      } catch (error) {
        console.error("Error fetching proposals:", error);
      }
    };

    const fetchUserRewards = async () => {
      if (!contract || !account) return;
      try {
        const rewards = await contract.methods.calculateRewards(account).call();
        setUserRewards(rewards);
      } catch (error) {
        console.error("Error fetching user rewards:", error);
      }
    };

    fetchProposals();
    fetchUserRewards();
  }, [contract, account]);

  const createProposal = async () => {
    if (!account) {
      alert('Please connect your wallet first.');
      return;
    }
    try {
      await contract.methods.createProposal(newProposal).send({ from: account });
      alert('Proposal created successfully!');
      setNewProposal('');
    } catch (error) {
      console.error("Error creating proposal:", error);
      alert('Error creating proposal. Check console for details.');
    }
  };

  const vote = async (proposalId, inFavor) => {
    if (!account) {
      alert('Please connect your wallet first.');
      return;
    }
    try {
      await contract.methods.vote(proposalId, inFavor).send({ from: account });
      alert('Vote cast successfully!');
    } catch (error) {
      console.error("Error casting vote:", error);
      alert('Error casting vote. Check console for details.');
    }
  };

  return (
    <div className="voting bg-ret-dark text-white p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Voting</h1>
      
      {/* Create Proposal Section */}
      <div className="create-proposal bg-ret-pink rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Create New Proposal</h2>
        <textarea 
          value={newProposal} 
          onChange={(e) => setNewProposal(e.target.value)}
          placeholder="Enter proposal description"
          className="w-full p-2 mb-4 border rounded bg-white text-ret-dark"
          rows="4"
        />
        <button 
          onClick={createProposal}
          className="w-full bg-ret-main text-white py-2 px-4 rounded hover:bg-ret-purple transition duration-200"
        >
          Create Proposal
        </button>
      </div>
      
      {/* Active Proposals Section */}
      <div className="proposals">
        <h2 className="text-2xl font-semibold mb-4">Active Proposals</h2>
        {proposals.length === 0 ? (
          <p className="text-center text-gray-300">No active proposals.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {proposals.map((proposal, index) => (
              <motion.div
                key={proposal.id}
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
                          color="#FFFFFF" // Changed to white for better contrast
                          anchorX="center"
                          anchorY="middle"
                        >
                          Proposal {proposal.id}
                        </Text>
                        <Text
                          position={[0, 0.3, 0.06]}
                          fontSize={0.05}
                          color="#FFFFFF" // Changed to white for better contrast
                          anchorX="center"
                          anchorY="middle"
                          maxWidth={0.9}
                          textAlign="center"
                        >
                          {proposal.description}
                        </Text>
                        <Text
                          position={[-0.3, 0, 0.06]}
                          fontSize={0.05}
                          color="#22C55E" // Green for votes in favor
                          anchorX="center"
                          anchorY="middle"
                        >
                          For: {proposal.forVotes}
                        </Text>
                        <Text
                          position={[0.3, 0, 0.06]}
                          fontSize={0.05}
                          color="#EF4444" // Red for votes against
                          anchorX="center"
                          anchorY="middle"
                        >
                          Against: {proposal.againstVotes}
                        </Text>
                      </AnimatedCard>
                    </Suspense>
                  </Canvas>
                </div>
                <div className="p-4 flex space-x-4">
                  <button 
                    onClick={() => vote(proposal.id, true)}
                    className="flex-1 bg-ret-main text-white py-2 px-4 rounded hover:bg-ret-pink transition duration-200"
                  >
                    Vote For
                  </button>
                  <button 
                    onClick={() => vote(proposal.id, false)}
                    className="flex-1 bg-ret-dark text-white py-2 px-4 rounded hover:bg-ret-pink transition duration-200"
                  >
                    Vote Against
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* User Rewards Section */}
      <div className="rewards bg-ret-pink rounded-lg shadow-lg p-6 mt-8">
        <h2 className="text-2xl font-semibold mb-4">Your Rewards</h2>
        <p className="text-xl text-ret-main font-bold">You have earned {userRewards} tokens for voting.</p>
      </div>
    </div>
  );
}

export default Voting;