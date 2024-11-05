/* eslint-disable require-await */
// 3rd's
import { FetchOptions } from 'ofetch'
import { AsyncDataOptions } from '#app'

// locals
import FetchFactory from '~/repository/factory'

class FlowModule extends FetchFactory<any> {
  private RESOURCE = 'flow'

  async getList (
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

  async getListById (
    id: any,
    param: any,
    query: any,
    asyncDataOptions?: AsyncDataOptions<any>
  ) {
    return useAsyncData(
      () => {
        const fetchOptions: FetchOptions<'json'> = {}
        return this.call(
          'GET',
          `${this.RESOURCE}/${id}`,
          param,
          fetchOptions,
          query
        )
      },
      asyncDataOptions
    )
  }

  async deleteList (
    id: any,
    param: any,
    query: any,
    asyncDataOptions?: AsyncDataOptions<any>
  ) {
    return useAsyncData(
      () => {
        const fetchOptions: FetchOptions<'json'> = {}
        return this.call(
          'DELETE',
          `${this.RESOURCE}/${id}?lang=id`,
          param,
          fetchOptions,
          query
        )
      },
      asyncDataOptions
    )
  }

  async getService (
    param: any,
    query: any,
    asyncDataOptions?: AsyncDataOptions<any>
  ) {
    return useAsyncData(
      () => {
        const fetchOptions: FetchOptions<'json'> = {}
        return this.call(
          'GET',
          // `${this.RESOURCE}/list-service`,
          'service',
          param,
          fetchOptions,
          query
        )
      },
      asyncDataOptions
    )
  }

  async getSlaType (
    param: any,
    query: any,
    asyncDataOptions?: AsyncDataOptions<any>
  ) {
    return useAsyncData(
      () => {
        const fetchOptions: FetchOptions<'json'> = {}
        return this.call(
          'GET',
          `${this.RESOURCE}/sla-type`,
          param,
          fetchOptions,
          query
        )
      },
      asyncDataOptions
    )
  }

  async getSla (
    param: any,
    query: any,
    asyncDataOptions?: AsyncDataOptions<any>
  ) {
    return useAsyncData(
      () => {
        const fetchOptions: FetchOptions<'json'> = {}
        return this.call(
          'GET',
          'sla',
          param,
          fetchOptions,
          query
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
  async getAgent (
    param: any,
    query: any,
    asyncDataOptions?: AsyncDataOptions<any>
  ) {
    return useAsyncData(
      () => {
        const fetchOptions: FetchOptions<'json'> = {}
        return this.call(
          'GET',
          `${this.RESOURCE}/agent`,
          param,
          fetchOptions,
          query
        )
      },
      asyncDataOptions
    )
  }

  async getAgentService (
    param: any,
    query: any,
    asyncDataOptions?: AsyncDataOptions<any>
  ) {
    return useAsyncData(
      () => {
        const fetchOptions: FetchOptions<'json'> = {}
        return this.call(
          'GET',
          `${this.RESOURCE}/service-agent`,
          param,
          fetchOptions,
          query
        )
      },
      asyncDataOptions
    )
  }

  async postFlow (
    param : any,
    asyncDataOptions?: AsyncDataOptions<any>
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

  async updateFlow (
    id: any,
    param : any,
    asyncDataOptions?: AsyncDataOptions<any>
  ) {
    return useAsyncData(
      () => {
        const fetchOptions: FetchOptions<'json'> = {}
        return this.call(
          'PATCH',
          `${this.RESOURCE}/${id}`,
          param, // body
          fetchOptions
        )
      },
      asyncDataOptions
    )
  }
}

export default FlowModule
