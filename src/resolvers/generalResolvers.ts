import { updatePlaybackProgress } from '../services/playbackProgress'

export const generelResolvers = {
  Mutation: {
    updatePlaybackProgress: async (
      parent,
      { firebase_uid, audio_file_id, progress_seconds },
      ctx
    ) => {
      // Check for the presence of authToken or userId
      const authTokenPresent = !!ctx.req.cookies.authToken
      const userIdPresent = !!(
        ctx.req.user && ctx.req.user.id
      )

      if (!authTokenPresent && !userIdPresent) {
        // Neither authToken nor userId is present
        throw new Error('Authentication required')
      }

      // Proceed if at least one of authToken or userId is present
      return await updatePlaybackProgress(
        firebase_uid,
        audio_file_id,
        progress_seconds
      )
    }
  }
}
