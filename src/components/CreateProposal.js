// import React, { useState } from 'react';

// function CreateProposal({ contract, account }) {
//   const [description, setDescription] = useState('');

//   const createProposal = async () => {
//     try {
//       await contract.methods.createProposal(description).send({ from: account });
//       alert('Proposal created successfully!');
//       setDescription('');
//     } catch (error) {
//       console.error("Error creating proposal:", error);
//       alert('Error creating proposal. Check console for details.');
//     }
//   };

//   return (
//     <div className="create-proposal">
//       <h2>Create Proposal</h2>
//       <textarea 
//         value={description} 
//         onChange={(e) => setDescription(e.target.value)}
//         placeholder="Enter proposal description"
//       />
//       <button onClick={createProposal}>Create Proposal</button>
//     </div>
//   );
// }

// export default CreateProposal;