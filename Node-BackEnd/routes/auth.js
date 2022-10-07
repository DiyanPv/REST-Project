const express = require(`express`);
const router = express.Router();
const User = require(`../models/user.js`);
const { body } = require(`express-validator/check`);
const authcontroller = require(`../controllers/auth`);
const isAuth = require("../middleware/is-auth.js");

router.put(`/signup`, [
  body(`email`)
    .isEmail()
    .withMessage(`Please enter a valid email`),
  body(`password`).isLength({ min: 5 }),
  body(`name`)
    .trim()
    .not()
    .isEmpty(),
  authcontroller.signup,
]);

router.post(`/login`, authcontroller.login);
router.get(`/status`, isAuth, authcontroller.getStatus);
router.put(`/status`, isAuth, authcontroller.changeStatus);
module.exports = router;
