import fs from "fs";
import ProductManager from "./ProductManager.js";

const products = new ProductManager;

class cartManager{
    #pathc= "./src/carts.json";
    

    constructor(){}

    async addCart(){

        let idc=await this.getIdCart();
        console.log(idc);
        let carts = await this.getCart();
        const newCart={id:idc , products: []};

        const cartsUpd=[...carts, newCart];
        await fs.promises.writeFile(this.#pathc, JSON.stringify(cartsUpd));
        return newCart;
    }

    async getCart(){
        
        try {
                    const cartsJson = await fs.promises.readFile(this.#pathc,"utf-8");
                    return JSON.parse(cartsJson);
            
        } catch (error) {
            console.error(error);
            return [];
        }

    }

    async getCartById(cartid){
        const carts=await this.getCart();
        const cart = carts.find((c)=> c.id ===cartid);
        return cart;
    }

    async getIdCart(){
        const idc = Math.random().toString(30).substring(2);    
        return idc;
    }

    async addProductcart(cid, pid){

        const carts = await this.getCart();
        const prods= products.getProducts();
        const exist_cart=carts.some((x)=>x.id ===cid);
        const exist_prod=prods.some((y)=>y.id===parseInt(pid));
    
    
        const updatedCarts = carts.map((c)=> {
            if(c.id===cid){
                const exist_prod_cart=c.products.find((p) => p.id ===parseInt(pid));
                
                if(exist_prod_cart){
                        const updatedProducts = c.products.map((p)=> {
                            if(p.id===cid){
                                return {
                                    ...p,quantity:p.quantity+1,
                                };
                            }
                            return p;
                        });
                        
                        return {
                            ...c,products:updatedProducts,
                        };
                    }

                    return {
                        ...c, products: [...c.products, {id:pid, quantity:1}],
                    };
            }
            return c;
        });

        await fs.promises.writeFile(this.#pathc, JSON.stringify(updatedCarts));
        return this.getCartById(cid);
        
    }

}

export default cartManager;