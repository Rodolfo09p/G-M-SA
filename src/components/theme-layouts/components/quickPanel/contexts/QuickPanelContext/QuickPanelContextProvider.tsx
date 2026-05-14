import { useEffect, useMemo, useState, type ReactNode } from 'react';
import {
	QuickPanelContext,
	QuickPanelData,
	quickPanelDefaultData,
	buildQuickPanelNotifications
} from './QuickPanelContext';
import {
	markAllClaimNotificationsAsRead,
	subscribeToClaimsNotificationsUpdated
} from '@/app/(control-panel)/claims/data/claimsMockData';

interface QuickPanelProviderProps {
	children: ReactNode;
}

export const QuickPanelProvider: React.FC<QuickPanelProviderProps> = ({ children }) => {
	const [data, setData] = useState<QuickPanelData>(quickPanelDefaultData);
	const [open, setOpen] = useState(false);

	useEffect(() => {
		const syncNotifications = () => {
			setData((prevData) => ({
				...prevData,
				notifications: buildQuickPanelNotifications()
			}));
		};

		syncNotifications();
		return subscribeToClaimsNotificationsUpdated(syncNotifications);
	}, []);

	const clearNotifications = () => {
		markAllClaimNotificationsAsRead();
		setData((prevData) => ({
			...prevData,
			notifications: buildQuickPanelNotifications()
		}));
	};

	const toggleQuickPanel = () => {
		setOpen((prevOpen) => !prevOpen);
	};

	const openQuickPanel = () => {
		setOpen(true);
	};

	const closeQuickPanel = () => {
		setOpen(false);
	};

	const value = useMemo(
		() => ({
			data,
			open,
			clearNotifications,
			toggleQuickPanel,
			openQuickPanel,
			closeQuickPanel
		}),
		[data, open]
	);

	return <QuickPanelContext.Provider value={value}>{children}</QuickPanelContext.Provider>;
};
