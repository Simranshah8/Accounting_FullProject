app.controller("GoalPeriodController", function ($scope, $filter, $http, $timeout, GlobalServices) {
    $scope.Title = 'Goal Period';

    $scope.LoadData = function () {
        $('.select2').select2();

        $scope.perPageColl = GlobalServices.getPerPageList();

        $scope.currentPages = {
            GoalPeriod: 1,
        };

        $scope.searchData = {
            GoalPeriod: '',
        };

        $scope.perPage = {
            GoalPeriod: GlobalServices.getPerPageRow(),
        };

        $scope.newGoalPeriod = {
            Name: '',
            FromDate: null,
            ToDate: null,
            Days: '',
            IsActive: true,
            Mode: "Save"
        }
        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.GetAllGoalPeriod();
    }
    $scope.ClearFields = function () {
        $scope.newGoalPeriod = {
            Name: '',
            FromDate: null,
            ToDate: null,
            Days: '',
            IsActive: true,
            Mode: "Save"
        }
    }
    $scope.IsValidGoalPeriod = function () {
        return true;
    }

    $scope.GetAllGoalPeriod = function () {
        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: 'POST',
            url: base_url + "EmployeePerformance/Creation/GetAllGoalPeriod",
            dataType: "json"
        }).then(function (res) {

            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                $scope.GoalPeriodList = res.data.Data;
                $scope.GoalPeriodList = res.data.Data;
            } else
                Swal.fire(res.data.ResponseMSG);

        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    }

    $scope.SaveUpdateGoalPeriod = function () {
        if ($scope.IsValidGoalPeriod() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.newGoalPeriod.Mode;
                Swal.fire({
                    title: 'Do you want to' + saveModify + 'the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    if (result.isConfirmed) {
                        $scope.CallSaveUpdateGoalPeriod();
                    }

                });
            }
            else
                $scope.CallSaveUpdateGoalPeriod();
        }
    };

    $scope.CallSaveUpdateGoalPeriod = function () {
        $scope.loadingstatus = 'running';
        showPleaseWait();

        if ($scope.newGoalPeriod.FromDateDet) {
            $scope.newGoalPeriod.FromDate = $filter('date')(new Date($scope.newGoalPeriod.FromDateDet.dateAD),'yyyy-MM-dd');
        } else 
            $scope.newGoalPeriod.FromDate = new Date();
        
        if ($scope.newGoalPeriod.ToDateDet) {
            $scope.newGoalPeriod.ToDate = $filter('date')(new Date($scope.newGoalPeriod.ToDateDet.dateAD), 'yyyy-MM-dd');
        } else 
            $scope.newGoalPeriod.ToDate = new Date();
        

        $http({
            method: 'POST',
            url: base_url + "EmployeePerformance/Creation/SaveGoalPeriod",
            headers: { 'content-Type': undefined },

            transformRequest: function (data) {
                var formData = new FormData();
                formData.append("jsonData", angular.toJson(data.jsonData));
                return formData;
            },
            data: { jsonData: $scope.newGoalPeriod }
        }).then(function (res) {

            $scope.loadingstatus = "stop";
            hidePleaseWait();

            Swal.fire(res.data.ResponseMSG);
            if (res.data.IsSuccess == true) {
                $scope.ClearFields();
                $scope.GetAllGoalPeriod();
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }

    $scope.GetGoalPeriodById = function (beData) {

        $scope.loadingstatus = "running";
        var para = {
            GoalPeriodId: beData.GoalPeriodId
        };
        $http({
            method: 'POST',
            url: base_url + "EmployeePerformance/Creation/GetGoalPeriodById",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $timeout(function () {
                    $scope.newGoalPeriod = res.data.Data;
                    $scope.newGoalPeriod.Mode = 'Modify';

                    if ($scope.newGoalPeriod.FromDate) {
                        $scope.newGoalPeriod.FromDate_TMP = new Date($scope.newGoalPeriod.FromDate);
                    } 
                    if ($scope.newGoalPeriod.ToDate) {
                        $scope.newGoalPeriod.ToDate_TMP = new Date($scope.newGoalPeriod.ToDate);
                    } 
                    $('#custom-tabs-four-profile-tab').tab('show');
                });
            } else
                Swal.fire(res.data.ResponseMSG);

        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    }

    $scope.deleteGoalPeriod = function (refData, ind) {
        Swal.fire({
            title: 'Are you sure to delete Goal Period:-' + refData.Name,
            showCancelButton: true,
            confirmButtonText: 'Delete',
        }).then((result) => {
            if (result.isConfirmed) {
                $scope.loadingstatus = "running";
                showPleaseWait();

                var para = {
                    GoalPeriodId: refData.GoalPeriodId
                };

                $http({
                    method: 'POST',
                    url: base_url + "EmployeePerformance/Creation/DelGoalPeriod",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingstatus = "stop";
                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess) {
                        $scope.GetAllGoalPeriod();
                    }

                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }
        });

    }


})