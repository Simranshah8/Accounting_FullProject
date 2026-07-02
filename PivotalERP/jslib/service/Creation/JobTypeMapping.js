app.controller('JobTypeMappingController', function ($scope, $http, $timeout, $filter, GlobalServices) {
    $scope.Title = 'JobTypeMapping';

    OnClickDefault();

    $scope.LoadData = function () {
        $('.select2').select2();
        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.perPageColl = GlobalServices.getPerPageList();

        //$scope.VehicleTypeList = [{ VehicleTypeId: 10, Name: 'Type1`' }, { VehicleTypeId: 11, Name: 'Type2' }];
        //$scope.VehicleModelList = [{ VehicleModelId: 1, Name: 'Model1`' }, { VehicleModelId: 2, Name: 'Model2' }];

        $scope.currentPages = {
            JobTypeMapping: 1,
        };

        $scope.searchData = {
            JobTypeMapping: '',

        };

        $scope.perPage = {
            JobTypeMapping: GlobalServices.getPerPageRow()
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

        $scope.VehicleTypeList = [];
        $http({
            method: 'GET',
            url: base_url + "Service/Transaction/GetAllVehicleType",
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.VehicleTypeList = res.data.Data;
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });


        $scope.VehicleModelList = [];
        $http({
            method: 'GET',
            url: base_url + "Service/Transaction/GetAllVehicleModel",
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.VehicleModelList = res.data.Data;
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $scope.newDet = {
            JobTypeMappingId: null,
            VehicleTypeId: null,
            VehicleModelId: null,
            Description: '',
            JobTypeMappingDetColl: [],
            Mode: 'Save'
        };
        $scope.newDet.JobTypeMappingDetColl.push({});
        $scope.GetAllJobTypeMapping();

    };

    $scope.ClearJobTypeMapping = function () {
        $scope.newDet = {
            JobTypeMappingId: null,
            VehicleTypeId: null,
            VehicleModelId: null,
            Description: '',
            JobTypeMappingDetColl: [],
            Mode: 'Save'
        };
        $scope.newDet.JobTypeMappingDetColl.push({});
    }


    $scope.AddDetail = function (ind) {
        if ($scope.newDet.JobTypeMappingDetColl) {
            if ($scope.newDet.JobTypeMappingDetColl.length > ind + 1) {
                $scope.newDet.JobTypeMappingDetColl.splice(ind + 1, 0, {
                    ClassName: ''
                })
            } else {
                $scope.newDet.JobTypeMappingDetColl.push({
                    ClassName: ''
                })
            }
        }
    };
    $scope.delDetail = function (ind) {
        if ($scope.newDet.JobTypeMappingDetColl) {
            if ($scope.newDet.JobTypeMappingDetColl.length > 1) {
                $scope.newDet.JobTypeMappingDetColl.splice(ind, 1);
            }
        }
    };


    //Show hide jf for Employee Profile

    function OnClickDefault() {
        /*  show or hide Employee Profile*/

        document.getElementById('JobTypeMapping-form').style.display = "none";

        document.getElementById('add-JobTypeMapping-details').onclick = function () {
            document.getElementById('JobTypeMapping-section').style.display = "none";
            document.getElementById('JobTypeMapping-form').style.display = "block";
        }
        document.getElementById('back-to-JobTypeMapping-list').onclick = function () {
            document.getElementById('JobTypeMapping-form').style.display = "none";
            document.getElementById('JobTypeMapping-section').style.display = "block";
        }


    };



    //************************* BaliType *********************************
    $scope.IsValidJobTypeMapping = function () {
        /*if ($scope.newBaliType.GenderName.isEmpty()) {
            Swal.fire('Please ! Enter GenderName Name');
            return false;
        }*/
        return true;
    }

    $scope.SaveJobTypeMapping = function () {
        if ($scope.IsValidJobTypeMapping() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.newDet.Mode;
                Swal.fire({
                    title: 'Do you want to ' + saveModify + ' the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    /* Read more about isConfirmed, isDenied below */
                    if (result.isConfirmed) {
                        $scope.CallSaveUpdateJobTypeMapping();
                    }
                });
            } else
                $scope.CallSaveUpdateJobTypeMapping();
        }
    };

    $scope.CallSaveUpdateJobTypeMapping = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();
        $http({
            method: 'POST',
            url: base_url + "Service/Creation/SaveJobTypeMapping",
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
                $scope.ClearJobTypeMapping();
                $scope.GetAllJobTypeMapping();
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }



    $scope.GetAllJobTypeMapping = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();
        $scope.JobTypeMappingList = [];
        $http({
            method: 'GET',
            url: base_url + "Service/Creation/GetAllJobTypeMapping",
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.JobTypeMappingList = res.data.Data;
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    }

    $scope.getJobTypeMappingById = function (refData) {
        $scope.loadingstatus = "running";
        showPleaseWait();
        var para = {
            JobTypeMappingId: refData.JobTypeMappingId
        };
        $http({
            method: 'POST',
            url: base_url + "Service/Creation/getJobTypeMappingById",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.newDet = res.data.Data;

                if (!$scope.newDet.JobTypeMappingDetColl || $scope.newDet.JobTypeMappingDetColl.length == 0) {
                    $scope.newDet.JobTypeMappingDetColl = [];
                    $scope.newDet.JobTypeMappingDetColl.push({});
                }

                $scope.newDet.Mode = 'Update';
                document.getElementById('JobTypeMapping-section').style.display = "none";
                document.getElementById('JobTypeMapping-form').style.display = "block";

            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    };



    $scope.DelJobTypeMappingById = function (refData, ind) {
        Swal.fire({
            title: 'Do you want to delete ' + refData.Name + '?',
            showCancelButton: true,
            confirmButtonText: 'Delete',
            //message: 'Are you sure to delete selected BaliType :-' + beData.Name,
        }).then((result) => {
            if (result.isConfirmed) {
                var para = {
                    JobTypeMappingId: refData.JobTypeMappingId
                };
                $http({
                    method: 'POST',
                    url: base_url + "Service/Creation/DeleteJobTypeMapping",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingStatus = "stop";

                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess == true) {
                        $scope.GetAllJobTypeMapping();
                    }
                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }

        });
    }





});