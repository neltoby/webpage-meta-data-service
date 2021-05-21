import {
  Injectable,
  Inject,
  HttpException,
  HttpStatus,
  CACHE_MANAGER,
} from '@nestjs/common';
import got from 'got';
import { URL } from 'url';
import { Cache } from 'cache-manager';
import { parse } from 'node-html-parser';
import { IUrlImage, IHeightWidth, IReturned } from './url.interfaces';
@Injectable()
export class UrlService {
  private _htmlResponse: any;
  private _url: string;
  private _title: string;
  private _description = '';
  private _largestImage: string;
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  get htmlResponse() {
    return this._htmlResponse;
  }

  set htmlResponse(val: any) {
    this._htmlResponse = val;
  }

  get url() {
    return this._url;
  }

  set url(val: string) {
    this._url = val;
  }

  get title() {
    return this._title;
  }

  set title(val: string) {
    this._title = val;
  }

  get description() {
    return this._description;
  }

  set description(val: string) {
    this._description = val;
  }

  get largestImage() {
    return this._largestImage;
  }

  set largestImage(val: string) {
    this._largestImage = val;
  }

  private validateUrl(uri: string) {
    try {
      const validUrl = new URL(uri);
      const { protocol } = validUrl;
      if (protocol !== 'http:' && protocol !== 'https:') {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: 'Not a valid web protocol.',
          },
          HttpStatus.BAD_REQUEST,
        );
      } else {
        this.url = uri;
      }
      return true;
    } catch (e) {
      throw e;
    }
  }

  private async httpGetPage(): Promise<any> {
    try {
      const { body } = await got(this.url);
      this.htmlResponse = body;
    } catch (e) {
      throw new HttpException(e, HttpStatus.NOT_FOUND);
    }
  }

  async getUrl(url: string): Promise<IReturned> {
    if (this.validateUrl(url)) {
      try {
        const savedValue: string = await this.cacheManager.get(url);
        if (savedValue) {
          const retVal: IReturned = JSON.parse(savedValue);
          return retVal;
        }
        await this.httpGetPage();
        return this.parseResponse();
      } catch (e) {
        throw new HttpException(e, HttpStatus.NOT_FOUND);
      }
    }
  }

  private async parseResponse(): Promise<IReturned> {
    const root = parse(this.htmlResponse);
    let meta: any[];
    let img: any[];
    try {
      this.title = root.querySelector('title').rawText;
    } catch (e) {
      this.title = 'No title';
    }
    try {
      meta = root.querySelectorAll('meta');
    } catch (e) {
      meta = [];
    }
    try {
      img = root.querySelectorAll('img');
    } catch (e) {
      img = [];
    }
    const image: IUrlImage[] = [];
    let setDesc = false;
    meta.forEach((item) => {
      if (item.getAttribute('name') === 'description') {
        this.description = item.getAttribute('content');
        setDesc = true;
      }
    });
    this.description = setDesc ? this.description : 'No description';
    if (img.length) {
      img.forEach((Img) => {
        const src = Img.getAttribute('src');
        const height = Img.getAttribute('height');
        const width = Img.getAttribute('width');
        const style = Img.getAttribute('style');
        if (height) {
          if (width) {
            image.push({ src, height, width });
          } else if (style != undefined) {
            const widthHeight: IHeightWidth[] = this.parseStyle(style);
            if (widthHeight.length) {
              if (widthHeight.length === 1)
                image.push({ src, ...widthHeight[0] });
              else image.push({ src, ...widthHeight[0], ...widthHeight[1] });
            }
          } else {
            image.push({ src, height });
          }
        } else if (width) {
          if (style !== undefined) {
            const widthHeight: IHeightWidth[] = this.parseStyle(style);
            if (widthHeight.length) {
              if (widthHeight.length === 1)
                image.push({ src, ...widthHeight[0] });
              else image.push({ src, ...widthHeight[0], ...widthHeight[1] });
            }
          } else {
            image.push({ src, width });
          }
        } else if (style != undefined) {
          const widthHeight: IHeightWidth[] = this.parseStyle(style);
          if (widthHeight.length) {
            if (widthHeight.length === 1)
              image.push({ src, ...widthHeight[0] });
            else image.push({ src, ...widthHeight[0], ...widthHeight[1] });
          }
        } else {
          image.push({ src });
        }
      });
      this.largestImage = this.compareSize(image);
    } else {
      this.largestImage = 'No image exist at load time';
    }
    return await this.getMetadata();
  }

  private async saveToCache(val: IReturned) {
    await this.cacheManager.set(this.url, JSON.stringify(val));
  }

  private async getMetadata(): Promise<IReturned> {
    const retVal = {
      title: this.title,
      description: this.description,
      image: this.largestImage,
    };
    await this.saveToCache(retVal);
    return retVal;
  }

  private parseStyle(style: string): IHeightWidth[] {
    const obj: IHeightWidth[] = [];
    if (style.includes(';')) {
      const parsed: string[] = style.split(';');
      parsed.forEach((item) => {
        const items = item.split(':');
        const styles: IHeightWidth = {};
        styles[items[0].trim()] = items[1];
        if (items[0].trim() === 'width' || items[0].trim() == 'height') {
          obj.push(styles);
        }
      });
    } else {
      const parsed: string[] = style.split(':');
      parsed.forEach((item) => {
        const items = item.split(':');
        const styles: IHeightWidth = {};
        styles[items[0].trim()] = items[1];
        if (items[0].trim() === 'width' || items[0].trim() == 'height') {
          obj.push(styles);
        }
      });
    }
    return obj;
  }

  private compareSize(arr: IUrlImage[]): string {
    const newArr = arr.sort((a, b) => {
      const heightA: number = parseInt(a.height);
      const heightB: number = parseInt(b.height);
      if (heightA > heightB) return -1;
      else if (heightA == heightB) {
        const widthA: number = parseInt(a.width);
        const widthB: number = parseInt(b.width);
        if (widthA > widthB) return -1;
        else if (widthA === widthB) return 0;
        else return 1;
      } else return 1;
    });
    return newArr[0].src;
  }
}
