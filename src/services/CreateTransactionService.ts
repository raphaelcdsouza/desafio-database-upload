import { getCustomRepository, getRepository } from 'typeorm';

import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import Category from '../models/Category';
import TransactionRepository from '../repositories/TransactionsRepository';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  categoryTitle: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    categoryTitle,
  }: Request): Promise<Transaction> {
    const categoriesRepository = getRepository(Category);

    const checkCategoryExists = await categoriesRepository.findOne({
      where: {
        title: categoryTitle,
      },
    });

    let category;

    if (!checkCategoryExists) {
      category = categoriesRepository.create({ title: categoryTitle });

      await categoriesRepository.save(category);
    } else {
      category = checkCategoryExists;
    }

    const transactionsRepository = getCustomRepository(TransactionRepository);

    const balance = await transactionsRepository.getBalance();

    if (balance.income === 0 && type === 'outcome') {
      throw new AppError(
        'You need a first income transaction to start spend money',
        401,
      );
    }

    if (balance.total < value && type === 'outcome') {
      throw new AppError("You should not spend money you don't have", 400);
    }

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category_id: category.id,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
