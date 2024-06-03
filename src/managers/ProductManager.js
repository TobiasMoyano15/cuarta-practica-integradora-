import fs from "fs";

class ProductManager {
#path = "../src/products.json";


constructor() {}

async addProduct(title,description,code,price,status,stock,category,thumbnail) {
    
    console.log("estamos en la creacion del producto");
    let id = (await this.contadorUnico()) +1;
    console.log(id);
    const products = await this.getProducts();
    let exist = products.find((a) => a.code === code);

        if(exist){
            
            throw new Error("El codigo que se quiere crear ya existe");
        }
        
            const newProduct = {
            id,
            title,
            description,
            code,
            price,
            status,
            stock,
            category,
            thumbnail,};
            const prodsUpd = [...products, newProduct];
            await fs.promises.writeFile(this.#path, JSON.stringify(prodsUpd));
            return newProduct;
}

async getProducts() {
    try {
    console.log("estamos en la consulta del producto");
    const products = await fs.promises.readFile(this.#path, "utf-8");
    console.log(products);
    return JSON.parse(products);
    } catch (e) {
    return e;
    }
}

async getProductsById(idb) {
    
    try {
    console.log(idb);
    const products = await this.getProducts();
    let prodB = products.find((p) => p.id ===parseInt(idb.pid));
    return prodB;
    
    } catch (error) {
    console.error("El producto especificado no existe ");
    }
}

async updateProduct(idn, nuevo_valor) {
        const productsU = await this.getProducts();
        idn=parseInt(idn.pid);
        
    try {
        let prodU = productsU.find((u)=>u.id===idn);

        if(!prodU){
            console.error(
            "No existe el producto que deseas actualizar"
            );
        }
        else{
            
            const updateProd = productsU.map((u) => {
                if (u.id === idn) {
                return {
                ...u,
                ...nuevo_valor,
                };
                }
                return u;
            }); 
            
            //await fs.promises.unlink(this.#path);
            await fs.promises.writeFile(this.#path,JSON.stringify(updateProd));
        }
        
    } catch (error) {
    console.log(error);
    }
}


async deleteProduct(idn) {

    try {
    const products = await this.getProducts();
    let nuevosProd = products.find((producto) => producto.id != idn);
    await fs.promises.unlink(this.#path);
    await fs.promises.writeFile(this.#path, JSON.stringify(nuevosProd));

    } catch (error) {
    console.log("Ha ocurrido un error no se puede borrar el producto");
    }
}

async contadorUnico() {
    let ids = [];
    const product_si = await this.getProducts();
    console.log("desde contador unico");
    for (let x = 0; x < product_si.length; x++) {
    ids[x] = parseInt(product_si[x].id);
    }

    ids.sort(function (a, b) {
    return b - a;
    });
    console.log(ids[0]);
    return ids[0];
}
}

export default ProductManager;