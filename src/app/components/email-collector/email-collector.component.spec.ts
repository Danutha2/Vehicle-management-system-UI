import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailCollectorComponent } from './email-collector.component';

describe('EmailCollectorComponent', () => {
  let component: EmailCollectorComponent;
  let fixture: ComponentFixture<EmailCollectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmailCollectorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmailCollectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
