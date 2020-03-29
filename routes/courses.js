const { Router } = require("express");
const Course = require("../models/course");
const router = Router();

router.get("/", async (req, res) => {
  const courses = await Course.getAll();
  console.log(courses);
  res.render("courses", {
    title: "Курсы",
    isCourses: true,
    courses: courses
  });
});

module.exports = router;
