import mongoose from "mongoose";

const whatsappSchema = mongoose.Schema({
    users: Array,
    name: String,
    creationTime: String,
    picture: String,
});

export default mongoose.model('chatcontents', whatsappSchema)