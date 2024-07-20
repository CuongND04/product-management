console.log("ok");
// show-alert
const showAlert = document.querySelector("[show-alert]");
if (showAlert) {
  let time = showAlert.getAttribute("data-time");
  time = parseInt(time);

  // Sau time giây sẽ đóng thông báo
  setTimeout(() => {
    showAlert.classList.add("alert-hidden");
  }, time);

  // Khi click vào nút close-alert sẽ đóng luôn
  const closeAlert = showAlert.querySelector("[close-alert]");
  closeAlert.addEventListener("click", () => {
    showAlert.classList.add("alert-hidden");
  });
}
// END show-alert

// Button Go Back
const buttonsGoBack = document.querySelectorAll("[button-go-back]");
if (buttonsGoBack.length > 0) {
  buttonsGoBack.forEach((button) => {
    button.addEventListener("click", () => {
      history.back();
    });
  });
}
// END Button Go Back
