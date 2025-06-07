const PRODUCTS_API_URL = "http://localhost:5002/products";

export async function fetchAllProducts() {
  const response = await fetch(PRODUCTS_API_URL);
  if (!response.ok) throw new Error("Не удалось получить список товаров");
  return await response.json();
}

export async function fetchProductById(id) {
  const response = await fetch(`${PRODUCTS_API_URL}/${id}`);
  if (!response.ok) throw new Error("Не удалось получить товар по ID");
  return await response.json();
} 