app.controller("ObjectiveQuestionController", function ($scope, $filter, $http, $timeout, GlobalServices) {
    $scope.Title = 'Objective Question';

    $scope.LoadData = function () {
        $('.select2').select2();

        $scope.perPageColl = GlobalServices.getPerPageList();

        $scope.currentPages = {
            ObjectiveQuestion: 1,
        };

        $scope.searchData = {
            ObjectiveQuestion: '',
        };

        $scope.perPage = {
            ObjectiveQuestion: GlobalServices.getPerPageRow(),
        };
        $scope.newDet = {
            ObjectiveQuestionId: null,
            Name: "",
            Description: "",
            IsActive: true,
            Mode: "Save"
        }
        $scope.CategoryList = [];
        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.GetAllObjectiveQuestion();
    }

    $scope.ClearFields = function () {
        $scope.newDet = {
            ObjectiveQuestionId: null,
            Name: "",
            Description: "",
            IsActive: true,
            Mode: "Save"
        }
    }

    $scope.IsValidObjectiveQuestion = function () {
        if ($scope.newDet.Name.isEmpty()) {
            Swal.fire('Please ! Enter Name');
            return false;
        }
        return true;
    }

    $scope.GetAllObjectiveQuestion = function () {
        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: 'POST',
            url: base_url + "EmployeePerformance/Creation/GetAllObjectiveQuestion",
            dataType: "json"
        }).then(function (res) {

            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                $scope.ObjectiveQuestionList = res.data.Data;
                $scope.CategoryList = res.data.Data;
            } else
                Swal.fire(res.data.ResponseMSG);

        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    }


    $scope.SaveUpdateObjectiveQuestion = function () {
        if ($scope.IsValidObjectiveQuestion() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.newDet.Mode;
                Swal.fire({
                    title: 'Do you want to' + saveModify + 'the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    if (result.isConfirmed) {
                        $scope.CallSaveUpdateObjectiveQuestion();
                    }

                });
            }
            else
                $scope.CallSaveUpdateObjectiveQuestion();
        }
    };


    $scope.CallSaveUpdateObjectiveQuestion = function () {
        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: 'POST',
            url: base_url + "EmployeePerformance/Creation/SaveObjectiveQuestion",
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
                $scope.GetAllObjectiveQuestion();
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }

    $scope.GetObjectiveQuestionById = function (beData) {

        $scope.loadingstatus = "running";
        var para = {
            ObjectiveQuestionId: beData.ObjectiveQuestionId
        };
        $http({
            method: 'POST',
            url: base_url + "EmployeePerformance/Creation/GetObjectiveQuestionById",
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


    $scope.deleteObjectiveQuestion = function (refData, ind) {

        Swal.fire({
            title: 'Are you sure to deleteObjectiveQuestion:-' + refData.Name,
            showCancelButton: true,
            confirmButtonText: 'Delete',
        }).then((result) => {
            if (result.isConfirmed) {
                $scope.loadingstatus = "running";
                showPleaseWait();

                var para = {
                    ObjectiveQuestionId: refData.ObjectiveQuestionId
                };

                $http({
                    method: 'POST',
                    url: base_url + "EmployeePerformance/Creation/DelObjectiveQuestion",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingstatus = "stop";
                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess) {
                        $scope.GetAllObjectiveQuestion();
                    }

                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }
        });

    }
})