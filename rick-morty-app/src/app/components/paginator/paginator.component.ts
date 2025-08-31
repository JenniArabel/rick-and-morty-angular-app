import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-paginator',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './paginator.component.html',
})
export class PaginatorComponent {
  @Input() currentPage: number = 1;
  @Input() totalPages: number = 1;
  @Output() pageChange = new EventEmitter<number>();

  @Input() pages: number[] = [];

  canGoBack(): boolean {
    return this.currentPage > 1;
  }

  canGoForward(): boolean {
    return this.currentPage < this.totalPages;
  }

  onPageChange(page: number): void {
    if (page > 0) {
      this.pageChange.emit(page);
    }
  }
}
