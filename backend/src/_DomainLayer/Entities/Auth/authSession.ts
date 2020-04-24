import { DDBUser } from "../DynamoDB/user.ddb";


export interface AuthSession {
    AccessToken?: string;
    RefreshToken?: string;
    User?: DDBUser;
 }