import { initializeApp } from 'firebase/app'
import { getDatabase, ref, onValue } from 'firebase/database'
import { uniqBy, orderBy, differenceBy } from 'lodash'

export default defineNuxtPlugin((nuxtApp) => {
  const app = initializeApp(nuxtApp.$config.public.firebaseConfig)
  const db = getDatabase(app)

  let root
  nuxtApp.$config.public.apiBaseUrl.includes('manggala') ?
    root = 'dev-etech' : process.env.NODE_ENV === 'production' ?
      root = 'prod' : root = 'dev-bp'
  console.log('fb:', root)

  const user = localStorage.getItem('user')
  const userRoles = JSON.parse(user || '{}')?.roles || null
  if (!userRoles?.length) return
  
  console.log('ROLE_FROM_FIREBASE', nuxtApp.$config.public.roleFromFirebase)
  if (nuxtApp.$config.public.roleFromFirebase === 'true') {
    onValue(ref(db, `${root}/roles`), (snapshot) => {
      /**
       * data from firebase
       */
      const data = snapshot.val()
      if (!data) return

      let merged = Array(), concated

      for (let i = 0; i < userRoles.length; i++) {
        merged.push(data[userRoles[i].id].menus)
      }

      concated = merged.reduce((a, b) => a.concat(b))
      const uniq = uniqBy(concated, 'merge_name')
      const uniqasc = orderBy(uniq.filter((el: any) => el.is_active), ['merge_name'], ['asc'])

      /**
       * data from localstorage
       */
      const localRole = localStorage.getItem('permissions')
      const roles = JSON.parse(localRole || '{}')
      const local = uniqBy(roles.menus, 'merge_name')
      const localasc = orderBy(local.filter((el: any) => el.is_active), ['merge_name'], ['asc'])

      /**
       * check different data between firebase and localstorage
       */
      const isDifferentA = differenceBy(uniqasc, localasc, 'merge_name')
      const isDifferentB = differenceBy(localasc, uniqasc, 'merge_name')

      /**
       * set localstorage
       */
      if (localRole && (isDifferentA.length || isDifferentB.length)) {
        const permissions = {
          roles: userRoles,
          menus: uniq
        }

        localStorage.setItem('permissions', JSON.stringify(permissions))
        reloadNuxtApp({ ttl: 1000 })
      }
    })
  }
})