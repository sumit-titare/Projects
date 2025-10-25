import { ApolloServer, gql } from "apollo-server";
import {ApolloServerPluginLandingPageGraphQLPlayground} from "apollo-server-core";
import {users, quotes} from "./fakedb.js";

const typeDefs = gql`
    type Query{
        users: [User]
        user(id:ID!): User
        quotes: [Quote]
    }

    type User{
        id: ID!
        firstName: String
        lastName: String
        email: String
        quotes: [Quote]
    }

    type Quote{
        id: ID!
        content: String
        by: ID
    }
`

const resolvers = {
    Query: {
        users: () => users,
        user:(_, {id}) => users.find(user => user.id == id),
        quotes: () => quotes
    },

    User: {
        quotes: (user) => quotes.filter(quote => quote.by == user.id)
    }
}


const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [
        ApolloServerPluginLandingPageGraphQLPlayground
    ]
});

server.listen().then(({url}) => {
    console.log(`Server started at ${url}`);
})