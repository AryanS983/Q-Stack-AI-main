const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const generateToken = (userID)=>{
    return jwt.sign({id: userID}, process.env.JWT_SECRET, {expiresIn: '7d'})
}

//@desc Register User
//@route POST /api/auth/register
//@access Public
const registerUser = async (req, res) => {
    try {
        const { name, email, password, profileImageUrl } = req.body

        //If user already exists
        const userExists = await User.findOne({ email })
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' })
        }

        //Hash password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        //create new user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            profileImageUrl
        })

        //return user data with Token
        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                profileImageUrl: user.profileImageUrl,
                token: generateToken(user._id)
            })
        }

    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message })
    }
}

//@desc Login User
//@route POST /api/auth/login
//@access Public
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email })

        if (user && (await bcrypt.compare(password, user.password))) {
            res.status(200).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                profileImageUrl: user.profileImageUrl,
                token: generateToken(user._id)
            })
        }else{
            res.status(500).json({message: 'Invalid credentials'})
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message })
    }
}

//@desc Get User Profile
//@route GET /api/auth/profile
//@access Private (Requires token)
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password")
        if(user){
            res.status(200).json(user)
        }else{
            res.status(404).json({message: 'User not found'})
        }
    } catch (error) {
        res.status(500).json({ message: 'Server f Error', error: error.message })
    }
}






module.exports = { registerUser, loginUser, getUserProfile }
