const clients = [];

function saveClient(newClient) {
  clients.push(newClient);
  console.log("푸쉬했음");
}

function updateClient(currentClient) {
  const client = clients.find((client) => client.id === currentClient.id);
  client.socket = currentClient.socket;
  console.log("업데이트");
}

function getClients() {
  // console.log("✨", clients);
  return clients;
}

module.exports = {
  saveClient,
  updateClient,
  getClients,
};
