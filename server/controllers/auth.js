import regeneratorRuntime from "regenerator-runtime";
import passport from "passport";

import Users from "../models/Users";
import { resolve } from "path";
import cfg from "./config";
import jwt from "jsonwebtoken";
import PassportJWT from "passport-jwt";
export const Register = (req, res) => {
  let user = JSON.parse(req.headers.user);
  userRegister(req.body)
    .then(user => {
      return res.json({
        message: "Registered Successfully",
        user: { ...user }
      });
    })
    .catch(err => {
      return res.status(400).json({
        message: err.message
      });
    });
};

const userRegister = (body, user) => {
  let type = body.userType;
  let newUser = new Users({
    ...body,
    userType: type
  });

  return new Promise((resolve, reject) => {
    Users.register(newUser, body.password, (err, user) => {
      if (err) {
        console.log(err)
        reject(err);
      }
      resolve(user);
    });
  });
};

export const Login = (req, res) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(400).json({
        message: "Something is not right",
        user: user
      });
    }
    req.login(user, { session: false }, err => {
      if (err) {
        res.send(err);
      }
      // generate a signed son web token with the contents of user object and return it in the response
      const token = jwt.sign(user, cfg.jwtSecret);
      return res.json({ user, token });
    });
  });
};

// Get user data from client side
export const AuthMe = (req, res) => {
  let user = JSON.parse(req.headers.user);
  if (user.username) {
    return res.json({
      authenticated: true,
      user: user
    });
  }
  return res.json({
    authenticated: false
  });
};

// Auth Middleware
export const RedirectNoAuth = (req, res, next) => {
  let user = JSON.parse(req.headers.user);
  if (!user) {
    return res.redirect("/whatever");
  }
  return next();
};

export const Logout = (req, res) => {
  req.logout();
  res.json({
    message: "Logout"
  });
};
