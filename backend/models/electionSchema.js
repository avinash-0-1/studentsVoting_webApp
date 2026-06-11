import mongoose from "mongoose";

const electionSchema = mongoose.Schema({
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
},{timestamps:true});

const electionModel = mongoose.model("Election", electionSchema);
export default electionModel;