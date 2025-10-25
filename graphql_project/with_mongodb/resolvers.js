import mongoose from "mongoose";
import brcypt from "bcrypt";
import jwt from "jsonwebtoken";

import "./models/User.js";
import "./models/Quote.js";
import { JWT_SECRET } from "./config.js";

const User = mongoose.model("User");
const Quote = mongoose.model("Quote");

export const resolvers = {
    Query: {
        users: async() => await User.find({}),
        user: async(_, {_id}) => await User.findOne({_id}),
        quotes: async() => await Quote.find({}),
    },

    User: {
        quotes: async(user) => Quote.find({by: user._id}) 
    },

    Mutation: {
        signupUser: async (_, {newUser}) => {
            const user = await User.findOne({email: newUser.email});
            if(user) {
                throw new Error ("User already exists in system");
            }

            const hashedPassword = await brcypt.hash(newUser.password, 12);

            const userNew = new User({
                ...newUser,
                password: hashedPassword
            })

            return await userNew.save();
        },

        signinUser: async (_, {signInUser}) => {
            const user = await User.findOne({email: signInUser.email});
            if(!user) {
              throw new Error("Invalid credentials");
            }

            const isMatched = await brcypt.compare(signInUser.password, user.password);

            if(!isMatched) {
                throw new Error("Invalid credentials");
            }

            const token = jwt.sign({userId: user._id}, JWT_SECRET);

            return {token};
        },

        createQuote: async (_, {content}, context) => {
            if(!context?.userId) {
                throw new Error("You must be logged in!");
            }
            const quote = new Quote({
                content,
                by: context.userId 
            })

            await quote.save();
            return "Quote created Successfully";
        }
    }
}