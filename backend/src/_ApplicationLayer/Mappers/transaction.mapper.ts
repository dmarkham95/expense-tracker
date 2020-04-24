import { DDBTransaction } from "_DomainLayer/Entities/DynamoDB/Transaction.ddb";
import { IMapper } from "_DomainLayer/Services/IMapper ";
import { TransactionDto } from "_ApplicationLayer/DTO/Transaction/transaction.dto";


class TransactionMapper implements IMapper<DDBTransaction,TransactionDto> {
    
    toDomain(dto: TransactionDto): DDBTransaction {
        let Transaction: DDBTransaction = {
            TransactionId: dto.id,
            Description: dto.description,
            Amount: dto.amount,
            UserId: dto.userId,
            CreatedBy: dto.userId ? dto.userId: null,
            UpdatedBy: dto.userId ? dto.userId: null,
        };

        return Transaction;
    }    
    
    toDTO(t: DDBTransaction) {

        let dto: TransactionDto = {
            id: t.TransactionId,
            userId: t.UserId,
            amount: t.Amount,
            description: t.Description
        }

        return dto;
    }

}

const instance = new TransactionMapper();

export default instance;