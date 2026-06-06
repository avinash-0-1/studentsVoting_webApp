import userModel from "./models/userSchema.js";

const createDefaultAdmin = async () => {
    try {

        const adminExists = await userModel.findOne({
            role: "admin"
        });

        if (!adminExists) {

            await userModel.create({
                name: "System Admin",
                id: "ADM001",
                username: "admin",
                password: "admin123",
                role: "admin",
                firstLogin: true
            });

            console.log("Default Admin Created");
        }

    } catch (error) {
        console.log("ADMIN CREATION ERROR", error);
    }
};

export default createDefaultAdmin;