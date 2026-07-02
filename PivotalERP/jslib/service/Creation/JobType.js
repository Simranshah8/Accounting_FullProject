app.controller('JobTypeController', function ($scope, $http, $timeout, $filter, GlobalServices) {
    $scope.Title = 'JobType';

    OnClickDefault();
    var glSrv = GlobalServices;
    $scope.LoadData = function () {
        $('.select2').select2();
        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.perPageColl = GlobalServices.getPerPageList();
        $scope.currentPages = {
            JobType: 1,
        };

        $scope.searchData = {
            JobType: '',

        };

        $scope.perPage = {
            JobType: GlobalServices.getPerPageRow()
        };


        $scope.newDet = {
            JobTypeId: null,
            JobType: '',
            OrderNo: 0,
            Description: '',
            LedgerId: null,
            IsWarrenty: false,
            IsFreeService: false,
            IsPDI: false,
            IsBillType:false,
            Mode: 'Save'
        };

        $scope.GetAllJobType();

    };

    $scope.ClearJobType = function () {
        $scope.newDet = {
            JobTypeId: null,
            JobType: '',
            OrderNo: 0,
            Description: '',
            LedgerId: null,
            IsWarrenty: false,
            IsFreeService: false,
            IsPDI: false,
            IsBillType: false,
            Mode: 'Save'
        };
    }


    //Show hide jf for Employee Profile

    function OnClickDefault() {
        /*  show or hide Employee Profile*/

        document.getElementById('JobType-form').style.display = "none";

        document.getElementById('add-JobType-details').onclick = function () {
            document.getElementById('JobType-section').style.display = "none";
            document.getElementById('JobType-form').style.display = "block";
        }
        document.getElementById('back-to-JobType-list').onclick = function () {
            document.getElementById('JobType-form').style.display = "none";
            document.getElementById('JobType-section').style.display = "block";
        }


    };



    //************************* BaliType *********************************
    $scope.IsValidJobType = function () {
        /*if ($scope.newBaliType.GenderName.isEmpty()) {
            Swal.fire('Please ! Enter GenderName Name');
            return false;
        }*/
        return true;
    }

    $scope.SaveJobType = function () {
        if ($scope.IsValidJobType() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.newDet.Mode;
                Swal.fire({
                    title: 'Do you want to ' + saveModify + ' the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    /* Read more about isConfirmed, isDenied below */
                    if (result.isConfirmed) {
                        $scope.CallSaveUpdateJobType();
                    }
                });
            } else
                $scope.CallSaveUpdateJobType();
        }
    };

    $scope.CallSaveUpdateJobType = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();
        $http({
            method: 'POST',
            url: base_url + "Service/Creation/SaveJobType",
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
                $scope.ClearJobType();
                $scope.GetAllJobType();
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }



    $scope.GetAllJobType = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();
        $scope.JobTypeList = [];
        $http({
            method: 'GET',
            url: base_url + "Service/Creation/GetAllJobType",
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.JobTypeList = res.data.Data;
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    }

    $scope.getJobTypeById = function (refData) {
        $scope.loadingstatus = "running";
        showPleaseWait();
        var para = {
            JobTypeId: refData.JobTypeId
        };
        $http({
            method: 'POST',
            url: base_url + "Service/Creation/getJobTypeById",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.newDet = res.data.Data;
                $scope.newDet.Mode = 'Update';
                document.getElementById('JobType-section').style.display = "none";
                document.getElementById('JobType-form').style.display = "block";

            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    };



    $scope.DelJobTypeById = function (refData, ind) {
        Swal.fire({
            title: 'Do you want to delete ' + refData.JobTypeName + '?',
            showCancelButton: true,
            confirmButtonText: 'Delete',
            //message: 'Are you sure to delete selected BaliType :-' + beData.Name,
        }).then((result) => {
            if (result.isConfirmed) {
                var para = {
                    JobTypeId: refData.JobTypeId
                };
                $http({
                    method: 'POST',
                    url: base_url + "Service/Creation/DeleteJobType",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingStatus = "stop";

                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess == true) {
                        $scope.GetAllJobType();
                    }
                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }

        });
    }





});