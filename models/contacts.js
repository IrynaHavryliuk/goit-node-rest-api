import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Set name for contact'],
    },
    email: {
        type: String,
        required: false, // Set to true if the email is required
    },
    phone: {
        type: String, // Storing phone as String to include characters like + or -
        required: false, // Set to true if the phone is required
    },
    favorite: {
        type: Boolean,
        default: false,
    },
});

const Contact = mongoose.model('Contact', contactSchema);

export default Contact;
