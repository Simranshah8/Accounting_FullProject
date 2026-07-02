app.controller("LoginLog", function ($scope, $http, $timeout, GlobalServices) {
    $scope.Title = 'LoginLog';

    LoadData();



    function LoadData() {
        $('.select2').select2();
        $scope.loadingstatus = "stop";
        $scope.confirmMSG = GlobalServices.getConfirmMSG();
       
        $scope.beData =
        {
            LocalDateTime: new Date(),
            LogDateTime: new Date(),
        };
        $scope.loadingstatus = "stop";

    };

    $scope.ClearFields = function () {
        $scope.loadingstatus = "stop";
        $scope.beData =
        {
            
            LocalDateTime: '',
            LogDateTime: '',
        };

    }
  
    $scope.GetLoginLog = function () {

        var dateFrom = new Date(($filter('date')(new Date(), 'yyyy-MM-dd')));
        var dateTo = new Date(($filter('date')(new Date(), 'yyyy-MM-dd')));

        if ($scope.beData.DateFromDet)
            dateFrom = new Date(($filter('date')($scope.beData.DateFromDet.dateAD, 'yyyy-MM-dd')));

        if ($scope.beData.DateToDet)
            dateTo = new Date(($filter('date')($scope.beData.DateToDet.dateAD, 'yyyy-MM-dd')));


       

    };




   


});