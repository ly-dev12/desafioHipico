const { Schema, model } = require('mongoose');


const FullprofileSchema = new Schema({

    username: {
        type: String,
        required: true
    },
    birthday: {
        type: Date,
        required: true
    },
    sexo: {
        type: String,
        required: true
    },
    cedula: {
        type: Number,
        required: true
    },
    direccion: {
        type: String,
        required: true
    },
    edad: {
        type: Number,
        default: 17,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    verified: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});


module.exports = model('Fullprofile', FullprofileSchema);