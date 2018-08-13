const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')

const { ApolloServer, gql } = require('apollo-server-express')
const { GraphQLServer } = require('graphql-yoga')
const { Prisma } = require('prisma-binding')
const { buildSchema } = require('graphql')

/*
var typeDefs = gql`
    type Query {
      globalQuery(
        budget {
          alloc: String
          amount: String
          food: String
          activities: String
        }
        in_out: String
        local_tourist: String
        food_activity: String
        NSFW: String
        days: String
        travelers: String
      )
    }
`;
*/
// var typeDefs = gql`
//   type Query {
//     globalQuery(request: String!): String
//   }
// `

const resolvers = {
  Query: {
    users: (_, args, context, info) => {
      return context.prisma.query.users
    }
  }
}

const server = new GraphQLServer({
  typeDefs: './server/src/schema.graphql',
  resolvers,
  context: req => ({
    ...req,
    db: new Prisma({
      typeDefs: './server/src/generated/prisma.graphql', // the auto-generated GraphQL schema of the Prisma API
      endpoint: 'http://localhost:4466', // the endpoint of the Prisma API
      debug: true // log all GraphQL queries & mutations sent to the Prisma API
      // secret: 'mysecret123', // only needed if specified in `database/prisma.yml`
    })
  })
})

server.start(() => console.log('Server is running on http://localhost:4000'))