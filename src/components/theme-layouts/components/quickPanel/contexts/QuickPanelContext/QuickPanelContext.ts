import { createContext } from 'react';

export type QuickNotification = {
	id: number;
	title: string;
	detail: string;
	type: 'renewal' | 'document' | 'payment';
	createdAt: string;
	read: boolean;
};

export const quickPanelDefaultData = {
	notifications: [
		{
			id: 1,
			title: 'Renovacion proxima: SOA-9068571',
			detail: 'Vence en 5 dias. Revisa documentos y contacta al cliente.',
			type: 'renewal',
			createdAt: 'Hoy 09:10 AM',
			read: false
		},
		{
			id: 2,
			title: 'Documento pendiente en AUTOMOVIL',
			detail: 'Falta subir circulacion del vehiculo para AU-2404-3043.',
			type: 'document',
			createdAt: 'Hoy 08:42 AM',
			read: false
		},
		{
			id: 3,
			title: 'Cobro aplicado correctamente',
			detail: 'Se registro prima total de SOA-9068571 por USD 35.00.',
			type: 'payment',
			createdAt: 'Ayer 05:30 PM',
			read: true
		}
	]
};

export type QuickPanelData = typeof quickPanelDefaultData;

export interface QuickPanelContextType {
	data: QuickPanelData;
	open: boolean;
	clearNotifications: () => void;
	toggleQuickPanel: () => void;
	openQuickPanel: () => void;
	closeQuickPanel: () => void;
}

export const QuickPanelContext = createContext<QuickPanelContextType>({
	data: quickPanelDefaultData,
	open: false,
	clearNotifications: () => {},
	toggleQuickPanel: () => {},
	openQuickPanel: () => {},
	closeQuickPanel: () => {}
});
