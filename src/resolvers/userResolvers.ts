import {
  createUser,
  getAllUsers,
  getUserById,
  redeemCode,
  getRedeemedBooks,
  insertHlsName,
  getUserAudioFiles,
} from "../userService/userService";

export const userResolvers = {
  Query: {
    users: async () => {
      return await getAllUsers();
    },
    userById: async (parent, { id }) => {
      return await getUserById(id);
    },
    getRedeemedBooks: async (parent, { firebase_uid }, ctx) => {
      return await getRedeemedBooks(ctx.uid);
    },
    getUserAudioFiles: async (parent, { firebase_uid }, ctx) => {
      return await getUserAudioFiles(firebase_uid);
    },
  },

  Mutation: {
    createUser: async (
      parent,
      { email, firebase_uid, is_author, username }
    ) => {
      return await createUser(email, firebase_uid, is_author, username);
    },
    redeemCode: async (parent, { code, firebase_uid }) => {
      return await redeemCode(code, firebase_uid);
    },
  },
};
