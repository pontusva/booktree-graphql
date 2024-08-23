import { pool } from "./initAuth";
import bcrypt from "bcrypt";

// Initialize the PostgreSQL connection pool

// Hash the password
const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

// Insert user into the database
export const insertUser = async (email, password) => {
  const hashedPassword = await hashPassword(password);
  const client = await pool.connect();

  try {
    await client.query(
      "INSERT INTO graphql (email, password) VALUES ($1, $2)",
      [email, hashedPassword]
    );
    console.log("User inserted successfully");
  } catch (error) {
    console.error("Error inserting user:", error);
  } finally {
    client.release();
  }
};
