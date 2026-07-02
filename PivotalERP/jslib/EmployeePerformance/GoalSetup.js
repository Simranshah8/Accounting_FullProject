app.controller("GoalSetupController", function ($scope, $http, $timeout, $filter, $compile, GlobalServices) {
    $scope.Title = 'Goal Setup';

    $scope.LoadData = function () {
        $('.select2').select2();

        $scope.perPageColl = GlobalServices.getPerPageList();
        $scope.confirmMSG = GlobalServices.getConfirmMSG();

        $scope.currentPages = {
            GoalSetup: 1,
        };

        $scope.searchData = {
            GoalSetup: '',
        };

        $scope.perPage = {
            GoalSetup: GlobalServices.getPerPageRow(),
        };

        $scope.beData = {
            GoalSetupId: null,
            CostClassId: null,
            GoalTypeId: null,
            GoalPeriodId: null,
            FromDate_TMP: "",
            ToDate_TMP: "",
            Description: "",
            GoalType: "",
            IsMeasurement: false,
            TargetValue: null,
            GoalMeasurement: "",
            WeightedId: null,
            GoalTargetTypeId: null,
            IsActive: true,
            Mode: "Save"
        }

        $scope.WeightedColl = [
            { id: 1, text: 'Sum' },
            { id: 2, text: 'Average' },
            { id: 3, text: 'Percentage' }
        ];

        $scope.GoalTypeList = [];
        $http({
            method: 'POST',
            url: base_url + "EmployeePerformance/Creation/GetAllGoalType",
            dataType: "json"
        }).then(function (res) {
            $scope.loadingstatus = 'stop';
            hidePleaseWait();
            if (res.data.IsSuccess && res.data.Data) {
                $scope.GoalTypeList = res.data.Data.filter(x => x.IsActive == true);
            } else
                Swal.fire(res.data.ResponseMSG);
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $scope.GoalPeriodList = [];
        $http({
            method: 'POST',
            url: base_url + "EmployeePerformance/Creation/GetAllGoalPeriod",
            dataType: "json"
        }).then(function (res) {
            $scope.loadingstatus = 'stop';
            hidePleaseWait();
            if (res.data.IsSuccess && res.data.Data) {
                $scope.GoalPeriodList = res.data.Data.filter(x => x.IsActive == true);
            } else
                Swal.fire(res.data.ResponseMSG);
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $scope.GoalTargetTypeList = [];
        $http({
            method: 'POST',
            url: base_url + "EmployeePerformance/Creation/GetAllGoalTargetType",
            dataType: "json"
        }).then(function (res) {
            $scope.loadingstatus = 'stop';
            hidePleaseWait();
            if (res.data.IsSuccess && res.data.Data) {
                $scope.GoalTargetTypeList = res.data.Data.filter(x => x.IsActive == true);
            } else
                Swal.fire(res.data.ResponseMSG);
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $scope.HideShow = {}
        $scope.CostClassColl = [];
        $http({
            method: 'GET',
            url: base_url + "Account/Creation/GetCostClassForEntry",
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.CostClassColl = res.data.Data;

                $timeout(function () {
                    $scope.$apply(function () {
                        if ($scope.CostClassColl.length > 0) {
                            $scope.CostClassDefault = $scope.CostClassColl.filter(x => x.IsDefault == true);
                            $scope.SelectedCostClass = $scope.CostClassDefault[0];
                            $scope.beData.CostClassId = $scope.SelectedCostClass.CostClassId;
                        }
                        if ($scope.CostClassColl.length <= 1) {
                            $scope.HideShow.CostClass = true;
                        } else {
                            $scope.HideShow.CostClass = false;
                        }
                    });
                });
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
       
       $scope.GetAllGoalSetup();
    }

    $scope.ClearFields = function () {
        $scope.beData = {
            GoalSetupId: null,
            CostClassId: $scope.SelectedCostClass.CostClassId,
            GoalTypeId: null,
            GoalPeriodId: null,
            FromDate_TMP: "",
            ToDate_TMP: "",
            Description: "",
            GoalType: "",
            IsMeasurement: false,
            TargetValue: null,
            GoalMeasurement: "",
            WeightedId: null,
            GoalTargetTypeId: null,
            IsActive: true,
            Mode: "Save"
        }
    }

    $scope.IsValidGoalSetup = function () {
        //if ($scope.beData.Name.isEmpty()) {
        //    Swal.fire('Please ! Enter Name');
        //    return false;
        //}
        return true;
    }

    $scope.GetAllGoalSetup = function () {
        $scope.loadingstatus = 'running';
        showPleaseWait();
        $http({
            method: 'POST',
            url: base_url + "EmployeePerformance/Creation/GetAllGoalSetup",
            dataType: "json"
        }).then(function (res) {
            $scope.loadingstatus = 'stop';
            hidePleaseWait();
            if (res.data.IsSuccess && res.data.Data) {
                $scope.GoalSetupList = res.data.Data;
            } else
                Swal.fire(res.data.ResponseMSG);
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    }


    $scope.SaveUpdateGoalSetup = function () {
        if ($scope.IsValidGoalSetup() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.beData.Mode;
                Swal.fire({
                    title: 'Do you want to' + saveModify + 'the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    if (result.isConfirmed) {
                        $scope.CallSaveUpdateGoalSetup();
                    }

                });
            }
            else
                $scope.CallSaveUpdateGoalSetup();
        }
    };


    $scope.CallSaveUpdateGoalSetup = function () {
        $scope.loadingstatus = 'running';
        showPleaseWait();

        if ($scope.beData.FromDateDet) {
            $scope.beData.FromDate = $filter('date')(new Date($scope.beData.FromDateDet.dateAD), 'yyyy-MM-dd');
        } else
            $scope.beData.FromDate = null;

        if ($scope.beData.ToDateDet) {
            $scope.beData.ToDate = $filter('date')(new Date($scope.beData.ToDateDet.dateAD), 'yyyy-MM-dd');
        } else
            $scope.beData.ToDate = null;


        $http({
            method: 'POST',
            url: base_url + "EmployeePerformance/Creation/SaveGoalSetup",
            headers: { 'content-Type': undefined },

            transformRequest: function (data) {
                var formData = new FormData();
                formData.append("jsonData", angular.toJson(data.jsonData));
                return formData;
            },
            data: { jsonData: $scope.beData }
        }).then(function (res) {

            $scope.loadingstatus = "stop";
            hidePleaseWait();

            Swal.fire(res.data.ResponseMSG);
            if (res.data.IsSuccess == true) {
                $scope.ClearFields();
                $scope.GetAllGoalSetup();
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }

    $scope.GetGoalSetupById = function (beData) {

        $scope.loadingstatus = "running";
        var para = {
            GoalSetupId: beData.GoalSetupId
        };
        $http({
            method: 'POST',
            url: base_url + "EmployeePerformance/Creation/GetGoalSetupById",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $timeout(function () {
                    $scope.beData = res.data.Data;
                    if ($scope.beData.FromDate)
                        $scope.beData.FromDate_TMP = new Date($scope.beData.FromDate);
                    if ($scope.beData.ToDate)
                        $scope.beData.ToDate_TMP = new Date($scope.beData.ToDate);
                    $scope.beData.Mode = 'Modify';
                    $('#custom-tabs-four-profile-tab').tab('show');
                });
            } else
                Swal.fire(res.data.ResponseMSG);

        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    }

    $scope.deleteGoalSetup = function (refData, ind) {

        Swal.fire({
            title: 'Are you sure to deleteGoalSetup:-' + refData.Name,
            showCancelButton: true,
            confirmButtonText: 'Delete',
        }).then((result) => {
            if (result.isConfirmed) {
                $scope.loadingstatus = "running";
                showPleaseWait();

                var para = {
                    GoalSetupId: refData.GoalSetupId
                };

                $http({
                    method: 'POST',
                    url: base_url + "EmployeePerformance/Creation/DelGoalSetup",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingstatus = "stop";
                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess) {
                        $scope.GetAllGoalSetup();
                    }

                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }
        });

    }

    $scope.ChangeNullMeasure = function (beData) {
        if (!beData.IsMeasurement) {
            $scope.beData.TargetValue = null;
            $scope.beData.GoalMeasurement = "";
            $scope.beData.WeightedId = null;
            $scope.beData.GoalTargetTypeId = null;
        }
    }

})