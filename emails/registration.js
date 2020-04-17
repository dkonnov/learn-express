const keys = require("../keys");

module.exports = function (email) {
  return {
    to: email,
    from: keys.EMAIL_FROM,
    subject: "Регистрация прошла успешно, аккакунт создан",
    html: `
    <h1>Добро пожаловать в нам в машизин</h1>
    <p>Вы успешно создали аккаунт c email = ${email}</p>
    <hr>
    <a href="${keys.BASE_URL}">Мазагин курсов</a>
    `,
  };
};
