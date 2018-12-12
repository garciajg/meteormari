import { Template } from 'meteor/templating';
 
import './body.html';
 
Template.body.helpers({
  products: [
    { product: 'Pantalones' },
    { product: 'Camisas' },
    { product: 'Zapatos' },
  ],
});