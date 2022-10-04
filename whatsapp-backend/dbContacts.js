import mongoose from "mongoose";

const whatsappSchema = mongoose.Schema({
    email: String,
    contacts: Array<String>
});

export default mongoose.model('contactscontents', whatsappSchema)