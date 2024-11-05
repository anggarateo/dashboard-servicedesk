/* eslint-disable require-await */
// 3rd's
import { FetchOptions } from 'ofetch'
import { AsyncDataOptions } from '#app'

// locals
import FetchFactory from '~/repository/factory'

interface Links {
  first: string;
  last: string;
  prev: string | null;
  next: string | null;
}

interface LinkItem {
  url: string | null;
  label: string;
  active: boolean;
}

interface Meta {
  current_page: number;
  from: number;
  last_page: number;
  links: LinkItem[];
  path: string;
  per_page: number;
  to: number;
  total: number;
}

interface ApiResponse {
  data: any;
  links: Links;
  meta: Meta;
  message: string;
  version: string;
}

class ServiceModule extends FetchFactory<any> {
  private GROUP = 'service/group'
  private RESOURCE = 'service'

  /**
   * Return the products as array
   * @param asyncDataOptions options for `useAsyncData`
   * @returns
   */
  async getList (
    params?: any,
    asyncDataOptions?: AsyncDataOptions<ApiResponse>
  ) {
    return useAsyncData(
      () => {
        return this.call(
          'GET',
          `${this.GROUP}`,
          undefined,
          undefined,
          params
        )
      },
      asyncDataOptions
    )
  }

  async get (
    id : any,
    asyncDataOptions?: AsyncDataOptions<any>
  ) {
    return useAsyncData(
      () => {
        return this.call(
          'GET',
          `${this.RESOURCE}/${id}`
        )
      },
      asyncDataOptions
    )
  }

  async post (
    param : any,
    asyncDataOptions?: AsyncDataOptions<ApiResponse>
  ) {
    return useAsyncData(
      () => {
        // const fetchOptions: FetchOptions<'json'> = {
        //   headers: {
        //     'Content-Type': 'multipart/form-data'
        //   }
        // }
        return this.call(
          'POST',
          `${this.RESOURCE}`,
          param // body
        )
      },
      asyncDataOptions
    )
  }

  async patch (
    id: string,
    param: any,
    asyncDataOptions?: AsyncDataOptions<ApiResponse>
  ) {
    return useAsyncData(
      () => {
        return this.call(
          'POST',
          `${this.RESOURCE}/${id}`,
          param, // body
          undefined,
          { _method: 'patch' }
        )
      },
      asyncDataOptions
    )
  }

  async delete (
    id: any,
    asyncDataOptions?: AsyncDataOptions<ApiResponse>
  ) {
    return useAsyncData(
      () => {
        return this.call(
          'DELETE',
          `${this.RESOURCE}/${id}?lang=id`
        )
      },
      asyncDataOptions
    )
  }

  async getServiceList (param?: Object, asyncDataOptions?: AsyncDataOptions<ApiResponse>) {
    return useAsyncData(() => {
      return this.call(
        'GET',
        'service',
        undefined,
        undefined,
        param
      )
    }, asyncDataOptions)
  }
}

export default ServiceModule
