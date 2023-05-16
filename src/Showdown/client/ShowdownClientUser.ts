export class ShowdownClientUser {
	constructor(private _data: ShowdownClientUserData) {}

	public get username() { return this._data.username; }
	public get avatar() { return this._data.avatar; }
	public get userId() { return this._data.userid; }
	public get loggedIn() { return this._data.loggedin; }
}

type ShowdownClientUserData = {
	userid: string;
	usernum: string;
	username: string;
	email: string | null;
	registertime: string;
	group: string;
	banstate: string;
	ip: string;
	avatar: string;
	account: string | null;
	logintime: string;
	loginip: string;
	loggedin: boolean;
	outdatedpassword: boolean;
}