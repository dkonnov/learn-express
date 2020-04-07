const { Schema, model } = require("mongoose");

const userSchama = new Schama({
  email: {
    type: String,
    required: true,
  },
  name: {
    name: String,
    required: true,
  },
  card: {
    items: [
      {
        count: {
          type: Number,
          required: true,
          default: 1,
        },
        courseId: {
          type: Schema.Types.ObjectId,
          ref: "Course",
          required: true,
        },
      },
    ],
  },
});

module.exports = model("User", userSchema);
