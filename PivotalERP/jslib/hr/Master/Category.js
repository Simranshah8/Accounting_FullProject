app.controller('CategoryController', function ($scope, $http, $timeout, $filter, GlobalServices) {
    $scope.Title = 'Category';

    LoadData();

    function LoadData() {
        $('.select2').select2();
        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.perPageColl = GlobalServices.getPerPageList();
        $scope.currentPages = {
            Category: 1,
        };

        $scope.searchData = {
            Category: '',

        };

        $scope.perPage = {
            Category: GlobalServices.getPerPageRow()
        };

        $scope.CategoryWisePayHeadLedger = [];
        $http({
            method: 'GET',
            url: base_url + "HR/Transaction/GetAllPayHeading",
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.CategoryWisePayHeadLedger = res.data.Data.filter(function (item) {
                    return item.IsActive === true;
                });
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $scope.newDet = {
            CategoryId: null,
            Name: '',
            OrderNo: 0,
            LedgerId: null,
            Code: '',
            Mode: 'Save',
            CategoryWisePayHeadLedgerColl: [{
                LedgerId: null
            }],
        };

        //$scope.GetAllCategory();

    };

    $scope.ClearCategory = function () {
        $scope.clrLedger();
        $scope.newDet = {
            CategoryId: null,
            Name: '',
            OrderNo: 0,
            LedgerId: null,
            Code: '',
            Mode: 'Save',
            CategoryWisePayHeadLedgerColl: [{
                LedgerId: null
            }],
        };
    }
    $scope.clrLedger = function () {
        angular.forEach($scope.CategoryWisePayHeadLedger, function (item) {
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



    //************************* Category *********************************
    $scope.IsValidCategory = function () {
        /*if ($scope.newBaliType.GenderName.isEmpty()) {
            Swal.fire('Please ! Enter GenderName Name');
            return false;
        }*/
        return true;
    }

    $scope.SaveCategory = function () {
        if ($scope.IsValidCategory() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.newDet.Mode;
                Swal.fire({
                    title: 'Do you want to ' + saveModify + ' the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    /* Read more about isConfirmed, isDenied below */
                    if (result.isConfirmed) {
                        $scope.CallSaveUpdateCategory();
                    }
                });
            } else
                $scope.CallSaveUpdateCategory();
        }
    };

    $scope.CallSaveUpdateCategory = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();

        var categoryWisePayHeadLedger = [];
        angular.forEach($scope.CategoryWisePayHeadLedger, function (item) {
            if (item.LedgerId) {
                categoryWisePayHeadLedger.push({
                    PayHeadingId: item.PayHeadingId,
                    LedgerId: item.LedgerId
                });
            }
        });
        $scope.newDet.CategoryWisePayHeadLedgerColl = categoryWisePayHeadLedger;
        $http({
            method: 'POST',
            url: base_url + "HR/Master/SaveCategory",
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
                $scope.ClearCategory();
                $scope.GetAllCategory();
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }



    $scope.GetAllCategory = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();
        $scope.CategoryList = [];
        $http({
            method: 'GET',
            url: base_url + "HR/Master/GetAllCategory",
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.CategoryList = res.data.Data;
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    }

    $scope.getCategoryById = function (refData) {
        $scope.loadingstatus = "running";
        showPleaseWait();
        var para = {
            CategoryId: refData.CategoryId
        };
        $http({
            method: 'POST',
            url: base_url + "HR/Master/getCategoryById",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.newDet = res.data.Data;
                $scope.newDet.Mode = 'Modify';
                if ($scope.newDet.CategoryWisePayHeadLedgerColl && $scope.CategoryWisePayHeadLedger.length > 0) {
                    angular.forEach($scope.CategoryWisePayHeadLedger, function (item) {
                        // Find matching PayHeadingId from the mapping list
                        var match = $scope.newDet.CategoryWisePayHeadLedgerColl.find(function (m) {
                            return m.PayHeadingId === item.PayHeadingId;
                        });
                        // If found, assign its LedgerId
                        if (match) {
                            item.LedgerId = match.LedgerId;
                            if ($scope.CategoryWisePayHeadLedger[0].PartyLedger) {
                                item.PartyLedger = angular.copy($scope.CategoryWisePayHeadLedger[0].PartyLedger);
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



    $scope.DelCategoryById = function (refData, ind) {
        Swal.fire({
            title: 'Do you want to delete ' + refData.Name + '?',
            showCancelButton: true,
            confirmButtonText: 'Delete',
            //message: 'Are you sure to delete selected BaliType :-' + beData.Name,
        }).then((result) => {
            if (result.isConfirmed) {
                var para = {
                    CategoryId: refData.CategoryId
                };
                $http({
                    method: 'POST',
                    url: base_url + "HR/Master/DeleteCategory",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingStatus = "stop";

                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess == true) {
                        $scope.GetAllCategory();
                    }
                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }

        });
    }





});