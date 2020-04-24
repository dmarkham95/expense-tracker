export default interface User {
	id: string;
	displayName: string;
	roles: string[];
	photoURL: string | null;
	email: string;
}
