export default {
    items: [
        {
            id: 'navigation',
            title: 'Consultas',
            type: 'group',
            icon: 'icon-navigation',
            children: [
                {
                    id: 'dashboard',
                    title: 'Dashboard',
                    type: 'collapse',
                    icon: 'feather icon-home',
                    children: [
                        {
                            id: 'atendimento',
                            title: 'Atendimento',
                            type: 'item',
                            url: '/dashboard/default'
                        },
                        {
                            id: 'auditoria',
                            title: 'Acompanhamento',
                            type: 'item',
                            url: '/dashboard/acompanhamento'
                        }
                    ]
                }
               
            ]
        },
        {
            id: 'administracao',
            title: 'Administração',
            type: 'group',
            icon: 'icon-ui',
            children: [
                {
                    id: 'cadastros',
                    title: 'Cadastros',
                    type: 'collapse',
                    icon: 'feather icon-box',
                    children: [
                        {
                            id: 'medicos',
                            title: 'Médicos',
                            type: 'item',
                            url: '/medicos'
                        },
                        {
                            id: 'pacientes',
                            title: 'Pacientes',
                            type: 'item',
                            url: '/medicos/'
                        }
                    ]
                }
                
            ]
        }
      
    ]
}