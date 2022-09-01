import Address, { AddressDocument } from '../../src/models/Address'

export const address1 = new Address({
  street: 'Lange Stationsstraat 352',
  postal: '3000',
  city: 'LEUVEN',
  country: 'BELGIUM',
})

export const address2 = new Address({
  street: 'Rue du Diamant 215',
  postal: '4800',
  city: 'VERVIERS',
  country: 'BELGIUM',
})

export const address3 = new Address({
  street: 'Tietgensgade 137',
  postal: '8800',
  city: 'VIBORG',
  country: 'Denmark',
})
