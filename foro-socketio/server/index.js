const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
    cors: { origin: '*' }
});

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
}));

app.use(bodyParser.json());

let votes = {
    option1: 0,
    option2: 0,
    option3: 0
};

app.get('/api/votes', (req, res) => {
    res.json({ votes });
});

app.post('/api/vote', (req, res) => {
    const { option } = req.body;
    if (option && votes.hasOwnProperty(option)) {
        votes[option]++;
        console.log(`Voted for ${option}. Votes:`, votes);
        io.emit('votes_updated', votes); 
        res.json({ success: true, votes });
    } else {
        res.status(400).json({ success: false, message: 'Invalid option' });
    }
});

//--------------------------------------------------------------------------------------------
let activeUsers = 0;

app.get('/api/active-users', (req, res) => {
    // Simula la espera de nuevos datos
    setTimeout(() => {
      // Envía una respuesta con el número de clientes activos
      res.json({ activeUsers });
    }, 5000); // Espera 5 segundos antes de responder
  });

  //------------------------------------------------------------
  
  io.on('connection', (socket) => {
      console.log('Se ha conectado un cliente');
      activeUsers++;//LONG
  
      socket.broadcast.emit('chat_message', {
          usuario: 'INFO',
          mensaje: 'Se ha conectado un nuevo usuario'
      });
  
      socket.on('chat_message', (data) => {
          io.emit('chat_message', data);
      });
  
      socket.on('disconnect', () => {
          console.log('Usuario desconectado');
          activeUsers--;//LONG
      });
  });


const PORT = 5000;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
