'use strict';

describe('Controller: ConfigurationSecteursIrrigationVSecteurCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var ConfigurationSecteursIrrigationVSecteurCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ConfigurationSecteursIrrigationVSecteurCtrl = $controller('ConfigurationSecteursIrrigationVSecteurCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ConfigurationSecteursIrrigationVSecteurCtrl.awesomeThings.length).toBe(3);
  });
});
