const { Router } = require("express");
const Cart = require("../models/cart");
const router = Router();

router.get("/", async (req, res) => {
  const cart = await Cart.fetch();
  res.render("index", {
    title: "Главная страница",
    coursesCount: cart.courses.length,
    isHome: true
  });
});

module.exports = router;
