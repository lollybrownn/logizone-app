const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");
const { authenticate, authorize } = require("../middlewares/authMiddleware");

router.get("/", authenticate, authorize("Owner"), UserController.showAll);
router.get("/role/:role", authenticate, authorize("Owner"), UserController.showByRole);
router.get("/username/:username", authenticate, authorize("Owner"), UserController.showByUsername);
router.get("/:id", authenticate, authorize("Owner"), UserController.showById);
router.post("/", authenticate, authorize("Owner"), UserController.createUser);
router.put("/:id", authenticate, authorize("Owner"), UserController.updateUser);
router.delete("/:id", authenticate, authorize("Owner"), UserController.deleteUser);

module.exports = router;
