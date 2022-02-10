const User = require("../models/user.model");

const authUtil = require("../util/authentication");
const validationUtil = require("../util/validation");
const sessionFlashUtil = require("../util/session-flash");

function getSignup(req, res) {
  let sessionData = sessionFlashUtil.getSessionData(req);
  if (!sessionData) {
    sessionData = {
      email: "",
      confirmEmail: "",
      password: "",
      name: "",
      street: "",
      postal: "",
      city: "",
    };
  }
  res.render("customer/auth/signup", { inputData: sessionData });
}

async function signup(req, res, next) {
  const enteredData = {
    email: req.body.email,
    confirmEmail: req.body["confirm-email"],
    password: req.body.password,
    name: req.body.fullname,
    street: req.body.street,
    postal: req.body.postal,
    city: req.body.city,
  };

  if (
    !validationUtil.userDetailsAreValid(
      req.body.email,
      req.body.password,
      req.body.fullname,
      req.body.street,
      req.body.postal,
      req.body.city
    ) ||
    !validationUtil.emailIsConfirmed(req.body.email, req.body["confirm-email"])
  ) {
    sessionFlashUtil.flashDataToSession(
      req,
      {
        errorMessage:
          "Please check your input. Password must be atleast 6 characters long.",
        ...enteredData,
      },
      () => {
        res.redirect("/signup");
      }
    );
    return;
  }
  const user = new User(
    req.body.email,
    req.body.password,
    req.body.fullname,
    req.body.street,
    req.body.postal,
    req.body.city
  );
  try {
    const existsAlready = await user.existsAlready();
    if (existsAlready) {
      sessionFlashUtil.flashDataToSession(
        req,
        {
          errorMessage: "User already exists. Try logging in instead.",
          ...enteredData,
        },
        () => {
          res.redirect("/signup");
        }
      );
      return;
    }
    await user.signup();
  } catch (error) {
    return next(error);
  }
  res.redirect("/login");
}

function getLogin(req, res) {
  let sessionData = sessionFlashUtil.getSessionData(req);
  if (!sessionData) {
    sessionData = {
      email: "",
      password: "",
    };
  }
  res.render("customer/auth/login", {inputData: sessionData});
}

async function login(req, res, next) {
  const user = new User(req.body.email, req.body.password);
  let existingUser;
  try {
    existingUser = await user.getUserWithSameEmail();
  } catch (error) {
    return next(error);
  }

  const sessionErrorData = {
    errorMessage: "Invalid credentials - Please double check email and password",
    email: user.email,
    password: user.password,
  };

  if (!existingUser) {
    // console.log("user does not exist");
    sessionFlashUtil.flashDataToSession(req, sessionErrorData, () => {
      res.redirect("/login");
    });
    return;
  }
  const passwordIsCorrect = await user.hasMatchingPassword(
    existingUser.password
  );
  if (!passwordIsCorrect) {
    sessionFlashUtil.flashDataToSession(req, sessionErrorData, () => {
      res.redirect("/login");
    });
    return;
  }
  authUtil.createUserSession(req, existingUser, () => {
    res.redirect("/");
  });
}

function logout(req, res) {
  authUtil.destroyUserSession(req);
  res.redirect("/login");
}

module.exports = {
  getSignup: getSignup,
  getLogin: getLogin,
  signup: signup,
  login: login,
  logout: logout,
};
