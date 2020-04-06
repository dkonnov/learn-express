const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const exphbs = require("express-handlebars");
const app = express();
const homeRoutes = require("./routes/home");
const addRoutes = require("./routes/add");
const cartRoutes = require("./routes/cart");
const coursesRoutes = require("./routes/courses");

const hbs = exphbs.create({
  defaultLayout: "main",
  extname: "hbs",
});

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", "views");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use("/", homeRoutes);
app.use("/add", addRoutes);
app.use("/cart", cartRoutes);
app.use("/courses", coursesRoutes);

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    const url =
      "mongodb+srv://dmitry:lHltGHz3guDoWuCC@cluster0-gfhyj.mongodb.net/shop";
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    app.listen(PORT, () => {
      console.log(`Server is running in port ${PORT}`);
    });
  } catch (e) {
    console.log(e);
  }
}
start();
