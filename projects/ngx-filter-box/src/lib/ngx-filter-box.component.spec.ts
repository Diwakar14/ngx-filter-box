import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxFilterBoxComponent } from './ngx-filter-box.component';

describe('NgxFilterBoxComponent', () => {
  let component: NgxFilterBoxComponent;
  let fixture: ComponentFixture<NgxFilterBoxComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NgxFilterBoxComponent]
    });
    fixture = TestBed.createComponent(NgxFilterBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
