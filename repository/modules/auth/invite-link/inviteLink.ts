// 3rd's
import { FetchOptions } from 'ofetch'
import { AsyncDataOptions } from '#app'

// locals
import FetchFactory from '~/repository/factory'

type IInviteLink = {
  sending_email: string;
  role_id: string;
  expired_date: string;
  note: string;
}

class InviteLinkModule extends FetchFactory<IInviteLink[]> {
  private RESOURCE = 'auth/invite-link'

  /**
   * Return the products as array
   * @param asyncDataOptions options for `useAsyncData`
   * @returns
   */

  // eslint-disable-next-line require-await
  async getInviteLink (
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
  async getInviteLinkContent (
    param : IInviteLink,
    asyncDataOptions?: AsyncDataOptions<IInviteLink[]>
  ) {
    return useAsyncData(
      () => {
        const fetchOptions: FetchOptions<'json'> = {}
        return this.call(
          'POST',
          `${this.RESOURCE}/content`,
          param, // body
          fetchOptions
        )
      },
      asyncDataOptions
    )
  }

  // eslint-disable-next-line require-await
  async postInviteLink (
    param : IInviteLink,
    asyncDataOptions?: AsyncDataOptions<IInviteLink[]>
  ) {
    return useAsyncData(
      () => {
        const fetchOptions: FetchOptions<'json'> = {}
        return this.call(
          'POST',
          `${this.RESOURCE}`,
          param, // body
          fetchOptions
        )
      },
      asyncDataOptions
    )
  }

  async getInvitedLink (uuid: String, asyncDataOptions?: AsyncDataOptions<any>) {
    return useAsyncData(() => {
      return this.call(
        'GET',
        `${this.RESOURCE}/${uuid}`
      )
    }, asyncDataOptions)
  }
}

export default InviteLinkModule
