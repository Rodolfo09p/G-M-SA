import { lazy } from 'react';
import { FuseRouteItemType } from '@fuse/utils/FuseUtils';

const DashboardView = lazy(() => import('./components/views/DashboardView'));

const route: FuseRouteItemType = {
	path: 'dashboard',
	element: <DashboardView />
};

export default route;
