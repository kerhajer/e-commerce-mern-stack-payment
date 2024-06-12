const express = require('express');
const router = express.Router();
const {Register,Login, googleAuth, deleteUser, getuserbyid, updateprofile, like, dislike, getAllusers }=require('../controllers/UserController.js');
const { AuthMiddleWare } = require('../Middlewares/AuthMiddleWare.js');
// Define user-related routes
router.post('/register', Register);
router.post('/login', Login)
router.post('/google',googleAuth)


router.put('/admin-panel/allusers/:id', updateprofile);

// Delete user
router.delete('/:id', AuthMiddleWare, deleteUser);

// Get a user
router.get('/admin-panel/allusers/:id', AuthMiddleWare, getuserbyid);

router.get('/admin-panel/allusers',getAllusers)

// Like a video
router.put('/like/:productId', AuthMiddleWare,like);

// Dislike a video
router.put('/dislike/:productId',AuthMiddleWare,dislike);

module.exports = router;











