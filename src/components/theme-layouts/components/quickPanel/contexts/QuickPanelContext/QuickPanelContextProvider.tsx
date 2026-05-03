import { useMemo, useState, type ReactNode } from 'react';
import { QuickPanelContext, QuickPanelData, quickPanelDefaultData } from './QuickPanelContext';

interface QuickPanelProviderProps {
	children: ReactNode;
}

export const QuickPanelProvider: React.FC<QuickPanelProviderProps> = ({ children }) => {
	const [data, setData] = useState<QuickPanelData>(quickPanelDefaultData);
	const [open, setOpen] = useState(false);

	const clearNotifications = () => {
		setData((prevData) => ({
			...prevData,
			notifications: []
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
