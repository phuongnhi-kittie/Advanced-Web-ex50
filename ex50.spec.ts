import { TestBed } from '@angular/core/testing';
import { Book50Service } from './books';


describe('Books', () => {
  let service: Book50Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Book50Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
