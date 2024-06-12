const  mongoose  = require("mongoose");
 const UserSchema= new mongoose.Schema({
    
  
      name:{type:String,
      required:true,
      unique:true,
  },
  
    email: {type:String,
        required:true,
        unique:true,
        match : [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'please type a valid email']
    },


    password : 
    {type:String,
     
    },
       

        address: {
          type: String,
          },  
        

         phonenumber: {
            type: String,
          },
  
 
          image: {
            type: String,
          }, 
          fromGoogle: {
            type: Boolean,
            default: false,
          },
          Role: {
            type: String,
            enum:['Admin','User'],
            default:'User',
          },
          timestamps: {
            type: Date,
            default: Date.now, // Add timestamps automatically
          },
        });

module.exports = mongoose.model("User", UserSchema )



