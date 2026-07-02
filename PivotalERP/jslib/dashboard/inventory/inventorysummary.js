"use strict";

agGrid.initialiseAgGridWithAngular1(angular);
app.controller('inventorySummaryDashboardController', function ($scope, $http, companyDet) {

    LoadData();
       
    function LoadData() {

        $scope.loadingstatus = 'running';
        $scope.invSummary = {};
        showPleaseWait();
        $http({
            method: 'POST',
            url: base_url + "DashBoard/Inventory/GetInventorySummary",
            dataType: "json"
            //data:JSON.stringify(para)
        }).then(function (res) {
           
            if (res.data.IsSuccess && res.data.Data) {
                $scope.invSummary = res.data.Data;

            } else
                alert(res.data.ResponseMSG);

            $scope.loadingstatus = 'stop';
            hidePleaseWait();
        }, function (reason) {
                alert('Failed' + reason);
                $scope.loadingstatus = 'stop';
                
        });
    }

});