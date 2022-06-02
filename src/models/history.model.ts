import { UserLocationDto } from 'src/link/dto/location.dto';

export class IHistory {
  readonly location: UserLocationDto;
  readonly visitedAt: number;
  readonly shortId: string;
  readonly userId?: string;
}
