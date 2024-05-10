import bcrypt from "bcrypt";
import User from "../model/user.js";

export const signup = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const alreadyExistsUser = await User.findOne({ where: { email } });

    if (alreadyExistsUser) {
      return res
        .status(409)
        .json({ message: "User with email already exists!" });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username,
      email,
      password: hashPassword,
    });

    res.json({ message: "Thanks for registering" });
    newUser.save();
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Cannot register user at the moment!" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res
        .status(401)
        .json({ message: "User with email does not exist!" });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ message: "Invalid password!" });
    }

    if (req.session.user) {
      res.json({ message: "Welcome back!" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Cannot login at the moment!" });
  }
};
