import { Participation } from './participation.model';

export interface Country {
  id: number;
  country: string;
  participations: Participation[];
}
