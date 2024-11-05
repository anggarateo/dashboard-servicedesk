import { Auth } from "../../../constants/types"

export default defineEventHandler(async event => {
  const body: {
    auth: Auth,
    uploadMaxSize: number
  } = await readBody(event)

  setCookie(event, 'max_upload_bytes', body.uploadMaxSize.toString(), {
    maxAge: process.env.COOKIE_MAX_AGE ? parseInt(process.env.COOKIE_MAX_AGE) : body.auth.expires_in
  })

  return setCookie(event, 'auth', JSON.stringify(body.auth), {
    maxAge: process.env.COOKIE_MAX_AGE ? parseInt(process.env.COOKIE_MAX_AGE) : body.auth.expires_in
  })
})
