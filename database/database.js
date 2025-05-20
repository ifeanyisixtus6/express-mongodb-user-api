import mongoose from "mongoose";

const database = async () => {
    try{
        const connect = await mongoose.connect(process.env.DATABASE_URL)
        console.log("database connected successful:", connect.connection.host, connect.connection.name);
   } catch(err){
    console.log(err);
    process.exit(1);   }
}

export default database