app.controller("GoalTypeController", function ($scope, $filter, $http, $timeout, GlobalServices) {
    $scope.Title = 'Goal  Type';

    $scope.LoadData = function () {
        $('.select2').select2();

        $scope.perPageColl = GlobalServices.getPerPageList();

        $scope.currentPages = {
            GoalType: 1,
        };

        $scope.searchData = {
            GoalType: '',
        };

        $scope.perPage = {
            GoalType: GlobalServices.getPerPageRow(),
        };
        $scope.newDet = {
            GoalTypeId: null,
            Name: "",
            IsActive: true,
            Description: "",
            Mode: "Save"
        }
        $scope.CategoryList = [];
        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.GetAllGoalType();
    }

    $scope.ClearFields = function () {
        $scope.newDet = {
            GoalTypeId: null,
            Name: "",
            Description: "",
            IsActive: true,
            Mode: "Save"
        }
    }

    $scope.IsValidGoalType = function () {
        if ($scope.newDet.Name.isEmpty()) {
            Swal.fire('Please ! Enter Name');
            return false;
        }
        return true;
    }

    $scope.GetAllGoalType = function () {
        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: 'POST',
            url: base_url + "EmployeePerformance/Creation/GetAllGoalType",
            dataType: "json"
        }).then(function (res) {

            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                $scope.GoalTypeList = res.data.Data;
                $scope.CategoryList = res.data.Data;
            } else
                Swal.fire(res.data.ResponseMSG);

        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    }


    $scope.SaveUpdateGoalType = function () {
        if ($scope.IsValidGoalType() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.newDet.Mode;
                Swal.fire({
                    title: 'Do you want to' + saveModify + 'the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    if (result.isConfirmed) {
                        $scope.CallSaveUpdateGoalType();
                    }

                });
            }
            else
                $scope.CallSaveUpdateGoalType();
        }
    };


    $scope.CallSaveUpdateGoalType = function () {
        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: 'POST',
            url: base_url + "EmployeePerformance/Creation/SaveGoalType",
            headers: { 'content-Type': undefined },

            transformRequest: function (data) {
                var formData = new FormData();
                formData.append("jsonData", angular.toJson(data.jsonData));
                return formData;
            },
            data: { jsonData: $scope.newDet }
        }).then(function (res) {

            $scope.loadingstatus = "stop";
            hidePleaseWait();

            Swal.fire(res.data.ResponseMSG);
            if (res.data.IsSuccess == true) {
                $scope.ClearFields();
                $scope.GetAllGoalType();
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }

    $scope.GetGoalTypeById = function (beData) {

        $scope.loadingstatus = "running";
        var para = {
            GoalTypeId: beData.GoalTypeId
        };
        $http({
            method: 'POST',
            url: base_url + "EmployeePerformance/Creation/GetGoalTypeById",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $timeout(function () {
                    $scope.newDet = res.data.Data;
                    $scope.newDet.Mode = 'Modify';
                    $('#custom-tabs-four-profile-tab').tab('show');
                });
            } else
                Swal.fire(res.data.ResponseMSG);

        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    }


    $scope.deleteGoalType = function (refData, ind) {

        Swal.fire({
            title: 'Are you sure to deleteGoalType:-' + refData.Name,
            showCancelButton: true,
            confirmButtonText: 'Delete',
        }).then((result) => {
            if (result.isConfirmed) {
                $scope.loadingstatus = "running";
                showPleaseWait();

                var para = {
                    GoalTypeId: refData.GoalTypeId
                };

                $http({
                    method: 'POST',
                    url: base_url + "EmployeePerformance/Creation/DelGoalType",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingstatus = "stop";
                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess) {
                        $scope.GetAllGoalType();
                    }

                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }
        });

    }
})