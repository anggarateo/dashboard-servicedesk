export default defineEventHandler(event => {
  return getCookie(event, 'auth') || null
})
