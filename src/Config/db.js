import mongoose from "mongoose";

const password = () =>{
    const password = '62bzFL87xRQujfZx'
    return password
}
export const connect = ()=>{
    mongoose.connect(mongodb+srv,//tobiasmoyano09:<password>@cluster0.ebidatw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
)
}