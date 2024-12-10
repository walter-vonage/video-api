import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RowRecordingComponent } from './row-recording.component';

describe('RowRecordingComponent', () => {
  let component: RowRecordingComponent;
  let fixture: ComponentFixture<RowRecordingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RowRecordingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RowRecordingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
