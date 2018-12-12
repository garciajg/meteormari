import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import './product.html';

Template.product.helpers({
  isOwner() {
    return this.owner === Meteor.userId();
  },
});

Template.product.events({
  'click .toggle-checked'() {
    Meteor.call('products.setChecked', this._id, !this.checked);
  },
  'click .delete'() {
    Meteor.call('products.remove', this._id);
  },
  'click .toggle-private'() {
    Meteor.call('products.setPrivate', this._id, !this.private);
  },
});
