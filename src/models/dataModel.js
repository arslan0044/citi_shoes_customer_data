import mongoose from "mongoose";

const dataSchema = new mongoose.Schema({
  number: {
    type: String,
    required: [true, "Please Enter Number"],
    unique: true,
  },
  name: {
    type: String,
    required: [true, "Please Enter Name"],
  },
  city: {
    type: String,
    required: [true, "Please Enter City"],
  },

});
const Data =
  mongoose.models.datas || mongoose.model("datas", dataSchema);
export default Data;
