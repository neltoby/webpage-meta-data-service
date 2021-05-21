import { UseFilters } from '@nestjs/common';
import { Resolver, Args, Query } from '@nestjs/graphql';
import { UrlService } from './url.service';
import { IReturned } from './url.interfaces';
import { HttpExceptionFilter } from '../common/filters/exception.filter';

@Resolver('Url')
export class UrlResolver {
  constructor(private readonly urlService: UrlService) {}

  @Query('url')
  @UseFilters(new HttpExceptionFilter())
  async getUrlMetadata(@Args('uri') uri: string): Promise<IReturned> {
    return await this.urlService.getUrl(uri);
  }
}
