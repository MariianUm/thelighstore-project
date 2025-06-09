// frontend/api/products.js
const API_URL = 'http://localhost:5002/products';

export async function fetchAllProducts() {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Ошибка при получении списка товаров');
    return await response.json();
}

export async function deleteProduct(id) {
  const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  if (!response.ok) throw new Error('Ошибка при удалении товара');
}

