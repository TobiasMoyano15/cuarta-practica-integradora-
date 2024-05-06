import multer from "multer";
import { __dirname } from "./utils.js";
import {dirname} from "path"

const storage = multer.diskStorage({
    destination: function(req,file,callback){
        callback(null,`${dirname(__dirname)}/public/uploads`)
    },
    filename: function(req,file,callback){
        callback(null,`${Date.now()}-${file.originalname}`)
    }

})

export const uploader = multer({storage})