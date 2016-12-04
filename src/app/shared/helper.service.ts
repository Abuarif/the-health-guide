import { Injectable } from '@angular/core';

@Injectable()
export class HelperService {

  constructor() { }

  public paginate(data: any[], start: number, end: number): any[] {
    if (start >= 1) {
      data = data.slice(start - 1, end);
    }
    return data;
  }

  public sortByName(arr: any[]): any[] {
    return arr.sort((a, b) => {
      let x = a.name.toLowerCase(), y = b.name.toLowerCase();
      return x < y ? -1 : x > y ? 1 : 0;
    });
  }

}