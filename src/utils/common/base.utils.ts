export class BaseUtils {
  public static getResponse(status: number, message: string, data: any) {
    return {
      data,
      message,
      status,
    };
  }

  public static getResponse1(status: number, message: string) {
    return {
      message,
      status,
    };
  }

  public static getResponse2(
    status: number,
    message: string,
    pagination: any,
    data: any,
  ) {
    return {
      data,
      message,
      pagination,
      status,
    };
  }
}
