const socket = io();

const addProductForm = document.querySelector("#addProductForm"); // Cambio de nombre para reflejar el formulario de agregar producto

const titleInput = document.querySelector("#title");
const descriptionInput = document.querySelector("#description");
const codeInput = document.querySelector("#code");
const priceInput = document.querySelector("#price");
const productStatusInput = document.querySelector("#status");
const stockInput = document.querySelector("#stock");
const categoryInput = document.querySelector("#category");
const thumbnailsInput = document.querySelector("#thumbnails");

const statusCheck = () => {
    return productStatusInput.checked;
};

socket.on("connect", () => {
    console.log("Conectado al servidor Socket.IO");
});

socket.on("getProducts", (products) => {
    const listProducts = document.querySelector("#listProducts");
    let productHTML = "";
    products.forEach(prod => {
        productHTML += `
            <div class="container">
                <li>${prod.title}</li>
                <div>
                    <button class="btnDelete" id="${prod._id}">Borrar</button>
                </div>
                <div>
                    <button class="btnUpdate" id="${prod._id}">Actualizar</button>
                </div>
            </div>
        `;
    });

    listProducts.innerHTML = productHTML;

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
                title: titleInput.value,
                description: descriptionInput.value,
                code: codeInput.value,
                price: Number.parseInt(priceInput.value),
                status: statusCheck(),
                stock: Number.parseInt(stockInput.value),
                category: categoryInput.value,
                thumbnails: thumbnailsInput.value,
            };
            try {
                socket.emit("updateProduct", btn.id, updatedProductData);
            } catch (error) {
                console.error("Error", error);
            }
        });
    });
});

addProductForm.addEventListener("submit", (evt) => {
    evt.preventDefault();
    const newProductData = {
        title: titleInput.value,
        description: descriptionInput.value,
        code: codeInput.value,
        price: Number.parseInt(priceInput.value),
        status: statusCheck(),
        stock: Number.parseInt(stockInput.value),
        category: categoryInput.value,
        thumbnails: thumbnailsInput.value,
    };
    try {
        socket.emit("addProduct", newProductData);
    } catch (error) {
        console.error("Error", error);
    }
});
