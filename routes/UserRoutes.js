import User from "../models/UserSchema.js";
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();

// Signup Route
router.post("/signup", async (req, res) => {
    try {
        let { FirstName, LastName, PhoneNumber, Email, Password } = req.body;

     

      
        if (!FirstName || !LastName || !PhoneNumber || !Email || !Password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if user already exists
        const isExistingUser = await User.findOne({ Email });
        if (isExistingUser) {
            return res.status(400).json({ message: "Email already in use" });
        }

        // Create new user (Password will be hashed automatically via schema)
        const newUser = await User.create({
            FirstName,
            LastName,
            PhoneNumber,
            Email,
            Password, // No need to hash again, as it's handled in schema pre-save
        });
        await newUser.save();
        return res.status(201).json({ message: "User registered successfully",newUser });

    } catch (error) {
        console.error("Error creating user:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

router.put("/edit/:id",async(req,res)=>{
    try{
            const editUser = await User.findByIdAndUpdate({
                _id: req.params.id
                },
                { $set: req.body },
                { new: true
                    
            })
            console.log("User update successfully",editUser);
            res.status(200).json({message:"User Updated Successfully",editUser});
    }catch(error){
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
})
// Login Route
router.post("/login", async (req, res) => {
    try {
        const { Email, Password } = req.body;

        // Validate input fields
        if (!Email || !Password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        // Find user by email
        const user = await User.findOne({ Email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Compare password using schema method
        const isMatch = await user.comparePassword(Password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Generate JWT Token
        const token = jwt.sign(
            { userId: user._id, email: user.Email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        
        res.cookie("authToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });

        return res.status(200).json({
            message: "Login successful",
            user: {
                id: user._id,
                FirstName: user.FirstName,
                LastName: user.LastName,
                Email: user.Email,
            },
            token, 
        });

    } catch (error) {
        console.error("Error logging in user:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

export default router;
