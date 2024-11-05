import { Auth } from "constants/types"

export async function setToken ({ auth, uploadMaxSize }: { auth: Auth, uploadMaxSize: number }) {
  return await useFetch('/fakeapi/token', {
    method: 'post',
    body: {
      auth,
      uploadMaxSize
    }
  })
}

export async function removeToken () {
  return await useFetch('/fakeapi/token', {
    method: 'delete'
  })
}
