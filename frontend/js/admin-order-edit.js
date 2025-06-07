document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const orderId = urlParams.get("id");
  const form = document.getElementById("order-form");
  const API_URL = `http://localhost:5001/orders/${orderId}`;

  try {
    const response = await fetch(API_URL);
    const order = await response.json();

    form.elements["customer_name"].value = order.customer_name;
    form.elements["total_amount"].value = order.total_amount;
    form.elements["status"].value = order.status;
  } catch (error) {
    console.error("Ошибка загрузки заказа:", error);
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const updatedOrder = {
      customer_name: form.elements["customer_name"].value,
      total_amount: parseFloat(form.elements["total_amount"].value),
      status: form.elements["status"].value,
    };

    try {
      const response = await fetch(API_URL, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedOrder),
      });

      if (response.ok) {
        alert("Заказ обновлён");
        window.location.href = "admin-orders.html";
      } else {
        throw new Error("Ошибка при обновлении заказа");
      }
    } catch (error) {
      console.error("Ошибка сохранения:", error);
    }
  });
});
