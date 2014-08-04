'use strict';

var Mongo = require('mongodb');
var _ = require('lodash');

function Item(o){
  this.name           = o.name;
  this.dimensions     = {};
  this.dimensions.l   = o.dimensions.l * 1;
  this.dimensions.w   = o.dimensions.w * 1;
  this.dimensions.h   = o.dimensions.h * 1;
  this.weight         = o.weight * 1;
  this.color          = o.color;
  this.quantity       = o.quantity * 1;
  this.msrp           = o.msrp * 1;
  this.percentOff     = o.percentOff * 1;
}

Object.defineProperty(Item, 'collection', {
  get: function(){
    return global.mongodb.collection('items');
  }
});

Item.prototype.cost = function(){
  return this.msrp - ((this.msrp * this.percentOff)/100);
};

Item.prototype.save = function (cb){
  Item.collection.save(this,cb);
};

Item.find = function(query, cb) {
  Item.collection.find(query).toArray(function (err, items) { 
    for(var i = 0; i < items.length; i++) { items[i] = toProto(items[i]);} 
    cb(err, items);
  });
};

Item.findById = function (id, cb) {
   id = (typeof id === 'string') ? Mongo.ObjectID(id) : id;
  Item.collection.findOne({_id:id}, function (err, item){
    cb(err, toProto(item));
  });
};

Item.deleteById= function (id, cb) {
   id = (typeof id === 'string') ? Mongo.ObjectID(id) : id;
  Item.collection.findAndRemove({_id:id}, cb);
};


module.exports = Item;

//Private function 

function toProto(item) {
  item = _.create(Item.prototype, item);
}

