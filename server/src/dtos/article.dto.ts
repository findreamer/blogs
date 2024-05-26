import { isNotEmpty } from 'class-validator'

export class CreateArticleDto {
  id?: number
  title: string
  content: string
}