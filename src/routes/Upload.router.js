import { Router } from "express";
import { uploader } from "../utils/multer.js";
import { __dirname } from "../utils/utils.js";
import xlsx from "xlsx"
import { productModel } from "../dao/models/product.model.js";
//import ProductManager from '../dao/MongoDB.ProductManager.js'
import MDBProductManager from "../dao/MongoDB.ProductManager.js";
import {dirname} from "path"

const router = new Router() 
const productManager = new MDBProductManager()

router.post('/bdFile', uploader.single('bdFile'), async (req,res)=>{
    if(!req.file){
        await res.send ({status:"Failed", payload: "No se ha adjuntado ningun archivo"})
    }
    const filePath = `${dirname(__dirname)}/public/uploads/${req.file.filename}`

    const excelFile = await xlsx.readFile(filePath)

    const sheetName = excelFile.SheetNames[0];
    const sheet = excelFile.Sheets[sheetName];

    const data = await xlsx.utils.sheet_to_json(sheet);

    data.forEach(row => {
        delete row[Object.keys(row)[0]];
    });

    await productManager.addProducts(data)
    //await productModel.insertMany(data)

    const {io} = req
    io.emit('massiveProductsUpload', await productManager.getProducts())

    await res.send({status: "success", payload: 'Archivo agregado exitosamente'})
})

export default router