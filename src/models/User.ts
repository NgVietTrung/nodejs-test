export interface IUser {
  id: string;
  login: string;
  password: string;
  version: string;
  createdAt: string;
  updatedAt: string;
}

class User {
  private id: string;
  private login: string;
  private password: string;
  private version: string;
  private createdAt: string;
  private updatedAt: string;

  constructor(
    id: string,
    login: string,
    password: string,
    version: string,
    createdAt: string,
    updatedAt: string
  ) {
    this.id = id;
    this.login = login;
    this.password = password;
    this.version = version;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

export { User };
