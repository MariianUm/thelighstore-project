const ORDERS_API_URL = "http://localhost:5001/orders";

export async function createOrder(orderData) {
  const response = await fetch(ORDERS_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(orderData),
  });

  if (!response.ok) throw new Error("Ошибка при создании заказа");

  return await response.json();
} 


