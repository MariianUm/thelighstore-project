import { fetchAllProducts } from '../api/products.js';

document.addEventListener('DOMContentLoaded', async () => {
    let cart = JSON.parse(localStorage.getItem('cart')) || {};
    const container = document.getElementById('products-container');
    const countElement = document.querySelectorAll('.cart-count');

    try {
        const products = await fetchAllProducts();
        localStorage.setItem('products', JSON.stringify(products));

        container.innerHTML = products.map(product => `
            <div class="product-card" data-product-id="${product.id}">
                <a href="product.html?id=${product.id}" class="product-image-link">
                    <img src="img/${product.image_url}" alt="${product.name}" class="product-image">
                </a>
                <div class="product-info">
                    <h3 class="product-title">${product.name}</h3>
                    <p class="product-price">${product.price} ₽</p>
                    <div class="cart-controls">
                        <button class="add-to-cart">В корзину</button>
                        <div class="quantity-container" style="display: none;">
                            <button class="quantity-btn minus">-</button>
                            <span class="product-count">0</span>
                            <button class="quantity-btn plus">+</button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');

        document.addEventListener('click', (e) => {
            const card = e.target.closest('.product-card');
            if (!card) return;

            const id = card.dataset.productId;
            if (e.target.classList.contains('add-to-cart')) {
                cart[id] = (cart[id] || 0) + 1;
                card.querySelector('.add-to-cart').style.display = 'none';
                card.querySelector('.quantity-container').style.display = 'flex';
                card.querySelector('.product-count').textContent = cart[id];
            } else if (e.target.classList.contains('plus')) {
                cart[id]++;
                card.querySelector('.product-count').textContent = cart[id];
            } else if (e.target.classList.contains('minus')) {
                cart[id] = Math.max(0, cart[id] - 1);
                if (cart[id] === 0) {
                    delete cart[id];
                    card.querySelector('.add-to-cart').style.display = 'block';
                    card.querySelector('.quantity-container').style.display = 'none';
                } else {
                    card.querySelector('.product-count').textContent = cart[id];
                }
            }

            localStorage.setItem('cart', JSON.stringify(cart));
            const total = Object.values(cart).reduce((a, b) => a + b, 0);
            countElement.forEach(c => c.textContent = total);
        });

        const total = Object.values(cart).reduce((a, b) => a + b, 0);
        countElement.forEach(c => c.textContent = total);
    } catch (err) {
        container.innerHTML = '<p style="color: red;">Ошибка загрузки товаров</p>';
    }
});
