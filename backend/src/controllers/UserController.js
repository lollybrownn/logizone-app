const UserModel = require("../models/UserModel");

const UserController = {
  async showAll(req, res) {
    try {
      const users = await UserModel.findAll();
      return res.status(200).json({ success: true, data: { users } });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },
  async showById(req, res) {
    try {
      const user = await UserModel.findById(req.params.id);
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
  async showByUsername(req, res) {
    try {
      const user = await UserModel.findByUsername(req.params.username);
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }
      return res.status(500).json({ success: true, data: { user } });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },
  async showByRole(req, res) {
    try {
      const users = await UserModel.findByUsername(req.params.role);
      if (!users) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }
      return res.status(500).json({ success: true, data: { users } });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },
  async createUser(req, res) {
    try {
      const { username, password, role } = req.body;
      if (!username || !password || !role) {
        return res.status(422).json({
          success: false,
          message: "Username, password and role are required ",
        });
      }
      const isTaken = await UserModel.findByUsername(username);
      if (isTaken) {
        return res
          .status(409)
          .json({ success: false, message: "Username already used" });
      }
      await UserModel.create({ username, password, role });
      return res
        .status(200)
        .json({ success: true, message: "Register successfully" });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },
  async updateUser(req, res) {
    try {
      const { id, username, role } = req.body;
      if (!username || !role) {
        return res
          .status(422)
          .json({ success: false, message: "Username and role are required" });
      }

      const user = await UserModel.findByUsername(username);
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }
      const updateUser = await UserModel.update(id, { username, role });
      return res.status(200).json({ success: true, message: "User Updated" });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  async deleteUser(req, res) {
    try {
      const deleted = await UserModel.delete(req.params.id);
      if (!deleted) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }
      return res.status(200).json({ success: true, message: "User deleted" });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },
};

module.exports = UserController;
