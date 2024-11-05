export default defineEventHandler(event => {
  return deleteCookie(event, 'auth')
})
