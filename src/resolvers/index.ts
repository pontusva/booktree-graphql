import { mergeResolvers } from "@graphql-tools/merge";
import { userResolvers } from "./userResolvers";
import { authorResolvers } from "./authorResolvers";
import { Resolvers } from "../generated/graphql";

export const resolvers: Resolvers = mergeResolvers([
  userResolvers,
  authorResolvers,
]);
