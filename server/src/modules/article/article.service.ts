import { CreateArticleDto, PublishArticleDto } from '@app/dtos/article.dto';
import { ArticleEntity } from '@app/entities/article.entity';
import { CategoryEntity } from '@app/entities/category.entity';
import { UserEntity } from '@app/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationService } from '@app/services/pagination.service';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}

  async getArticles(params: { page: number; pageSize: number }) {
    const paginationService = new PaginationService<ArticleEntity>(
      this.articleRepository,
    );
    const res = await paginationService.paginate({
      ...params,
      options: {
        select: ['id', 'categoryId', 'introduction', 'title', 'creatorName'],
        where: { status: 1, isDeleted: 0 },
      },
    });

    return res;
  }

  async createOrUpdate(createArticleDto: CreateArticleDto, creatorId: number) {
    const userInfo = await this.userRepository.findOne({
      where: { id: creatorId },
      select: ['username', 'id'],
    });

    if (createArticleDto.id) {
      if (creatorId !== userInfo.id) {
        throw Error('无权限修改');
      }

      // 更新文章内容
      const res = await this.articleRepository.update(
        { id: createArticleDto.id },
        createArticleDto,
      );
      return res;
    } else {
      // 新创建内容
      const save = await this.articleRepository.save(
        Object.assign({}, createArticleDto, {
          creatorName: userInfo.username,
          creatorId: userInfo.id,
        }),
      );
      return save.id;
    }
  }

  async deleteArticle(articleId: number, creatorId: number) {
    const article = await this.articleRepository.findOne({
      where: { id: articleId, creatorId },
    });
    if (!article) {
      throw Error('删除失败！');
    }

    console.log('=> ', articleId, creatorId);
    const res = await this.articleRepository.update(
      { id: articleId, creatorId },
      { isDeleted: 1 },
    );
    return res;
  }

  async getMyAricle(creatorId: number) {
    const articles = await this.articleRepository.find({
      where: {
        creatorId,
        isDeleted: 0,
      },
      select: [
        'id',
        'title',
        'status',
        'createdTime',
        'updatedTime',
        'creatorName',
      ],
    });

    return {
      published: articles.filter((item) => item.status == 1),
      draft: articles.filter((item) => item.status === 0),
    };
  }

  async getArticleInfo(id: number) {
    this.addViewRecord(id);
    const article = await this.articleRepository.findOne({ where: { id } });
    return article;
  }

  async addViewRecord(id: number) {
    // 这里使用队列进行写入数据
  }

  async getCategoryList() {
    return this.categoryRepository.find();
  }

  async publish(publishArticleDto: PublishArticleDto) {
    const { id } = publishArticleDto;
    if (publishArticleDto.time) {
      // 往定时任务表塞数据
    }

    const time = publishArticleDto.time;
    delete publishArticleDto.time;

    let article = await this.articleRepository.findOne({ where: { id } });
    article = Object.assign({}, article, publishArticleDto, {
      status: time ? 0 : 1,
    });

    return await this.articleRepository.update({ id }, article);
  }
}
