const messages = [];

function saveMessage(newMessage) {
  messages.push(newMessage);
}

function getMessages() {
  console.log("⚡️ ", messages);
  return messages;
}

//: 객체 내부에 변수로 저장하면 변수의 이름이 key 값이 되고 그 변수의 값이 value 가 됨. 실제로는 {saveMessage : 함수} 이렇게 exporting
module.exports = {
  saveMessage,
  getMessages,
};
