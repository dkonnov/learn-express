const { body } = require("express-validator");

exports.registerValidators = [
  body("email").isEmail().withMessage("Ввидете корректную форму"),
  body("password", "Пароль должен быть 6 символов").isLength({
    min: 6,
    max: 56,
  }).isAlphanumeric,
  body("confirm").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Пароли олжны совпадать");
    }
    return true;
  }),
  body("name")
    .isLength({ min: 3 })
    .withMessage("Имя должно быть не меньше 3х символов"),
];
