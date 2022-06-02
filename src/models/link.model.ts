export class ILink {
  readonly title: string;
  readonly subTitle?: string;
  readonly description?: string;
  readonly picture?: string;
  readonly url: string;
  readonly shortId: string;
  views: number;
  readonly isSub?: boolean;
  readonly userId?: number;
  createdAt?: number;
  updatedAt?: number;
}
