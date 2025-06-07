const params = new URLSearchParams(window.location.search);
const productId = params.get("id");
const isEdit = !!productId;

const API_URL = "http://localhost:5002/products";
const form = document.getElementById("edit-product-form");
const previewImg = document.getElementById("preview-img");
const imageInput = document.getElementById("image-upload");
const imageTextInput = form.elements["image"];
const title = document.getElementById("form-title");
const deleteBtn = document.getElementById("delete-button");

// Показываем превью изображения и сохраняем имя файла
imageInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    previewImg.src = URL.createObjectURL(file);
    imageTextInput.value = file.name;
  }
});

// Загрузка товара по ID
async function fetchProduct() {
  if (!isEdit) {
    deleteBtn.style.display = "none";
    title.textContent = "Создание нового товара";
    previewImg.src = "img/placeholder.png";
    return;
  }

  try {
    const response = await fetch(`${API_URL}/${productId}`);
    if (!response.ok) throw new Error("Не удалось загрузить товар");

    const product = await response.json();
    form.elements["name"].value = product.name;
    form.elements["description"].value = product.description;
    form.elements["price"].value = product.price;
    form.elements["image"].value = product.image_url;
    previewImg.src = `img/${product.image_url}`;
  } catch (err) {
    alert("Ошибка загрузки товара");
  }
}

// Отправка формы
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const payload = {
    name: form.elements["name"].value,
    description: form.elements["description"].value,
    price: parseFloat(form.elements["price"].value),
    image_url: form.elements["image"].value,
  };

  const method = isEdit ? "PUT" : "POST";
  const url = isEdit ? `${API_URL}/${productId}` : API_URL;

  const response = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (response.ok) {
    alert("Товар успешно сохранён");
    window.location.href = "admin-products.html";
  } else {
    alert("Ошибка при сохранении товара");
  }
});

// Удаление товара
deleteBtn.addEventListener("click", async () => {
  if (!isEdit) return;

  const confirmed = confirm("Удалить товар?");
  if (!confirmed) return;

  const response = await fetch(`${API_URL}/${productId}`, {
    method: "DELETE",
  });

  if (response.ok) {
    alert("Товар удалён");
    window.location.href = "admin-products.html";
  } else {
    alert("Ошибка при удалении");
  }
});

document.addEventListener("DOMContentLoaded", fetchProduct);
