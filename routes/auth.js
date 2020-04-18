const { Router } = require("express");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const sendgrid = require("nodemailer-sendgrid-transport");
const User = require("../models/user");
const keys = require("../keys");
const regMail = require("../emails/registration");
const resetEmail = require("../emails/reset");
const router = Router();

const transporter = nodemailer.createTransport(
  sendgrid({
    auth: { api_key: keys.SENDGRID_API_KEY },
  }),
);

router.get("/login", async (req, res) => {
  res.render("auth/login", {
    title: "Авторизация",
    isLogin: true,
    loginError: req.flash("loginError"),
    login: req.flash("login"),
    registerError: req.flash("registerError"),
  });
});

router.get("/logout", async (req, res) => {
  req.session.destroy(() => {
    res.redirect("/auth/login#login");
  });
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const candidate = await User.findOne({ email });

    if (candidate) {
      const areSame = await bcrypt.compare(password, candidate.password);
      console.log(areSame);
      if (areSame) {
        req.session.user = candidate;
        req.session.isAuthenticated = true;
        req.session.save((err) => {
          if (err) {
            throw err;
          }
          res.redirect("/");
        });
      } else {
        req.flash("loginError", "Не верный пароль");
        res.redirect("/auth/login#login");
      }
    } else {
      req.flash("login", "Такого пользователя не существует");
      res.redirect("/auth/login#login");
    }
  } catch (e) {
    console.log(e);
  }
});

router.post("/register", async (req, res) => {
  try {
    const { email, password, repeat, name } = req.body;
    const candidate = await User.findOne({ email });

    if (candidate) {
      req.flash("registerError", "Пользователь с таким email уже сущестует");
      res.redirect("/auth/login#register");
    } else {
      const hashPassword = await bcrypt.hash(password, 10);
      const user = new User({
        email,
        name,
        password: hashPassword,
        cart: { items: [] },
      });
      await user.save();
      res.redirect("/auth/login#login");
      await transporter.sendMail(regMail(email));
    }
  } catch (e) {
    console.log(e);
  }
});

router.get("/reset", (req, res) => {
  res.render("auth/reset", {
    title: "Забыл пароль?",
    error: req.flash("error"),
  });
});

router.post("/reset", (req, res) => {
  try {
    crypto.randomBytes(32, async (err, buffer) => {
      if (err) {
        req.flash("error", "Что пошло не так.");
        return res.redirect("/auth/reset");
      }
      const token = buffer.toString("hex");
      const candidate = await User.findOne({ email: req.body.email });
      if (candidate) {
        candidate.resetToken = token;
        candidate.resetTokenExp = Date.now() + 3600;
        await candidate.save();
        await transporter.sendMail(resetEmail(candidate.email, token));
        res.redirect("/auth/login#");
      } else {
        req.flash("error", "Такого email нет");
        return res.redirect("/auth/reset");
      }
    });
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
