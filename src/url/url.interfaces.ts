export interface IHeightWidth {
  width?: string;
  height?: string;
}

export interface IUrlImage extends IHeightWidth {
  src: string;
}

export interface IReturned {
  title: string;
  description: string;
  image: string;
}
