import express, { RequestHandler } from "express";
import http from "http";
import cors from "cors";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { graphqlUploadExpress } from "graphql-upload-ts";
import { getAuth } from "firebase-admin/auth";
import jwt from "jsonwebtoken";
import { readFileSync } from "fs";
import { resolvers } from "./resolvers";
import { init, pool } from "./initAuth";
import cookieParser from "cookie-parser";

interface JwtPayload extends jwt.JwtPayload {
  userId: string;
}

init;
const app = express();
const httpServer = http.createServer(app);
app.use(cookieParser());

app.use(
  cors({
    origin: [
      "https://sandbox.embed.apollographql.com",
      "http://localhost:5173",
    ], // Allow requests from Apollo Studio
    credentials: true, // Allow credentials (cookies, authorization headers)
  })
);

pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

const verifyAuthToken = async (req, res, next) => {
  const authorizationHeader = req.headers.authorization || "";
  const headerToken = authorizationHeader.replace("Bearer ", "");
  const cookieToken = req.cookies.authToken;
  const token = headerToken || cookieToken;

  if (!token) {
    return next();
  }

  try {
    const decodedToken = await getAuth().verifyIdToken(token);
    req.user = { id: decodedToken.uid };

    return next();
  } catch (error) {
    if (error.code === "auth/id-token-expired") {
      return res
        .status(401)
        .json({ error: "Token has expired. Please log in again." });
    }

    // Attempt to verify the token using custom JWT verification
    try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      req.user = { id: decodedToken.userId };

      return next();
    } catch (jwtError) {
      // Handle JWT specific errors, including expiration
      if (jwtError.name === "TokenExpiredError") {
        res.clearCookie("authToken");
      }

      // Handle other JWT errors
      return res.status(401).json({ error: "Invalid or expired token" });
    }
  }
};

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
    verifyAuthToken,
    expressMiddleware(server, {
      context: async ({ req, res }) => {
        const user = req.user || null;
        return { req, res, user };
      },
    })
  );

  httpServer.listen({ port: 4000 }, () => {
    console.log(`🚀 Server ready at http://localhost:4000/`);
  });
});
