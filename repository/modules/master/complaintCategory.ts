import { AsyncDataOptions } from '#app'
import FetchFactory from '~/repository/factory'

class ComplaintCategoryModule extends FetchFactory<any> {
  private RESOURCE = 'complaint-category'

  async getList (params?: Object, asyncDataOptions?: AsyncDataOptions<any>) {
    return useAsyncData(() => {
      return this.call(
        'GET',
        this.RESOURCE,
        undefined,
        undefined,
        params
      )
    }, asyncDataOptions)
  }
}

export default ComplaintCategoryModule
