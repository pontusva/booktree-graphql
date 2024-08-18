import { ApolloServer } from "@apollo/server";
// import { startStandaloneServer } from "@apollo/server/standalone";
import { init } from "./initAuth";
import { readFileSync } from "fs";
import { pool } from "./initAuth";
import { uploadAudio } from "./endpoints/uploadAudio";
import { resolvers } from "./resolvers";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { graphqlUploadExpress } from "graphql-upload-ts";
import auth from "firebase-admin";

import express from "express";
import http from "http";
import cors from "cors";
init;
const app = express();
const httpServer = http.createServer(app);
pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

const verifyIdToken = async (req, res, next) => {
  const idToken = req.headers.authorization?.split(" ")[1];
  if (!idToken) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decodedToken = await auth.auth().verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

const typeDefs = readFileSync("./schema.graphql", { encoding: "utf-8" });

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

await server.start();

app.use(
  "/",
  graphqlUploadExpress({
    maxFileSize: 10000000,
    maxFiles: 10,
    // If you are using framework around express like [ NestJS or Apollo Serve ]
    // use this options overrideSendResponse to allow nestjs to handle response errors like throwing exceptions
    overrideSendResponse: false,
  })
);

app.use(
  "/",
  cors<cors.CorsRequest>(),
  express.json(),
  expressMiddleware(server, {
    context: async ({ req }) => {
      const token = req.headers.authorization || "";
      let uid: string | null = null;

      try {
        if (token) {
          const decodedToken = await auth
            .auth()
            .verifyIdToken(token.replace("Bearer ", ""));
          uid = decodedToken.uid;
        }
      } catch (error) {
        console.error("Token verification failed:", error);
      }

      return { uid }; // Provide UID to resolvers via context
    },
  })
);
app.use(graphqlUploadExpress);

app.post("/api/request-audio", uploadAudio);

await new Promise<void>((resolve) =>
  httpServer.listen({ port: 4000 }, resolve)
);

console.log(`🚀 Server ready at http://localhost:4000/`);
