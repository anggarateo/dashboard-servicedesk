/* eslint-disable require-await */
// 3rd's
import { FetchOptions } from 'ofetch'
import { AsyncDataOptions } from '#app'

// locals
import FetchFactory from '~/repository/factory'

class DashboardModule extends FetchFactory<any> {
  private RESOURCE = 'dashboard'

  /**
   * Return the products as array
   * @param asyncDataOptions options for `useAsyncData`
   * @returns
   */
  async getTotalHeader (
    param: any,
    query: any,
    asyncDataOptions?: AsyncDataOptions<any>
  ) {
    return useAsyncData(
      () => {
        const fetchOptions: FetchOptions<'json'> = {}
        return this.call(
          'GET',
          `${this.RESOURCE}/total-header`,
          param,
          fetchOptions,
          query
        )
      },
      asyncDataOptions
    )
  }

  async getUserRole (
    param: any,
    query: any,
    asyncDataOptions?: AsyncDataOptions<any>
  ) {
    return useAsyncData(
      () => {
        const fetchOptions: FetchOptions<'json'> = {}
        return this.call(
          'GET',
          `${this.RESOURCE}/user-role`,
          param,
          fetchOptions,
          query
        )
      },
      asyncDataOptions
    )
  }

  async getAverageTicketHandle (
    param: any,
    query: any,
    asyncDataOptions?: AsyncDataOptions<any>
  ) {
    return useAsyncData(
      () => {
        const fetchOptions: FetchOptions<'json'> = {}
        return this.call(
          'GET',
          `${this.RESOURCE}/average-ticket-handled`,
          param,
          fetchOptions,
          query
        )
      },
      asyncDataOptions
    )
  }

  async getAverageTicketRating (
    param: any,
    query: any,
    asyncDataOptions?: AsyncDataOptions<any>
  ) {
    return useAsyncData(
      () => {
        const fetchOptions: FetchOptions<'json'> = {}
        return this.call(
          'GET',
          `${this.RESOURCE}/average-ticket-rating`,
          param,
          fetchOptions,
          query
        )
      },
      asyncDataOptions
    )
  }

  async getPerfomance (
    param: any,
    query: any,
    asyncDataOptions?: AsyncDataOptions<any>
  ) {
    return useAsyncData(
      () => {
        const fetchOptions: FetchOptions<'json'> = {}
        return this.call(
          'GET',
          `${this.RESOURCE}/performance-bcare`,
          param,
          fetchOptions,
          query
        )
      },
      asyncDataOptions
    )
  }

  async getManageService (params?: any, asyncDataOptions?: AsyncDataOptions<any>) {
    return useAsyncData(() => {
      return this.call(
        'GET',
        `${this.RESOURCE}/service`,
        undefined,
        undefined,
        params
      )
    }, asyncDataOptions)
  }

  async getLeaderboardService (params?: any, asyncDataOptions?: AsyncDataOptions<any>) {
    return useAsyncData(() => {
      return this.call(
        'GET',
        `${this.RESOURCE}/leaderboard-service`,
        undefined,
        undefined,
        params
      )
    }, asyncDataOptions)
  }

  async getLeaderboardAgent (params?: any, asyncDataOptions?: AsyncDataOptions<any>) {
    return useAsyncData(() => {
      return this.call(
        'GET',
        `${this.RESOURCE}/leaderboard-agent`,
        undefined,
        undefined,
        params
      )
    }, asyncDataOptions)
  }

  async getNearestSla (params?: any, asyncDataOptions?: AsyncDataOptions<any>) {
    return useAsyncData(() => {
      return this.call(
        'GET',
        `${this.RESOURCE}/sla-close-in`,
        undefined,
        undefined,
        params
      )
    }, asyncDataOptions)
  }

  async getTicketStatistic (params?: any, asyncDataOptions?: AsyncDataOptions<any>) {
    return useAsyncData(() => {
      return this.call(
        'GET',
        `${this.RESOURCE}/ticket-statistics`,
        undefined,
        undefined,
        params
      )
    }, asyncDataOptions)
  }

  async getTicketTodolist (params?: any, asyncDataOptions?: AsyncDataOptions<any>) {
    return useAsyncData(() => {
      return this.call(
        'GET',
        `${this.RESOURCE}/todolist-ticket`,
        undefined,
        undefined,
        params
      )
    }, asyncDataOptions)
  }

  async getSlaPerform (params?: any, asyncDataOptions?: AsyncDataOptions<any>) {
    return useAsyncData(() => {
      return this.call(
        'GET',
        `${this.RESOURCE}/performance-sla`,
        undefined,
        undefined,
        params
      )
    }, asyncDataOptions)
  }

  async getServicePerform (params?: any, asyncDataOptions?: AsyncDataOptions<any>) {
    return useAsyncData(() => {
      return this.call(
        'GET',
        `${this.RESOURCE}/performance-service`,
        undefined,
        undefined,
        params
      )
    }, asyncDataOptions)
  }
}

export default DashboardModule
