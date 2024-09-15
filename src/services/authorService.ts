import { pool } from '../initAuth'

export const isAuthor = async (firebase_uid: string) => {
  try {
    const res = await pool.query(
      'SELECT * FROM users WHERE firebase_uid = $1 AND is_author = TRUE',
      [firebase_uid]
    )

    return res.rows[0]
  } catch (err) {
    console.error('Error fetching users:', err)
    throw new Error('Failed to fetch users')
  }
}
export const becomeAuthor = async (
  firebase_uid: string
) => {
  try {
    const res = await pool.query(
      'UPDATE users SET is_author = TRUE WHERE firebase_uid = $1 RETURNING *;',
      [firebase_uid]
    )
    return res.rows[0]
  } catch (err) {
    console.error('Error updating user to author:', err)
    throw new Error('Failed to update user to author')
  }
}

export const insertBook = async (
  author_id: number,
  title: string,
  description: string,
  file_url: string,
  file_name: string,
  cover_image_url: string
) => {
  try {
    const res = await pool.query(
      `INSERT INTO AudioFiles (author_id, title, description, file_url, file_name, cover_image_url)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;`,
      [
        author_id,
        title,
        description,
        file_url,
        file_name,
        cover_image_url
      ]
    )

    return res.rows[0]
  } catch (err) {
    console.error('Error inserting book:', err)
    throw new Error('Failed to insert book')
  }
}

export const updateAuthor = async (
  firebase_uid: string,
  bio: string,
  profile_picture_url: string,
  contact_info: string
) => {
  // Retrieve user from the database using firebase_uid
  const user = await pool.query(
    'SELECT id FROM users WHERE firebase_uid = $1',
    [firebase_uid]
  )

  if (user.rows.length === 0) {
    throw new Error('User not found')
  }

  const userId = user.rows[0].id

  // Check if the author entry exists
  const existingAuthor = await pool.query(
    'SELECT * FROM authors WHERE user_id = $1',
    [userId]
  )

  if (existingAuthor.rows.length > 0) {
    // If the author exists, update the entry
    const updatedAuthor = await pool.query(
      `UPDATE authors
       SET bio = $1, profile_picture_url = $2, contact_info = $3
       WHERE user_id = $4
       RETURNING *`,
      [bio, profile_picture_url, contact_info, userId]
    )
    return updatedAuthor.rows[0]
  } else {
    // If the author does not exist, insert a new entry
    const newAuthor = await pool.query(
      `INSERT INTO authors (user_id, bio, profile_picture_url, contact_info)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [userId, bio, profile_picture_url, contact_info]
    )
    return newAuthor.rows[0]
  }
}

export const getAuthorBooks = async (
  firebase_uid: string
) => {
  try {
    const authorRes = await pool.query(
      `
      SELECT id FROM Users WHERE firebase_uid = $1
      `,
      [firebase_uid]
    )

    if (authorRes.rowCount === 0) {
      throw new Error('Author not found')
    }

    const author_id = authorRes.rows[0].id

    const res = await pool.query(
      'SELECT * FROM AudioFiles WHERE author_id = $1',
      [author_id]
    )
    return res.rows
  } catch (err) {
    console.error('Error fetching users:', err)
    throw new Error('Failed to fetch users')
  }
}

export const getAuthor = async (firebase_uid: string) => {
  try {
    // Query to get author details by joining Users and Authors tables
    const authorRes = await pool.query(
      `SELECT u.id AS userId, 
       a.user_id AS authorId, 
       a.bio, 
       a.profile_picture_url AS "profilePictureUrl", 
       a.contact_info 
        FROM Users u
        JOIN Authors a ON u.id = a.user_id
        WHERE u.firebase_uid = $1`,
      [firebase_uid]
    )

    if (authorRes.rowCount === 0) {
      throw new Error('Author not found')
    }
    console.log(authorRes.rows[0])
    // Return the author details
    return authorRes.rows[0]
  } catch (err) {
    console.error('Error fetching author:', err)
    throw new Error('Failed to fetch author')
  }
}

export const insertPurchaseCodes = async (
  author_id: string,
  code: string,
  audio_file_id: string,
  expires_at: string,
  is_redeemed: boolean
) => {
  try {
    const res = await pool.query(
      'INSERT INTO PurchaseCodes (author_id, code, audio_file_id, expires_at, is_redeemed) VALUES ($1, $2, $3, $4, $5) RETURNING *;',
      [
        author_id,
        code,
        audio_file_id,
        expires_at,
        is_redeemed
      ]
    )
    return {
      success: true
    }
  } catch (err) {
    console.error('Error fetching users:', err)
    throw new Error('Failed to fetch users')
  }
}

export const getPurchaseCodes = async (
  firebase_uid: string
) => {
  try {
    const authorRes = await pool.query(
      `
      SELECT id FROM Users WHERE firebase_uid = $1
      `,
      [firebase_uid]
    )

    if (authorRes.rowCount === 0) {
      throw new Error('Author not found')
    }

    const author_id = authorRes.rows[0].id

    const res = await pool.query(
      `SELECT
            af.title,
            pc.code,
            pc.id,
            pc.is_redeemed,
            pc.expires_at,
            pc.created_at,
            af.author_id,
            af.id AS audio_file_id
                FROM
                AudioFiles af
                JOIN
                PurchaseCodes pc
                ON
            af.id = pc.audio_file_id
                WHERE
    af.author_id = $1;`,
      [author_id]
    )
    return res.rows
  } catch (err) {
    console.error('Error fetching users:', err)
    throw new Error('Failed to fetch users')
  }
}

export const insertImageUrl = async (
  image_url: string,
  audiofile_id: string
) => {
  try {
    const res = await pool.query(
      'UPDATE audiofiles SET cover_image_url = $1 WHERE id = $2 RETURNING *',
      [image_url, audiofile_id]
    )

    return {
      success: true,
      audiofile: res.rows[0] // Returning the updated row
    }
  } catch (err) {
    console.error('Error updating audiofile:', err)
    throw new Error('Failed to update audiofile')
  }
}
