import express from "express";
import http from "http";
import cors from "cors";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { graphqlUploadExpress } from "graphql-upload-ts";
import admin from "firebase-admin";
import jwt from "jsonwebtoken";
import { readFileSync } from "fs";
import { resolvers } from "./resolvers";
import { init, pool } from "./initAuth";

interface JwtPayload extends jwt.JwtPayload {
  userId: string;
}

init;
const app = express();
const httpServer = http.createServer(app);

app.use(cors());

pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

const verifyAuthToken = async (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.split(" ")[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = { id: decodedToken.uid };
    next();
  } catch (firebaseError) {
    try {
      const decodedToken = jwt.verify(
        token,
        process.env.JWT_SECRET
      ) as JwtPayload;
      req.user = { id: decodedToken.userId };
      next();
    } catch (jwtError) {
      console.error("Token verification failed:", jwtError);
      res.status(401).json({ error: "Invalid or expired token" });
    }
  }
};

app.use(verifyAuthToken);

const typeDefs = readFileSync("./schema.graphql", { encoding: "utf-8" });

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

server.start().then(() => {
  app.use(
    "/",
    graphqlUploadExpress({
      maxFileSize: 10000000,
      maxFiles: 10,
      overrideSendResponse: false,
    })
  );

  app.use(
    "/",
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        // User will be available from the middleware
        console.log(req.user);
        return { user: req.user };
      },
    })
  );

  httpServer.listen({ port: 4000 }, () => {
    console.log(`🚀 Server ready at http://localhost:4000/`);
  });
});
