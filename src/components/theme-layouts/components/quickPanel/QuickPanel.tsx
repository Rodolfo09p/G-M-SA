import FuseScrollbars from '@fuse/core/FuseScrollbars';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Typography from '@mui/material/Typography';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useQuickPanelContext } from './contexts/QuickPanelContext/useQuickPanelContext';

const StyledSwipeableDrawer = styled(SwipeableDrawer)(() => ({
	'& .MuiDrawer-paper': {
		width: 280
	}
}));

/**
 * The quick panel.
 */
function QuickPanel() {
	const { data, open, toggleQuickPanel, clearNotifications } = useQuickPanelContext();
	const unreadCount = data.notifications.filter((notification) => !notification.read).length;

	const notificationIconByType = {
		renewal: 'lucide:refresh-cw',
		document: 'lucide:file-warning',
		payment: 'lucide:credit-card'
	} as const;

	return (
		<StyledSwipeableDrawer
			open={open}
			anchor="right"
			onOpen={() => {}}
			onClose={() => toggleQuickPanel()}
			disableSwipeToOpen
		>
			<FuseScrollbars>
				<Box className="flex items-center justify-between px-6 py-4">
					<div>
						<Typography variant="h6">Notificaciones</Typography>
						<Typography variant="body2" color="text.secondary">
							{unreadCount} sin leer
						</Typography>
					</div>
					<Button
						size="small"
						color="secondary"
						onClick={clearNotifications}
						disabled={data.notifications.length === 0}
					>
						Limpiar
					</Button>
				</Box>
				<Divider />
				<List>
					<ListSubheader component="div">Ultimas 3</ListSubheader>
					{data.notifications.map((notification) => (
						<ListItem key={notification.id} alignItems="flex-start">
							<ListItemIcon className="min-w-9">
								<FuseSvgIcon>{notificationIconByType[notification.type]}</FuseSvgIcon>
							</ListItemIcon>
							<ListItemText
								primary={notification.title}
								secondary={
									<>
										<Typography variant="body2" color="text.secondary" component="span">
											{notification.detail}
										</Typography>
										<Typography
											variant="caption"
											color={notification.read ? 'text.secondary' : 'secondary.main'}
											display="block"
											sx={{ mt: 0.5 }}
										>
											{notification.createdAt}
										</Typography>
									</>
								}
							/>
						</ListItem>
					))}
				</List>
			</FuseScrollbars>
		</StyledSwipeableDrawer>
	);
}

export default QuickPanel;
