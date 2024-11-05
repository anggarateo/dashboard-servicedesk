// 3rd's
import { AsyncDataOptions } from '#app'

// locals
import FetchFactory from '~/repository/factory'

type IRegister = {
  email: string;
  password: string;
  firstname: string;
  username: string;
  phone: string;
}
interface ApiResponse {
  data: {
    authorization:{},
    user:{}
  };
  request_at: string;
  message: string;
  version: string;
}

class RegisterModule extends FetchFactory<ApiResponse> {
  private RESOURCE = 'auth/register'

  /**
   * Return the products as array
   * @param asyncDataOptions options for `useAsyncData`
   * @returns
   */
  // eslint-disable-next-line require-await
  async postRegister (
    param : IRegister,
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
}

export default RegisterModule
