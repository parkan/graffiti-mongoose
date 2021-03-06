import {expect} from 'chai';
import {
  GraphQLString,
  GraphQLFloat,
  GraphQLBoolean,
  GraphQLList
} from 'graphql/type';
import GraphQLDate from './date';

import User from '../fixture/user';
import {getField} from './field';

var projection =  require('./projection');

describe('field', () => {
  it('should resolve ObjectId with ref properly', function* () {
    this.sandbox.stub(projection, 'getProjection').returns({
      name: 1
    });

    var user = new User();
    var findOneStub = this.sandbox.stub(User, 'findOne').returnsWithResolve(user);

    var field = getField({
      instance: 'ObjectID',
      name: '_id',
      ref: 'User'
    }, {
      User: 'GraphQL Type'
    }, {
      User: {
        model: User
      }
    }, {
      name: 'User'
    });

    var result = yield field.resolve({
      _id: user._id.toString()
    }, undefined, {
      fieldASTs: {
        name: {
          value: '_id'
        }
      }
    });

    expect(findOneStub).to.calledWith({
      _id: user._id.toString(),
    }, {
      name: 1
    });

    expect(field).to.containSubset({
      type: 'GraphQL Type',
      name: '_id',
      description: '"_id" field of the "User" model with type "ObjectID" and reference to "User" model'
    });

    expect(result).to.be.eql(user);
  });

  it('should resolve ObjectID without ref properly', () => {
    var field = getField({
      instance: 'ObjectID',
      name: 'foo'
    }, undefined, undefined, {
      name: 'Bar'
    });

    expect(field).to.be.eql({
      type: GraphQLString,
      name: 'foo',
      description: '"foo" field of the "Bar" model with type "ObjectID"'
    });
  });

  it('should resolve String properly', () => {
    var field = getField({
      instance: 'String',
      name: 'foo'
    }, undefined, undefined, {
      name: 'Bar'
    });

    expect(field).to.be.eql({
      type: GraphQLString,
      name: 'foo',
      description: '"foo" field of the "Bar" model with type "String"'
    });
  });

  it('should resolve Number properly', () => {
    var field = getField({
      instance: 'Number',
      name: 'foo'
    }, undefined, undefined, {
      name: 'Bar'
    });

    expect(field).to.be.eql({
      type: GraphQLFloat,
      name: 'foo',
      description: '"foo" field of the "Bar" model with type "Number"'
    });
  });

  it('should resolve Boolean properly', () => {
    var field = getField({
      instance: 'Boolean',
      name: 'foo'
    }, undefined, undefined, {
      name: 'Bar'
    });

    expect(field).to.be.eql({
      type: GraphQLBoolean,
      name: 'foo',
      description: '"foo" field of the "Bar" model with type "Boolean"'
    });
  });

  it('should resolve Date properly', () => {
    var field = getField({
      instance: 'Date',
      name: 'foo'
    }, undefined, undefined, {
      name: 'Bar'
    });

    expect(field).to.be.eql({
      name: 'foo',
      description: '"foo" field of the "Bar" model with type "Date"',
      type: GraphQLDate
    });
  });

  it('should resolve Array of ObjectId with ref properly', function* () {
    var users = [
      new User(),
      new User()
    ];

    this.sandbox.stub(projection, 'getProjection').returns({
      name: 1
    });
    var findStub = this.sandbox.stub(User, 'find').returnsWithResolve(users);

    var field = getField({
      instance: 'Array',
      name: 'value',
      caster: {
        instance: 'ObjectID',
        ref: 'User'
      }
    }, {
      User: GraphQLString
    }, {
      User: {
        model: User
      }
    }, {
      name: 'User'
    });

    var result = yield field.resolve({
      value: [users[0]._id, users[1]._id]
    }, undefined, {
      fieldASTs: {
        name: {
          value: 'value'
        }
      }
    });

    expect(findStub).to.calledWith({
      _id: {
        $in: [users[0]._id.toString(), users[1]._id.toString()]
      }
    }, {
      name: 1
    });

    expect(result).to.be.eql(users);

    expect(field).to.containSubset({
      type: new GraphQLList(GraphQLString),
      name: 'value',
      description: '"value" field of the "User" model with type "Array"' +
        ' of "ObjectID" and reference to "User" model'
    });
  });

  it('should resolve Array of ObjectId without ref properly', () => {
    var field = getField({
      instance: 'Array',
      name: 'foo',
      caster: {
        instance: 'ObjectID'
      }
    }, undefined, undefined, {
      name: 'Bar'
    });

    expect(field).to.be.eql({
      type: new GraphQLList(GraphQLString),
      name: 'foo',
      description: '"foo" field of the "Bar" model with type "Array" of "ObjectID"'
    });
  });

  it('should resolve Array of String properly', () => {
    var field = getField({
      instance: 'Array',
      name: 'foo',
      caster: {
        instance: 'String'
      }
    }, undefined, undefined, {
      name: 'Bar'
    });

    expect(field).to.be.eql({
      type: new GraphQLList(GraphQLString),
      name: 'foo',
      description: '"foo" field of the "Bar" model with type "Array" of "String"'
    });
  });

  it('should resolve Array of Number properly', () => {
    var field = getField({
      instance: 'Array',
      name: 'foo',
      caster: {
        instance: 'Number'
      }
    }, undefined, undefined, {
      name: 'Bar'
    });

    expect(field).to.be.eql({
      type: new GraphQLList(GraphQLFloat),
      name: 'foo',
      description: '"foo" field of the "Bar" model with type "Array" of "Number"'
    });
  });

  it('should resolve Array of Boolean properly', () => {
    var field = getField({
      instance: 'Array',
      name: 'foo',
      caster: {
        instance: 'Boolean'
      }
    }, undefined, undefined, {
      name: 'Bar'
    });

    expect(field).to.be.eql({
      type: new GraphQLList(GraphQLBoolean),
      name: 'foo',
      description: '"foo" field of the "Bar" model with type "Array" of "Boolean"'
    });
  });

  it('should resolve Array of Dates properly', () => {
    var field = getField({
      instance: 'Array',
      name: 'foo',
      caster: {
        instance: 'Date'
      }
    }, undefined, undefined, {
      name: 'Bar'
    });

    expect(field).to.be.eql({
      type: new GraphQLList(GraphQLDate),
      name: 'foo',
      description: '"foo" field of the "Bar" model with type "Array" of "Date"'
    });
  });
});
