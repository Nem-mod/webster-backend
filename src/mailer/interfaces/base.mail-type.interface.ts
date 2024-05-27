export interface IBaseMailType {
  extractPayload(mailInfo: object): object;
  generateJwt(payload: object): Promise<string>;
  prepareReturnLink(payload: object, returnLink: string): Promise<string>;
  setTemplateData(mailInfo: object): object;
  sendMail(email: string, templateData: object): Promise<void>;
  execute(mailInfo: object): Promise<void>;
}
