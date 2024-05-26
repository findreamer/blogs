import { IsNotEmpty } from 'class-validator'

/** 创建文章 */
export class CreateArticleDto {
  id?: number
  title: string
  content: string
}

export class PublishArticleDto {
  @IsNotEmpty()
  id: number

  /** 文章简介 */
  @IsNotEmpty()
  introduction: string


  /** 文章分类 */
  @IsNotEmpty()
  categoryId: number


}

