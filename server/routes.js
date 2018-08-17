import express, { Router } from "express";
import path from "path";
import passport from "passport";
import passportLocal from "passport-local";
import cfg from "./controllers/config";
import jwt from "jsonwebtoken";
import PassportJWT from "passport-jwt";
import Users from "./models/Users";
import json2xls from "json2xls";
import { Register, Logout, AuthMe } from "./controllers/auth";
import {
  GetParticipants,
  CreateParticipant,
  DownloadParticipantList,
  GetSummary
} from "./controllers/api";

const router = Router();
const api = Router();

const JWTStrategy = PassportJWT.Strategy;
const ExtractJWT = PassportJWT.ExtractJwt;

// PassportJS Setup
router.use(passport.initialize());

const LocalStrategy = passportLocal.Strategy;
passport.use(new LocalStrategy(Users.authenticate()));
passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: cfg.jwtSecret
    },
    function(jwtPayload, cb) {
      //find the user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.
      return Users.findOne(jwtPayload.id)
        .then(user => {
          return cb(null, user);
        })
        .catch(err => {
          return cb(err);
        });
    }
  )
);

router.use(express.static(path.join(__dirname, "../client/build")));

router.use("/api", api);
api.use(json2xls.middleware);

api.get("/me", AuthMe);
api.get("/auth/logout", Logout);
api.post("/auth/register", Register);
api.post("/auth/login", function(req, res, next) {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err || !user) {
      console.log(user);
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
      const token = jwt.sign(user.toJSON(), cfg.jwtSecret);
      console.log("Logged In!!!");
      return res.json({
        user: {
          ...user,
          salt: undefined,
          hash: undefined
        },
        token
      });
    });
  })(req, res);
});

api.post("/getParticipants/:id", GetParticipants);
api.post("/createParticipant", CreateParticipant);
api.get("/downloadParticipantLists", DownloadParticipantList);
api.get('/getSummary', GetSummary)

export default router;
