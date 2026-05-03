import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useQuickPanelContext } from './contexts/QuickPanelContext/useQuickPanelContext';

type QuickPanelToggleButtonProps = Readonly<{
	className?: string;
	children?: React.ReactNode;
}>;

/**
 * The quick panel toggle button.
 */
function QuickPanelToggleButton(props: QuickPanelToggleButtonProps) {
	const { className = '', children } = props;
	const { data, toggleQuickPanel } = useQuickPanelContext();
	const unreadCount = data?.notifications?.filter((notification) => !notification.read).length ?? 0;
	const defaultIcon = (
		<Badge
			badgeContent={unreadCount > 0 ? unreadCount : undefined}
			color="error"
			overlap="circular"
		>
			<FuseSvgIcon>lucide:bell</FuseSvgIcon>
		</Badge>
	);

	return (
		<IconButton
			onClick={() => toggleQuickPanel()}
			className={className}
			aria-label="notifications"
		>
			{children ?? defaultIcon}
		</IconButton>
	);
}

export default QuickPanelToggleButton;
