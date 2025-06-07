export function createProductCard(product, onAddToCart) {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
        <img src="img/${product.image}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p>${product.price} ₽</p>
        <button class="add-to-cart">Добавить</button>
    `;

    card.querySelector(".add-to-cart").addEventListener("click", () => {
        onAddToCart(product);
    });

    return card;
}
