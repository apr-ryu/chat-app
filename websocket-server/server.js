const WebSocket = require("ws");
const clients = [];
const server = new WebSocket.Server({
  port: 8080,
});

server.on("connection", (socket) => {
  console.log("✅ CONNECTED");

  socket.on("message", (data) => {
    const message = JSON.parse(data);

    if (!clients.find((client) => client.sender === message.sender)) {
      clients.push({
        sender: message.sender,
        socket: socket,
        key: message.key,
      });
    }

    clients.forEach((client) => {
      if (message.type === "publicKey" && client.id !== message.id) {
        client.socket.send(JSON.stringify(message));
      }
      if (
        message.type === "text" &&
        client.socket.readyState === WebSocket.OPEN
      ) {
        client.socket.send(JSON.stringify(message));
      }
    });
  });

  socket.on("close", (code, reason) => {
    console.log("❌ Disconnected", code, reason.toString());
    const index = clients.findIndex((client) => client.socket === socket);

    if (index !== -1) {
      clients.splice(index, 1);
    }
  });
});
