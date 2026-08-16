const WebSocket = require("ws");
const express = require("express");
const { Client } = require("pg");
const messageStore = require("./messageStore");
const clientsStore = require("./clientsStore");
const cors = require("cors");

const client = new Client({
  host: "postgres",
  port: 5432,
  user: "postgres",
  password: "cy0009",
  database: "chat_app",
});

client
  .connect()
  .then(async () => {
    console.log("PostgreSQL!! connected!");
  })
  .catch((err) => {
    console.error("PostgreSQL!!connection error:", err);
  });

const app = express();
app.use(cors());

app.get("/api/messages", async (req, res) => {
  const { sender, recipient } = req.query;
  console.log("여기도 실행되나..", sender, recipient);

  // const messages = messageStore.getMessages();

  const result = await client.query(
    `SELECT *
       FROM messages
       WHERE (sender = $1 AND recipient = $2)
       OR (sender = $2 AND recipient = $1)
       ORDER BY created_at ASC`,
    [sender, recipient],
  );

  res.json({
    sender,
    recipient,
    messages: result.rows,
  });
});

app.get("/api/message-history", (req, res) => {
  const { username } = req.query;
  console.log("herer", username);

  const messages = messageStore.getMessages();
  const filteredMessages = messages.filter(
    (message) => message.sender === username || message.recipient === username,
  );

  res.json({
    username,
    messages: filteredMessages,
  });
});

app.listen(3001);

//: WEBSOCKET
const server = new WebSocket.Server({
  port: 8080,
});

server.on("connection", (socket) => {
  console.log("✅ CONNECTED");
  const storedClients = clientsStore.getClients();

  socket.on("message", async (data) => {
    const newMessage = JSON.parse(data);

    if (newMessage.type === "userInfo") {
      const storedMessage = messageStore.getMessages();
      let userInfo = {
        id: newMessage.id,
        socket: socket,
      };

      if (storedClients.find((client) => client.id == newMessage.id)) {
        clientsStore.updateClient(userInfo);
        //: 해당 유저에게 전체 히스토리 보내기 함수 설정
        // storedClients.forEach((client) => {
        //   if (
        //     client.socket.readyState === WebSocket.OPEN &&
        //     client.id === newMessage.id
        //   ) {
        //     let filteredMessage = storedMessage.filter(
        //       (message) =>
        //         message.sender == newMessage.id ||
        //         message.recipient == newMessage.id,
        //     );
        //     console.log(storedMessage);
        //     console.log(filteredMessage);
        //     client.socket.send(JSON.stringify(filteredMessage));
        //   }
        // });
      } else {
        clientsStore.saveClient(userInfo);
      }
      //: 이미 로그인 후 새로운 메세지 클라이언트로 부터 받음
    } else if (newMessage.type === "newMessage") {
      const result = await client.query(
        `INSERT INTO messages (sender, recipient, content)
       VALUES ($1, $2, $3)`,
        [newMessage.sender, newMessage.recipient, newMessage.content],
      );

      const newMessageWithTimestamp = {
        ...newMessage,
        timestamp: new Date().toISOString(),
      };
      messageStore.saveMessage(newMessageWithTimestamp);

      storedClients.forEach((client) => {
        if (
          client.socket.readyState === WebSocket.OPEN &&
          (client.id === newMessage.sender ||
            client.id === newMessage.recipient)
        ) {
          client.socket.send(JSON.stringify(newMessage));
        }
      });
    }
  });

  socket.on("close", (code, reason) => {
    console.log("❌ Disconnected", code, reason.toString());
  });
});
