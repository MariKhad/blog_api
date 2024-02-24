import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ERRORS } from '../../const';
import * as path from 'path';
import * as fs from 'fs/promises';
import * as uuid from 'uuid';

@Injectable()
export class FilesService {
  async createFile(file: any): Promise<string> {
    try {
      const fileName = uuid.v4() + '.jpg';
      const filePath = path.resolve(__dirname, '..', 'static');
      this.checkPath(filePath);
      await fs.writeFile(path.join(filePath, fileName), file.buffer);
      return fileName;
    } catch (e) {
      console.error('Error while creating file:', e);
      throw new HttpException(
        ERRORS.RECORD_FAIL,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async readFile(filename: string): Promise<Buffer> {
    const filePath = path.join(__dirname, '../static', filename);
    return fs.readFile(filePath);
  }

  async checkPath(filePath: string): Promise<void> {
    if (!(await fs.stat(filePath).catch(() => null))) {
      await fs.mkdir(filePath, { recursive: true });
    }
  }
}
