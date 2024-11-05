// 3rd's
import { $fetch, FetchOptions } from 'ofetch'

// locals
import LoginModule from '~/repository/modules/auth/login'
import LoginSsoModule from '~/repository/modules/auth/loginSso'
import RegisterModule from '~/repository/modules/auth/register'
import GlobalModule from '~/repository/modules/index'
import AgentModule from '~/repository/modules/agent'
import InviteLinkModule from '~/repository/modules/auth/invite-link/inviteLink'
import CategoryModule from '~/repository/modules/master/categories'
import ServiceModule from '~/repository/modules/master/services'
import AppAssetModule from '~/repository/modules/master/appassets'
import SlaModule from '~/repository/modules/master/sla'
import { GetRoleModule, PostRoleModule } from '~/repository/modules/role'
import KnowledgebaseModule from '~/repository/modules/knowledgebase'
import AktivasiLinkModule from '~/repository/modules/auth/invite-link/aktivasiLink'
import ContentModule from '~/repository/modules/content'
import ProfileModule from '~/repository/modules/auth/profile'
import TicketModule from '~/repository/modules/ticket'
import ClassificationModule from '~/repository/modules/master/classification'
import ComplaintCategoryModule from '~/repository/modules/master/complaintCategory'
import ForgotPasswordModule from '~/repository/modules/auth/forgot-password'
import FlowModule from '~/repository/modules/master/flow'
import UserModule from '~/repository/modules/user'
import ChatModule from '~/repository/modules/chat'
import DashboardModule from '~/repository/modules/dashboard'
import NotificationModule from '~/repository/modules/notification'
import ReportModule from '~/repository/modules/report'
import { removeToken } from '~/composables/useToken'

interface IApiInstance {
  login: LoginModule;
  loginSso: LoginSsoModule;
  register: RegisterModule;
  agent: AgentModule;
  inviteLink: InviteLinkModule;
  category: CategoryModule;
  service: ServiceModule;
  global: GlobalModule;
  appAsset: AppAssetModule;
  sla: SlaModule;
  aktivasiLink: AktivasiLinkModule;
  role: { get: GetRoleModule, post: PostRoleModule };
  knowledgebase: KnowledgebaseModule;
  content: ContentModule
  profile: ProfileModule,
  ticket: TicketModule,
  classification: ClassificationModule,
  complaintCategory: ComplaintCategoryModule,
  forgotPassword: ForgotPasswordModule,
  flow: FlowModule,
  user: UserModule,
  chat: ChatModule,
  dashboard: DashboardModule
  notification: NotificationModule
  report: ReportModule
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  const loading = ref(true)
  const fetchOptions: FetchOptions = {
    baseURL: config.public.apiBaseUrl,
    async onResponse ({ response }) {
      loading.value = false
      if (response.status === 401) {
        localStorage.clear()
        await removeToken()
        useRouter().push('/auth/login')
      }
    }
  }

  // Create a new instance of $fecther with custom option
  const apiFecther = $fetch.create(fetchOptions)

  // An object containing all repositories we need to expose
  const modules: IApiInstance = {
    login: new LoginModule(apiFecther),
    loginSso: new LoginSsoModule(apiFecther),
    register: new RegisterModule(apiFecther),
    agent: new AgentModule(apiFecther),
    inviteLink: new InviteLinkModule(apiFecther),
    category: new CategoryModule(apiFecther),
    service: new ServiceModule(apiFecther),
    global: new GlobalModule(apiFecther),
    appAsset: new AppAssetModule(apiFecther),
    sla: new SlaModule(apiFecther),
    role: { get: new GetRoleModule(apiFecther), post: new PostRoleModule(apiFecther) },
    knowledgebase: new KnowledgebaseModule(apiFecther),
    aktivasiLink: new AktivasiLinkModule(apiFecther),
    content: new ContentModule(apiFecther),
    profile: new ProfileModule(apiFecther),
    ticket: new TicketModule(apiFecther),
    classification: new ClassificationModule(apiFecther),
    complaintCategory: new ComplaintCategoryModule(apiFecther),
    forgotPassword: new ForgotPasswordModule(apiFecther),
    flow: new FlowModule(apiFecther),
    user: new UserModule(apiFecther),
    chat: new ChatModule(apiFecther),
    dashboard: new DashboardModule(apiFecther),
    notification: new NotificationModule(apiFecther),
    report: new ReportModule(apiFecther)
  }

  return {
    provide: {
      api: modules
    }
  }
})
