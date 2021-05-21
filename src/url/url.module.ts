import { CacheModule, Module } from '@nestjs/common';
import { UrlService } from './url.service';
import { UrlResolver } from './url.resolver';
import { LoggingPlugin } from '../common/plugins/logging.plugin';

@Module({
  imports: [
    CacheModule.register({
      ttl: 120,
    }),
  ],
  providers: [UrlService, UrlResolver],
})
export class UrlModule {}
