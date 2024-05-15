const socket = io();

const addProductForm = document.querySelector("#addProductForm");
const title = document.querySelector("#title");
const description = document.querySelector("#description");
const code = document.querySelector("#code");
const price = document.querySelector("#price");
const productStatus = document.querySelector("#status");
const stock = document.querySelector("#stock");
const category = document.querySelector("#category");
const thumbnails = document.querySelector("#thumbnails");

statusCheck = () => {
	if (productStatus.checked) return true;
	return false;
};

socket.on("connection", async () => {
	console.log("Conectado al servidor Socket.IO");
});


socket.on("getProducts", async (products) => {
	const listProducts = document.querySelector("#listProducts");
	let product = "";
	for (prod of await products) {
		product += `
    <div class="container">
      <li>${prod.title}</li>
      <div>
        <button class="btnDelete" id="${prod.id}">Borrar</button>
      </div>
      <div>
        <button class="btnUpdate" id="${prod.id}">Actualizar</button>
      </div>
    </div>
    `;
	}

	listProducts.innerHTML = product;

	btnDelete = document.querySelectorAll(".btnDelete");

	btnDelete.forEach((btn) => {
		btn.addEventListener("click", async (evt) => {
			evt.preventDefault();
			socket.emit("deleteProduct", btn.id);
		});
	});

	const btnUpdate = document.querySelectorAll(".btnUpdate");
	btnUpdate.forEach((btn) => {
		btn.addEventListener("click", async (evt) => {
			evt.preventDefault();


			const updatedProductData = {
				title: title.value,
				description: description.value,
				code: code.value,
				price: Number.parseInt(price.value),
				status: Boolean(statusCheck),
				stock: Number.parseInt(stock.value),
				category: category.value,
				thumbnails: thumbnails.value,
			};
			try {


				socket.emit("updateProduct", btn.id, updatedProductData);
			} catch (error) {
				console.error("Error", error);

			}


		});

	});
});

addProductForm.addEventListener("click", async (evt) => {
	evt.preventDefault();
	const newProductData = {
		title: title.value,
		description: description.value,
		code: code.value,
		price: Number.parseInt(price.value),
		status: Boolean(statusCheck),
		stock: Number.parseInt(stock.value),
		category: category.value,
		thumbnails: thumbnails.value,
	};
	try {
		socket.emit("addProduct", newProductData);
	} catch (error) {
		console.error("Error", error);
	}
});