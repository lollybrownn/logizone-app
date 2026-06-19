const UserModel = require("../models/UserModel");
const jwt = require("jsonwebtoken");
const AuthController = {
  async login(req, res) {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(422).json({
          success: false,
          message: "Username and Password are required",
        });
      }
      const user = await UserModel.findByUsername(username);
      if (!user) {
        return res
          .status(401)
          .json({ success: false, message: "Invalid credentials" });
      }
      if (user.status === "Inactive") {
        return res.status(403).json({
          success: false,
          message: "This account has been deactivated",
        });
      }
      const isMatch = await UserModel.verifyPassword(password, user.password);
      if (!isMatch) {
        return res
          .status(401)
          .json({ success: false, message: "Invalid credentials" });
      }
      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || "30min" },
      );
      const { password: _omit, ...safeUser } = user;

      return res
        .status(200)
        .json({ success: true, data: { user: safeUser, token: token } });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },
  async me(req, res) {
    try {
      const user = await UserModel.findById(req.user.id);
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }
      return res.status(200).json({ success: true, data: { user } });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },
};

module.exports = AuthController;
