 
app.controller('JobHistoryController', function ($scope, $http, $timeout, $filter, GlobalServices) {
    $scope.Title = 'JobHistory';
    
    $scope.greaterThan = function (prop, val) {
        return function (item) {
            return item[prop] > val;
        }
    }

    $scope.LoadData = function () {

        $('.select2').select2({
            allowClear: true,
            openOnEnter: true
        });
        $scope.beData = {
            JobNo: '',
            BranchId: null,
            CostClassId:null
        };

        $http({
            method: 'GET',
            url: base_url + "Account/Creation/GetCostClassForEntry",
            dataType: "json"
        }).then(function (res1) {
            if (res1.data.IsSuccess && res1.data.Data) {
                $scope.CostClassColl = res1.data.Data;
                if ($scope.CostClassColl && $scope.CostClassColl.length >0) {
                    $scope.beData.CostClassId = $scope.CostClassColl[0].CostClassId;
                }
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $scope.BranchList = [];
        $http({
            method: 'GET',
            url: base_url + "Setup/Security/GetAllBranchList",
            dataType: "json"
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.BranchList = res.data.Data; 

                if ($scope.BranchList.length==1) { 
                    $scope.beData.BranchId = $scope.BranchList[0].BranchId;                     
                }

            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });


    }

    $scope.JobHis = {};
    $scope.GetJobHistory = function () {

        if ($scope.beData.JobNo && $scope.beData.JobNo.length > 0) {

        } else {
            return;
        }

        $scope.loadingstatus = "running";
        showPleaseWait();

        $scope.JobHis = {};
        var para = {
            JobNo: $scope.beData.JobNo,
            BranchId: $scope.beData.BranchId,
            CostClassId:$scope.beData.CostClassId,
        };

        $http({
            method: 'POST',
            url: base_url + "Service/Reporting/GetJobHistory",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {

            $scope.loadingstatus = "stop";
            hidePleaseWait(); 
            if (res.data.IsSuccess && res.data.Data) {
                $scope.JobHis = res.data.Data;

                if (res.data.Data.JobHistoryCOll && res.data.Data.JobHistoryCOll.length>0)
                    $scope.JobHis.Job = res.data.Data.JobHistoryCOll[0];

            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    }
   

});