import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DEFAULTS } from '../../const';
import { Article } from '../articles/entities/article.entity';
import { transliterate as tr, slugify } from 'transliteration';
import { Repository } from 'typeorm';

@Injectable()
export class SlugService {
  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
  ) {}
  async getUniqueSlug(title: string): Promise<string> {
    const slug = slugify(tr(title));
    const exists = await this.findSlugs(slug);

    if (!exists || exists.length === 0) {
      return slug;
    }

    const lastSlug = exists[exists.length - 1];
    const numbers = lastSlug.match(/\d+/g);
    const nextNumber = numbers
      ? parseInt(numbers[numbers.length - 1]) + 1
      : exists.length;

    return numbers && exists.length !== 1
      ? `${slug}${DEFAULTS.REPLACEMENT}${nextNumber}`
      : `${slug}${DEFAULTS.REPLACEMENT}${exists.length}`;
  }

  async findSlugs(slug: string): Promise<string[]> {
    const articles = (await this.articleRepository
      .createQueryBuilder('articles')
      .select('articles.slug')
      .where('slug like :slug', { slug: `${slug}%` })
      .getMany()) as Article[];

    return articles.map((article) => article.slug);
  }
}
