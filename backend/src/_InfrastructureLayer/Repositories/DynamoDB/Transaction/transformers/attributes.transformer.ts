import { DDBTransaction, DDBTransaction_AllAttrs } from "_DomainLayer/Entities/DynamoDB/Transaction.ddb";
import { DDB_Type } from "_DomainLayer/Enums/ddb-types";
import { DDBOverloadedTableTransformer } from "../../dynamodb.table.transformers";
import { buildCompositeKey, destructCompositeKey } from "../../utils/utils";

/**
 * Transformers define how the application level DTO objects transforms to DynamoDB attributes in a table
 */
export class TransactionAttrsTransformer extends DDBOverloadedTableTransformer<
  DDBTransaction_AllAttrs,
  DDBTransaction
  > {
  constructor() {
    super();
  }

  public prefixes = {
    Node: "",
    TypeTarget: DDB_Type.Transaction,
    GSIK: "",
    Data: "",
    User: DDB_Type.user,
  };

  public attrsToItemTransformer = {
    TransactionId: (pk: string) => destructCompositeKey(pk, 1),
    AssignedUserId: (pk: string) => destructCompositeKey(pk, 1),
    UnitId: (pk: string) => destructCompositeKey(pk, 1),
  };

  public itemToAttrsTransformer = {
    Node: (id: string) => id,
    TypeTarget: (id: string) => buildCompositeKey(this.prefixes.TypeTarget, id),
    GSIK: (data: string) => buildCompositeKey(this.prefixes.TypeTarget, data),
    Data: (name: string) => name,
    User: (data: string) => buildCompositeKey(this.prefixes.User, data),
  };

  public transformAttrsToItem(dynamodbItem: DDBTransaction_AllAttrs): DDBTransaction {
    const { Node, TypeTarget, GSIK, Data, ...rest } = dynamodbItem;
    return {
      TransactionId: this.attrsToItemTransformer.TransactionId(TypeTarget),
      UserId: Node,
      ...rest,
    };
  }

  public transformItemToAttrs(item: DDBTransaction): DDBTransaction_AllAttrs {
    const { CreatedBy,UpdatedBy,...rest } = item;
    return {
      Node: this.itemToAttrsTransformer.Node(item.UserId),
      TypeTarget: this.itemToAttrsTransformer.TypeTarget(item.TransactionId),
      GSIK: this.itemToAttrsTransformer.GSIK(item.TransactionId),
      Data: item.Description,
      CreatedBy: CreatedBy ? this.itemToAttrsTransformer.User(CreatedBy) : null,
      UpdatedBy: UpdatedBy ? this.itemToAttrsTransformer.User(UpdatedBy) : null,
      ...rest
    };
  }

  

  public primaryKey(id: string,node: string) {
    return {
      [this.attrName('Node')]: this.itemToAttrsTransformer.Node(node),
      [this.attrName('TypeTarget')]: this.itemToAttrsTransformer.TypeTarget(id),
    };
  }

}
