import { faker } from '@faker-js/faker';
import { randomId } from './commonFixtures';
import { CreateArticleDto } from '../articles/dto/create-article.dto';
import { UpdateArticleDto } from 'src/articles/dto/update-article.dto';
import { Article } from 'src/articles/entities/article.entity';
import { mockCreatedUser } from './userFixtures';

export const getRandomArticle = (): CreateArticleDto => {
  return {
    title: faker.lorem.words(3),
    content: faker.lorem.words(30),
  };
};

export const getRandomArticleNoTitle = (): UpdateArticleDto => {
  return {
    content: faker.lorem.words(30),
  };
};

export const mockCreatedArticle = {
  id: randomId(),
  ...getRandomArticle(),
  slug: 'some-slug',
  image: 'default_placeholder.jpg',
  createdAt: faker.date.recent(),
  updatedAt: faker.date.recent(),
  author: mockCreatedUser,
} as Article;

export const mockQueryParams = {
  filters: { title: 'Sample Article', author: 7 },
  limit: 10,
  page: 1,
};
