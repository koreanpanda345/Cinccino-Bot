export interface IMonitor {
	id: string;
	disabled?: boolean;
	invoke: (...args: any[]) => Promise<unknown> | unknown;
}