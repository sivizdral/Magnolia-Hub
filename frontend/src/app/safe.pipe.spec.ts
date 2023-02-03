import { Sanitizer } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SafePipe } from './safe.pipe';

describe('SafePipe', () => {
  it('create an instance', () => {
    let sanitizer!: DomSanitizer;
    const pipe = new SafePipe(sanitizer);
    expect(pipe).toBeTruthy();
  });
});
