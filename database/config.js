import mongoose from "mongoose";

const dbConnection = async() => {
    try {
        await mongoose.connect(process.env.MONGODB_CONN);

        console.log('Base de datos online');
    } catch (error) {
        console.log(error);
        throw new Error("Error en conexión a base de datos");
    }
}

export { dbConnection }