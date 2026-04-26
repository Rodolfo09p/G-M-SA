import type { DocumentItem } from '../data/dataConfig';

export const mapTypeToCategory = (type: DocumentItem['type']): string => {
	switch (type) {
		case 'CLIENT':
			return 'Cliente';
		case 'RISK':
			return 'Riesgo';
		case 'POLICY':
		default:
			return 'Poliza';
	}
};

export const toMockFileName = (itemKey: string): string => {
	return `${itemKey}.pdf`;
};
