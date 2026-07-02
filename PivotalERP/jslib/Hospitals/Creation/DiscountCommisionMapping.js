app.controller('DiscountMapping', function ($scope, $filter, $http, $timeout, GlobalServices) {
    $scope.Title = 'DiscountMapping';
    var glSrv = GlobalServices;
    $scope.LoadData = function () {
        $('.select2').select2();
        $scope.loadingstatus = "stop";
        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.perPageColl = GlobalServices.getPerPageList();
        $scope.currentPages = {
            DiscountMapping: 1
        };
        $scope.searchData = {
            DiscountMapping: ''
        };
        $scope.perPage = {
            DiscountMapping: GlobalServices.getPerPageRow(),
        };
        $scope.CommissionList = [];
        $http({
            method: 'POST',
            url: base_url + "Hospital/Creation/GetAllCommissionType",
            dataType: "json"
        }).then(function (res) {
            $scope.loadingstatus = 'stop';
            hidePleaseWait();
            if (res.data.IsSuccess && res.data.Data) {
                $scope.CommissionList = res.data.Data;
            } else
                Swal.fire(res.data.ResponseMSG);
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $scope.beData = {
            CommissionTypeId: null,
            DiscountMappingList: [],
            CommissionMappingList: [],
            Mode: 'Save'
        }
        $scope.GetAllDiscountMapping();
    };

    $scope.GetAllDiscountMapping = function () {
        $scope.DiscountMappingList = []; 
        $http({
            method: 'POST',
            url: base_url + "Hospital/Creation/GetAllDiscountCommissionMapping",
            dataType: "json"
         }).then(function (res) {
            $scope.loadingstatus = 'stop';
            hidePleaseWait();
            if (res.data.IsSuccess && res.data.Data) {
                    $scope.DiscountMappingList = res.data.Data;
            } else
                Swal.fire(res.data.ResponseMSG);
        }, function (reason) {
             Swal.fire('Failed' + reason);
        });
    }

    $scope.SaveDiscountMapping = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();
        var dataToSave = [];
        for (var i = 0; i < $scope.DiscountMappingList.length; i++) {
            var item = $scope.DiscountMappingList[i];
            var dataItem = {
                DiscountTypeId: item.DiscountTypeId,
                CommissionTypeId: item.CommissionTypeId,
                DiscountType: item.DiscountType,
            };
            dataToSave.push(dataItem);
        }
        $http({
            method: 'POST',
            url: base_url + "Hospital/Creation/SaveDiscountMapping",
            headers: { 'Content-Type': undefined },
            transformRequest: function (data) {
                var formData = new FormData();
                formData.append("jsonData", angular.toJson(data.jsonData));
                return formData;
            },
            data: { jsonData: dataToSave }
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            Swal.fire(res.data.ResponseMSG);
        }, function (err) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            Swal.fire("Error saving data: " + err.statusText);
        });
    };

});