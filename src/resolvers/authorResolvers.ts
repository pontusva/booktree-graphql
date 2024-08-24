import { Request, Response } from "express";
import {
  isAuthor,
  becomeAuthor,
  insertBook,
  getAuthorBooks,
  insertPurchaseCodes,
  getPurchaseCodes,
  insertImageUrl,
} from "../userService/authorService";
import { GraphQLUpload } from "graphql-upload-ts";
import { v4 as uuidv4 } from "uuid";
import { uploadAudio } from "../endpoints/uploadAudio";
import { insertHlsName } from "../userService/userService";
import { getStorage } from "firebase-admin/storage";

export const authorResolvers = {
  Upload: GraphQLUpload,
  Query: {
    users: async (parent, { firebase_uid }, ctx) => {
      // Check for the presence of authToken or userId
      const authTokenPresent = !!ctx.req.cookies.authToken;
      const userIdPresent = !!(ctx.req.user && ctx.req.user.id);

      if (!authTokenPresent && !userIdPresent) {
        // Neither authToken nor userId is present
        throw new Error("Authentication required");
      }
      return await isAuthor(firebase_uid);
    },
    isAuthor: async (parent, { firebase_uid }, ctx) => {
      // Check for the presence of authToken or userId
      const authTokenPresent = !!ctx.req.cookies.authToken;
      const userIdPresent = !!(ctx.req.user && ctx.req.user.id);

      if (!authTokenPresent && !userIdPresent) {
        // Neither authToken nor userId is present
        throw new Error("Authentication required");
      }
      await isAuthor(firebase_uid);
    },
    getAuthorBooks: async (parent, { author_id }, ctx) => {
      // Check for the presence of authToken or userId
      const authTokenPresent = !!ctx.req.cookies.authToken;
      const userIdPresent = !!(ctx.req.user && ctx.req.user.id);

      if (!authTokenPresent && !userIdPresent) {
        // Neither authToken nor userId is present
        throw new Error("Authentication required");
      }
      return await getAuthorBooks(author_id);
    },
    getPurchaseCodes: async (parent, { author_id }, ctx) => {
      // Check for the presence of authToken or userId
      const authTokenPresent = !!ctx.req.cookies.authToken;
      const userIdPresent = !!(ctx.req.user && ctx.req.user.id);

      if (!authTokenPresent && !userIdPresent) {
        // Neither authToken nor userId is present
        throw new Error("Authentication required");
      }
      return await getPurchaseCodes(author_id);
    },
  },

  Mutation: {
    becomeAuthor: async (parent, { firebase_uid }, ctx) => {
      // Check for the presence of authToken or userId
      const authTokenPresent = !!ctx.req.cookies.authToken;
      const userIdPresent = !!(ctx.req.user && ctx.req.user.id);

      if (!authTokenPresent && !userIdPresent) {
        // Neither authToken nor userId is present
        throw new Error("Authentication required");
      }

      // Proceed if at least one of authToken or userId is present
      await becomeAuthor(firebase_uid);
    },

    insertPurchaseCodes: async (
      parent,
      { author_id, code, audio_file_id, expires_at, is_redeemed },
      ctx
    ) => {
      // Check for the presence of authToken or userId
      const authTokenPresent = !!ctx.req.cookies.authToken;
      const userIdPresent = !!(ctx.req.user && ctx.req.user.id);

      if (!authTokenPresent && !userIdPresent) {
        // Neither authToken nor userId is present
        throw new Error("Authentication required");
      }
      return await insertPurchaseCodes(
        author_id,
        code,
        audio_file_id,
        expires_at,
        is_redeemed
      );
    },

    processAudio: async (
      _: any,
      {
        authorId,
        title,
        fileUrl,
        fileName,
        description,
        docs,
        cover_image_url,
      }: {
        authorId: string;
        title: string;
        fileUrl: string;
        fileName: string;
        description?: string;
        docs;
        cover_image_url?: string;
      },
      ctx
    ) => {
      // Check for the presence of authToken or userId
      const authTokenPresent = !!ctx.req.cookies.authToken;
      const userIdPresent = !!(ctx.req.user && ctx.req.user.id);

      if (!authTokenPresent && !userIdPresent) {
        // Neither authToken nor userId is present
        throw new Error("Authentication required");
      }
      try {
        const insertBookResponse = await insertBook(
          Number(authorId),
          title,
          description || "", // Ensure description is a string, even if optional
          fileUrl,
          fileName,
          cover_image_url || ""
        );

        if (!insertBookResponse || !insertBookResponse.id) {
          throw new Error("Failed to insert book");
        }

        const newBookId = insertBookResponse.id;

        const req: Request = {
          body: { fileName },
        } as unknown as Request;

        const res: Partial<Response<any, Record<string, any>>> & {
          finished: boolean;
          response?: any;
        } = {
          status: function (statusCode: number) {
            this.statusCode = statusCode;
            return this;
          },
          json: function (response: any) {
            this.response = response;
            this.finished = true;
            return this;
          },
          response: undefined,
          send: function (message: any) {
            this.response = { error: message };
            this.finished = true;
            return this;
          },
          sendStatus: function (status: number) {
            this.statusCode = status;
            this.finished = true;
            return this;
          },
          finished: false,
        };

        const result = await new Promise<any>((resolve, reject) => {
          try {
            uploadAudio(req, res as Response<any, Record<string, any>>);

            const checkFinished = setInterval(() => {
              if (res.finished) {
                clearInterval(checkFinished);
                if (res.statusCode && res.statusCode >= 400) {
                  reject(new Error(res.response?.error || "Request failed"));
                } else {
                  resolve(res.response);
                }
              }
            }, 10);
          } catch (error) {
            reject(error);
          }
        });

        const hlsUrl = result?.hlsUrl;
        if (!hlsUrl) {
          throw new Error("Failed to get HLS URL");
        }

        await insertHlsName(hlsUrl, newBookId);
        const bucket = getStorage().bucket(process.env.BUCKET_NAME);
        const uploadedFiles = [];

        for (const doc of docs) {
          const { createReadStream, filename } = await doc.file;
          const destination = `${uuidv4()}/${doc.docType}-${filename}`;
          const file = bucket.file(destination);

          // Create a writable stream to the destination file in Google Cloud Storage
          const writeStream = file.createWriteStream({
            resumable: false, // Set to true if you want resumable uploads
          });

          // Pipe the file stream to the Google Cloud Storage stream
          createReadStream().pipe(writeStream);

          // Wait for the upload to complete
          await new Promise((resolve, reject) => {
            writeStream.on("finish", resolve);
            writeStream.on("error", reject);
          });

          // Generate a signed URL for the uploaded file
          const [fileUrl] = await file.getSignedUrl({
            action: "read",
            expires: "03-09-2491", // Set your desired expiration date
          });

          uploadedFiles.push({ filename, url: fileUrl });
        }

        insertImageUrl(uploadedFiles[0].url, newBookId);

        return {
          book: insertBookResponse,
          hlsUrl,
          success: true,
          files: uploadedFiles,
        };
      } catch (error) {
        throw new Error("Failed to process audio");
      }
    },
  },
};
