export interface IShowdownEvents {
	ready: () => void;
	conencted: () => void;
	disconnected: (code: number, reason: string) => void;
	error: (err: Error) => void;
	debug: (data: string) => void;
	noinit: (sections: string[]) => void;
	init: (sections: string[]) => void;
	updateUser: (sections: string[]) => void;
	message: (message: any) => void;
	updateChallenges: (sections: string[]) => void;
	updateSearch: (sections: string[]) => void;
	queryResponse: (data: any) => void;
}