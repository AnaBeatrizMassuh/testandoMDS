/* eslint-disable import/extensions */
import {
  IAccountModel,
  IAddAccount,
  IAddAccountModel,
} from "../../presentation/protocols/signup-protocols";
import { IHasher } from "../protocols/database/data-sign-up-protocols";
import { ILoadAccountByEmailRepository } from "../protocols/database/ILoadAccountByEmailRepository";

class AddAccountRepository implements IAddAccount {
  constructor(
    private readonly hasher: IHasher,
    private readonly addAccountRepository: IAddAccount,
    private readonly loadAccountByEmailRepository: ILoadAccountByEmailRepository
  ) {
    this.hasher = hasher;
    this.addAccountRepository = addAccountRepository;
    this.loadAccountByEmailRepository = loadAccountByEmailRepository;
  }
  async add(accountData: IAddAccountModel): Promise<IAccountModel> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(
      accountData.email
    );
    if (!account) {
      const hashedPassword = await this.hasher.hash(accountData.password);
      const newAccount = await this.addAccountRepository.add(
        Object.assign(accountData, { password: hashedPassword })
      );
      return new Promise((resolve) => resolve(newAccount));
    }
    return null;
  }
}

export { AddAccountRepository };
