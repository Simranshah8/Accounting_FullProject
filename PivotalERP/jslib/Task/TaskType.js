app.controller('TaskTypeController', function ($scope, $http, $timeout, $filter, GlobalServices) {
    $scope.Title = 'TaskType';
    $scope.LoadData = function () {
        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.perPageColl = GlobalServices.getPerPageList();


        $scope.currentPages = {
            TaskType: 1,
        };

        $scope.searchData = {
            TaskType: '',
        };

        $scope.perPage = {
            TaskType: GlobalServices.getPerPageRow(),
        };

        $scope.newTaskType = {
            TaskTypeId: null,
            Name: '',
            Code: '',
            Description:'',
            OrderNo: 0,
            IsActive: false,
            Mode: 'Save'
        };

        $scope.GetAllTaskType();
    }

    $scope.ClearTaskType = function () {
        $scope.newTaskType = {
            TaskTypeId: null,
            Name: '',
            Code: '',
            Description: '',
            OrderNo: 0,
            IsActive: false,
            Mode: 'Save'
        };       
    }
    //************************* TaskType *********************************
    $scope.IsValidTaskType = function () {
        if ($scope.newTaskType.Name.isEmpty()) {
            Swal.fire('Please ! Enter Name');
            return false;
        }
        return true;
    }

    $scope.SaveUpdateTaskType = function () {
        if ($scope.IsValidTaskType() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.newTaskType.Mode;
                Swal.fire({
                    title: 'Do you want to ' + saveModify + ' the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    /* Read more about isConfirmed, isDenied below */
                    if (result.isConfirmed) {
                        $scope.CallSaveUpdateTaskType();
                    }
                });
            } else
                $scope.CallSaveUpdateTaskType();
        }
    };

    $scope.CallSaveUpdateTaskType = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();
        $http({
            method: 'POST',
            url: base_url + "Task/Creation/SaveUpdateTaskType",
            headers: { 'Content-Type': undefined },
            transformRequest: function (data) {
                var formData = new FormData();
                formData.append("jsonData", angular.toJson(data.jsonData));
                return formData;
            },
            data: { jsonData: $scope.newTaskType }
        }).then(function (res) {
            $scope.loadingstatus = "stop";
            hidePleaseWait();
            Swal.fire(res.data.ResponseMSG);
            if (res.data.IsSuccess == true) {
                $scope.ClearTaskType();
                $scope.GetAllTaskType();
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }

    $scope.GetAllTaskType = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();
        $scope.TaskTypeList = [];
        $http({
            method: 'GET',
            url: base_url + "Task/Creation/GetAllTaskType",
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.TaskTypeList = res.data.Data;
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    }

    $scope.getTaskTypeById = function (refData) {
        $scope.loadingstatus = "running";
        showPleaseWait();
        var para = {
            TaskTypeId: refData.TaskTypeId
        };
        $http({
            method: 'POST',
            url: base_url + "Task/Creation/getTaskTypeById",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.newTaskType = res.data.Data;
                $scope.newTaskType.Mode = 'Modify';

                $('#custom-tabs-four-profile-tab').tab('show');

            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    };


    $scope.DelTaskTypesById = function (refData, ind) {
        Swal.fire({
            title: 'Are you sure you want to delete ' + refData.Name + '?',
            showCancelButton: true,
            confirmButtonText: 'Delete',
            //message: 'Are you sure to delete selected Branch :-' + beData.Name,
        }).then((result) => {
            if (result.isConfirmed) {
                var para = { TaskTypeId: refData.TaskTypeId };
                $http({
                    method: 'POST',
                    url: base_url + "Task/Creation/DeleteTaskTypeById",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingStatus = "stop";
                    if (res.data.IsSuccess) {
                        $scope.GetAllTaskType();
                    }
                    Swal.fire(res.data.ResponseMSG);


                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }

        });
    }

    $scope.pageChangeHandler = function (num) {
        console.log('page changed to ' + num);
    };
});