import i18n from '@i18n';
import { FuseNavItemType } from '@fuse/core/FuseNavigation/types/FuseNavItemType';
import ar from './navigation-i18n/ar';
import en from './navigation-i18n/en';
import tr from './navigation-i18n/tr';

i18n.addResourceBundle('en', 'navigation', en);
i18n.addResourceBundle('tr', 'navigation', tr);
i18n.addResourceBundle('ar', 'navigation', ar);

const navigationConfig: FuseNavItemType[] = [
	{
		id: 'panel-control-group',
		title: 'PANEL DE CONTROL',
		type: 'group',
		icon: 'heroicons-outline:home',
		children: [
			{
				id: 'dashboard-component',
				title: 'Dashboard',
				type: 'item',
				icon: 'heroicons-outline:chart-pie',
				url: 'dashboard'
			}
		]
	},
	{
		id: 'gestion-operativa',
		title: 'GESTIÓN OPERATIVA',
		type: 'group',
		icon: 'heroicons-outline:briefcase',
		children: [
			{
				id: 'customers-component',
				title: 'Clientes',
				type: 'item',
				icon: 'heroicons-outline:user-group',
				url: 'customers'
			},
			{
				id: 'policies-component',
				title: 'Pólizas',
				type: 'item',
				icon: 'heroicons-outline:document-duplicate',
				url: 'policies'
			},
			{
				id: 'claims-component',
				title: 'Reclamos (Siniestros)',
				type: 'item',
				icon: 'heroicons-outline:exclamation-circle',
				url: 'claims'
			}
		]
	},
	{
		id: 'modulo-busqueda',
		title: 'BÚSQUEDAS',
		type: 'group',
		icon: 'heroicons-outline:magnifying-glass',
		children: [
			{
				id: 'search-advanced',
				title: 'Búsqueda Avanzada',
				type: 'item',
				icon: 'heroicons-outline:magnifying-glass',
				// url: 'search/advanced'
				url: ''
			}
		]
	},
	{
		id: 'modulo-reportes',
		title: 'REPORTES',
		type: 'group',
		icon: 'heroicons-outline:presentation-chart-line',
		children: [
			{
				id: 'reports-collections',
				title: 'Cobranza',
				type: 'item',
				icon: 'heroicons-outline:banknotes',
				url: ''
			},
			{
				id: 'reports-renewals',
				title: 'Próximas Renovaciones',
				type: 'item',
				icon: 'heroicons-outline:arrow-path',
				// url: 'reports/renewals'
				url: ''
			}
		]
	},
	{
		id: 'administracion-sistema',
		title: 'ADMINISTRACIÓN',
		type: 'group',
		icon: 'heroicons-outline:cog-6-tooth',
		children: [
			{
				id: 'catalogos-component',
				title: 'Catálogos',
				type: 'item',
				icon: 'heroicons-outline:list-bullet',
				url: ''
			},
			{
				id: 'users-component',
				title: 'Usuarios y Permisos',
				type: 'item',
				icon: 'heroicons-outline:user-plus',
				// url: 'settings/users'
				url: ''
			},
		]
	}
];

export default navigationConfig;