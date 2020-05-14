import { getCustomRepository } from 'typeorm';

import TransactionsRepository from '../repositories/TransactionsRepository';

import AppError from '../errors/AppError';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const transaction = await transactionsRepository.findOne(id);

    if (!transaction) {
      throw new AppError(
        'This transactions does not exist. Send a valida transaciton to be deleted',
        400,
      );
    }

    await transactionsRepository.remove(transaction);
  }
}

export default DeleteTransactionService;
