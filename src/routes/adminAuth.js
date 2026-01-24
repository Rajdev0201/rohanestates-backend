const express = require('express');
const { Register, login, logout, updateProfile, changePassword, deleteAccount,ResetLink,ResetPassword, profileData, getDashboardStats} = require('../controllers/adminAuth');
const userAuth = require('../middleware/auth');


const router = express.Router();

//manual login
router.post('/register',Register);
router.post('/login',login);
router.get('/logout',logout);


//profile data
router.get('/profile',userAuth,profileData)


//update and delete and reset
router.put("/update-profile", userAuth, updateProfile);
router.put("/change-password", userAuth, changePassword);
router.delete("/delete-account", userAuth, deleteAccount);

router.post("/user/forgotPassword",ResetLink)
router.put("/user/changePassword/:token",ResetPassword)


router.get("/getStates",getDashboardStats);
module.exports = router;