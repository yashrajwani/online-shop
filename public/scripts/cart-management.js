const addToCartButtonElement = document.querySelector(
  "#product-details button"
);

const badgeElement = document.querySelector(".nav-items .badge");

async function addToCart() {
  let response;
  const productId = addToCartButtonElement.dataset.productid;
  const csrfToken = addToCartButtonElement.dataset.csrf;
  try {
    response = await fetch("/cart/items", {
      method: "POST",
      body: JSON.stringify({
        productId: productId,
        _csrf: csrfToken,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    alert("Something went wrong");
    
    return;
  }

  if (!response.ok) {
    alert("Something went wrong");
    return;
  }

  const responseData = await response.json();
  const newTotalQuantity = responseData.newTotalItems;
  badgeElement.textContent = newTotalQuantity;
}

addToCartButtonElement.addEventListener("click", addToCart);
