import { AsyncDataOptions } from '#app'
import FetchFactory from '~/repository/factory'

class TicketModule extends FetchFactory<any> {
  private RESOURCE = 'trans/ticket/admin'
  private MASTER = 'trans/master'

  async getList (params?: Object, asyncDataOptions?: AsyncDataOptions<any>) {
    return useAsyncData(() => {
      return this.call(
        'GET',
        `${this.RESOURCE}/list`,
        undefined,
        undefined,
        params
      )
    }, asyncDataOptions)
  }

  async getById (id: String, params?: Object, asyncDataOptions?: AsyncDataOptions<any>) {
    return useAsyncData(() => {
      return this.call(
        'GET',
        `${this.RESOURCE}/detail/${id}`,
        undefined,
        undefined,
        params
      )
    }, asyncDataOptions)
  }

  async getInfo (id: String, params?: Object, asyncDataOptions?: AsyncDataOptions<any>) {
    return useAsyncData(() => {
      return this.call(
        'GET',
        `${this.RESOURCE}/info/${id}`,
        undefined,
        undefined,
        params
      )
    }, asyncDataOptions)
  }

  async getImpacts (param?: Object, asyncDataOptions?: AsyncDataOptions<any>) {
    return useAsyncData(() => {
      return this.call(
        'GET',
        `${this.MASTER}/list-impact-level`,
        undefined,
        undefined,
        param
      )
    }, asyncDataOptions)
  }

  async getCategories (param?: Object, asyncDataOptions?: AsyncDataOptions<any>) {
    return useAsyncData(() => {
      return this.call(
        'GET',
        `${this.MASTER}/list-service-category`,
        undefined,
        undefined,
        param
      )
    }, asyncDataOptions)
  }

  async getServices (param?: Object, asyncDataOptions?: AsyncDataOptions<any>) {
    return useAsyncData(() => {
      return this.call(
        'GET',
        `${this.MASTER}/list-service`,
        undefined,
        undefined,
        param
      )
    }, asyncDataOptions)
  }

  async getAllServices (param?: Object, asyncDataOptions?: AsyncDataOptions<any>) {
    return useAsyncData(() => {
      return this.call(
        'GET',
        `${this.MASTER}/list-service-all`,
        undefined,
        undefined,
        param
      )
    }, asyncDataOptions)
  }

  async createTicket (body: FormData, asyncDataOptions?: AsyncDataOptions<any>) {
    return useAsyncData(() => {
      return this.call(
        'POST',
        this.RESOURCE,
        body
      )
    }, asyncDataOptions)
  }

  async getReportSources (params?: Object, asyncDataOptions?: AsyncDataOptions<any>) {
    return useAsyncData(() => {
      return this.call(
        'GET',
        `${this.MASTER}/report-source`,
        undefined,
        undefined,
        params
      )
    }, asyncDataOptions)
  }

  async uploadFile (body: FormData, asyncDataOptions?: AsyncDataOptions<any>) {
    return useAsyncData(() => {
      return this.call(
        'POST',
        'trans/upload',
        body
      )
    }, asyncDataOptions)
  }

  async verifyTicket (idTicket: string, body: FormData, asyncDataOptions?: AsyncDataOptions<any>) {
    return useAsyncData(() => {
      return this.call(
        'POST',
        `${this.RESOURCE}/verification/${idTicket}`,
        body
      )
    }, asyncDataOptions)
  }

  async updateTicket (idTicket: string, body: FormData, asyncDataOptions?: AsyncDataOptions<any>) {
    return useAsyncData(() => {
      return this.call(
        'POST',
        `${this.RESOURCE}/update-ticket/${idTicket}`,
        body
      )
    }, asyncDataOptions)
  }

  async getStatusFlow (params?: any, asyncDataOptions?: AsyncDataOptions<any>) {
    return useAsyncData(() => {
      return this.call(
        'GET',
        `${this.MASTER}/status-flow`,
        undefined,
        undefined,
        params
      )
    }, asyncDataOptions)
  }

  async closeTicket (idTicket: string, body: FormData, asyncDataOptions?: AsyncDataOptions<any>) {
    return useAsyncData(() => {
      return this.call(
        'POST',
        `${this.RESOURCE}/close/${idTicket}`,
        body
      )
    }, asyncDataOptions)
  }

  async rejectTicket (idTicket: string, body: FormData, asyncDataOptions?: AsyncDataOptions<any>) {
    return useAsyncData(() => {
      return this.call(
        'POST',
        `${this.RESOURCE}/reject/${idTicket}`,
        body
      )
    }, asyncDataOptions)
  }

  async approveReOpenTicket (idTicket: string, body: FormData, asyncDataOptions?: AsyncDataOptions<any>) {
    return useAsyncData(() => {
      return this.call(
        'POST',
        `${this.RESOURCE}/approve-reopen-ticket/${idTicket}`,
        body)
    }, asyncDataOptions)
  }

  async getListUserViewer (params?: Object, asyncDataOptions?: AsyncDataOptions<any>) {
    return useAsyncData(() => {
      return this.call(
        'GET',
        `${this.RESOURCE}/list-user-viewer/${params.idTicket}`,
        undefined,
        undefined,
        params
      )
    }, asyncDataOptions)
  }

  async reOpenTicket (idTicket: string, body: FormData, asyncDataOptions?: AsyncDataOptions<any>) {
    return useAsyncData(() => {
      return this.call(
        'POST',
        `${this.RESOURCE}/re-open-ticket/${idTicket}`,
        body
      )
    }, asyncDataOptions)
  }

  async getListTicketViewer (params?: Object, asyncDataOptions?: AsyncDataOptions<any>) {
    return useAsyncData(() => {
      return this.call(
        'GET',
        `${this.RESOURCE}/list-ticket-viewer`,
        undefined,
        undefined,
        params
      )
    }, asyncDataOptions)
  }
  
  async addViewerTicket (idTicket: any, body: any, asyncDataOptions?: AsyncDataOptions<any>) {
    return useAsyncData(() => {
      return this.call(
        'POST',
        `${this.RESOURCE}/add-viewer/${idTicket}`,
        body
        )
      }, asyncDataOptions)
    }

  async getLogTicket (idTicket: String, params?: Object, asyncDataOptions?: AsyncDataOptions<any>) {
    return useAsyncData(() => {
      return this.call(
        'GET',
        `${this.RESOURCE}/log/${idTicket}`,
        undefined,
        undefined,
        params
      )
    }, asyncDataOptions)
  }
  
  async defineSlaAgent (idTicket: String, body: Object, asyncDataOptions?: AsyncDataOptions<any>) {
    return useAsyncData(() => {
      return this.call(
        'POST',
        `${this.RESOURCE}/create-flow-sla/${idTicket}`,
        body
      )
    }, asyncDataOptions)
  }
  
  async handleFlow (idTicket: String, body?: Object, asyncDataOptions?: AsyncDataOptions<any>) {
    return useAsyncData(() => {
      return this.call(
        'POST',
        `${this.RESOURCE}/flow-handled/${idTicket}`,
        body
      )
    }, asyncDataOptions)
  }

  async getMyTickets (params?: Object, asyncDataOptions?: AsyncDataOptions<any>) {
    return useAsyncData(() => {
      return this.call(
        'GET',
        `${this.RESOURCE}/my-tickets`,
        undefined,
        undefined,
        params
      )
    })
  }

  async detailMyTicket (idTicket: String, asyncDataOptions?: AsyncDataOptions<any>) {
    return useAsyncData(() => {
      return this.call(
        'GET',
        `${this.RESOURCE}/my-tickets/${idTicket}`
      )
    }, asyncDataOptions)
  }

  async accMyTicket (idTicket: String, body: Object, asyncDataOptions?: AsyncDataOptions<any>) {
    return useAsyncData(() => {
      return this.call(
        'POST',
        `${this.RESOURCE}/my-tickets-approve/${idTicket}`,
        body
      )
    }, asyncDataOptions)
  }
  
  async getStatusTicket (params?: any, asyncDataOptions?: AsyncDataOptions<any>) {
    return useAsyncData(() => {
      return this.call(
        'GET',
        `${this.MASTER}/status-ticket`,
        undefined,
        undefined,
        params
      )
    }, asyncDataOptions)
  }
  
  async getListAll (params?: Object, asyncDataOptions?: AsyncDataOptions<any>) {
    return useAsyncData(() => {
      return this.call(
        'GET',
        `${this.RESOURCE}/list-all`,
        undefined,
        undefined,
        params
      )
    })
  }
  
  async changeService (idTicket: String, body?: Object, asyncDataOptions?: AsyncDataOptions<any>) {
    return useAsyncData(() => {
      return this.call(
        'POST',
        `${this.RESOURCE}/change-service/${idTicket}`,
        body
      )
    }, asyncDataOptions)
  }
  
  async previousFlow (idTicket: String, body?: Object, asyncDataOptions?: AsyncDataOptions<any>) {
    return useAsyncData(() => {
      return this.call(
        'POST',
        `${this.RESOURCE}/backflow-ticket/${idTicket}`,
        body
      )
    }, asyncDataOptions)
  }
  
  async rating (body: { trx_ticket_id: String, grade: Number, message?: String }, asyncDataOptions?: AsyncDataOptions<any>) {
    return useAsyncData(() => {
      return this.call(
        'POST',
        'rating',
        body
      )
    }, asyncDataOptions)
  }

  async getFiles (idTicket: String, params?: Object) {
    return useAsyncData(() => {
      return this.call(
        'GET',
        `${this.RESOURCE}/list-file/${idTicket}`,
        undefined,
        undefined,
        params
      )
    })
  }

  async DSReport (body: { code_ticket: string | string[], form_request: string, passphrase: string, trx_ticket_report_flow_stage_id?: string }, asyncDataOptions?: AsyncDataOptions<any>) {
    return useAsyncData(() => {
      return this.call(
        'POST',
        `${this.RESOURCE.replace('/admin', '')}/report/pdf-report`,
        body,
        asyncDataOptions
      )
    }, asyncDataOptions)
  }
}
  
export default TicketModule
