import bcrypt from "bcrypt";
import User from "../models/auth.js";

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "-password");

    res.status(200).json({ status: "ok", data: users });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.body.user_id);
    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }

    if (!("role" in req.body)) {
      return res
        .status(400)
        .json({ status: "error", message: "No valid fields provided" });
    }

    user.role = req.body.role;
    await user.save();

    res
      .status(200)
      .json({ status: "ok", message: "Account access updated successfully" });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.body.user_id);
    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }

    if (req.user.id === req.body.user_id) {
      return res.status(403).json({
        status: "error",
        message: "You cannot delete your own account",
      });
    }

    await User.findByIdAndDelete(req.body.user_id);

    res.status(200).json({ status: "ok", message: "User deleted" });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

const deleteMe = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    res
      .status(200)
      .json({ status: "ok", message: "account deletion successful" });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

const getMe = async (req, res) => {
  try {
    // const user = await User.findById(req.body.user_id); - i was working on user profile here....NTS
    const user = await User.findById(req.user.id, "-password");
    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }

    res.status(200).json({ status: "ok", data: user });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

const updateMe = async (req, res) => {
  try {
    const updateDetails = {};

    if ("displayName" in req.body)
      updateDetails.displayName = req.body.displayName;
    if ("username" in req.body) updateDetails.username = req.body.username;

    if (Object.keys(updateDetails).length === 0) {
      return res
        .status(400)
        .json({ status: "error", message: "No valid fields provided" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      updateDetails,
    );
    res.status(200).json({ status: "ok", message: "Profile updated" });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }

    const passwordMatch = await bcrypt.compare(currentPassword, user.password);
    if (!passwordMatch) {
      return res
        .status(401)
        .json({ status: "error", message: "Current password is incorrect" });
    }

    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();

    res
      .status(200)
      .json({ status: "ok", message: "Password changed successfully" });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

export {
  getAllUsers,
  updateUser,
  deleteUser,
  deleteMe,
  getMe,
  updateMe,
  changePassword,
};
