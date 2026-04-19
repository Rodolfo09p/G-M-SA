import i18n from '@i18n';
import { FuseNavItemType } from '@fuse/core/FuseNavigation/types/FuseNavItemType';
import ar from './navigation-i18n/ar';
import en from './navigation-i18n/en';
import tr from './navigation-i18n/tr';

i18n.addResourceBundle('en', 'navigation', en);
i18n.addResourceBundle('tr', 'navigation', tr);
i18n.addResourceBundle('ar', 'navigation', ar);

/**
 * The navigationConfig object is an array of navigation items for the Fuse application.
 */
const navigationConfig: FuseNavItemType[] = [
	{
		id: 'dashboard-component',
		title: 'Dashboard',
		type: 'item',
		icon: 'lucide:layout-dashboard',
		url: 'dashboard'
	},
	{
		id: 'customers-component',
		title: 'Clientes',
		type: 'item',
		icon: 'lucide:users',
		url: 'customers'
	},
	{
		id: 'policies-component',
		title: 'Polizas',
		type: 'item',
		icon: 'lucide:file-text',
		url: 'policies'
	},
	{
		id: 'example-component',
		title: 'Example',
		translate: 'EXAMPLE',
		type: 'item',
		icon: 'lucide:star',
		url: 'example'
	}
];

export default navigationConfig;
