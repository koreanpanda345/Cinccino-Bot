export interface IEvent {
	name: string;
	id: string;
	onlyOnce?: boolean;
	disabled?: boolean;
	invoke: (...args: any[]) => Promise<void> | void;
}