import mongoose from "mongoose";

const whatsappSchema = mongoose.Schema({
  email: String,
  contacts: Array,
});

export default mongoose.model("contactscontents", whatsappSchema);
