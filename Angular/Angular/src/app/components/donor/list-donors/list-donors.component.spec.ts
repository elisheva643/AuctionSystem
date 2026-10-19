import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListDonorsComponent } from './list-donors.component';

describe('ListDonorsComponent', () => {
  let component: ListDonorsComponent;
  let fixture: ComponentFixture<ListDonorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListDonorsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListDonorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
