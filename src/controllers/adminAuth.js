const adminAuth = require("../model/adminAuth");
const sendToken = require("../utils/sendToken");
const bcrypt = require("bcrypt");
// const sendMail = require("../utils/sendEmail");
const crypto = require("crypto")

exports.Register = async (req,res) => {
   const { userName, userEmail, password, phoneNumber } = req.body;
   try{

      if(!userName || !userEmail || !password || !phoneNumber){
        return res.status(400).json({message:"All fields are required"})
      }

      const existingUser = await adminAuth.findOne({userEmail:userEmail});

      if(existingUser?.userEmail === userEmail) {
        return res.status(400).json({message:"User Alredy Exists"})
      }

     const hPassword = await bcrypt.hash(password,10)

      const user = new adminAuth({
        userName,
        userEmail,
        password:hPassword,
        phoneNumber
      })
      await user.save();
      await sendToken(user,res,201)

   }catch(err){
      console.log(err)
   }
}

exports.login = async (req,res) => {
    const {userEmail,password} = req.body;

   try{

    if(!userEmail || !password){
         return res.status(400).json({message:"All fields are required"});
    }

    const user = await adminAuth.findOne({userEmail:userEmail});

    if(!user){
        return res.status(400).json({message:"User does not exist"});
    }

    const isPWMatch = await bcrypt.compare(password,user.password);

    if(!isPWMatch){
        return res.status(400).json({message:"Your password is incorrect"});
    }

    await sendToken(user,res,200);

   }catch(err){
        console.log(err);
        return res.status(500).json({message:"Internal Server Error"});
   }
}


exports.logout = async(req,res) => {
    try{
        res.status(200).cookie('token',null ,{
       httpOnly: true,
       secure: true,
       sameSite: "none",
       expires: new Date(0),
        })
        .json({
            message:"Logged out successfully"
        })
    }catch(err){
        console.log(err)
    }
}


exports.profileData = async(req,res) => {
    try{
        const user = req.user;
         if(!user){
            return res.status(400).json({message:"user not found"})
         }
         res.status(200).json({message: "User profile data", user});
    }catch(err){
        console.log(err);
        return res.status(500).json({message: "Internal Server Error" + err.message});
    }
}

exports.updateProfile = async (req, res) => {
    try {
      const {phoneNumber} = req.body;
      const userID = req.user._id;
  
        
    const user = await adminAuth.findOne({_id:userID});
      if (!user) {
        return res.status(400).json({message:"User not found"});
      }
      if(!phoneNumber){
         return res.status(400).json({message:"Mobile number filed should not be empty"});
      }
  
      user.phoneNumber = phoneNumber;
      await user.save();
  
    res.status(200).json({ 
      success: true, 
      message: "Profile updated successfully",
      user: user 
    });
    } catch (error) {
      console.log(error)
      res.status(500).json({ success: false, message: "Internal server error" });
    }
 };
  
exports.changePassword = async (req, res) => {
    try {
      const { oldPassword, newPassword, confirmPassword } = req.body;
      const userID = req.user._id;

        
    const user = await adminAuth.findOne({_id:userID});
      // Ensure all fields are provided
      if (!oldPassword || !newPassword || !confirmPassword) {
         return res.status(400).json({message:"All fields are required"})
      }
  
      if (!user) {
        return res.status(400).json({message:"user not found"})
      }
  
      // Ensure user has a password stored
      if (!user.password) {
              return res.status(400).json({message:"User does not have a password set"})
      }
  
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({message:"Old password is incorrect"});
      }
  
      if (newPassword.length < 6) {
        return res.status(400).json({message:"New password must be at least 6 characters long"});
      }
  
      if (oldPassword === newPassword) {
        return  res.status(400).json({message:"New password cannot be the same as the old password"});
      }
  
      if (newPassword !== confirmPassword) {
        return  res.status(400).json({message:"New password and confirm password do not match"});
      }
  
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
  
      await user.save();
  
      res.status(200).json({ success: true, message: "Password changed successfully" });
    } catch (error) {
      console.error("Error changing password:", error);
    }
};
  
// Delete Account
exports.deleteAccount = async (req, res,) => {

  const userID = req.user._id;
    try {
      
    const user = await adminAuth.findOne({_id:userID});
      if (!user) {
        return  res.status(400).json({message:"User not found"});
      }
  
      await user.deleteOne();
      res.status(200).json({ success: true, message: "Account deleted successfully" });
    } catch (error) {
      next(error);
    }
};

exports.ResetLink = async (req, res) => {
    const { userEmail } = req.body;

     if(!userEmail){
      return res.status(400).json({message:"Please Enter a userEmail!..."})
    }
    const user = await adminAuth.findOne({userEmail:userEmail});
    if (!user) {
        return res.status(400).json({message:"Not a valid user"});
    }

    const token = user.getresetPasswordToken();
    await user.save({ validateBeforeSave: false });

    const resetUrl = `https://www.disenosys.com/reset-password?token=${token}`; // frontend route

    const message = {
        to: userEmail,
          subject: "Reset Your Password - Disenosys",
          text: `
              <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
               <div style="max-width: 600px; margin: auto; background-color: #fff; border-radius: 8px; padding: 30px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
               <h2 style="color: #1e3a8a; text-align: center;">Disenosys - Password Reset</h2>
                 <p>Hi there,</p>
                <p>We received a request to reset your password for your Disenosys account.</p>
                <p style="text-align: center; margin: 30px 0;">
                <a href="${resetUrl}" style="background-color: #1e3a8a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Reset Password</a>
                </p>
                <p>If you didn’t request this, you can safely ignore this email.</p>
                <hr style="margin: 30px 0;" />
               <p style="text-align: center; font-size: 12px; color: #777;">
                &copy; ${new Date().getFullYear()} Disenosys. All rights reserved.
              </p>
             </div>
             </div>
          
          `,
        };
        
    // SendEmail is a utility that uses nodemailer/mailtrap/etc.
    await sendMail(message);

    res.status(200).json({
        success: true,
        message: `Reset password link has been sent to ${userEmail}`,
    });
};


exports.ResetPassword = async (req, res) => {
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await adminAuth.findOne({
    resetPasswordToken,
    resetPasswordTokenExpire: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({message:"Your token has expired or is invalid,please check with your user email"});
  }

  const { password, confirmPassword } = req.body;


  if (!password || password.length < 6) {
    return res.status(400).json({message:"Password must be at least 6 characters"});
  }


  if (password !== confirmPassword) {
    return res.status(400).json({message:"Passwords do not match"});
  }

  const hash = await bcrypt.hash(password, 10);
  user.password = hash;
  user.resetPasswordToken = undefined;
  user.resetPasswordTokenExpire = undefined;

  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: "Password has been reset successfully",
  });
};