const {Schema, model} = require('mongoose');

const bcrypt = require('bcryptjs');

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    apellido: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    extension: {
        type: Number,
        default: 534
    },
    phone: {
        type: Number,
        required: true
    },
    key: {
        type: String,
        required: true
    },
    active: {
        type: Boolean,
        default: false
    },
    restore: {
        type: String,
        required: true,
        default: "XrtEd"
    },
    role: {
        type: String,
        default: "User"
    },
    status: {
        type: Boolean,
        default: false
    },
    blacklist: {
        type: Boolean,
        default: false
    },
    date: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

UserSchema.methods.encryptPassword = async password => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

UserSchema.methods.matchPassword = async function(password) {
    return await bcrypt.compare(password, this.password);
}

module.exports = model('User', UserSchema);