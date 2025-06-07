const PRODUCTS_API_URL = "http://localhost:5002/products";

async function fetchProducts() {
  try {
    const response = await fetch(PRODUCTS_API_URL);
    if (!response.ok) throw new Error("Ошибка загрузки товаров");

    const products = await response.json();
    const tableBody = document.getElementById("products-table-body");
    tableBody.innerHTML = ""; // Очищаем перед вставкой

    products.forEach((product) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${product.id}</td>
        <td>${product.name}</td>
        <td>${product.price} ₽</td>
        <td><button class="btn" onclick="editProduct(${product.id})">Изменить</button></td>
      `;
      tableBody.appendChild(row);
    });
  } catch (err) {
    console.error("Ошибка:", err);
  }
}

function editProduct(productId) {
  window.location.href = `admin-product-edit.html?id=${productId}`;
}

document.getElementById("add-product-btn").addEventListener("click", () => {
  window.location.href = "admin-product-edit.html";
});

document.addEventListener("DOMContentLoaded", fetchProducts);
