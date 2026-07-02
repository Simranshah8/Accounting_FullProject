app.controller('LandStatusController', function ($scope, $http, $timeout, $filter, GlobalServices) {
    $scope.Title = 'ApplicantDetails';

    

    $scope.LoadData=function() {
        
        $scope.searchData = {          
            Land:'',
        };
         
        $scope.LandTypeList = [];
        $http({
            method: 'GET',
            url: base_url + "Gadhimai/Creation/GetAllLandType",
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.LandTypeList = res.data.Data;
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $scope.GetBlankLand();
    };
       
    $scope.GetBlankLand = function () {
        
        $scope.loadingstatus = "running";
        showPleaseWait();
        $scope.LandColl = [];
        $http({
            method: 'GET',
            url: base_url + "Gadhimai/Creation/GetBlankLand",
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                var lColl = mx(res.data.Data).groupBy(p1 => p1.LandTypeId);

                var tmpLandTypeList = angular.copy($scope.LandTypeList);


                $scope.LandColl = [];
                if ($scope.LandTypeList)
                {
                    $scope.LandTypeList.forEach(function (lc)
                    { 
                        var qry = lColl.where(p1 => p1.LandTypeId == lc.LandTypeId);

                        var row = 0;
                        angular.forEach(qry, function (q) {

                            var beData = {
                                LandTypeId: lc.LandTypeId,
                                Name: lc.Name,
                                Rate: lc.Rate,
                                SNo: lc.SNo,
                                LandName: lc.LandName,
                                LandTypeName: lc.LandTypeName,
                                IsVacant: lc.IsVacant,
                                BillingName: lc.BillingName,
                                BillingAddress: lc.BillingAddress,
                                BillingNameNP: lc.BillingNameNP,
                                BillingAddressNP: lc.BillingNameNP,
                                MobileNo: lc.MobileNo,
                            };

                        });

                      

                    });
                }

            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    }
        
});