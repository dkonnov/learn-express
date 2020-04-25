const { Router } = require("express");
const auth = require("../middleware/auth");
const User = require("../models/user");
const router = Router();

router.get("/", auth, async (req, res) => {
  res.render("profile", {
    title: "Профиль",
    isProfile: true,
    user: req.user.toObject(),
  });
});

router.post("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    const toChange = {
      name: req.body.name,
    };

    if (req.file) {
      toChange.avatarURL = req.file.path;
    }
    console.log(toChange);
    Object.assign(user, toChange);
    await user.save();
    console.log(user);
    res.redirect("/profile");
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
