import { Test, TestingModule } from '@nestjs/testing';
import { FilesService } from './files.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Article } from '../articles/entities/article.entity';
import * as path from 'path';
import * as fs from 'fs/promises';
import * as uuid from 'uuid';
import { ERRORS } from '../../const';

describe('FileService', () => {
  let service: FilesService;
  const ARTICLE_REPOSITORY_TOKEN = getRepositoryToken(Article);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilesService,
        {
          provide: ARTICLE_REPOSITORY_TOKEN,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();
    service = module.get<FilesService>(FilesService);
  });

  afterEach(() => {
    jest.restoreAllMocks(); // Восстановление всех моков после каждого теста
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createFile', () => {
    it('should create a file', async () => {
      const file = { buffer: Buffer.from('Test content') };
      const fileName = await service.createFile(file);

      const filePath = path.join(__dirname, '..', 'static', fileName);
      const fileContent = await fs.readFile(filePath, 'utf-8');

      expect(fileContent).toEqual('Test content');
      await fs.unlink(filePath);
    });

    it('should throw an error if file creation fails', async () => {
      const file = { buffer: Buffer.from('Test content') };
      const writeFileMock = jest
        .spyOn(fs, 'writeFile')
        .mockRejectedValue(new Error(ERRORS.RECORD_FAIL));

      await expect(service.createFile(file)).rejects.toThrowError(
        ERRORS.RECORD_FAIL,
      );

      expect(writeFileMock).toHaveBeenCalled();
    });

    afterEach(async () => {
      jest.clearAllMocks();
    });

    describe('readFile', () => {
      it('should read a file', async () => {
        const testFileName = 'test-file.jpg';
        const testFilePath = path.join(__dirname, '..', 'static', testFileName);
        await fs.writeFile(testFilePath, 'Test file content');
        const fileContent = await service.readFile(testFileName);
        const expectedContent = await fs.readFile(testFilePath);
        expect(fileContent).toEqual(expectedContent);
        await fs.unlink(testFilePath);
      });

      it('should throw an error if file reading fails', async () => {
        const testFileName = 'test-file.jpg';
        jest
          .spyOn(fs, 'readFile')
          .mockRejectedValue(new Error('File reading failed'));
        await expect(service.readFile(testFileName)).rejects.toThrow();
      });
    });

    describe('checkPath', () => {
      it('should create directory if it does not exist', async () => {
        const testDirPath = path.join(__dirname, '..', 'static', 'test-dir');

        await service.checkPath(testDirPath);

        const dirStat = await fs.stat(testDirPath);
        expect(dirStat.isDirectory()).toBeTruthy();
        await fs.rmdir(testDirPath);
      });

      it('should do nothing if directory exists', async () => {
        const testDirPath = path.join(__dirname, '..', 'static', 'test2-dir');
        await fs.mkdir(testDirPath, { recursive: true });
        const mkdirSpy = jest.spyOn(fs, 'mkdir');
        await service.checkPath(testDirPath);
        expect(mkdirSpy).not.toHaveBeenCalled();
        await fs.rmdir(testDirPath);
      });
    });
  });
});
