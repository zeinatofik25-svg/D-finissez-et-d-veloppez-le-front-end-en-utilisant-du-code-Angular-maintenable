import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

export interface HeaderIndicator {
  label: string;
  value: string | number;
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  @Input({ required: true }) title!: string;
  @Input() indicators: HeaderIndicator[] = [];
}
