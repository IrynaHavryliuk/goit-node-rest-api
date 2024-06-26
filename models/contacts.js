import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Set name for contact'],
    },
    email: {
        type: String,
        required: false, 
    },
    phone: {
        type: String, 
        required: false, 
    },
    favorite: {
        type: Boolean,
        default: false,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'user',
      },
});

const Contact = mongoose.model('Contact', contactSchema);

export default Contact;
