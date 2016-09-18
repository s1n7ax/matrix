function(doc) { doc.type === 'testcase' && emit(doc._id, doc) }



function (doc) {if(doc.type === 'testcase') {emit(doc._id, doc);}}




<div layout="column" md-whiteframe="1" ng-repeat="test in tests" ng-click="test = !test">
  <div class="clickable-mouse-point no-select" flex layout="row" layout-align="start center">{{test.name}}
    <div ng-repete>
      
    </div>
  </div>
</div>