const socket = io();

const createProductForm = document.querySelector("#createProductForm");
const title = document.querySelector("#title");
const description = document.querySelector("#description");
const code = document.querySelector("#code");
const price = document.querySelector("#price");
const productStatus = document.querySelector("#status");
const stock = document.querySelector("#stock");
const category = document.querySelector("#category");
const thumbnails = document.querySelector("#thumbnails");

const statusCheck = () => {
    return productStatus.checked;
};

socket.on("connection", () => {
    
    console.info("Conectado al servidor Socket.IO");
});

socket.on("getProducts", (products) => {
	console.info('Received products:', products);
    const listProducts = document.querySelector("#listProducts");
    let productHtml = "";
    products.forEach(product => {
        productHtml += `
            <div class="container">
                <li>${product.title}</li>
                <div>
                    <button class="btnDelete" id="${product._id}">Borrar</button>
                </div>
                <div>
                    <button class="btnUpdate" id="${product._id}">Actualizar</button>
                </div>
            </div>
        `;
    });

    listProducts.innerHTML = productHtml;

    const btnDelete = document.querySelectorAll(".btnDelete");
    btnDelete.forEach((btn) => {
        btn.addEventListener("click", (evt) => {
            evt.preventDefault();
            socket.emit("deleteProduct", btn.id);
        });
    });

    const btnUpdate = document.querySelectorAll(".btnUpdate");
    btnUpdate.forEach((btn) => {
        btn.addEventListener("click", (evt) => {
            evt.preventDefault();

            const updatedProductData = {
                title: title.value,
                description: description.value,
                code: code.value,
                price: Number.parseInt(price.value),
                status: statusCheck(),
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

createProductForm.addEventListener("submit", (evt) => {
    evt.preventDefault();
    const newProductData = {
        title: title.value,
        description: description.value,
        code: code.value,
        price: Number.parseInt(price.value),
        status: statusCheck(),
        stock: Number.parseInt(stock.value),
        category: category.value,
        thumbnails: thumbnails.value,
    };
    try {
        socket.emit("createProduct", newProductData);
    } catch (error) {
        console.error("Error", error);
    }
});