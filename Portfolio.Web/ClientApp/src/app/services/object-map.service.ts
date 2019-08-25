import { Injectable } from '@angular/core';
import { AdUser } from '../models';

@Injectable()
export class ObjectMapService {
  // map - Use when receiving response from HTTP request
  // mapPerson = (person: Object): Person => Object.assign(new Person, person);

  // mapCollection - Use when receiving response from HTTP request
  // mapPeople = (people: Object[]): Person[] => people.map(this.mapPerson);

  // compareWith - Use when binding object value to MatSelect
  // comparePeople = (p1: Person, p2: Person) => p1 && p2 ? p1.id === p2.id : false;
  compareAdUsers = (u1: AdUser, u2: AdUser) => u1 && u2 ? u1.guid === u2.guid : false;

  // trackBy - Use when iterating collection with NgFor
  // trackByPerson = (person: Person) => person.id;
}
