import { createOrder } from '../api/orders.js';

document.addEventListener('DOMContentLoaded', () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || {};
    const products = JSON.parse(localStorage.getItem('products')) || [];

    const orderItemsContainer = document.getElementById('order-items');
    const totalPriceElement = document.getElementById('order-total');
    const customerNameInput = document.querySelector('input[placeholder="Введите ФИО"]');
    const phoneInput = document.querySelector('input[type="tel"]');
    const addressInput = document.querySelector('input[placeholder="Введите адрес доставки"]');
    const orderDateInput = document.getElementById('order-date');
    const orderNumberInput = document.getElementById('order-number');
    const statusSelect = document.querySelector('select');

    const validItems = Object.entries(cart)
        .filter(([id, qty]) => {
            const product = products.find(p => p.id === parseInt(id));
            return qty > 0 && product;
        })
        .map(([id, qty]) => {
            const product = products.find(p => p.id === parseInt(id));
            return { product, qty };
        });

    let total = 0;
    orderItemsContainer.innerHTML = validItems.map(({ product, qty }) => {
        const sum = qty * product.price;
        total += sum;

        const image = product.image_url ? product.image_url : 'placeholder.png';
        const power = product.description?.match(/\b\d+W\b/)?.[0] || '-';

        return `<tr>
            <td><img src="img/${image}" alt="${product.name}" style="width: 60px;"></td>
            <td>${product.name}</td>
            <td>${power}</td>
            <td>${product.price} ₽</td>
            <td>${qty}</td>
            <td><span>${sum} ₽</span></td>
        </tr>`;
    }).join('');

    totalPriceElement.textContent = `${total} ₽`;

    orderDateInput.value = new Date().toISOString().split('T')[0];
    orderNumberInput.value = `ORD-${Date.now()}`;

    document.querySelector('.btn-primary').addEventListener('click', async () => {
        const orderData = {
            customer_name: customerNameInput.value,
            phone: phoneInput.value,
            address: addressInput.value,
            email: 'client@example.com',
            comment: '',
            items: validItems.map(({ product, qty }) => ({
                product_id: product.id,
                quantity: qty
            }))
        };

        try {
            await createOrder(orderData);
            localStorage.removeItem('cart');
            window.location.href = 'index.html';
        } catch (error) {
            alert('Ошибка при оформлении заказа');
        }
    });

    const count = Object.values(cart).reduce((a, b) => a + b, 0);
    document.querySelectorAll('.cart-count').forEach(el => el.textContent = count);
});
