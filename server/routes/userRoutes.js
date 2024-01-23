const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
const keySecret = "1234";
const clientId = "43990325827-4v7rp5ce0kf6qq4i2h6i0b07992lehae.apps.googleusercontent.com";
const clientSecret = "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";

// email config
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "anurag.gupta199418@gmail.com",
    pass: "dtqx nxxr ttst zhlv",
  },
});

// registration
const user = require("../models/user.js");
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    const userData = new user({
      name: name,
      email: email,
      password: hashedPassword,
    });

    const usersData = await userData.save();
    res.send("User registered successfully");
  } catch (err) {
    return res.status(400).send(err);
  }
});


// GET method to get all the user 
router.get("/", async (req, res) => {
  try {
    const allUsers = await user.find({}, { password: 0, verifytoken: 0 });
    res.status(200).json(allUsers);
  } catch (err) {
    console.error(`Error while fetching all users: ${err}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


// DELETE method to delete user from user data base
router.delete('/:userId', async (req, res) => {
  const userId = req.params.userId;
  try {
    const result = await user.findByIdAndDelete(userId);
    if (!result) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});


// POST method for login user
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const usersData = await user.findOne({ email: email });
    if (usersData) {
      const isPasswordMatch = await bcrypt.compare(password, usersData.password);
      if (isPasswordMatch) {
        const temp = {
          name: usersData.name,
          email: usersData.email,
          isAdmin: usersData.isAdmin,
          _id: usersData._id,
        };
        res.send(temp);
      } else {
        return res.status(400).json({ message: "Invalid credentials" });
      }
    } else {
      return res.status(400).json({ message: "User not registered, please login" });
    }
  } catch (err) {
    res.status(400).json({ err });
  }
});

// reset password

router.post("/sendpasslink", async (req, res) => {
  const { email } = req.body;
  if (!email) {
    res.status(401).json({ status: 401, message: "Enter your email" });
  }
  try {
    let userFind = await user.findOne({ email: email });

    // Token generate for reset password

    const token = jwt.sign(
      {
        _id: userFind._id,
      },
      keySecret,
      {
        expiresIn: "120s",
      }
    );

    const setUserToken = await user.findByIdAndUpdate(
      {
        _id: userFind._id,
      },
      {
        verifytoken: token,
      },
      {
        new: true,
      }
    );

    if (setUserToken) {
      const mailOptions = {
        from: "anurag.gupta199418@gmail.com",
        to: email,
        subject: "Reset password link",
        text: `This link will expire within 2 minutes. Click the link to reset your password: https://desi-deliveries-frontend.vercel.app/forgotpassword/${userFind.id}/${setUserToken.verifytoken}`,
        html: `<p style="text-align: center;">This link will expire within 2 minutes. Click the link
        <a href="https://desi-deliveries-frontend.vercel.app/forgotpassword/${userFind.id}/${setUserToken.verifytoken}"> Reset Password </a>
         to reset your password:</p>
               <div style="text-align: center;">
                 <a href="https://desi-deliveries-frontend.vercel.app/forgotpassword/${userFind.id}/${setUserToken.verifytoken}">
                   <img src="https://assets-v2.lottiefiles.com/a/4a774176-1171-11ee-ae48-bf87d1dea7a3/FzdIgU4ZSq.gif" alt="Forgot Password" />
                 </a>
               </div>`,
      };

      transporter.sendMail(mailOptions)
      .then(info => {
        console.log("Email", info.response);
        res.status(200).json({ status: 200, message: "Email sent successfully" });
      })
      .catch(error => {
        console.error("Email sending error:", error);
        res.status(401).json({ status: 401, message: "Email not sent" });
      });
    
    }
  } catch (err) {
    res.status(401).json({ status: 401, message: "Email not send" });
  }
});

// verify user

router.get("/forgotpassword/:id/:token", async (req, res) => {
  const { id, token } = req.params;

  try {
    const validUser = await user.findOne({ _id: id, verifytoken: token });
    const verifyToken = jwt.verify(token, keySecret);
    if (validUser && verifyToken._id) {
      res.status(200).json({ status: 200, validUser });
    } else {
      return res
        .status(401)
        .json({ status: 401, message: "Invalid User or Token not exist" });
    }
  } catch (err) {
    res.status(401).json({ status: 401, err });
  }
});

// change password

router.post("/:id/:token", async(req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;
  try {
    const validUser = await user.findOne({ _id: id,
      verifytoken: token });
    const verifyToken = jwt.verify(token, keySecret);
    if (validUser && verifyToken._id) {
      let newPassword = await bcrypt.hash(password, 12);
      const setNewPass = await user.findByIdAndUpdate(
       id,
        { password: newPassword }
      );
      setNewPass.save();
      res.status(200).json({ status: 200, message: "Password change successfully" });
      
      } else {
      res.status(401).json({ status: 401, message: "user not exist" });
    }
  } catch (err) {
    console.error("Error updating password:", err);
    res.status(401).json({ status: 401, message: "Error updating password" });
    return; 
  }
});
module.exports = router;
