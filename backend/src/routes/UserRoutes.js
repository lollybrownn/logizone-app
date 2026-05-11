const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");

router.get("/users", UserController.showAll);
router.get("/users/:username", UserController.showByUsername);
router.get("/users/:id", UserController.showById);
router.get("/users/");
