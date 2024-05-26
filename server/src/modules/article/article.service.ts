import { CreateArticleDto } from '@app/dtos/article.dto';
import { ArticleEntity } from '@app/entities/article.entity';
import { UserEntity } from '@app/entities/user.entity';
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';


@Injectable()
export class ArticleService {
  constructor(


    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) { }

  async createOrUpdate(createArticleDto: CreateArticleDto, creatorId: number) {
    const userInfo = await this.userRepository.findOne({ where: { id: creatorId }, select: ['username', 'id'] })

    if (createArticleDto.id) {
      if (createArticleDto.id !== userInfo.id) {
        throw Error('无权限修改');
      }

      // 更新文章内容
      const res = await this.articleRepository.update({ id: createArticleDto.id }, createArticleDto)
      // return createArticleDto.id
      return res

    } else {
      // 新创建内容
      const save = this.articleRepository.save(Object.assign({}, createArticleDto, {
        creatorName: userInfo.username,
        creatorId: userInfo.id
      }))
    }

  }

  async deleteArticle(articleId: number, creatorId: number) {
    const article = await this.articleRepository.findOne({ where: { id: articleId, creatorId } })
    if (!article) {
      throw Error('删除失败！')
    }

    const res = await this.articleRepository.update({ id: articleId, creatorId }, { isDeleted: 1 })
    return res

  }

  async getMyAricle(creatorId: number) {
    const articles = await this.articleRepository.find({
      where: {
        creatorId, isDeleted: 0
      },
      select: ['id', 'title', 'status', 'createdTime', 'updatedTime', 'creatorName']
    })

    return {
      published: articles.filter(item => item.status == 1),
      draft: articles.filter((item) => item.status === 0),
    }

  }
}