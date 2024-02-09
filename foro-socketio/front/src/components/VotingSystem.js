import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './VotingSystem.css' ;

function VotingSystem() {
  const [votes, setVotes] = useState({ option1: 0, option2: 0, option3: 0 });

  useEffect(() => {
    const fetchVotes = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/votes');
        setVotes(response.data.votes);
      } catch (error) {
        console.error('Error fetching votes:', error);
      }
    };

    const interval = setInterval(fetchVotes, 5000); // Polling every 5 seconds

    fetchVotes(); // Initial fetch

    return () => {
      clearInterval(interval);
    };
  }, []);

  const handleVote = async (option) => {
    try {
      const response = await axios.post('http://localhost:5000/api/vote', { option });
      setVotes(response.data.votes);
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  return (
    <div className="app-container">
      <div className="voting-section">
        <div className="option">
          <img src="images/antonioMeade.jpg" alt="Opción 1" />
          <p>TOTAL DE VOTOS: {votes.option1}</p>
          <button onClick={() => handleVote('option1')}>VOTAR</button>
        </div>
        <div className="option">
          <img src="images/elBronco.jpg" alt="Opción 2" />
          <p>TOTAL DE VOTOS: {votes.option2}</p>
          <button onClick={() => handleVote('option2')}>VOTAR</button>
        </div>
        <div className="option">
          <img src="images/ricardoAnaya.png" alt="Opción 3" />
          <p>TOTAL DE VOTOS: {votes.option3}</p>
          <button onClick={() => handleVote('option3')}>VOTAR</button>
        </div>
      </div>
      <div className="chat-section">
        {/* Código del chat */}
      </div>
    </div>
  );
}

export default VotingSystem;
