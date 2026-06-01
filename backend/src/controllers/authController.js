import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/auth.js";

// Put /api/auth/register
const register = async (req, res) => {
  try {
    const { username, password } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ status: "error", message: "Username already taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await User.create({
      username,
      password: hashedPassword,
    });

    res.status(201).json({
      status: "ok",
      message: "Registration successful",
      data: { id: newUser.user_id, username: newUser.username },
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ status: "error", message: "Invalid credentials" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ status: "error", message: "Invalid credentials" });
    }

    const accessToken = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.ACCESS_SECRET,
      { expiresIn: "1d" },
    );

    res.status(200).json({
      status: "ok",
      message: "Login successful",
      data: { access: accessToken },
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

// POST /api/auth/logout
const logout = async (req, res) => {
  res.status(200).json({ status: "ok", message: "Logged out successfully" });
};

export { register, login, logout };
