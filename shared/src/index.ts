import {Constants} from './Constants';
export {Constants};
import {InventoryUris} from './InventoryUris';
export {InventoryUris};
import {TaxS, Tax} from './entity/inventory/Tax';
export {TaxS, Tax};
import {ProductS, Product} from './entity/inventory/Product';
export {Product, ProductS};
import {ProductGroupS, ProductGroup} from './entity/inventory/ProductGroup';
export {ProductGroupS, ProductGroup};
import { Unit, UnitS } from './entity/inventory/Unit';
export { Unit, UnitS };

export const Greeter = (name: string) => {

  return `Hello ${name}`;

};

export const Greeter2 = (name: string) => {

  return `2 Hello ${name}`;

};
