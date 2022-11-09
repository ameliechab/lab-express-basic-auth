const router = require("express").Router();
const { isLoggedIn } = require("./../middlewares/middlewares");

router.use("/auth", require("./auth.route"));

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/profile", (req, res, next) => {
  console.log(req.session.currentUser);
  res.render("profile", { currentUser: req.session.currentUser });
});

router.get("/main", isLoggedIn, (req, res) => {
  res.render("main");
});

router.get("/private", isLoggedIn, (req, res) => {
  res.render("private");
});

module.exports = router;
