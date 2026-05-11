const UserModel = require("../models/UserModel");
const jwt = require("jsonwebtoken");
const AuthController = {
  async login(req, res) {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(422).json({
          sucess: false,
          message: "Username and Password are required",
        });
      }
      const user = await UserModel.findByUsername(username);
      if (!user) {
        return res
          .status(401)
          .json({ sucess: false, message: "Invalid credentials" });
      }
      const isMatch = await UserModel.verifyPassword(password, user.password);
      if (!isMatch) {
        return res
          .status(401)
          .json({ sucess: false, message: "Invalid credentials" });
      }
      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_SECRET || "30min" },
      );
      const { password: __, ...safeUser } = user;

      return res
        .status(200)
        .json({ sucess: true, data: { user: safeUser, token: token } });
    } catch (error) {
      return res.status(500).json({ sucess: false, message: error.message });
    }
  },
};

module.exports = AuthController;
