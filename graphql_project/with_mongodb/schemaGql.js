import {gql} from "apollo-server";

export const typeDefs = gql`
    type Query {
        users: [User]
        user(_id: ID!): User
        quotes: [Quote]
    }

    type User {
        _id: ID!
        firstName: String
        lastName: String
        email: String
        password: String
        quotes: [Quote]
    }

    type Quote {
        _id: ID!
        content: String
        by: ID
    }

    type Token {
        token: String
    }

    type Mutation {
        signupUser(newUser: UserInput!): User
        signinUser(signInUser: SigninInput!): Token
        createQuote(content: String!): String
    }

    input UserInput {
        firstName: String!
        lastName: String!
        email: String!
        password: String!
    }

    input SigninInput {
        email: String!
        password: String!
    }

`