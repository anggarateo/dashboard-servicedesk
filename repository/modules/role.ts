// 3rd's
import { FetchOptions } from 'ofetch'
import { AsyncDataOptions } from '#app'

// locals
import FetchFactory from '~/repository/factory'

interface Permission {
  id: string;
  action: string;
  description: string;
  is_active: boolean;
}

interface GrandChild {
  id: string;
  code: string;
  name: string;
  description: string;
  is_active: boolean;
  permissions: Permission[];
}

interface Child {
  id: string;
  code: string;
  name: string;
  description: string;
  is_active: boolean;
  permissions: Permission[];
  children: GrandChild[];
}

interface Menu {
  id: string;
  code: string;
  name: string;
  description: string;
  is_active: boolean;
  permissions: Permission[];
  children: Child[];
}

interface Role {
  id: string;
  name: string;
  description: string;
  is_active: boolean;
  menus: Menu[];
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

interface Response {
  data: Role[];
  links: Links;
  meta: Meta;
  message: string;
  version: string
}

class GetRoleModule extends FetchFactory<Response> {
  private RESOURCE = 'role-menu'

  async getMenu (param: any, asyncDataOptions?: AsyncDataOptions<Response>) {
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

  async getRoles (param: any, asyncDataOptions?: AsyncDataOptions<Response>) {
    return useAsyncData(() => {
      return this.call(
        'GET',
        `${this.RESOURCE}/list`,
        undefined,
        undefined,
        param
      )
    }, asyncDataOptions)
  }

  async deleteRole (id: string) {
    return useAsyncData(() => {
      return this.call(
        'DELETE',
        `${this.RESOURCE}/${id}`
      )
    })
  }

  async getRoleUser (token: String) {
    return useAsyncData(() => {
      const fetchOptions: FetchOptions<'json'> = {
        headers: {
          Authorization: 'Bearer ' + token
        }
      }

      return this.call(
        'GET',
        `${this.RESOURCE}/current-action`,
        undefined,
        fetchOptions
      )
    })
  }
}

class PostRoleModule extends FetchFactory<Role> {
  private RESOURCE = 'role-menu'

  async addRoles (param: Role, asyncDataOptions?: AsyncDataOptions<Role>) {
    return useAsyncData(() => {
      return this.call(
        'POST',
        this.RESOURCE,
        param
      )
    }, asyncDataOptions)
  }
}

export {
  GetRoleModule,
  PostRoleModule
}
