const ORDERS_API_URL = "http://localhost:5001/orders";

async function fetchOrders() {
  try {
    const response = await fetch(ORDERS_API_URL);
    if (!response.ok) throw new Error("Ошибка при загрузке заказов");

    const orders = await response.json();
    const tableBody = document.getElementById("orders-table-body");
    tableBody.innerHTML = "";

    orders.forEach((order) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td><a class="order-link" href="admin-order-edit.html?id=${order.id}">#${order.id}</a></td>
        <td>${order.total} ₽</td>
        <td>${new Date(order.created_at).toLocaleDateString()}</td>
        <td>${order.customer_name}</td>
        <td>${order.status}</td>
      `;
      tableBody.appendChild(row);
    });
  } catch (err) {
    console.error("Ошибка загрузки заказов:", err.message);
  }
}

document.addEventListener("DOMContentLoaded", fetchOrders);
