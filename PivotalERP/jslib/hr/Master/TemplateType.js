app.controller('TemplateTypeController', function ($scope, $http, $timeout, $filter, GlobalServices) {
    $scope.Title = 'TemplateType';

    LoadData();

    function LoadData() {
        $('.select2').select2();
        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.perPageColl = GlobalServices.getPerPageList();
        $scope.currentPages = {
            TemplateType: 1,
        };

        $scope.searchData = {
            TemplateType: '',

        };

        $scope.perPage = {
            TemplateType: GlobalServices.getPerPageRow()
        };


        $scope.beData = {
            TemplateTypeId: null,
            Name: '',
            OrderNo: 0,
            Mode: 'Save'
        };

        //$scope.GetAllTemplateType();

    };

    $scope.ClearTemplateType = function () {
        $scope.beData = {
            TemplateTypeId: null,
            Name: '',
            OrderNo: 0,
            Mode: 'Save'
        };
    }





    //************************* BaliType *********************************
    $scope.IsValidTemplateType = function () {
        /*if ($scope.newBaliType.GenderName.isEmpty()) {
            Swal.fire('Please ! Enter GenderName Name');
            return false;
        }*/
        return true;
    }

    $scope.SaveTemplateType = function () {
        if ($scope.IsValidTemplateType() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.beData.Mode;
                Swal.fire({
                    title: 'Do you want to ' + saveModify + ' the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    /* Read more about isConfirmed, isDenied below */
                    if (result.isConfirmed) {
                        $scope.CallSaveUpdateTemplateType();
                    }
                });
            } else
                $scope.CallSaveUpdateTemplateType();
        }
    };

    $scope.CallSaveUpdateTemplateType = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();
        $http({
            method: 'POST',
            url: base_url + "HR/Master/SaveTemplateType",
            headers: { 'Content-Type': undefined },
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
                $scope.ClearTemplateType();
                $scope.GetAllTemplateType();
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }



    $scope.GetAllTemplateType = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();
        $scope.TemplateTypeList = [];
        $http({
            method: 'Post',
            url: base_url + "HR/Master/GetAllTemplateType",
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.TemplateTypeList = res.data.Data;
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    }

    $scope.getTemplateTypeById = function (refData) {
        $scope.loadingstatus = "running";
        showPleaseWait();
        var para = {
            TemplateTypeId: refData.TemplateTypeId
        };
        $http({
            method: 'POST',
            url: base_url + "HR/Master/getTemplateTypeById",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.beData = res.data.Data;
                $scope.beData.Mode = 'Modify';
                $('#custom-tabs-four-profile-tab').tab('show');


            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    };



    $scope.DelTemplateTypeById = function (refData, ind) {
        Swal.fire({
            title: 'Do you want to delete ' + refData.Name + '?',
            showCancelButton: true,
            confirmButtonText: 'Delete',
            //message: 'Are you sure to delete selected BaliType :-' + beData.Name,
        }).then((result) => {
            if (result.isConfirmed) {
                var para = {
                    TemplateTypeId: refData.TemplateTypeId
                };
                $http({
                    method: 'POST',
                    url: base_url + "HR/Master/DelTemplateType",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingStatus = "stop";

                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess == true) {
                        $scope.GetAllTemplateType();
                    }
                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }

        });
    }


});