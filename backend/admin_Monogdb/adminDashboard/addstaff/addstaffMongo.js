const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
    joiningDate: {
        type: Date,

    },
    designation: {
        type: String,
        enum: [
            'General Manager',
            'Area Manager',
            'Marketing',
            'Sales and Services',
            'HR and Admin',
            'Finance'
        ],

    },
    name: {
        type: String,

    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],

    },
    address: {
        type: String,

    },
    mobile: {
        type: String,
        required: true,
        unique: true,

    },
    dob: {
        type: Date,

    },

    panCard: {
        type: String,

    },
    aadhaarCard: {
        type: String,

    },

    remark: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ['Active', 'Quit'],

    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (v) {
                return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v);
            },
            message: props => `${props.value} is not a valid email!`
        }
    },
    password: {
        type: String,
        required: true
    },
    token: {
        type: String,
        default: ''
    },
    createdby: {
        type: String
    },
}, {
    timestamps: true // Adds createdAt and updatedAt fields automatically
});

const Staff = mongoose.model('Staff', staffSchema);

module.exports = Staff;
