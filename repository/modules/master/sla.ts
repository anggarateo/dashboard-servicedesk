/* eslint-disable require-await */
// 3rd's
import { AsyncDataOptions } from '#app'

// locals
import FetchFactory from '~/repository/factory'

interface IForm {
  id: string;
  category: string;
}

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

class SlaModule extends FetchFactory<any> {
  private RESOURCE = 'sla'

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
          `${this.RESOURCE}`,
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
    param : IForm,
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

  async patch (
    id: string,
    param: any,
    asyncDataOptions?: AsyncDataOptions<ApiResponse>
  ) {
    return useAsyncData(
      () => {
        return this.call(
          'PATCH',
          `${this.RESOURCE}/${id}`,
          param // body
        )
      },
      asyncDataOptions
    )
  }

  async delete (
    id: string,
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
}

export default SlaModule
