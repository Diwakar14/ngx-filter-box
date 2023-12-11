import { NgModule } from '@angular/core';
import { NgxFilterBoxComponent } from './ngx-filter-box.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [NgxFilterBoxComponent],
  imports: [CommonModule, FormsModule],
  exports: [NgxFilterBoxComponent],
})
export class NgxFilterBoxModule {}
