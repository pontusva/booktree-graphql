const { ApolloServer } = require("@apollo/server");
const { readFileSync } = require("fs");
const express = require("express");
const http = require("http");
const cors = require("cors");
const { expressMiddleware } = require("@apollo/server/express4");
const {
  ApolloServerPluginDrainHttpServer,
} = require("@apollo/server/plugin/drainHttpServer");
const { graphqlUploadExpress } = require("graphql-upload-ts");
const admin = require("firebase-admin");

// Import your custom modules
const { init } = require("./initAuth");
const { pool } = require("./initAuth");
const { uploadAudio } = require("./endpoints/uploadAudio");
const { resolvers } = require("./resolvers");

// Initialize Firebase Admin SDK
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
    const decodedToken = await admin.auth().verifyIdToken(idToken);
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

(async () => {
  await server.start();

  app.use(
    "/",
    graphqlUploadExpress({
      maxFileSize: 10000000,
      maxFiles: 10,
      // If you are using a framework around express like NestJS or Apollo Server
      // use this option overrideSendResponse to allow NestJS to handle response errors like throwing exceptions
      overrideSendResponse: false,
    })
  );

  app.use(
    "/",
    cors(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        const token = req.headers.authorization || "";
        let uid = null;

        try {
          if (token) {
            const decodedToken = await admin
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

  app.post("/api/request-audio", uploadAudio);

  await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));

  console.log(`🚀 Server ready at http://localhost:4000/`);
})();
