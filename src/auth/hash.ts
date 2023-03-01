import * as bcrypt from 'bcrypt';

export class Hash {
  constructor() {}

  static async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(password, salt);
  }

  static async compare(password: string, hashedPassword: string): Promise<boolean>{
    return await bcrypt.compare(password, hashedPassword)
  }
}
