import * as Popper from "https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js";

// Upload Images
const upload = new FileUploadWithPreview.FileUploadWithPreview(
  "upload-images",
  {
    multiple: true,
    maxFileCount: 6,
  }
);
// End Upload Images

// CLIENT_SEND_MESSAGE
const formSendData = document.querySelector(".chat .inner-form");

if (formSendData) {
  formSendData.addEventListener("submit", (event) => {
    event.preventDefault();
    const content = formSendData.content.value; // name ô input là content
    const images = upload.cachedFileArray || [];

    if (content || images.length > 0) {
      socket.emit("CLIENT_SEND_MESSAGE", content);
      formSendData.content.value = "";
      // đề ẩn typing immediate khi submit
      socket.emit("CLIENT_SEND_TYPING", "hidden");
    }
  });
}
// End CLIENT_SEND_MESSAGE

// SERVER_RETURN_MESSAGE
socket.on("SERVER_RETURN_MESSAGE", (data) => {
  const body = document.querySelector(".chat .inner-body");
  const myId = document.querySelector("[my-id]").getAttribute("my-id");
  const boxTyping = document.querySelector(".inner-list-typing");

  const div = document.createElement("div");

  let htmlFullName = "";

  if (myId == data.user_id) {
    div.classList.add("inner-outgoing");
  } else {
    div.classList.add("inner-incoming");
    htmlFullName = `<div class="inner-name">${data.fullName}</div>`;
  }

  div.innerHTML = `
    ${htmlFullName}
    <div class="inner-content">${data.content}</div>
  `;

  body.insertBefore(div, boxTyping);
  body.scrollTop = body.scrollHeight;
});
// End SERVER_RETURN_MESSAGE

// Scroll Chat To Bottom
const bodyChat = document.querySelector(".chat .inner-body");
if (bodyChat) {
  bodyChat.scrollTop = bodyChat.scrollHeight;
}
// END Scroll Chat To Bottom

// Show Tooltip emoji
const buttonIcon = document.querySelector(".button-icon");
if (buttonIcon) {
  const tooltip = document.querySelector(".tooltip");
  Popper.createPopper(buttonIcon, tooltip);
  buttonIcon.addEventListener("click", () => {
    tooltip.classList.toggle("shown");
  });
}
// End Show Tooltip emoji

// Show typing
const showTyping = () => {
  socket.emit("CLIENT_SEND_TYPING", "show");
  clearTimeout(timeOut);
  timeOut = setTimeout(() => {
    socket.emit("CLIENT_SEND_TYPING", "hidden");
  }, 3000);
};
// END Show typing

// Emoji-picker : insert icon to input
var timeOut;
const emojiPicker = document.querySelector("emoji-picker");
if (emojiPicker) {
  const inputChat = document.querySelector(
    ".chat .inner-form input[name='content']"
  );
  emojiPicker.addEventListener("emoji-click", (event) => {
    const icon = event.detail.unicode;

    inputChat.value = inputChat.value + icon;
    // xử lí để sau khi chèn icon, con trỏ vẫn ở cuối dòng
    const end = inputChat.value.length;
    inputChat.setaSelectionRange(end, end);
    inputChat.focus();
    // xử lí trường hợp chèn icon vẫn hiện typing
    showTyping();
  });

  inputChat.addEventListener("keyup", () => {
    showTyping();
  });
}
// END Emoji-picker : insert icon to input

// SERVER_RETURN_TYPING
const elementListTyping = document.querySelector(".chat .inner-list-typing");
socket.on("SERVER_RETURN_TYPING", (data) => {
  // còn gửi cả cái "hidden" nữa nên cần kiểm tra có phải show không
  if (data.type == "show") {
    // Kiểm tra xem typing tồn tại chưa
    const existBoxTyping = elementListTyping.querySelector(
      `.box-typing[user-id="${data.userId}"]`
    );
    // Nếu typing chưa tồn tại
    if (!existBoxTyping) {
      const boxTyping = document.createElement("div");
      boxTyping.classList.add("box-typing");
      boxTyping.setAttribute("user-id", data.userId);
      boxTyping.innerHTML = `
        <div class="inner-name">${data.fullName}</div>
        <div class="inner-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      `;

      elementListTyping.appendChild(boxTyping);
      bodyChat.scrollTop = bodyChat.scrollHeight;
    }
  } else {
    // nếu nó gửi lên hidden
    const existBoxRemove = elementListTyping.querySelector(
      `.box-typing[user-id="${data.userId}"]`
    );
    // Nếu cái ô  typing nó vẫn còn
    if (existBoxRemove) {
      elementListTyping.removeChild(existBoxRemove);
    }
  }
});
// End SERVER_RETURN_TYPING
