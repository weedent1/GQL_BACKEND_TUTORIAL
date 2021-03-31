const { ApolloServer } = require('apollo-server');
const fs = require('fs');
const path = require('path');

// Moved schema to its own file
// const typeDefs = `
//   type Query {
//     info: String!
//     feed: [Link!]!
//   }

//   type Mutation {
//       post(url: String!, description: String!): Link!
//   }

//   type Link {
//       id: ID!
//       description: String!
//       url: String!
//   }
// `

let links = [
    {
        id: 'link-0',
        url: 'www.matc.edu',
        description: 'Milwaukee Area Technical College'
    },
    {
        id: 'link-1',
        url: 'www.matc.edu',
        description: 'Milwaukee Area Technical College'
    }
 ]

 let idCount = links.length;

const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`,
    feed: () => links,
    link: (parent, args) => links.find((link) => link.id === args.id)
  },
  Mutation: {
      post: (parent, args) => {
          const link = {
              id: `link-${idCount++}`,
              description: args.description,
              url: args.url,
          };
          links.push(link);
          return link;
      },
      updateLink: (parent, args) => {
        const link = links.find((link) => link.id === args.id);
        link.url = args.url;
        link.description = args.description;
        return link;
      },
      deleteLink: (parent, args) => {
        const linkIndex = links.findIndex((link) => link.id === args.id);
        const deletedLink = links[linkIndex];
        links = links.splice(linkIndex, 1);
        return deletedLink;
      }
  },
  // You can uncomment the code below but it isnt necessary for the code to run, graphql automaically does the following for us 
  // Uncommenting the code will not cause an error it will simply work the same as this is what gql does under the hood
  
  /*
  https://www.howtographql.com/graphql-js/2-a-simple-query/

On the first level, it invokes the feed resolver and returns the entire data stored in links. For the second execution level, the GraphQL server is smart enough to invoke the resolvers of the Link type (because thanks to the schema, it knows that feed returns a list of Link elements) for each element inside the list that was returned on the previous resolver level. Therefore, in all of the three Link resolvers, the incoming parent object is the element inside the links list.

Note: To learn more about this, check out this article.

In any case, because the implementation of the Link resolvers is trivial, you can actually omit them and the server will work in the same way as it did before 👌 We just wanted you to understand what’s happening under the hood 🚗
  */
//   Link: {
//       id: (parent) => parent.id,
//       description: (parent) => parent.description,
//       url: (parent) => parent.url
//   }
}

const server = new ApolloServer({
  typeDefs: fs.readFileSync(
      path.join(__dirname, 'schema.gql'),
      'utf8'
  ),
  resolvers,
})

server
  .listen()
  .then(({ url }) =>
    console.log(`Server is running on ${url}`)
  );