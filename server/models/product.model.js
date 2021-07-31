const { string } = require("joi");
const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
    prod_name: {
        type: String,
        required:true,
    },
    prod_descp:{
        type: String,
    },
    prod_price: {
        type: Number,
        required:true,
    },
    isDeleted: {
        type: Boolean,
        default: false,
      },
      createdDate: {
        type: Date,
        default: Date.now,
      },
      updateHistory: {
        type: Array,
        required: false,
      },
});

productSchema.set("toJSON", { virtuals: true });
productSchema.set("timestamps", true);

module.exports = mongoose.model("Product", productSchema);