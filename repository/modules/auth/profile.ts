import { AsyncDataOptions } from '#app'
import FetchFactory from '~/repository/factory'

class ProfileModule extends FetchFactory<any> {
  private RESOURCE = 'auth/'

  /**
   * Return the products as array
   * @param asyncDataOptions options for `useAsyncData`
   * @returns
   */
  async getProfile (asyncDataOptions?: AsyncDataOptions<any>) {
    return useAsyncData(() => {
      return this.call(
        'GET',
        `${this.RESOURCE}profile`
      )},
      asyncDataOptions
    )
  }

  async updateProfile (body: Object, asyncDataOptions?: AsyncDataOptions<any>) {
    return useAsyncData(() => {
      return this.call(
        'POST',
        `${this.RESOURCE}update-profile`,
        body
      )},
      asyncDataOptions
    )
  }
}

export default ProfileModule