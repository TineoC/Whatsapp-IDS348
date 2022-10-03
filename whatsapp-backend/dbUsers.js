import mongoose from "mongoose";

const whatsappSchema = mongoose.Schema({
    email: String,
    email_verified: Boolean,
    name: String,
    picture: String,
    id: String,
});

export default mongoose.model('usercontents', whatsappSchema)
