const assert = require('assert');
const services = require('../core/services/services')

describe('userException', function () {
  it('should return a function with name message htmlMessage properties', function () {
    let obj = new services();

    let name = 'dazz';
    let message = 'message';
    let htmlMessage = 'html message';

    assert.equal(typeof obj.name, 'undefined');
    assert.equal(typeof obj.message, 'undefined');
    assert.equal(typeof obj.htmlMessage, 'undefined');

    obj.userException(name, message, htmlMessage);

    assert.equal(typeof obj.name, 'string');
    assert.equal(typeof obj.message, 'string');
    assert.equal(typeof obj.htmlMessage, 'string');

    assert.equal(obj.name, name);
    assert.equal(obj.message, message);
    assert.equal(obj.htmlMessage, htmlMessage);
  })
})