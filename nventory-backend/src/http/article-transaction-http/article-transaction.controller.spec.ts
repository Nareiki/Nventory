import { Test, TestingModule } from '@nestjs/testing';
import { ArticleTransactionController } from './article-transaction.controller';

describe('ArticleTransactionHttpController', () => {
  let controller: ArticleTransactionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArticleTransactionController],
    }).compile();

    controller = module.get<ArticleTransactionController>(ArticleTransactionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
