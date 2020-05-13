import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();

    const incomeTotal = transactions
      .filter(transaction => transaction.type === 'income')
      .reduce(
        (accumulator, transaction) => accumulator + Number(transaction.value),
        0,
      );

    const outcomeTotal = transactions
      .filter(transaction => transaction.type === 'outcome')
      .reduce(
        (accumulator, transaction) => accumulator + Number(transaction.value),
        0,
      );

    const balance = {
      income: incomeTotal,
      outcome: outcomeTotal,
      total: incomeTotal - outcomeTotal,
    };

    return balance;
  }
}

export default TransactionsRepository;
