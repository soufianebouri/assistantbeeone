'use strict';

describe('Service: ressourcesHydriques', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var ressourcesHydriques;
  beforeEach(inject(function (_ressourcesHydriques_) {
    ressourcesHydriques = _ressourcesHydriques_;
  }));

  it('should do something', function () {
    expect(!!ressourcesHydriques).toBe(true);
  });

});
