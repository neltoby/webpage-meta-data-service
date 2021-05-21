import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { url } from 'inspector';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  const queryUrl = `
  query getUrl($url: String!){
    url(url: $url){
      title
      description
      image
    }
  }
  `;

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('getUrl', () => {
    const sentUrl = 'https://trend-user.netlify.app';
    return request(app.getHttpServer())
      .get('/graphql')
      .send({
        variables: {
          url: sentUrl,
        },
        query: queryUrl,
      })
      .expect(({ body }) => {
        console.log(body, 'line 48');
        const url = body.data.url;
        console.log(url);
        expect(url).toHaveProperty('title');
        expect(url).toHaveProperty('description');
        expect(url).toHaveProperty('image');
      });
  });
});
