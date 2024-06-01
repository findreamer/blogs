import { Body, Controller, Post, Get, Query } from '@nestjs/common';
import { ArticleService } from './article.service';
import { User } from '../../decorators/user.decorator';
import { CreateArticleDto, PublishArticleDto } from '@app/dtos/article.dto';

@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get('getArticles')
  async getArticles(
    @Query('pageNo') pageNo: number,
    @Query('pageSize') pageSize: number,
  ) {
    console.log('===> ', pageNo, pageSize);
    return await this.articleService.getArticles({ page: pageNo, pageSize });
  }

  @Post('createOrUpdate')
  async createOrUpdate(
    @User('id') userId: number,
    @Body() createArticleDto: CreateArticleDto,
  ) {
    if (!createArticleDto.title && !createArticleDto.content) {
      throw Error('标题和内容不能同时为空');
    }

    const res = await this.articleService.createOrUpdate(
      createArticleDto,
      userId,
    );
    return res;
  }

  @Get('getArticleInfo')
  async getArticleInfo(@Query('id') id: number) {
    if (!id) {
      throw Error('参数错误');
    }
    const res = await this.articleService.getArticleInfo(id);
    return res;
  }

  @Get('getCategoryList')
  async getCategoryList() {
    return await this.articleService.getCategoryList();
  }

  @Post('publish')
  async publish(@Body() publishArticleDto: PublishArticleDto) {
    return await this.articleService.publish(publishArticleDto);
  }

  @Post('deleteArticle')
  async deleteArticle(
    @Body('articleId') articleId: number,
    @User('id') userId: number,
  ) {
    if (!articleId) {
      throw Error('参数错误');
    }
    return await this.articleService.deleteArticle(articleId, userId);
  }

  @Get('getMyArticle')
  async getMyArticle(@User('id') userId: number) {
    return await this.articleService.getMyAricle(userId);
  }
}
