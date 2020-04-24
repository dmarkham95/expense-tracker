import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { DDBUser, DDBUser_AllAttrs } from "_DomainLayer/Entities/DynamoDB/user.ddb";
import { DDB_Type } from "_DomainLayer/Enums/ddb-types";
import { DDBOverloadedTableTransformer } from "../../dynamodb.table.transformers";
import { buildCompositeKey, destructCompositeKey } from "../../utils/utils";

/**
 * Transformers define how the application level DTO objects transforms to DynamoDB attributes in a table
 */
export class UserAttrsTransformer extends DDBOverloadedTableTransformer<
DDBUser_AllAttrs,
DDBUser
> {
  constructor() {
    super();
  }

  public prefixes = {
    Node: "",
    TypeTarget: DDB_Type.user,
    GSIK: "",
    Data: ""
  };

  public attrsToItemTransformer = {
    UserId: (pk: string) => destructCompositeKey(pk, 1),
  };

  public itemToAttrsTransformer = {
    Node: (id: string) => id,
    TypeTarget: (id: string) => buildCompositeKey(this.prefixes.TypeTarget, id),
    GSIK: (id: string) => buildCompositeKey(this.prefixes.TypeTarget, id),
    Data: (name: string) => name,
  };

  public transformAttrsToItem(dynamodbItem: DDBUser_AllAttrs): DDBUser {
    const { Node,TypeTarget,GSIK,Data, ...rest } = dynamodbItem;
    return {
      UserId: destructCompositeKey(TypeTarget,1),
      ...rest,
    };
  }

  public transformItemToAttrs(item: DDBUser): DDBUser_AllAttrs {
    const { ...rest } = item;
    return {
      Node: this.itemToAttrsTransformer.Node(item.UserId),
      TypeTarget: this.itemToAttrsTransformer.TypeTarget(item.UserId),
      GSIK: this.itemToAttrsTransformer.GSIK(item.UserId),
      Data: this.itemToAttrsTransformer.Data(item.UserId),
      ...rest
    };
  }

  public primaryKey(id: string) {
    return {
      [this.attrName('Node')]: this.itemToAttrsTransformer.Node(id),
      [this.attrName('TypeTarget')]: this.itemToAttrsTransformer.TypeTarget(id),
    };
  }

  public buildFullObject(items: DocumentClient.AttributeMap[]){
    let user = {} as DDBUser;
    

    items.forEach((item: DocumentClient.AttributeMap) => {
      let key = destructCompositeKey(item["TypeTarget"],0);

      switch (key) {
        case DDB_Type.user:
          
            let _user = (item as DDBUser_AllAttrs);

            user.UserId = _user.Node;
            user.FirstName = _user.FirstName;
            user.LastName = _user.LastName;
            user.Email = _user.Email;
            user.AwsId = _user.Node;
            user.IsConfirmed = _user.IsConfirmed;
            user.IsActive = _user.IsActive;

          break;
        default:
          break;
      }

    } );

    return user;
  }
}
