// 3rd's
import { FetchOptions } from 'ofetch'
import { AsyncDataOptions } from '#app'

// locals
import FetchFactory from '~/repository/factory'

type IAktivasiLink = {
  password: string;
}

class aktivasiLink extends FetchFactory<IAktivasiLink[]> {
  private RESOURCE = 'auth/register-link'

  /**
   * Return the products as array
   * @param asyncDataOptions options for `useAsyncData`
   * @returns
   */
  // eslint-disable-next-line require-await
  async postAktivasiLink (
    param : IAktivasiLink,
    userId: string,
    asyncDataOptions?: AsyncDataOptions<IAktivasiLink[]>
  ) {
    return useAsyncData(
      () => {
        const fetchOptions: FetchOptions<'json'> = {}
        return this.call(
          'POST',
          `${this.RESOURCE}/${userId}`,
          param, // body
          fetchOptions
        )
      },
      asyncDataOptions
    )
  }
}

export default aktivasiLink
