const WebSocket = require('ws');

const createWebSocketServer = (server) =>{
  const wss = new WebSocket.Server({ server });

  wss.on('connection', (ws) => {
    ws.on('message', (message) => {
      if (message === 'nextClicked') {
        wss.clients.forEach((client) => {
          client.send('refresh');
        });
      }
    });
  });
}

module.exports = createWebSocketServer;