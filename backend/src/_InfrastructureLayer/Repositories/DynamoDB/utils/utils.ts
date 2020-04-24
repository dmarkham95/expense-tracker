import { AWSError } from 'aws-sdk';
import { logger } from '_Common/Logger';
import { IDynamoDBService } from '_DomainLayer/Services/IAwsService';

/**
 * Create dynamodb repository with transformers via dynamodb configuration
 * @param Repo RepositoryClass
 * @param Transformer TransformerClass
 * @param dynamodbService dynamodb configuration
 */
export function repositoryFactory(Repo, dynamodbService: IDynamoDBService) {
  return {
    provide: Repo,
    useFactory: () => {
      return new Repo(dynamodbService);
    },
  };
}

export function logDynamoDBError(errorDesc: string, err: AWSError, params: any) {
  let errMessage;
  if (!err.requestId) {
    // Not AWSError
    errMessage = err.message;
  }
  logger.error(`DynamoDB Error: ${errorDesc}`, {
    data: {
      params: params,
      error: errMessage || err,
    },
  });
}

export function logThrowDynamoDBError(errorDesc: string, params: any) {
  return (err: AWSError) => {
    logDynamoDBError(errorDesc, err, params);
    throw err;
  };
}

export function logThrowError(errorDesc: string, params: any) {
  return err => {
    logError(errorDesc, err, params);
    throw err;
  };
}

export function logError(errorDesc: string, err: any, params: any) {
  let errMessage;
  if (!err.requestId) {
    // Not AWSError
    errMessage = err.message;
  }
  logger.error(`Error: ${errorDesc}`, {
    data: {
      params: params,
      error: errMessage || err,
    },
  });
}

export function buildCompositeKey(base: string, ...params: string[]) {
  let str = base;
    for (const param of params) {
      if (param !== undefined && param !== null && param.length > 0) {
        str = str + '_' + param;
      } else {
        break;
      }
    }
  return str + (str === base ? '_' : '');
}

export function destructCompositeKey(key: string, index: number): string {
  if (!key) {
    return key;
  }
  const token = key.split('_')[index];
  return token;
}

/** Encode numbers in string preserving their lexicographical order */
export function encodePointToString(point: number) {
  const digitCount = Math.max(Math.floor(Math.log10(Math.abs(point))), 0) + 1;
  // https://www.arangodb.com/2017/09/sorting-number-strings-numerically/
  const prefix = String.fromCodePoint(digitCount + 33) + ' ';
  return prefix + point.toString();
}

export function decodeStringToPoint(point: string) {
  return parseInt(point.split(' ')[1], 10);
}
