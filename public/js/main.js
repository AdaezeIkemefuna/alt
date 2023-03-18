const socket = io();
const chatForm = document.getElementById("form");
const chatMessages = document.querySelector(".chat__body");

socket.on("chat__bot message", (message) => {
  // console.log(message);
  console.log(message.text.length);
  console.log(Array.isArray(message.text));

  //check if message.text is an array
  if (Array.isArray(message.text)) {
    let msg = message.text
      .map((item) => `${item.number}: To ${item.text}`)
      .join(`<br>`);
    msg = "Please select a number from the list below: <br>" + msg;
    message.text = msg;
  } else {
    message.text = message.text;
  }
  outputMessage("Hamsa's Chatchat__bot", message);

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

socket.on("user message", (message) => {
  // console.log(message);
  outputMessage("You", message);

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // Get message text
  let msg = e.target.elements.msg.value;

  msg = msg.trim();

  if (!msg) {
    return false;
  }

  // Emit message to server
  socket.emit("private message", msg);

  // Clear input
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

// Output message to DOM
const outputMessage = (sender, message) => {
  const div = document.createElement("div");
  div.classList.add("chat__messages");
  if (sender === "Hamsa's Chatchat__bot") {
    div.classList.add("chat__bot");
  } else {
    div.classList.add("user");
  }

  div.innerHTML = `
  <p class="data__meta">${message.username} <span>${message.time}</span></p>
						<p class="text">${message.text}</p>`;
  document.querySelector(".chat__body").appendChild(div);
};
