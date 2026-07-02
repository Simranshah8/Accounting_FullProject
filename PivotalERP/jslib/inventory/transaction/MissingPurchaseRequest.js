app.controller('MissingPurchaseReqController', function ($scope, $http, $timeout, $filter, GlobalServices) {
    $scope.Title = 'MissingPurchaseRequest';

    var gSrv = GlobalServices;

    $scope.LoadData = function () {
        $('.select2').select2();
        $scope.confirmMSG = gSrv.getConfirmMSG();
        $scope.perPageColl = gSrv.getPerPageList();
        $scope.currentPages = {
            MissingPurchase: 1,
        };

        $scope.searchData = {
            MissingPurchase: '',
        };

        $scope.perPage = {
            MissingPurchase: gSrv.getPerPageRow()
        };

        $scope.newDet = {
            TranId: null,
            Sales_order: '',
            Party_Name: null,
            Code: '',
        };

        $scope.MissingPurchase = {
            DateFrom_TMP: new Date(),
            DateTo_TMP: new Date(),
        };

        $scope.selectAll = false;
        $scope.MissingPurchaseList = [];

        $scope.toggleAll = function (selectAll) {
            angular.forEach($scope.MissingPurchaseList, function (item) {
                item.selected = selectAll;
            });
        };

        $scope.$watch('MissingPurchaseList', function (newVal) {
            $scope.selectAll = newVal && newVal.length > 0 && newVal.every(function (item) {
                return item.selected;
            });
        }, true);

        $scope.GetMissingPurchase();
    };

    $scope.GetMissingPurchase = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();

        $http({
            method: 'GET',
            url: base_url + "Inventory/Transaction/GetMissingPurchase",
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";

            if (res.data.IsSuccess && res.data.Data) {
                $scope.MissingPurchaseList = res.data.Data;
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            Swal.fire('Failed: ' + reason.statusText);
        });
    };

    $scope.LoadData();
});
