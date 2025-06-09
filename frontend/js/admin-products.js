
import { fetchAllProducts, deleteProduct } from '../api/products.js';

document.addEventListener('DOMContentLoaded', async () => {
    const tableBody = document.getElementById('products-table-body');

    try {
        const products = await fetchAllProducts();

        products.forEach(product => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${product.id}</td>
                <td>${product.name}</td>
                <td>${product.price} руб.</td>
                <td>
                    <button class="edit-btn" data-id="${product.id}">Редактировать</button>
                    <button class="delete-btn" data-id="${product.id}">Удалить</button>
                </td>
            `;

            tableBody.appendChild(row);
        });

        // Обработчики удаления
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', async () => {
                const productId = button.getAttribute('data-id');
                if (confirm('Удалить товар?')) {
                    await deleteProduct(productId);
                    location.reload();
                }
            });
        });

        // Обработчики редактирования
        document.querySelectorAll('.edit-btn').forEach(button => {
            button.addEventListener('click', () => {
                const productId = button.getAttribute('data-id');
                window.location.href = `admin-product-edit.html?id=${productId}`;
            });
        });

    } catch (error) {
        console.error('Ошибка при загрузке товаров:', error);
        tableBody.innerHTML = '<tr><td colspan="4">Ошибка при загрузке товаров</td></tr>';
    }
});
