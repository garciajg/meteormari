import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Products } from '../api/products.js';
import './product.js'
import './body.html';

Template.body.onCreated(function bodyOnCreated() {
  this.state = new ReactiveDict();
  Meteor.subscribe('products');
});

Template.body.helpers({
  products() {
    // const instance = Template.instane();
    const instance = Template.instance();
    if (instance.state.get('hideCompleted')) {
      // If hide completed is checked, filter products
      return Products.find({ checked: { $ne: true } }, { sort: { createdAt: -1 } });
    }
    // Show newest products on top
    return Products.find({}, {sort: {created_at: -1}});
  },
  incompleteCount(){
    return Products.find({ checked: { $ne: true }}).count()
  }
});

Template.body.events({
  'submit .new-product'(event) {
    // Prevent default browser from submit
    event.preventDefault();

    // Get value from form element
    const target = event.target;
    const product = target.product_name.value;

    /*
    Inser Product to Collection

    inserting into database withot frontend

    Products.insert({
      product,
      created_at: new Date(),
      owner: Meteor.userId(),
      username: Meteor.user().username,
    });
    */

    Meteor.call('products.insert', product);

    // Clear form
    target.product_name.value = '';
  },
  'change .hide-completed input'(event, instance) {
    instance.state.set('hideCompleted', event.target.checked);
  },
});
