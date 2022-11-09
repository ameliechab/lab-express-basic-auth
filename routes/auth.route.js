const router = require("express").Router();
const User = require("./../models/User.model");
const bcrypt = require("bcryptjs");
const salt = 12;

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.get("/login", (req, res, next) => res.render("auth/login"));

router.post("/signup", async (req, res, next) => {
  const { username, password } = req.body;

  try {
    if (!username || !password) {
      return res.render("auth/signup", {
        errorMessage: "Both fields are mandatory",
      });
    }

    const foundUser = await User.findOne({ username });

    if (foundUser) {
      return res.render("auth/signup", {
        errorMessage: "Username is already taken",
      });
    }
    const generatedSalt = await bcrypt.genSalt(salt);
    const hashedPassword = await bcrypt.hash(password, generatedSalt);

    const newUser = await User.create({
      username,
      password: hashedPassword,
    });
    res.redirect("/");
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(500).render("auth/signup", { errorMessage: error.message });
    } else if (error.code === 11000) {
      res.status(500).render("auth/signup", {
        errorMessage:
          "Username and email need to be unique. Either username or email is already used.",
      });
    }
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;

  try {
    if (!username || !password) {
      return res.render("auth/login", {
        errorMessage: "Both fields are mandatory",
      });
    }
    const foundUser = await User.findOne({ username });

    if (!foundUser) {
      return res.render("auth/login", {
        errorMessage: "Wrong credentials",
      });
    }

    const samePassword = await bcrypt.compare(password, foundUser.password);

    if (!samePassword) {
      return res.render("auth/login", {
        errorMessage: "Wrong credentials",
      });
    }

    req.session.currentUser = foundUser;

    res.redirect("/profile");
  } catch (error) {
    next(error);
  }
});

module.exports = router;
