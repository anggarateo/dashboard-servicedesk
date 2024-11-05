/* eslint-disable require-await */
// 3rd's
import { AsyncDataOptions } from '#app'
import { FetchOptions } from 'ofetch'

// locals
import FetchFactory from '~/repository/factory'

class NotificationModule extends FetchFactory<any> {
  private RESOURCE = 'notif'

  async getByUser (
    param: any,
    query: any,
    asyncDataOptions?: AsyncDataOptions<any>
  ) {
    return useAsyncData(
      () => {
        const fetchOptions: FetchOptions<'json'> = {}
        return this.call(
          'GET',
          `${this.RESOURCE}`,
          param,
          fetchOptions,
          query
        )
      },
      asyncDataOptions
    )
  }

  // eslint-disable-next-line require-await
  async readNotif (
    param : any,
    asyncDataOptions?: AsyncDataOptions<any>
  ) {
    return useAsyncData(
      () => {
        return this.call(
          'POST',
          `${this.RESOURCE}/read/${param.id}`,
          param // body
        )
      },
      asyncDataOptions
    )
  }

  async total (
    params?: any,
    asyncDataOptions?: AsyncDataOptions<any>
  ) {
    return useAsyncData(
      () => {
        return this.call(
          'GET',
          `${this.RESOURCE}/total`,
          undefined,
          undefined,
          params
        )
      },
      asyncDataOptions
    )
  }

  async readAll (
    asyncDataOptions?: AsyncDataOptions<any>
  ) {
    return useAsyncData(
      () => {
        return this.call(
          'POST',
          `${this.RESOURCE}/read-all`
        )
      },
      asyncDataOptions
    )
  }
}

export default NotificationModule
