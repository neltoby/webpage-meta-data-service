import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UrlModule } from './url/url.module';

@Module({
  imports: [
    GraphQLModule.forRoot({
      typePaths: ['./**/*.graphql'],
    }),
    UrlModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
