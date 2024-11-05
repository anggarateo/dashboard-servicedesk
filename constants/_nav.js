const nav = [
  {
    _tag: 'CSidebarNavItem',
    name: 'Dashboard',
    to: '/dashboard',
    icon: 'solar:home-2-linear',
    code: 'dashboard' // sesuai dari api/role-menu
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Manajemen Tiket',
    to: '/ticket',
    icon: 'mingcute:ticket-line',
    code: 'pengelolaan_tiket' // sesuai dari api/role-menu
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Tim',
    to: '/tim',
    icon: 'clarity:users-line',
    code: 'team', // sesuai dari api/role-menu
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'FAQ',
    to: '/knowledgebase',
    icon: 'ph:book-open-text',
    code: 'basis_pengetahuan' // sesuai dari api/role-menu
  },
  {
    _tag: 'CSidebarNavDropdown',
    name: 'Master Data',
    to: '/master',
    icon: 'mingcute:folder-line',
    code: 'master_data', // sesuai dari api/role-menu
    _children: [
      {
        _tag: 'CSidebarNavDropdown',
        name: 'Layanan',
        to: '/master/service',
        code: 'layanan', // sesuai dari api/role-menu
        _children: [
          {
            _tag: 'CSidebarNavItem',
            name: 'Kategori Layanan',
            to: '/master/service/category',
            code: 'kategori_layanan', // sesuai dari api/role-menu
          },
          {
            _tag: 'CSidebarNavItem',
            name: 'List Layanan',
            to: '/master/service/list',
            code: 'list_layanan', // sesuai dari api/role-menu
          }
        ]
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Agent',
        to: '/master/agent',
        code: 'agent', // sesuai dari api/role-menu
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Alur',
        to: '/master/flow',
        code: 'alur', // sesuai dari api/role-menu
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'IT Asset',
        to: '/master/appassets',
        code: 'it_asset', // sesuai dari api/role-menu
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'SLA',
        to: '/master/sla',
        code: 'sla', // sesuai dari api/role-menu
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Unit Kerja',
        to: '/master/unit-of-work',
        code: 'unit_kerja', // sesuai dari api/role-menu
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Konfigurasi',
        to: '/master/config',
        code: 'config', // sesuai dari api/role-menu
      }
    ]
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Role',
    to: '/role',
    icon: 'clarity:users-line',
    code: 'role', // sesuai dari api/role-menu
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Invite Link',
    to: '/invite-link',
    icon: 'fluent:link-48-regular',
    code: 'invite_link', // sesuai dari api/role-menu
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Pemohon',
    to: '/pengadu',
    icon: 'solar:user-linear',
    code: 'pengadu', // sesuai dari api/role-menu
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Konten',
    to: '/content',
    icon: 'system-uicons:window-content',
    code: 'konten', // sesuai dari api/role-menu
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Laporan',
    to: '/laporan',
    icon: 'solar:document-text-linear',
    code: 'laporan', // sesuai dari api/role-menu
  }
]

const _nav = [
  nav
]

export default _nav
