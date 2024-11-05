// 3rd's
import { AsyncDataOptions } from '#app'

// locals
import FetchFactory from '~/repository/factory'

type ILogin = {
  email: string;
  password: string;
}
interface ApiResponse {
  data: {
    authorization:{
      type: string,
      token: string,
      expired_date: string,
      expires_in: number
    },
    user:{
      avatar: string
    },
    max_upload_bytes: number
  };
  request_at: string;
  message: string;
  version: string;
}

class LoginModule extends FetchFactory<ApiResponse> {
  private RESOURCE = 'auth/login'

  /**
   * Return the products as array
   * @param asyncDataOptions options for `useAsyncData`
   * @returns
   */
  // eslint-disable-next-line require-await
  async postLogin (
    param : ILogin,
    asyncDataOptions?: AsyncDataOptions<ApiResponse>
  ) {
    return useAsyncData(
      () => {
        return this.call(
          'POST',
          `${this.RESOURCE}`,
          param // body
        )
      },
      asyncDataOptions
    )
  }

  /**
   * Return the products as array
   * @param asyncDataOptions options for `useAsyncData`
   * @returns
   */
  // eslint-disable-next-line require-await
  async postLoginSosmed (
    param : any,
    asyncDataOptions?: AsyncDataOptions<any>
  ) {
    return useAsyncData(
      () => {
        return this.call(
          'POST',
          `${this.RESOURCE}-sosmed`,
          param // body
        )
      },
      asyncDataOptions
    )
  }
}

export default LoginModule
