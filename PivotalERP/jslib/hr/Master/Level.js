app.controller('LevelController', function ($scope, $http, $timeout, $filter, GlobalServices) {
    $scope.Title = 'Level';

    LoadData();

    function LoadData() {
        $('.select2').select2();
        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.perPageColl = GlobalServices.getPerPageList();
        $scope.currentPages = {
            Level: 1,
        };

        $scope.searchData = {
            Level: '',

        };

        $scope.perPage = {
            Level: GlobalServices.getPerPageRow()
        };


        $scope.PayHeadList = [];
        $http({
            method: 'GET',
            url: base_url + "HR/Transaction/GetAllPayHeading",
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.PayHeadList = res.data.Data.filter(function (item) {
                    return item.IsActive === true;
                });
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $scope.newDet = {
            LevelId: null,
            Name: '',
            OrderNo: 0,
            LedgerId: null,
            Code: '',
            Description: '',
            Mode: 'Save',
            LevelWisePayHeadLedgerColl: [{
                LedgerId: null
            }],
        };

        //$scope.GetAllLevel();

    };

    $scope.ClearLevel = function () {
        $scope.clrLedger();
        $scope.newDet = {
            LevelId: null,
            Name: '',
            OrderNo: 0,
            LedgerId: null,
            Code: '',
            Description: '',
            Mode: 'Save',
            LevelWisePayHeadLedgerColl: [{
                LedgerId: null
            }],
        };
    }

    $scope.clrLedger = function () {
        angular.forEach($scope.PayHeadList, function (item) {
            item.LedgerId = null;
            item.LedgerGroup = '';
        });
    }

    $scope.PartySelectionChange = function (det) {
        if (det && det.PartyLedger) {
            det.LedgerGroup = det.PartyLedger.GroupName;
        } else {
            det.LedgerGroup = '';
        }
    };


    //************************* Level *********************************
    $scope.IsValidLevel = function () {
        /*if ($scope.newBaliType.Name.isEmpty()) {
            Swal.fire('Please ! Enter Name');
            return false;
        }*/
        return true;
    }

    $scope.SaveLevel = function () {
        if ($scope.IsValidLevel() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.newDet.Mode;
                Swal.fire({
                    title: 'Do you want to ' + saveModify + ' the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    /* Read more about isConfirmed, isDenied below */
                    if (result.isConfirmed) {
                        $scope.CallSaveUpdateLevel();
                    }
                });
            } else
                $scope.CallSaveUpdateLevel();
        }
    };

    $scope.CallSaveUpdateLevel = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();
        var levelWisePayHeadLedger = [];
        angular.forEach($scope.PayHeadList, function (item) {
            if (item.LedgerId) {
                levelWisePayHeadLedger.push({
                    PayHeadingId: item.PayHeadingId,
                    LedgerId: item.LedgerId
                });
            }
        });
        $scope.newDet.LevelWisePayHeadLedgerColl = levelWisePayHeadLedger;
        $http({
            method: 'POST',
            url: base_url + "HR/Master/SaveLevel",
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
                $scope.ClearLevel();
                $scope.GetAllLevel();
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }



    $scope.GetAllLevel = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();
        $scope.LevelList = [];
        $http({
            method: 'GET',
            url: base_url + "HR/Master/GetAllLevel",
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.LevelList = res.data.Data;
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    }

    $scope.getLevelById = function (refData) {
        $scope.loadingstatus = "running";
        showPleaseWait();
        var para = {
            LevelId: refData.LevelId
        };
        $http({
            method: 'POST',
            url: base_url + "HR/Master/getLevelById",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.newDet = res.data.Data;
                $scope.newDet.Mode = 'Modify';

                if ($scope.newDet.LevelWisePayHeadLedgerColl && $scope.PayHeadList.length > 0) {
                    angular.forEach($scope.PayHeadList, function (item) {
                        // Find matching PayHeadingId from the mapping list
                        var match = $scope.newDet.LevelWisePayHeadLedgerColl.find(function (m) {
                            return m.PayHeadingId === item.PayHeadingId;
                        });
                        // If found, assign its LedgerId
                        if (match) {
                            item.LedgerId = match.LedgerId;
                            if ($scope.PayHeadList[0].PartyLedger) {
                                item.PartyLedger = angular.copy($scope.PayHeadList[0].PartyLedger);
                            }
                            $scope.PartySelectionChange(item);
                        } else {
                            item.LedgerId = null;
                            item.LedgerGroup = '';
                        }
                    });
                }

                $('#custom-tabs-four-profile-tab').tab('show');


            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    };



    $scope.DelLevelById = function (refData, ind) {
        Swal.fire({
            title: 'Do you want to delete ' + refData.Name + '?',
            showCancelButton: true,
            confirmButtonText: 'Delete',
            //message: 'Are you sure to delete selected BaliType :-' + beData.Name,
        }).then((result) => {
            if (result.isConfirmed) {
                var para = {
                    LevelId: refData.LevelId
                };
                $http({
                    method: 'POST',
                    url: base_url + "HR/Master/DeleteLevel",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingStatus = "stop";

                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess == true) {
                        $scope.GetAllLevel();
                    }
                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }

        });
    }





});