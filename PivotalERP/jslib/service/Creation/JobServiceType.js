app.controller('JobServiceTypeController', function ($scope, $http, $timeout, $filter, GlobalServices) {
    $scope.Title = 'JobServiceType';

    OnClickDefault();
    $scope.LoadData = function () {
        $('.select2').select2();
        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.perPageColl = GlobalServices.getPerPageList();
        $scope.currentPages = {
            JobServiceType: 1,
        };

        $scope.searchData = {
            JobServiceType: '',
        };

        $scope.perPage = {
            JobServiceType: GlobalServices.getPerPageRow()
        };

        $scope.JobCardTypeList = [];
        $http({
            method: 'GET',
            url: base_url + "Service/Creation/GetAllJobCardType",
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.JobCardTypeList = res.data.Data;
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        

        $scope.newDet = {
            ServiceTypeId: null,
            Name: '',
            OrderNo: 0,
            JobCardTypeId: null,
            Mode: 'Save'
        };

        $scope.GetAllJobServiceType();

    };

    $scope.ClearJobServiceType = function () {
        $scope.newDet = {
            ServiceTypeId: null,
            Name: '',
            OrderNo: 0,
            JobCardTypeId: null,
            Mode: 'Save'
        };
    }


    //Show hide jf for Employee Profile

    function OnClickDefault() {
        /*  show or hide Employee Profile*/

        document.getElementById('JobServiceType-form').style.display = "none";

        document.getElementById('add-JobServiceType-details').onclick = function () {
            document.getElementById('JobServiceType-section').style.display = "none";
            document.getElementById('JobServiceType-form').style.display = "block";
        }
        document.getElementById('back-to-JobServiceType-list').onclick = function () {
            document.getElementById('JobServiceType-form').style.display = "none";
            document.getElementById('JobServiceType-section').style.display = "block";
        }


    };



    //************************* BaliType *********************************
    $scope.IsValidJobServiceType = function () {
        if ($scope.newDet.Name.isEmpty()) {
            Swal.fire('Please ! Enter Name');
            return false;
        }
        return true;
    }

    $scope.SaveJobServiceType = function () {
        if ($scope.IsValidJobServiceType() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.newDet.Mode;
                Swal.fire({
                    title: 'Do you want to ' + saveModify + ' the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    /* Read more about isConfirmed, isDenied below */
                    if (result.isConfirmed) {
                        $scope.CallSaveUpdateJobServiceType();
                    }
                });
            } else
                $scope.CallSaveUpdateJobServiceType();
        }
    };

    $scope.CallSaveUpdateJobServiceType = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();
        $http({
            method: 'POST',
            url: base_url + "Service/Creation/SaveJobServiceType",
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
                $scope.ClearJobServiceType();
                $scope.GetAllJobServiceType();
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }



    $scope.GetAllJobServiceType = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();
        $scope.JobServiceTypeList = [];
        $http({
            method: 'GET',
            url: base_url + "Service/Creation/GetAllJobServiceType",
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.JobServiceTypeList = res.data.Data;
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    }

    $scope.getJobServiceTypeById = function (refData) {
        $scope.loadingstatus = "running";
        showPleaseWait();
        var para = {
            ServiceTypeId: refData.ServiceTypeId
        };
        $http({
            method: 'POST',
            url: base_url + "Service/Creation/getJobServiceTypeById",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.newDet = res.data.Data;
                $scope.newDet.Mode = 'Update';
                document.getElementById('JobServiceType-section').style.display = "none";
                document.getElementById('JobServiceType-form').style.display = "block";

            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    };



    $scope.DelJobServiceTypeById = function (refData, ind) {
        Swal.fire({
            title: 'Do you want to delete ' + refData.Name + '?',
            showCancelButton: true,
            confirmButtonText: 'Delete',
            //message: 'Are you sure to delete selected BaliType :-' + beData.Name,
        }).then((result) => {
            if (result.isConfirmed) {
                var para = {
                    ServiceTypeId: refData.ServiceTypeId
                };
                $http({
                    method: 'POST',
                    url: base_url + "Service/Creation/DeleteJobServiceType",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingStatus = "stop";

                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess == true) {
                        $scope.GetAllJobServiceType();
                    }
                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }

        });
    }





});