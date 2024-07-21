// CLIENT_SEND_MESSAGE
const formSendData = document.querySelector(".chat .inner-form");

if (formSendData) {
  formSendData.addEventListener("submit", (event) => {
    event.preventDefault();
    const content = formSendData.content.value; // name ô input là content

    if (content) {
      socket.emit("CLIENT_SEND_MESSAGE", content);
      formSendData.content.value = "";
    }
  });
}
// End CLIENT_SEND_MESSAGE
