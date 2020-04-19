const keys = require("../keys");

module.exports = function (email, token) {
  return {
    to: email,
    from: keys.EMAIL_FROM,
    subject: "Восстановление доступа",
    html: `
    <h1>Забыли пароль</h1>
    <p><a href="${keys.BASE_URL}/auth/password/${token}">Восстановить</a></p>
    <hr>
    <a href="${keys.BASE_URL}">Мазагин курсов</a>
    `,
  };
};
