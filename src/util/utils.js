import { fileURLToPath } from "url";
import { dirname } from "path";
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
export const __dirname = dirname(__filename)

export const readFile = async(path)=>{
    try{
    const file = await fs.promises.readFile(path, 'utf-8')
    return JSON.parse(file)
  } catch {
    return []
  }
}

export const writeFile = async(file,path)=>{
    try{
      await fs.promises.writeFile(
        path,
        JSON.stringify(file, 'null',2),
        "utf-8")
  } catch (err){
    console.log(err)
  }
  }

/* export const isExist = async (id,path) =>{
    const array = await readFile(path)
    const isExist = array.some(c => c.id === id)
    return isExist
} */