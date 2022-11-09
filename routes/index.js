const router = require("express").Router();

router.use("/auth", require("./auth.route"));

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/profile", (req, res, next) => {
  console.log(req.session.currentUser);
  res.render("profile", { currentUser });
});

module.exports = router;
