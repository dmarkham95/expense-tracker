// Prefix the token with an underscore because Nest uses the token
// "UserRepository" for the TypeORM repository already. Need to find a better
// solution.
export const TASK_REPOSITORY = '_TaskRepository';
export const UNIT_REPOSITORY = '_UnitRepository';
export const AUTH_REPOSITORY = '_AuthRepository';
export const USER_REPOSITORY = '_USER_REPOSITORY';
export const ACCOUNT_REPOSITORY = '_ACCOUNT_REPOSITORY';