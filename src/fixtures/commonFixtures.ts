import { faker } from '@faker-js/faker';

export const mockResult = {
  generatedMaps: [],
  raw: [],
  affected: 1,
};

export const wrongId = 'invalidId';
export const randomId = () => faker.number.int({ min: 1, max: 100 });

export const mockCacheManager = {
  get: jest.fn(),
  set: jest.fn(),
  del: jest.fn(),
  reset: jest.fn(),
};
