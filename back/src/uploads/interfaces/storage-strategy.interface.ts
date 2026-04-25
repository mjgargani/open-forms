export interface IStorageStrategy {
  save(file: Buffer, fileName: string): Promise<string>;
}