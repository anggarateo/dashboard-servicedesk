/* eslint-disable require-await */
// 3rd's
import { FetchOptions } from 'ofetch'
import { AsyncDataOptions } from '#app'

// locals
import FetchFactory from '~/repository/factory'

class UserModule extends FetchFactory<any> {
  private RESOURCE = 'user'

  /**
   * Return the products as array
   * @param asyncDataOptions options for `useAsyncData`
   * @returns
   */
  async getUser (
    param: any,
    query: any,
    asyncDataOptions?: AsyncDataOptions<any>
  ) {
    return useAsyncData(
      () => {
        const fetchOptions: FetchOptions<'json'> = {}
        return this.call(
          'GET',
          `${this.RESOURCE}/list`,
          param,
          fetchOptions,
          query
        )
      },
      asyncDataOptions
    )
  }

  async getDetailUser (
    id: number,
    param: any,
    query: any,
    asyncDataOptions?: AsyncDataOptions<any>
  ) {
    return useAsyncData(
      () => {
        const fetchOptions: FetchOptions<'json'> = {}
        return this.call(
          'GET',
          `${this.RESOURCE}/${id}`,
          param,
          fetchOptions,
          query
        )
      },
      asyncDataOptions
    )
  }

  // eslint-disable-next-line require-await
  async updateContent (
    id: string,
    param: any,
    asyncDataOptions?: AsyncDataOptions<any>
  ) {
    return useAsyncData(
      () => {
        const fetchOptions: FetchOptions<'json'> = {}
        return this.call(
          'PATCH',
          `${this.RESOURCE}/${id}`,
          param,
          fetchOptions
        )
      },
      asyncDataOptions
    )
  }
}

export default UserModule
