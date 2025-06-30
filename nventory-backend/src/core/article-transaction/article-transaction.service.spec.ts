import { Test, TestingModule } from '@nestjs/testing';
import { ArticleTransactionService } from './article-transaction.service';

describe('ArticleTransactionService', () => {
  let service: ArticleTransactionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ArticleTransactionService],
    }).compile();

    service = module.get<ArticleTransactionService>(ArticleTransactionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
