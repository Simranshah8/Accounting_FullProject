app.controller('LandTypeController', function ($scope, $http, $timeout, $filter, GlobalServices) {
    $scope.Title = 'LandType';

    LoadData();
    function LoadData() {
        $('.select2').select2();
        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.perPageColl = GlobalServices.getPerPageList();
        $scope.currentPages = {
            LandType: 1,
        };

        $scope.searchData = {
            LandType: '',

        };

        $scope.perPage = {
            LandType: GlobalServices.getPerPageRow()
        };

        $scope.newDet = {
            LandTypeId: null,
            Name: '',
            Rate: '',
            Mode: 'Save',
            StartNo: 0,
            EndNo: 0,
            TentRate:0,
            WaterRate: 0,
            ElectricityRate: 0,
            OthersRate: 0,
            LandTypeDetailColl:[],
        };

        $scope.newDet.LandTypeDetailColl.push({ LandName: '' });
        //$scope.GetAllLandType();

    };

    $scope.StartEndNo = function () {
        if ($scope.newDet.StartNo > 0 && $scope.newDet.EndNo > 0) {
            $scope.newDet.LandTypeDetailColl = [];
            for (var i = $scope.newDet.StartNo; i <= $scope.newDet.EndNo; i++) {
                $scope.newDet.LandTypeDetailColl.push({
                    LandName: i
                });
            }
        }
    }
    $scope.addRow = function (det, ind) {
        if (det.LandName && det.LandName.length > 0) {
            if ($scope.newDet.LandTypeDetailColl) {
                if ($scope.newDet.LandTypeDetailColl.length > ind + 1) {
                    $scope.newDet.LandTypeDetailColl.splice(ind + 1, 0, {
                    })
                } else {
                    $scope.newDet.LandTypeDetailColl.push({
                        LandName:''
                    });
                }
            }
        }

    };
    $scope.delRow = function (ind) {
        if ($scope.newDet.LandTypeDetailColl) {
            if ($scope.newDet.LandTypeDetailColl.length > 1) {
                $scope.newDet.LandTypeDetailColl.splice(ind, 1);
            }
        }
    };

    $scope.ClearLandType = function () {

        $scope.newDet = {
            LandTypeId: null,
            Name: '',
            Rate: '',
            Mode: 'Save',
            StartNo: 0,
            EndNo: 0,
            TentRate: 0,
            WaterRate: 0,
            ElectricityRate: 0,
            OthersRate: 0,
            LandTypeDetailColl: [],
        };


        $scope.newDet.LandTypeDetailColl.push({ LandName: '' });
    }




    //************************* Department *********************************
    $scope.IsValidLandType = function () {
        /*if ($scope.newDet.Name.isEmpty()) {
            Swal.fire('Please ! Enter Name');
            return false;
        }*/
        return true;
    }

    $scope.SaveLandType = function () {
        if ($scope.IsValidLandType() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.newDet.Mode;
                Swal.fire({
                    title: 'Do you want to ' + saveModify + ' the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    /* Read more about isConfirmed, isDenied below */
                    if (result.isConfirmed) {
                        $scope.CallSaveUpdateLandType();
                    }
                });
            } else
                $scope.CallSaveUpdateLandType();
        }
    };

    $scope.CallSaveUpdateLandType = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();
        $http({
            method: 'POST',
            url: base_url + "Gadhimai/Creation/SaveLandType",
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
                $scope.ClearLandType();
                $scope.GetAllLandType();
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }



    $scope.GetAllLandType = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();
        $scope.LandTypeList = [];
        $http({
            method: 'GET',
            url: base_url + "Gadhimai/Creation/GetAllLandType",
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.LandTypeList = res.data.Data;
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    }

    $scope.getLandTypeById = function (refData) {
        $scope.loadingstatus = "running";
        showPleaseWait();
        var para = {
            LandTypeId: refData.LandTypeId
        };
        $http({
            method: 'POST',
            url: base_url + "Gadhimai/Creation/getLandTypeById",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.newDet = res.data.Data;

                if (!$scope.newDet.LandTypeDetailColl || $scope.newDet.LandTypeDetailColl.length ==0) {
                    $scope.newDet.LandTypeDetailColl = [];
                    $scope.newDet.LandTypeDetailColl.push({ LandName: '' });
                }

                $scope.newDet.Mode = 'Modify';
                $('#custom-tabs-four-profile-tab').tab('show');


            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    };



    $scope.DelLandTypeById = function (refData, ind) {
        Swal.fire({
            title: 'Do you want to delete ' + refData.Name + '?',
            showCancelButton: true,
            confirmButtonText: 'Delete',
            //message: 'Are you sure to delete selected BaliType :-' + beData.Name,
        }).then((result) => {
            if (result.isConfirmed) {
                var para = {
                    LandTypeId: refData.LandTypeId
                };
                $http({
                    method: 'POST',
                    url: base_url + "Gadhimai/Creation/DeleteLandType",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingStatus = "stop";

                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess == true) {
                        $scope.GetAllLandType();
                    }
                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }

        });
    }





});