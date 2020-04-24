import { DDBBaseAttrs } from "./base.ddb.";
import { DDBTableKeyAttrs } from "./key.ddb";


interface Attrs {
   UserId: string;
   FirstName?: string;
   LastName?: string;
   FullName?: string;
   Email: string;
   AwsId: string;
   IsConfirmed?: boolean;
   DateInviteAccepted?: string;
   DateInviteSent?: string;
   InviteAccepted?: string;
   InviteSentBy?: string;
   Roles?: string[];
}

interface NonKeyAttrs extends Attrs {}

 export type DDBUser_AllAttrs = DDBTableKeyAttrs & Attrs & DDBBaseAttrs;

export type DDBUser = Attrs & DDBBaseAttrs;


