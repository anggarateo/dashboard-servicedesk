import { AsyncDataOptions } from '#app'
import FetchFactory from '~/repository/factory'

interface lang {
  title: String,
  content: String
}

interface langIdEn {
  id: lang,
  en: lang
}

interface services {
  id: String,
  description: String
}

interface knowledgebase {
  id: String,
  service_category: services,
  service: services,
  is_show_homepage: Boolean,
  langs: langIdEn
}

interface Links {
  first: String;
  last: String;
  prev: String | null;
  next: String | null;
}

interface LinkItem {
  url: String | null;
  label: String;
  active: Boolean;
}

interface Meta {
  current_page: number;
  from: number;
  last_page: number;
  links: LinkItem[];
  path: String;
  per_page: number;
  to: number;
  total: number;
}

interface Response {
  data: knowledgebase[];
  links: Links;
  meta: Meta;
  message: String;
  version: String
}

interface uploaded {
  error: Boolean,
  message: String,
  data: String
}

class KnowledgebaseModule extends FetchFactory<any> {
  private RESOURCE = 'knowledge-base'

  async getKnowledgebase (param?: Object, asyncDataOptions?: AsyncDataOptions<Response>) {
    return useAsyncData(() => {
      return this.call(
        'GET',
        this.RESOURCE,
        undefined,
        undefined,
        param
      )
    }, asyncDataOptions)
  }
  
  async detailKnowledgebase (id: String, asyncDataOptions?: AsyncDataOptions<knowledgebase>) {
    return useAsyncData(() => {
      return this.call(
        'GET',
        `${this.RESOURCE}/${id}`
      )
    }, asyncDataOptions)
  }
  
  async addKnowledgebase (body: Object, asyncDataOptions?: AsyncDataOptions<knowledgebase>) {
    return useAsyncData(() => {
      return this.call(
        'POST',
        this.RESOURCE,
        body
      )
    }, asyncDataOptions)
  }
  
  async updateKnowledgebase (id: String, body: Object, asyncDataOptions?: AsyncDataOptions<knowledgebase>) {
    return useAsyncData(() => {
      return this.call(
        'PATCH',
        `${this.RESOURCE}/${id}`,
        body
      )
    }, asyncDataOptions)
  }
  
  async deleteKnowledgebase (id: String, asyncDataOptions?: AsyncDataOptions<knowledgebase>) {
    return useAsyncData(() => {
      return this.call(
        'DELETE',
        `${this.RESOURCE}/${id}`
      )
    }, asyncDataOptions)
  }

  async uploadKnowledgebase (body: File, asyncDataOptions?: AsyncDataOptions<uploaded>) {
    return useAsyncData(() => {
      return this.call(
        'POST',
        `${this.RESOURCE}/upload-galery`,
        body
      )
    }, asyncDataOptions)
  }
  
  async getFaqCategory (param?: Object, asyncDataOptions?: AsyncDataOptions<any>) {
    return useAsyncData(() => {
      return this.call(
        'GET',
        'page-faq/category',
        undefined,
        undefined,
        param
      )
    }, asyncDataOptions)
  }
}

export default KnowledgebaseModule
