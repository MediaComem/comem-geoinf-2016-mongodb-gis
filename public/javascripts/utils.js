(function() {

  var app = angular.module('mongodb-gis');

  app.component('apiError', {
    template: `
      <div class='alert clearfix' ng-class='{"alert-danger": ctrl.error.status != 501, "alert-warning": ctrl.error.status == 501}'>
        <button type='button' class='btn btn-default btn-xs pull-right' ng-if='ctrl.error.status != 501' ng-click='ctrl.showDetails()'>Details</button>
        <span ng-if='ctrl.error.status == 501'>{{ ctrl.error.data }}</span>
        <span ng-if='ctrl.error.status != 501'>
          An unexpected error occurred.
        </span>
      </div>
    `,
    controller: 'ApiErrorCtrl',
    controllerAs: 'ctrl',
    bindings: {
      error: '<'
    }
  });

  app.controller('ApiErrorCtrl', function($sce, $scope, $uibModal) {

    var ctrl = this;

    ctrl.errorBody = $sce.trustAsHtml(ctrl.error.data.replace(/^.*<body>/, '').replace(/<\/body>.*$/, ''));

    ctrl.showDetails = function() {

      $uibModal.open({
        scope: $scope,
        template: `
          <div class='modal-header'>
            <h3 class='modal-title' id='modal-title'>API Error</h3>
          </div>
          <div class='modal-body' id='modal-body'>
            <div ng-bind-html='ctrl.errorBody'></div>
          </div>
          <div class='modal-footer'>
            <button class='btn btn-primary pull-right' type='button' ng-click='$close()'>Close</button>
          </div>
        `
      });
    };
  });
})();
