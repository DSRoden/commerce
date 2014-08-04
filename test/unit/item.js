/* jshint expr:true */
/* global describe, it, before, beforeEach */

'use strict';

var expect = require('chai').expect;
var Item = require('../../app/models/item');
var dbConnect = require('../../app/lib/mongodb');
var Mongo = require('mongodb');

var ipad, android, cell;
describe('Item', function(){
  before(function(done){
    dbConnect('commerce-test', function(){
      done();
    });
  });
  
  beforeEach(function(done){
    Item.collection.remove(function() {
      var i = {name:'iPad', dimensions:{l:'3', w:'4', h:'5'}, weight:'2.5', color:'pink', quantity:'30', msrp:'200', percentOff:'5'};
      var a = {name:'android', dimensions:{l:'4', w:'4', h:'5'}, weight:'2.5', color:'green', quantity:'30', msrp:'100', percentOff:'5'};
      var c = {name:'cell', dimensions:{l:'5', w:'4', h:'5'}, weight:'2.5', color:'blue', quantity:'30', msrp:'300', percentOff:'5'};
      ipad = new Item(i);
      android = new Item(a);
      cell = new Item(c);
      ipad.save(function(){
        android.save(function(){
          cell.save( function () {
            done();
           }); 
         });
        });
      });
    });

  describe('constructor', function(){
    it('should create a new Item object', function(){
      var o = {name:'iPad', dimensions:{l:'3', w:'4', h:'5'}, weight:'2.5', color:'pink', quantity:'30', msrp:'200', percentOff:'5'};
      var ipad = new Item(o);

      expect(ipad).to.be.instanceof(Item);
      expect(ipad.name).to.equal('iPad');
      expect(ipad.dimensions.l).to.equal(3);
      expect(ipad.dimensions.w).to.equal(4);
      expect(ipad.dimensions.h).to.equal(5);
      expect(ipad.weight).to.be.closeTo(2.5, 0.1);
      expect(ipad.color).to.equal('pink');
      expect(ipad.quantity).to.equal(30);
      expect(ipad.msrp).to.equal(200);
      expect(ipad.percentOff).to.equal(5);
    });
  });

  describe('#cost', function(){
    it('should find the value of the item after percentoff', function(){
      var o = {name:'iPad', dimensions:{l:'3', w:'4', h:'5'}, weight:'2.5', color:'pink', quantity:'30', msrp:'200', percentOff:'5'};
      var ipad = new Item(o);
      var cost = ipad.cost(); 
      expect(cost).to.equal(190, 0.1);
   });
  });

  describe('#save', function(){
    it('should insert a new item into the database', function(done){
      var o = {name:'iPad', dimensions:{l:'3', w:'4', h:'5'}, weight:'2.5', color:'pink', quantity:'30', msrp:'200', percentOff:'5'};
      var ipad = new Item(o);
      ipad.save(function (){
        expect(ipad._id).to.be.instanceof(Mongo.ObjectID); 
        done();
      });
    });
  });

  describe('.find', function() {
     it('should find all items in db', function (done){
      Item.find({}, function(err, items){
        expect(items).to.have.length(3);
        done();
     });
    });
  });

  describe('.findById', function() {
    it('should find an item by id', function(done){
      Item.findById(ipad._id, function(err, item){
        expect(ipad.name).to.equal('iPad');
        expect(ipad).to.respondTo('cost');
        done();
      });
    });
  });

  describe('.deleteById', function() {
    it('should delete an item by ID', function(done){
      Item.deleteById(ipad._id, function(){
        Item.find({}, function( err, items){
          expect(items).to.have.length(2);
          done();
        });
      });
    });
  });

});

