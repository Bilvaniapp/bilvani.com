const mongoose = require('mongoose');

const AdminSupplierSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required:true
    
    
  },
  storeAddress: {
    type: String
    
    
  },
  city: {
    type: String
   
    
  },
  state: {
    type: String
    
   
  },
  pincode: {
    type: String
    
    
  },
  email: {
    type: String,
    required: true,
    
    unique: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
  },
  phoneNo: {
    type: String,
    required: true,
    
    match: [/^\d{10}$/, 'Please enter a valid 10-digit phone number']
  },
  bankDetails: {
    accountNumber: {
      type: String,
      
      
    },
    bankName: {
      type: String,
      
     
    },
    branchName: {
      type: String,
      
      
    },
    ifscCode: {
      type: String
      
     
      
    }
  },
  panNo: {
    type: String,
   
   
  },
  gstNo: {
    type: String,
    
    
    
  },
  remark: {
    type: String
   
  },
  token: {
    type: String,
   
  }
}, {
  timestamps: true
});

const AdminSupplier = mongoose.model('AdminSupplier', AdminSupplierSchema);

module.exports = AdminSupplier;
