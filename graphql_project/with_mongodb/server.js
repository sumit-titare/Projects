import {ApolloServer} from "apollo-server";
import {ApolloServerPluginLandingPageGraphQLPlayground} from "apollo-server-core";
import {JWT_SECRET, MONGO_URL} from "./config.js";
import mongoose from "mongoose";
import {typeDefs} from "./schemaGql.js";
import { resolvers } from "./resolvers.js";
import jwt from "jsonwebtoken";


mongoose.connect(MONGO_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.connection.on("connected", () => {
    console.log("MongodB connected");
});

mongoose.connection.on("error", (error) => {
    console.log("Error connecting MongoDB", error);
});

// Context is a middleware that runs for every resolver
const context = ({req}) => {
    const {authorization} = req.headers;
    if(authorization){
        const token = authorization.replace("Bearer ", "");
        const {userId} = jwt.verify(token, JWT_SECRET);
        return {userId};
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context,
    plugins: [
        ApolloServerPluginLandingPageGraphQLPlayground
    ]
});

server.listen().then(({url}) => {
    console.log(`server started at ${url}`);
})