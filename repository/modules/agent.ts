/* eslint-disable require-await */
// 3rd's
import { FetchOptions } from 'ofetch'
import { AsyncDataOptions } from '#app'

// locals
import FetchFactory from '~/repository/factory'

class AgentModule extends FetchFactory<any> {
  private RESOURCE = 'user/agent'
  private RESOURCE_ROLE = 'role'
  private RESOURCE_UNIT_OF_WORK = 'unit-of-work'
  private RESOURCE_POSITION = 'position'

  /**
   * Return the products as array
   * @param asyncDataOptions options for `useAsyncData`
   * @returns
   */
  // eslint-disable-next-line require-await
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
          `${this.RESOURCE}`,
          param,
          fetchOptions,
          query
        )
      },
      asyncDataOptions
    )
  }

  // eslint-disable-next-line require-await
  async getDetailAgent (
    id: number,
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

  async getHistoryLayanan (
    param: any,
    query: any,
    asyncDataOptions?: AsyncDataOptions<any>
  ) {
    return useAsyncData(
      () => {
        const fetchOptions: FetchOptions<'json'> = {}
        return this.call(
          'GET',
          'user/service-flow',
          param,
          fetchOptions,
          query
        )
      },
      asyncDataOptions
    )
  }

  async getHistoryPerubahan (
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
          'log/agent/' + id,
          param,
          fetchOptions,
          query
        )
      },
      asyncDataOptions
    )
  }

  // eslint-disable-next-line require-await
  async getAgentRole (
    param: any,
    query: any,
    asyncDataOptions?: AsyncDataOptions<any>
  ) {
    return useAsyncData(
      () => {
        const fetchOptions: FetchOptions<'json'> = {}
        return this.call(
          'GET',
          `${this.RESOURCE_ROLE}`,
          param,
          fetchOptions,
          query
        )
      },
      asyncDataOptions
    )
  }

  // eslint-disable-next-line require-await
  async getAgentUnitOfWork (
    param: any,
    query: any,
    asyncDataOptions?: AsyncDataOptions<any>
  ) {
    return useAsyncData(
      () => {
        const fetchOptions: FetchOptions<'json'> = {}
        return this.call(
          'GET',
          `${this.RESOURCE_UNIT_OF_WORK}`,
          param,
          fetchOptions,
          query
        )
      },
      asyncDataOptions
    )
  }

  // eslint-disable-next-line require-await
  async getAgentPosition (
    param: any,
    query: any,
    asyncDataOptions?: AsyncDataOptions<any>
  ) {
    return useAsyncData(
      () => {
        const fetchOptions: FetchOptions<'json'> = {}
        return this.call(
          'GET',
          `${this.RESOURCE_POSITION}`,
          param,
          fetchOptions,
          query
        )
      },
      asyncDataOptions
    )
  }

  // eslint-disable-next-line require-await
  async updateAgent (
    id: number,
    param: any,
    asyncDataOptions?: AsyncDataOptions<any>
  ) {
    return useAsyncData(
      () => {
        const fetchOptions: FetchOptions<'json'> = {}
        return this.call(
          'PATCH',
          `${this.RESOURCE}/${id}`,
          param,
          fetchOptions
        )
      },
      asyncDataOptions
    )
  }

  // eslint-disable-next-line require-await
  async deleteAgent (
    id: number,
    param: any,
    asyncDataOptions?: AsyncDataOptions<any>
  ) {
    return useAsyncData(
      () => {
        const fetchOptions: FetchOptions<'json'> = {}
        return this.call(
          'DELETE',
          `${this.RESOURCE}/${id}`,
          param,
          fetchOptions
        )
      },
      asyncDataOptions
    )
  }

  // eslint-disable-next-line require-await
  async syncAgent (
    param: any,
    asyncDataOptions?: AsyncDataOptions<any>
  ) {
    return useAsyncData(
      () => {
        const fetchOptions: FetchOptions<'json'> = {}
        return this.call(
          'POST',
          `${this.RESOURCE}/sync`,
          param,
          fetchOptions
        )
      },
      asyncDataOptions
    )
  }
}

export default AgentModule
