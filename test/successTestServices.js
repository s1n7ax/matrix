const assert = require('assert');
const services = require('../core/services/services')

describe('userException', function () {
  let define1 = `validate asigned property values with provided ones`;
  it(define, function () {
    let obj1 = new services();

    let name = 'dazz';
    let message = 'message';
    let htmlMessage = 'html message';

    assert.equal(typeof obj1.name, 'undefined');
    assert.equal(typeof obj1.message, 'undefined');
    assert.equal(typeof obj1.htmlMessage, 'undefined');

    obj.userException(name, message, htmlMessage);

    assert.equal(typeof obj1.name, 'string');
    assert.equal(typeof obj1.message, 'string');
    assert.equal(typeof obj1.htmlMessage, 'string');

    assert.equal(obj1.name, name);
    assert.equal(obj1.message, message);
    assert.equal(obj1.htmlMessage, htmlMessage);
  });


  let define2 = `validate returned function and it's properties`;
  it(define2, function () {

  });
});