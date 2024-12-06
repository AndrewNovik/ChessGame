import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ycc',
  standalone: true,
})
export class YcoordinateConverterPipe implements PipeTransform {
  result: string = '';
  transform(num: number): string {
    switch (num) {
      case 0:
        this.result = 'a';
        break;
      case 1:
        this.result = 'b';
        break;
      case 2:
        this.result = 'c';
        break;
      case 3:
        this.result = 'd';
        break;
      case 4:
        this.result = 'e';
        break;
      case 5:
        this.result = 'f';
        break;
      case 6:
        this.result = 'g';
        break;
      case 7:
        this.result = 'h';
        break;
    }

    return this.result;
  }
}
