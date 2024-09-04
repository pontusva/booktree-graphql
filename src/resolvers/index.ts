import { mergeResolvers } from '@graphql-tools/merge'
import { userResolvers } from './userResolvers'
import { authorResolvers } from './authorResolvers'
import { Resolvers } from '../generated/graphql'
import { generelResolvers } from './generalResolvers'

export const resolvers: Resolvers = mergeResolvers([
  userResolvers,
  authorResolvers,
  generelResolvers
])
