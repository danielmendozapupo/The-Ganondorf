const mongoose = require('mongoose');

const AddressSchema =  new mongoose.Schema(
    {
        address: String
    }
)
const Address = mongoose.model('Address', AddressSchema);
module.exports = Address;
