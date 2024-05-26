import { Body, Controller, Post, Get, Query } from '@nestjs/common'
import { ArticleService } from './article.service'
import { User } from '../../decorators/user.decorator'
import { CreateArticleDto } from '@app/dtos/article.dto'

@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) { }

  @Get('getArticles')
  async getArticles(@Query('pageNo') pageNo: string, @Query('pageSize') pageSize: string) {

    console.log('===> ', pageNo, pageSize)

  }

  @Post('createOrUpdate')
  async createOrUpdate(@User('id') userId: number, @Body() createArticleDto: CreateArticleDto) {
    if (!createArticleDto.title && !createArticleDto.content) {
      throw Error('标题和内容不能同时为空')
    }

    const res = await this.articleService.createOrUpdate(createArticleDto, userId)
    return res
  }
}