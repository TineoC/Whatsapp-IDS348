import mongoose from "mongoose";

const whatsappSchema = mongoose.Schema({
  message: String,
  imgURL: String || null,
  name: String,
  timestamp: String,
  chat: String,
});

export default mongoose.model("messagecontents", whatsappSchema);
