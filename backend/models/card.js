const mongoose = require('mongoose');
const { default: isURL } = require('validator/lib/isURL');

const CardSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: (link) => isURL(link),
      message: (props) => `Неверный адрес: ${props.value}`,
    },
  },
  likes: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', CardSchema);
