export class CreateTransactionDto {
    articleID: number;
    transactionTimestamp: Date;
    transactionType: string;
    transactionAmount: number;
    transactionPrice: number;
}
