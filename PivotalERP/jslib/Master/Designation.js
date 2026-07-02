app.controller('DesignationController', function ($scope, $http, $timeout, $filter, GlobalServices) {
    $scope.Title = 'Designation';

    LoadData();

    function LoadData() {
        $('.select2').select2();
        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.perPageColl = GlobalServices.getPerPageList();
        $scope.currentPages = {
            Designation: 1,
        };

        $scope.searchData = {
            Designation: '',

        };

        $scope.perPage = {
            Designation: GlobalServices.getPerPageRow()
        };


        $scope.newDet = {
            DesignationId: null,
            Name: '',
            OrderNum: null,
            Code: '',
            Mode: 'Save'
        };

        //$scope.GetAllDesignation();

    };

    $scope.ClearDesignation = function () {
        $scope.newDet = {
            DesignationId: null,
            Name: '',
            Alias: '',
            Code: '',
            Mode: 'Save'
        };
    }




    //************************* Department *********************************
    $scope.IsValidDesignation = function () {
        /*if ($scope.newBaliType.GenderName.isEmpty()) {
            Swal.fire('Please ! Enter GenderName Name');
            return false;
        }*/
        return true;
    }

    $scope.SaveDesignation = function () {
        if ($scope.IsValidDesignation() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.newDet.Mode;
                Swal.fire({
                    title: 'Do you want to ' + saveModify + ' the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    /* Read more about isConfirmed, isDenied below */
                    if (result.isConfirmed) {
                        $scope.CallSaveUpdateDesignation();
                    }
                });
            } else
                $scope.CallSaveUpdateDesignation();
        }
    };

    $scope.CallSaveUpdateDesignation = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();
        $http({
            method: 'POST',
            url: base_url + "Payroll/Master/SaveDesignation",
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
                $scope.ClearDesignation();
                $scope.GetAllDesignation();
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }



    $scope.GetAllDesignation = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();
        $scope.DesignationList = [];
        $http({
            method: 'GET',
            url: base_url + "Payroll/Master/GetAllDesignation",
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.DesignationList = res.data.Data;
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    }

    $scope.getDesignationById = function (refData) {
        $scope.loadingstatus = "running";
        showPleaseWait();
        var para = {
            DesignationId: refData.DesignationId
        };
        $http({
            method: 'POST',
            url: base_url + "Payroll/Master/getDesignationById",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.newDet = res.data.Data;
                $scope.newDet.Mode = 'Modify';
                $('#custom-tabs-four-profile-tab').tab('show');


            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    };



    $scope.DelDesignationById = function (refData, ind) {
        Swal.fire({
            title: 'Do you want to delete ' + refData.Name + '?',
            showCancelButton: true,
            confirmButtonText: 'Delete',
            //message: 'Are you sure to delete selected BaliType :-' + beData.Name,
        }).then((result) => {
            if (result.isConfirmed) {
                var para = {
                    DesignationId: refData.DesignationId
                };
                $http({
                    method: 'POST',
                    url: base_url + "Payroll/Master/DeleteDesignation",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingStatus = "stop";

                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess == true) {
                        $scope.GetAllDesignation();
                    }
                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }

        });
    }





});