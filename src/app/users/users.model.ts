// tslint:disable:max-classes-per-file
export class User {
  public id: number;
  public name: string;
  public username: string;
  public email: string;
  public address: Address;
  public phone: string;
  public website: string;
  public company: Company;

  constructor(id: number,
              name: string,
              username: string,
              email: string,
              address: Address,
              phone: string,
              website: string,
              company: Company) {
    this.id = id;
    this.name = name;
    this.username = username;
    this.email = email;
    this.address = address;
    this.phone = phone;
    this.website = website;
    this.company = company;
  }
}

export class Address {
  public street: string;
  public suite: string;
  public city: string;
  public zipcode: string;
  public geo: Coordinates;

  constructor(street: string, suite: string, city: string, zipcode: string, geo: Coordinates) {
    this.street = street;
    this.suite = suite;
    this.city = city;
    this.zipcode = zipcode;
    this.geo = geo;
  }
}

export class Coordinates {
  public lat: string;
  public lng: string;

  constructor(lat: string, lng: string) {
    this.lat = lat;
    this.lng = lng;
  }
}

export class Company {
  public name: string;
  public catchPhrase: string;
  public bs: string;

  constructor(name: string, catchPhrase: string, bs: string) {
    this.name = name;
    this.catchPhrase = catchPhrase;
    this.bs = bs;
  }
}
