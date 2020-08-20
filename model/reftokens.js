const mongoose=require('mongoose');
const Schema = mongoose.Schema;
const refTokenSchema = new Schema({
userid:{
    type:String,
        required:true,
        lowercase:true,
        unique:true 
},
refreshToken:{
    type:String,
    required:true
}
})

const refToken = mongoose.model("refToken",refTokenSchema);
module.exports = refToken