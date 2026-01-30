const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    gender: { type: String, enum: ['male', 'female'] },
    
    // Measurements («Œ Ì«—Ì)
    height: { type: Number }, // cm
    weight: { type: Number }, // kg
    shoulderWidth: { type: Number },
    chestSize: { type: Number },
    waistSize: { type: Number },
    
    // Preferences
    bodyShape: { type: String }, // A, B, C, D, E
    stylePreferences: { type: [String] }, // ['classic', 'sport', etc]
    
    // Timestamps
    createdAt: { type: Date, default: Date.now }
});

//  ‘›Ì— ﬂ·„… «·„—Ê— ﬁ»· «·Õ›Ÿ
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// „ﬁ«—‰… ﬂ·„«  «·„—Ê—
userSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);