/* eslint-disable require-await */
// 3rd's
import { AsyncDataOptions } from '#app'

// locals
import FetchFactory from '~/repository/factory'

class GlobalModule extends FetchFactory<any> {
  private RESOURCE = 'service/group'
  private RUNIT = 'unit-of-work'
  private RPOSITION = 'position'

  /**
   * Return the products as array
   * @param asyncDataOptions options for `useAsyncData`
   * @returns
   */
  async getUnitOfWork (
    params?: any,
    asyncDataOptions?: AsyncDataOptions<any>
  ) {
    return useAsyncData(
      () => {
        return this.call(
          'GET',
          `${this.RUNIT}`,
          undefined,
          undefined,
          params
        )
      },
      asyncDataOptions
    )
  }

  async updateUnitOfWork (
    id: string,
    body: any,
    asyncDataOptions?: AsyncDataOptions<any>
  ) {
    return useAsyncData(
      () => {
        return this.call(
          'PATCH',
          `${this.RUNIT}/${id}`,
          body
        )
      },
      asyncDataOptions
    )
  }

  async syncUnitOfWork (
    asyncDataOptions?: AsyncDataOptions<any>
  ) {
    return useAsyncData(
      () => {
        return this.call(
          'POST',
          'sync/units-of-work',
          {
            bcare: 'passwordnya'
          },
          undefined,
          undefined,
          {
            'AccessKey': 'b7satmve4i',
            'User-Agent': 'MANTRA'
          }
        )
      },
      asyncDataOptions
    )
  }

  async getPositinOfWork (
    params?: any,
    asyncDataOptions?: AsyncDataOptions<any>
  ) {
    return useAsyncData(
      () => {
        return this.call(
          'GET',
          `${this.RPOSITION}`,
          undefined,
          undefined,
          params
        )
      },
      asyncDataOptions
    )
  }

  async getTeams (params?: any, asyncDataOptions?: AsyncDataOptions<any>) {
    return useAsyncData(() => {
      return this.call(
        'GET',
        'user/my-team',
        undefined,
        undefined,
        params
      )
    })
  }

  async getTicketAgent (idAgent: String, asyncDataOptions?: AsyncDataOptions<any>) {
    return useAsyncData(() => {
      return this.call(
        'GET',
        `user/my-team/ticket-agent/${idAgent}`
      )
    })
  }

  async getConfig (params?: object, asyncDataOptions?: AsyncDataOptions<any>) {
    return useAsyncData(() => {
      return this.call(
        'GET',
        'config',
        undefined,
        undefined,
        params
      )
    }, asyncDataOptions)
  }

  async updateConfig (id: string, body: object, asyncDataOptions?: AsyncDataOptions<any>) {
    return useAsyncData(() => {
      return this.call(
        'PATCH',
        `config/${id}`,
        body
      )
    }, asyncDataOptions)
  }
}

export default GlobalModule
