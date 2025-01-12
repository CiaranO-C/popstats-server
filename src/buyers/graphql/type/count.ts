import { GraphQLInt, GraphQLObjectType } from "graphql";


const Count = new GraphQLObjectType({
    name: "BuyersCount",
    fields: {
        all: { type: GraphQLInt },
        repeat: { type: GraphQLInt }
    }
})