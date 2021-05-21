import { Test, TestingModule } from '@nestjs/testing';
import { CacheModule, HttpException } from '@nestjs/common';
import { UrlService } from './url.service';
import { UrlResolver } from './url.resolver';

describe('UrlService', () => {
  let service: UrlService;
  const result = `<html><head>
  <meta name='description' content='My test webpage'>
  <meta name='og:description' content='My test webpage'>
  <meta name='twitter:description' content='My test webpage'>
  <title>Title for my test webpage</title>
  </head>
  <body>
  <img src='fake-path-to-Image-largest' height=450 width=400 alt='fk' />
  <img src='fake-path-to-Image' height=300 width=400 alt='fk' />
  <img src='fake-path-to-Image' height=400 width=400 alt='fk' />
  </body>
  </html>
  `;
  const expVal = {
    title: 'Title for my test webpage',
    description: 'My test webpage',
    image: 'fake-path-to-Image-largest',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        CacheModule.register({
          ttl: 120,
        }),
      ],
      providers: [UrlService, UrlResolver],
    }).compile();

    service = module.get<UrlService>(UrlService);

    service['httpGetPage'] = jest.fn(async () => {
      service.htmlResponse = result;
    });

    service['saveToCache'] = jest.fn(async () => {
      console.log('save to cache');
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('httpGetPage method should set htmlResponse property to result', async () => {
    await service['httpGetPage']();
    expect(service.htmlResponse).toBe(result);
  });

  it('validateUrl method should throw for invalide url', () => {
    expect(() =>
      service['validateUrl']('htt://trend-user.netlify.app'),
    ).toThrow();
  });

  it('validateUrl method should set url property', () => {
    const url = 'https://trend-user.netlify.app';
    service['validateUrl'](url);
    expect(service.url).toBe(url);
  });

  it('getMetadata method should return value of the IReturn interface', async () => {
    service.title = 'Test title';
    service.description = 'Test description';
    service.largestImage = 'test-Image';
    const retVal = {
      title: service.title,
      description: service.description,
      image: service.largestImage,
    };
    expect(await service['getMetadata']()).toEqual(retVal);
  });

  it('parseStyle method should return an array of Object with property of either height or width', () => {
    const str = 'height:400;width:300;max-height:500;';
    const arr = service['parseStyle'](str);
    expect(arr.length).toBe(2);
    expect(arr[0]).toHaveProperty('height', '400');
    expect(arr[1]).toHaveProperty('width', '300');
  });

  it('compareSize method should return the src attribute for the largest image', () => {
    const obj = [
      { src: 'meduim-size', height: '500', width: '400' },
      { src: 'big-size', height: '550', width: '400' },
      { src: 'biggest-size', height: '700', width: '350' },
      { src: 'small-size', height: '400', width: '400' },
      { src: 'smallest-size', height: '300', width: '300' },
    ];
    expect(service['compareSize'](obj)).toBe('biggest-size');
  });

  it('parseResponse to return IReturn object type', async () => {
    await service['httpGetPage']();
    expect(service.htmlResponse).toBe(result);
    const retVal = await service['parseResponse']();
    expect(retVal).toEqual(expVal);
  });

  it('getUrl to return object to type IReturn', async () => {
    const retVal = await service.getUrl('https://trend-user.netlify.app');
    expect(retVal).toEqual(expVal);
  });

  it('getUrl to return object to throw', async () => {
    try {
      await service.getUrl('htt://trend-user.netlify.app');
    } catch (e: any) {
      expect(e instanceof HttpException).toBe(true);
      expect(e.response.error).toBe('Not a valid web protocol.');
      expect(e.response).toHaveProperty('status', 400);
    }
  });
});
