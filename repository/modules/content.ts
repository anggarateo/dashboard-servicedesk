// 3rd's
import { FetchOptions } from 'ofetch'
import { AsyncDataOptions } from '#app'

// locals
import FetchFactory from '~/repository/factory'

class ContentModule extends FetchFactory<any> {
  private RESOURCE = 'content'

  /**
   * Return the products as array
   * @param asyncDataOptions options for `useAsyncData`
   * @returns
   */
  // eslint-disable-next-line require-await
  async getContent (
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
  async getDetailContent (
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

export default ContentModule
