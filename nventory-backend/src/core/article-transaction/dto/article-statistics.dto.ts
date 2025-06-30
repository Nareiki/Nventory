export interface ArticleStatisticsDto {
    articleID: number;
    articleName: string;
    articleInformation: string;
    articleAmount: number;
    articlePrice: number;
    shelfID: number;
    warehouseID: number;
    totalTransactions: number; // Total number of transactions for this article
    totalAmountSold: number; // Total amount sold for this article
    totalRevenue: number; // Total revenue generated from this article
    lastTransactionDate: Date; // Date of the last transaction for this article
}
