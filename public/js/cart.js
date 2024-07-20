// Update quantity product in cart
const inputsQuantity = document.querySelectorAll("input[name='quantity']");
if (inputsQuantity.length > 0) {
  inputsQuantity.forEach((input) => {
    input.addEventListener("change", (e) => {
      const quantity = parseInt(e.target.value);
      const productId = input.getAttribute("product-id");
      console.log(`/cart/update/${productId}/${quantity}`);
      if (quantity > 0)
        window.location.href = `/cart/update/${productId}/${quantity}`;
    });
  });
}
// END Update quantity product in cart
