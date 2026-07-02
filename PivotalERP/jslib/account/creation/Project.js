app.controller('ProjectController', function ($scope, $http, $timeout, $filter, GlobalServices) {
    $scope.Title = 'Project';

    LoadData();

    function LoadData() {
        $('.select2').select2();
        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.perPageColl = GlobalServices.getPerPageList();
        $scope.currentPages = {
            Project: 1,
        };

        $scope.searchData = {
            Project: '',

        };

        $scope.perPage = {
            Project: GlobalServices.getPerPageRow()
        };


        $scope.newDet = {
            ProjectId: null,
            Name: '',
            Code: '',
            Location : '',
            ProjectHead: '',
            ContactNo: '',
            ValidFrom_TMP: '',
            ValidTo_TMP: '',
            OrderNo: null,
            IsActive: false,
            Mode: 'Save'
        };

        //$scope.GetAllProject();

    };

    $scope.ClearProject = function () {
        $scope.newDet = {
            ProjectId: null,
            Name: '',
            Code: '',
            Location: '',
            ProjectHead: '',
            ContactNo: '',
            ValidFrom_TMP: '',
            ValidTo_TMP: '',
            OrderNo: null,
            IsActive: false,
            Mode: 'Save'
        };
    }




    //************************* Project *********************************
    $scope.IsValidProject = function () {
        /*if ($scope.newBaliType.GenderName.isEmpty()) {
            Swal.fire('Please ! Enter GenderName Name');
            return false;
        }*/
        return true;
    }

    $scope.SaveProject = function () {
        if ($scope.IsValidProject() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.newDet.Mode;
                Swal.fire({
                    title: 'Do you want to ' + saveModify + ' the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    /* Read more about isConfirmed, isDenied below */
                    if (result.isConfirmed) {
                        $scope.CallSaveUpdateProject();
                    }
                });
            } else
                $scope.CallSaveUpdateProject();
        }
    };

    $scope.CallSaveUpdateProject = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();
        if ($scope.newDet.ValidFromDet) {
            $scope.newDet.ValidFrom = $filter('date')(new Date($scope.newDet.ValidFromDet.dateAD), 'yyyy-MM-dd');
        } else
            $scope.newDet.ValidFrom = null;
        if ($scope.newDet.ValidToDet) {
            $scope.newDet.ValidTo = $filter('date')(new Date($scope.newDet.ValidToDet.dateAD), 'yyyy-MM-dd');
        } else
            $scope.newDet.ValidTo = null;
        $http({
            method: 'POST',
            url: base_url + "Account/Creation/SaveProject",
            headers: { 'Content-Type': undefined },
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
                $scope.ClearProject();
                $scope.GetAllProject();
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }



    $scope.GetAllProject = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();
        $scope.ProjectList = [];
        $http({
            method: 'GET',
            url: base_url + "Account/Creation/GetAllProject",
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.ProjectList = res.data.Data;
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    }

    $scope.getProjectById = function (refData) {
        $scope.loadingstatus = "running";
        showPleaseWait();
        var para = {
            ProjectId: refData.ProjectId
        };
        $http({
            method: 'POST',
            url: base_url + "Account/Creation/getProjectById",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.newDet = res.data.Data;

                if ($scope.newDet.ValidFrom)
                    $scope.newDet.ValidFrom_TMP = $scope.newDet.ValidFrom;
                if ($scope.newDet.ValidTo)
                    $scope.newDet.ValidTo_TMP = $scope.newDet.ValidTo;

                $scope.newDet.Mode = 'Modify';
                $('#custom-tabs-four-profile-tab').tab('show');


            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    };



    $scope.DelProjectById = function (refData, ind) {
        Swal.fire({
            title: 'Do you want to delete ' + refData.Name + '?',
            showCancelButton: true,
            confirmButtonText: 'Delete',
            //message: 'Are you sure to delete selected BaliType :-' + beData.Name,
        }).then((result) => {
            if (result.isConfirmed) {
                var para = {
                    ProjectId: refData.ProjectId
                };
                $http({
                    method: 'POST',
                    url: base_url + "Account/Creation/DeleteProject",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingStatus = "stop";

                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess == true) {
                        $scope.GetAllProject();
                    }
                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }

        });
    }





});