import { pool } from "../initAuth";

export const getAllUsers = async () => {
  try {
    const res = await pool.query("SELECT * FROM users");
    return res.rows;
  } catch (err) {
    console.error("Error fetching users:", err);
    throw new Error("Failed to fetch users");
  }
};

export const getUserById = async (firebase_uid: string) => {
  try {
    const res = await pool.query(
      "SELECT * FROM users WHERE firebase_uid = $1",
      [firebase_uid]
    );
    return res.rows[0];
  } catch (err) {
    console.error("Error fetching user by ID:", err);
    throw new Error("Failed to fetch user by ID");
  }
};

export const createUser = async (
  email: string,
  firebase_uid: string,
  is_author: boolean,
  username: string
) => {
  try {
    const res = await pool.query(
      "INSERT INTO users (email, firebase_uid, is_author, username) VALUES ($1, $2, $3, $4) RETURNING *",
      [email, firebase_uid, is_author, username]
    );
    return {
      success: true,
      user: res.rows[0],
    };
  } catch (err) {
    console.error("Error creating user:", err);
    throw new Error("Failed to create user");
  }
};

export const redeemCode = async (code: string, firebase_uid: string) => {
  try {
    // Fetch the user_id from the Users table using the firebase_uid
    const userRes = await pool.query(
      `
      SELECT id FROM Users WHERE firebase_uid = $1
      `,
      [firebase_uid]
    );

    if (userRes.rowCount === 0) {
      throw new Error("User not found");
    }

    const user_id = userRes.rows[0].id;

    // Now proceed with the purchase process
    const res = await pool.query(
      `
      WITH updated_code AS (
        UPDATE PurchaseCodes
        SET is_redeemed = TRUE
        WHERE code = $1 AND is_redeemed = FALSE
        RETURNING id, audio_file_id
      )
      INSERT INTO Purchases (user_id, purchase_code_id, audio_file_id)
      SELECT $2, id, audio_file_id FROM updated_code
      RETURNING *;
    `,
      [code, user_id]
    );

    return {
      success: true,
      purchase: res.rows[0],
    };
  } catch (err) {
    console.error("Error redeeming code:", err);
    throw new Error("Failed to redeem code");
  }
};

export const getRedeemedBooks = async (firebase_uid: string) => {
  try {
    // Fetch the user_id from the Users table using the firebase_uid
    const userRes = await pool.query(
      `
      SELECT id FROM Users WHERE firebase_uid = $1
      `,
      [firebase_uid]
    );

    if (userRes.rowCount === 0) {
      throw new Error("User not found");
    }

    const user_id = userRes.rows[0].id;

    // Now fetch the audio files associated with this user_id
    const res = await pool.query(
      `
      SELECT af.id, af.title, af.description, af.file_url, af.file_name, af.created_at, af.hls_path, af.cover_image_url, p.purchased_at
      FROM AudioFiles af
      INNER JOIN Purchases p ON af.id = p.audio_file_id
      WHERE p.user_id = $1;
      `,
      [user_id]
    );
    return res.rows;
  } catch (err) {
    console.error("Error fetching audio files:", err);
    throw new Error("Failed to fetch audio files");
  }
};

export const insertHlsName = async (
  hls_path: string,
  audio_file_id: string
) => {
  try {
    const res = await pool.query(
      `UPDATE AudioFiles SET hls_path = $1 WHERE id = $2 RETURNING *;`,
      [hls_path, audio_file_id]
    );
    return {
      success: true,
      result: res.rows[0],
    };
  } catch (err) {
    console.error("Error updating HLS path:", err);
    throw new Error("Failed to update HLS path");
  }
};

export const getUserAudioFiles = async (firebase_uid: string) => {
  try {
    const res = await pool.query(
      `
        SELECT
          p.id,
          p.user_id,
          p.purchase_code_id,
          p.audio_file_id,
          p.purchased_at,
          a.title AS audio_title,
          a.description AS audio_description,
          a.file_url AS audio_file_url,
          a.hls_path AS audio_hls_path,
          a.created_at AS audio_created_at,
          a.cover_image_url AS cover_image_url
        FROM Purchases p
        JOIN Users u ON p.user_id = u.id
        JOIN AudioFiles a ON p.id = a.id
        WHERE u.firebase_uid = $1;
      `,
      [firebase_uid]
    );

    return res.rows;
  } catch (err) {
    console.error(
      "Error fetching purchases with audio details by firebase_uid:",
      err
    );
    throw new Error("Failed to fetch purchases");
  }
};
