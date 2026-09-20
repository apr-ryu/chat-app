import WebSocket, { WebSocketServer } from "ws";
import express from "express";
import { Client } from "pg";
import * as messageStore from "./messageStore";
import * as clientsStore from "./clientsStore";
import bcrypt from "bcrypt";
import cors from "cors";

const client = new Client({
  // host: "postgres",
  host: "localhost",
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
app.use(express.json());

app.get("/api/messages", async (req, res) => {
  const { sender, recipient } = req.query;
  const result = await client.query(
    `SELECT
      id,
      sender,
      recipient,
      content,
      created_at AT TIME ZONE 'UTC' AS created_at
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

app.get("/api/chat-list", async (req, res) => {
  const { username } = req.query;
  const result = await client.query(
    `SELECT 
       m.id,
       m.sender,
       m.recipient,
       m.content,
       m.created_at AT TIME ZONE 'UTC' AS created_at
    FROM messages m
    WHERE (m.sender = $1 OR m.recipient = $1)
    AND m.created_at = (
      SELECT MAX(m2.created_at)
        FROM messages m2
          WHERE
            (m2.sender = m.sender AND m2.recipient = m.recipient)
            OR
            (m2.sender = m.recipient AND m2.recipient = m.sender)
      )
    ORDER BY m.created_at DESC;`,
    [username],
  );

  res.json({
    messages: result.rows,
  });
});

app.post("/api/signup", async (req, res) => {
  const { username, password } = req.body;
  const passwordHash = await bcrypt.hash(password, 10);
  const result = await client.query(`SELECT * FROM users WHERE username = $1`, [
    username,
  ]);

  if (result.rows.length === 0) {
    await client.query(
      `INSERT INTO users (username, "passwordHash")
     VALUES ($1, $2)`,
      [username, passwordHash],
    );
    return res.status(201).json({
      message: "Signup successful",
    });
  } else {
    return res.status(409).json({
      message: "User already exists",
    });
  }
});

app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  const result = await client.query(`SELECT * FROM users WHERE username = $1`, [
    username,
  ]);

  if (result.rows.length === 0) {
    return res.status(401).json({
      message: "Invalid user",
    });
  }
  const isValid = await bcrypt.compare(password, result.rows[0].passwordHash);
  if (isValid) {
    return res.status(200).json({
      message: "Login successful",
    });
  } else {
    return res.status(401).json({
      message: "Invalid password",
    });
  }
});

app.listen(3001);

//: WEBSOCKET
const server = new WebSocketServer({
  port: 8080,
});

server.on("connection", (socket) => {
  console.log("✅ CONNECTED");
  const storedClients = clientsStore.getClients();

  socket.on("message", async (data) => {
    console.log("data here!!!!!!!!!", data);
    const newMessage = JSON.parse(data.toString());

    if (newMessage.type === "userInfo") {
      const storedMessage = messageStore.getMessages();
      let userInfo = {
        id: newMessage.id,
        socket: socket,
      };

      if (storedClients.find((client) => client.id == newMessage.id)) {
        clientsStore.updateClient(userInfo);
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
        created_at: new Date().toISOString(),
      };
      messageStore.saveMessage(newMessageWithTimestamp);

      storedClients.forEach((client) => {
        if (
          client.socket.readyState === WebSocket.OPEN &&
          (client.id === newMessage.sender ||
            client.id === newMessage.recipient)
        ) {
          client.socket.send(JSON.stringify(newMessageWithTimestamp));
        }
      });
    }
  });

  socket.on("close", (code, reason) => {
    console.log("❌ Disconnected", code, reason.toString());
  });
});
