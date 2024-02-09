import './App.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { LiMensaje, UlMensajes } from './ui-components';
import VotingSystem from './components/VotingSystem';

const socket = io('http://localhost:5000');

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [nuevoMensaje, setNuevoMensaje] = useState('');
  const [mensajes, setMensajes] = useState([]);
  const [activeUsers, setActiveUsers] = useState(0);

  useEffect(() => {
    socket.on('connect', () => {
      setIsConnected(true);
      // Emitir el evento 'user_connected' al servidor
      socket.emit('user_connected');
    });

    socket.on('chat_message', (data) => {
      setMensajes(mensajes => [...mensajes, data]);
    });

    socket.on('active_users', (data) => {
      setActiveUsers(data);
    });

    const fetchActiveUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/active-users');
        setActiveUsers(response.data.activeUsers);
      } catch (error) {
        console.error('Error fetching active users:', error);
      }
    };

    const interval = setInterval(fetchActiveUsers, 5000); // Polling every 5 seconds
    fetchActiveUsers(); // Initial fetch

    return () => {
      socket.off('connect');
      socket.off('chat_message');
      socket.off('active_users');
      clearInterval(interval);
    };
  }, []);

  const enviarMensaje = () => {
    socket.emit('chat_message', {
      usuario: socket.id,
      mensaje: nuevoMensaje
    });
    setNuevoMensaje('');
  }

  return (
    <div className="App">
      <div>
        <h2>SISTEMA DE VOTACION SHORT POLLING</h2>
        <VotingSystem/>
      </div>
      <h2>{isConnected ? 'FORO EN VIVO SOCKETIO' : 'NADA'}</h2>
      <UlMensajes>
        {mensajes.map((mensaje, index) => (
          <LiMensaje key={index}>{mensaje.usuario}: {mensaje.mensaje}</LiMensaje>
        ))}
      </UlMensajes>
      <input
        type="text"
        value={nuevoMensaje}
        onChange={e => setNuevoMensaje(e.target.value)}
      />
      <button onClick={enviarMensaje}>Enviar</button>
      <h2>Usuarios en línea: {activeUsers}</h2>
    </div>
  );
}

export default App;
