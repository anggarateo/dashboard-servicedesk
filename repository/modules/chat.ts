import { AsyncDataOptions } from '#app'
import FetchFactory from '~/repository/factory'

class ChatModule extends FetchFactory<any> {
  private RESOURCE = 'chat'

  async uploadImage (body: FormData, asyncDataOptions?: AsyncDataOptions<any>) {
    return useAsyncData(() => {
      return this.call(
        'POST',
        `${this.RESOURCE}/upload/image`,
        body
      )
    }, asyncDataOptions)
  }

  async storeImage (body: { trx_ticket_chat_id: String, image: [] }, asyncDataOptions?: AsyncDataOptions<any>) {
    return useAsyncData(() => {
      return this.call(
        'POST',
        `${this.RESOURCE}/store/image`,
        body
      )
    }, asyncDataOptions)
  }

  async create (body: { trx_ticket_id: String, message: String, category?: String, sub_chat_id?: String }, asyncDataOptions?: AsyncDataOptions<any>) {
    return useAsyncData(() => {
      return this.call(
        'POST',
        this.RESOURCE,
        body
      )
    }, asyncDataOptions)
  }

  async detail (id: String, params: { lang?: String, category?: String }, asyncDataOptions?: AsyncDataOptions<any>) {
    return useAsyncData(() => {
      return this.call(
        'GET',
        `${this.RESOURCE}/${id}/detail`,
        undefined,
        undefined,
        params
      )
    }, asyncDataOptions)
  }

  async list (id: String, params?: { lang?: String, category?: String, per_page?: Number, page?: Number }, asyncDataOptions?: AsyncDataOptions<any>) {
    return useAsyncData(() => {
      return this.call(
        'GET',
        `${this.RESOURCE}/list/${id}`,
        undefined,
        undefined,
        params
      )
    }, asyncDataOptions)
  }

  async listSub (id: String, params?: { lang?: String, category?: String, per_page?: Number, page?: Number }, asyncDataOptions?: AsyncDataOptions<any>) {
    return useAsyncData(() => {
      return this.call(
        'GET',
        `${this.RESOURCE}/list/sub/${id}`,
        undefined,
        undefined,
        params
      )
    }, asyncDataOptions)
  }
}

export default ChatModule
