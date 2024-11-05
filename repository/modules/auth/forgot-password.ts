import { AsyncDataOptions } from '#app'
import FetchFactory from '~/repository/factory'

class ForgotPasswordModule extends FetchFactory<any> {
  private RESOURCE = 'auth/forgot-password'

  async request (body: { email: String }, asyncDataOptions?: AsyncDataOptions<any>) {
    return useAsyncData(() => {
      return this.call(
        'POST',
        `${this.RESOURCE}-send`,
        body
      )}, asyncDataOptions
    )
  }

  async resetPassword (body: { token: any, password: String }, asyncDataOptions?: AsyncDataOptions<any>) {
    return useAsyncData(() => {
      return this.call(
        'POST',
        `${this.RESOURCE}/save`,
        body
      )}, asyncDataOptions
    )
  }
}

export default ForgotPasswordModule
