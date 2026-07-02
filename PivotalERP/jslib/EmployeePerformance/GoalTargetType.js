app.controller("GoalTargetTypeController", function ($scope, $filter, $http, $timeout, GlobalServices) {
    $scope.Title = 'Goal Target Type';

    $scope.LoadData = function () {
        $('.select2').select2();

        $scope.perPageColl = GlobalServices.getPerPageList();

        $scope.currentPages = {
            GoalTargetType: 1,
        };

        $scope.searchData = {
            GoalTargetType: '',
        };

        $scope.perPage = {
            GoalTargetType: GlobalServices.getPerPageRow(),
        };
 
        $scope.newGoalTargetType = {
            Name: null,
            Descfription: null,
            ISActive: true,          
            Mode: "Save"
        }
        $scope.GoalTargetTypList = [];
        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.GetAllGoalTargetType();
    }

    $scope.ClearFields = function () {
        $scope.newGoalTargetType = {
            Name: null,
            Descfription: null,
            ISActive: true,
            Mode: "Save"
        }
    }

    $scope.IsValidGoalTargetType = function () {
        return true;
    }


    $scope.GetAllGoalTargetType = function () {
        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: 'POST',
            url: base_url + "EmployeePerformance/Creation/GetAllGoalTargetType",
            dataType: "json"
        }).then(function (res) {

            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                $scope.GoalTargetTypeList = res.data.Data;
                $scope.GoalTargetTypeList = res.data.Data;
            } else
                Swal.fire(res.data.ResponseMSG);

        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    }

    $scope.SaveUpdateGoalTargetType = function () {
        if ($scope.IsValidGoalTargetType() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.newGoalTargetType.Mode;
                Swal.fire({
                    title: 'Do you want to' + saveModify + 'the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    if (result.isConfirmed) {
                        $scope.CallSaveUpdateGoalTargetType();
                    }

                });
            }
            else
                $scope.CallSaveUpdateGoalTargetType();
        }
    };

    $scope.CallSaveUpdateGoalTargetType = function () {
        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: 'POST',
            url: base_url + "EmployeePerformance/Creation/SaveGoalTargetType",
            headers: { 'content-Type': undefined },

            transformRequest: function (data) {
                var formData = new FormData();
                formData.append("jsonData", angular.toJson(data.jsonData));
                return formData;
            },
            data: { jsonData: $scope.newGoalTargetType }
        }).then(function (res) {

            $scope.loadingstatus = "stop";
            hidePleaseWait();

            Swal.fire(res.data.ResponseMSG);
            if (res.data.IsSuccess == true) {
                $scope.ClearFields();
                $scope.GetAllGoalTargetType();
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }

    $scope.GetGoalTargetTypeById = function (beData) {

        $scope.loadingstatus = "running";
        var para = {
            GoalTargetTypeId: beData.GoalTargetTypeId
        };
        $http({
            method: 'POST',
            url: base_url + "EmployeePerformance/Creation/GetGoalTargetTypeById",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $timeout(function () {
                    $scope.newGoalTargetType = res.data.Data;
                    $scope.newGoalTargetType.Mode = 'Modify';
                    $('#custom-tabs-four-profile-tab').tab('show');
                });
            } else
                Swal.fire(res.data.ResponseMSG);

        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    }

    $scope.deleteGoalTargetType = function (refData, ind) {

        Swal.fire({
            title: 'Are you sure to delete GoalTargetType:-' + refData.Name,
            showCancelButton: true,
            confirmButtonText: 'Delete',
        }).then((result) => {
            if (result.isConfirmed) {
                $scope.loadingstatus = "running";
                showPleaseWait();

                var para = {
                    GoalTargetTypeId: refData.GoalTargetTypeId
                };

                $http({
                    method: 'POST',
                    url: base_url + "EmployeePerformance/Creation/DelGoalTargetType",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingstatus = "stop";
                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess) {
                        $scope.GetAllGoalTargetType();
                    }

                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }
        });

    }

})