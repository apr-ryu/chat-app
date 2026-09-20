import type WebSocket from "ws";

interface Client {
  id: string;
  socket: WebSocket;
}

const clients: Client[] = [];

function saveClient(newClient: Client): void {
  clients.push(newClient);

  console.log("푸쉬했음");
}

function updateClient(currentClient: Client): void {
  const client = clients.find((client) => client.id === currentClient.id);

  if (!client) return;

  client.socket = currentClient.socket;

  console.log("업데이트");
}

function getClients(): Client[] {
  return clients;
}

export { saveClient, updateClient, getClients };
