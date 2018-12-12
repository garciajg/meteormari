import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

export const Products = new Mongo.Collection('products');

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('products', function productPublication() {
    return Products.find({
      $or: [
        { private: { $ne: true } },
        { owner: this.userId },
      ],
    });
  });
}

Meteor.methods({
  'products.insert'(product_name) {
    check(product_name, String);

    // Make sure the user is logged in before inserting a task
    if (! Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    Products.insert({
      product_name,
      createdAt: new Date(),
      owner: Meteor.userId(),
      username: Meteor.user().username,
    });
  },
  'products.remove'(productId) {
    check(productId, String);

    const product = Products.findOne(productId);
    if (product.private && product.owner !== Meteor.userId()) {
      // If the task is private, make sure only the owner can delete it
      throw new Meteor.Error('not-authorized');
    }

    Products.remove(productId);
  },
  'products.setChecked'(productId, setChecked) {
    check(productId, String);
    check(setChecked, Boolean);

    Products.update(productId, { $set: { checked: setChecked } });
  },

  'products.setPrivate'(productId, setToPrivate) {
      check(productId, String);
      check(setToPrivate, Boolean);

      const product = Products.findOne(productId);
      if (product.private && product.owner !== Meteor.userId()) {
        // If the task is private, make sure only the owner can delete it
        throw new Meteor.Error('not-authorized');
      }

      Products.update(productId, { $set: { private: setToPrivate } });
    },
});
