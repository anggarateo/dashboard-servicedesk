/* eslint-disable require-await */
// 3rd's
import { FetchOptions } from 'ofetch'
import { AsyncDataOptions } from '#app'

// locals
import FetchFactory from '~/repository/factory'

class ReportModule extends FetchFactory<any> {
  private RESOURCE = 'trans/ticket/report'

  /**
   * Return the products as array
   * @param asyncDataOptions options for `useAsyncData`
   * @returns
   */
  async getReportType (
    params: any,
    asyncDataOptions?: AsyncDataOptions<any>
  ) {
    return useAsyncData(
      () => {
        return this.call(
          'GET',
          `${this.RESOURCE}/mapping-laporan`,
          undefined,
          undefined,
          params
        )
      },
      asyncDataOptions
    )
  }
}

export default ReportModule
