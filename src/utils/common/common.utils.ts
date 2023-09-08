import * as bcrypt from 'bcrypt';
import * as colors from 'colors';
colors.enable();
class Logger {
  private readonly context: string;
  static error: any;
  constructor(context: string) {
    this.context = context;
  }

  getLogger(context: string) {
    return new Logger(context);
  }

  log(message: string) {
    console.log(`[${this.context}] ${message}`.blue);
  }

  error(message: string, trace?: string) {
    console.error(`[${this.context}] ${message}`.red, trace);
  }

  info(message: string) {
    console.log(`[${this.context}] ${message}`.green);
  }
  warn(message: string) {
    console.log(`[${this.context}] ${message}`.yellow);
  }
  debug(message: string) {
    console.log(`[${this.context}] ${message}`.cyan);
  }
  verbose(message: string) {
    console.log(`[${this.context}] ${message}`.magenta);
  }
  wtf(message: string) {
    console.log(`[${this.context}] ${message}`.bgRed);
  }
}

class CommonUtils {
  static generateRandomString(length = 15) {
    let result = '';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let index = 0; index < length; index++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  static encodePassword(password: string) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    return hash;
  }

  static comparePassword(password: string, hash: string) {
    return bcrypt.compareSync(password, hash);
  }
}

export { Logger, CommonUtils };
