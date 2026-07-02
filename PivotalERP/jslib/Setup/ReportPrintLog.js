app.controller("ReportPrintLog", function ($scope, $http, $timeout, GlobalServices) {
    $scope.Title = 'ReportPrintLog';

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
    $scope.UserList = [];
    $http({
        method: 'GET',
        url: base_url + "Setup/Security/GetAllUserNameList",
        dataType: "json",
    }).then(function (res) {
        if (res.data.IsSuccess && res.data.Data) {
            $scope.UserList = res.data.Data;
        }
    }, function (reason) {
        Swal.fire('Failed' + reason);
    });
    $scope.LedgerList = [];
    $http({
        method: 'GET',
        url: base_url + "Account/Creation/GetLedgerList",
        dataType: "json",
    }).then(function (res) {
        if (res.data.IsSuccess && res.data.Data) {
            $scope.LedgerList = res.data.Data;
        }
    }, function (reason) {
        Swal.fire('Failed' + reason);
    });
    $scope.BranchList = [];
    $http({
        method: 'GET',
        url: base_url + "Setup/Security/GetAllBranchList",
        dataType: "json",
    }).then(function (res) {
        if (res.data.IsSuccess && res.data.Data) {
            $scope.BranchList = res.data.Data;
        }
    }, function (reason) {
        Swal.fire('Failed' + reason);
    });








});