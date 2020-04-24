import { DDBBaseAttrs } from "./base.ddb.";
import { DDBTableKeyAttrs } from "./key.ddb";


interface Attrs {
   TransactionId: string;
   Amount: number;
   Description: string;
   UserId?: string;
}

interface NonKeyAttrs extends Attrs {}

 export type DDBTransaction_AllAttrs = DDBTableKeyAttrs & Attrs & DDBBaseAttrs;

export type DDBTransaction = Attrs & DDBBaseAttrs;


