import { pool } from '../initAuth'

export const updatePlaybackProgress = async (
  firebase_uid: string,
  audio_file_id: number,
  progress_seconds: number
) => {
  try {
    const res = await pool.query(
      `INSERT INTO PlaybackProgress (firebase_uid, audio_file_id, progress_seconds)
       VALUES ($1, $2, $3)
       ON CONFLICT (firebase_uid, audio_file_id) 
       DO UPDATE SET 
         progress_seconds = EXCLUDED.progress_seconds, 
         last_updated = CURRENT_TIMESTAMP
       RETURNING *`,
      [firebase_uid, audio_file_id, progress_seconds]
    )

    return {
      success: true,
      progress: res.rows[0]
    }
  } catch (err) {
    console.error('Error updating playback progress:', err)
    throw new Error('Failed to update playback progress')
  }
}
