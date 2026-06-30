import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";


// Register

export const registerUser = async (req, res) => {

  try {

    const { name, email, password, phone, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Please fill in all required fields (name, email, password)",
      });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {

      return res.status(400).json({
        message: "User already exists",
      });

    }

    if (role === "admin") {
      return res.status(403).json({
        message: "Public registration for Admin/Doctor is not permitted.",
      });
    }

    const user = await User.create({

      name,
      email,
      password,
      phone,
      role: role || "patient",

    });

    res.status(201).json({

      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,

      token: generateToken(user._id),

    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};


// Login

export const loginUser = async (req, res) => {

  try {

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Please enter email and password",
      });
    }

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {

      res.json({

        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,

        token: generateToken(user._id),

      });

    } else {

      res.status(401).json({

        message: "Invalid Email or Password",

      });

    }

  } catch (error) {

    res.status(500).json({

      message: error.message,

    });

  }

};


// Profile

export const getProfile = async (req, res) => {

  res.json(req.user);

};