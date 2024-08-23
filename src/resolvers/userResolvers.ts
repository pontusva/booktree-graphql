import {
  createUser,
  getAllUsers,
  getUserById,
  redeemCode,
  getRedeemedBooks,
  getUserAudioFiles,
} from "../userService/userService";
import bcrypt from "bcrypt";
import { pool } from "../initAuth";
import jwt from "jsonwebtoken";

export const userResolvers = {
  Query: {
    users: async (parent, args, ctx) => {
      if (!ctx.user) {
        throw new Error("Authentication required");
      }
      return await getAllUsers();
    },
    userById: async (parent, { id }, ctx) => {
      if (!ctx.user) {
        throw new Error("Authentication required");
      }
      return await getUserById(id);
    },
    getRedeemedBooks: async (parent, { firebase_uid }, ctx) => {
      if (!ctx.user) {
        throw new Error("Authentication required");
      }
      return await getRedeemedBooks(firebase_uid);
    },
    getUserAudioFiles: async (parent, { firebase_uid }, ctx) => {
      if (!ctx.user) {
        throw new Error("Authentication required");
      }
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
    async login(parent, { email, password }) {
      try {
        const res = await pool.query(
          "SELECT id, email, password FROM graphql WHERE email = $1",
          [email]
        );

        if (res.rows.length === 0) {
          throw new Error("User not found");
        }

        const user = res.rows[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          throw new Error("Invalid email or password");
        }

        // Generate a JWT token
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
          expiresIn: "1h",
        });
        return {
          token,
          user: {
            id: user.id,
            email: user.email,
          },
        };
      } catch (err) {
        console.error("Error logging in:", err);
        throw new Error("Failed to login");
      }
    },
  },
};
