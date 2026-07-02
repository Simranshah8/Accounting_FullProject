app.controller("ControllCostCenterDepartment", function ($scope, $http, GlobalServices, $timeout) {
    $scope.Title = 'DebtorType';

    LoadData();


    function LoadData() {
        $scope.loadingstatus = "stop";

        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.perPageColl = GlobalServices.getPerPageList();

        $scope.BranchList = [];
        $http({
            method: 'GET',
            url: base_url + "Setup/Security/GetAllBranchList",
            dataType: "json"
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.BranchList = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $scope.currentPages = {
            CostCenterDepartment: 1

        };

        $scope.searchData = {
            CostCenterDepartment: ''

        };

        $scope.perPage = {
            CostCenterDepartment: GlobalServices.getPerPageRow(),

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

        $scope.beData =
        {
            CostCenterDepartmentId: 0,
            Name: '',
            Alias: '',
            Code: '',            
            Mode: 'Save',
            CCDepartmentWisePayHeadLedgerColl: [{
                LedgerId: null
            }],
        };

    };

    $scope.ClearFields = function () {
        $scope.loadingstatus = "stop";
        $scope.beData =
        {
            CostCenterDepartmentId: 0,
            Name: '',
            Alias: '',
            Code: '',
            ImagePath: '',
            Mode: 'Save',
            CCDepartmentWisePayHeadLedgerColl: [{
                LedgerId: null
            }],
        };
        $scope.clrLedger();
        $scope.ClearSliderPhoto();
        $('#txtName').focus();
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

    $scope.GetAllCostCenterDepartment = function () {
        $scope.CostCenterDepartmentColl = []; //declare an empty array
        if ($scope.loadingstatus != 'stop') {
            alert('Already Running Process')
            return;
        }
        $scope.loadingstatus = 'running';
        showPleaseWait();
        $http({
            method: 'GET',
            url: base_url + "Account/Creation/GetAllCostCenterDepartment",
            dataType: "json"
            //data:JSON.stringify(para)
        }).then(function (res) {
            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                $timeout(function () {
                    $scope.CostCenterDepartmentColl = res.data.Data;
                });
            } else
                alert(res.data.ResponseMSG);

        }, function (reason) {
            alert('Failed' + reason);
        });

    }
    $scope.ClearSliderPhoto = function () {
        $timeout(function () {
            $scope.$apply(function () {
                $scope.beData.PhotoData = null;
                $scope.beData.Photo_TMP = [];
                $scope.beData.ImagePath = '';
            });
        });
        $('input[type=file]').val('');
        $('#imgPhoto1').attr('src', '');

    };

    $scope.IsValidDebtorCreditorType = function () {
        if ($scope.beData.Name.isEmpty()) {
            Swal.fire("Please ! Enter Valid Debtor Creditor Name");
            return false;
        }
        else
            return true;
    }

    $scope.AddNewCostCenterDepartment = function () {
        if ($scope.IsValidDebtorCreditorType() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.beData.Mode;
                Swal.fire({
                    title: 'Do you want to' + saveModify + 'the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    if (result.isConfirmed) {
                        $scope.CallSaveUpdateDebtorCreditorsType();
                    }

                });
            }
            else
                $scope.CallSaveUpdateDebtorCreditorsType();
        }
    };

    $scope.CallSaveUpdateDebtorCreditorsType = function () {
        $scope.loadingstatus = 'running';
        showPleaseWait();

        var departmentWisePayHeadLedger = [];
        angular.forEach($scope.PayHeadList, function (item) {
            if (item.LedgerId) {
                departmentWisePayHeadLedger.push({
                    PayHeadingId: item.PayHeadingId,
                    LedgerId: item.LedgerId
                });
            }
        });
        $scope.beData.CCDepartmentWisePayHeadLedgerColl = departmentWisePayHeadLedger;

        $http({
            method: 'POST',
            url: base_url + "Account/Creation/SaveUpdateCostCenterDepartment",
            headers: { 'content-Type': undefined },

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
                $scope.GetAllCostCenterDepartment();
                $scope.ClearFields();
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }

    $scope.getCostCenterDepartmentById = function (beData) {

        $scope.loadingstatus = "running";
        var para = {
            CostCenterDepartmentId: beData.CostCenterDepartmentId
        };
        $http({
            method: 'POST',
            url: base_url + "Account/Creation/getCostCenterDepartmentById",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $timeout(function () {
                    $scope.beData = res.data.Data;
                    $scope.beData.Mode = 'Modify';

                    if ($scope.beData.CCDepartmentWisePayHeadLedgerColl && $scope.PayHeadList.length > 0) {
                        angular.forEach($scope.PayHeadList, function (item) {
                            // Find matching PayHeadingId from the mapping list
                            var match = $scope.beData.CCDepartmentWisePayHeadLedgerColl.find(function (m) {
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
                });
            } else
                Swal.fire(res.data.ResponseMSG);

        }, function (reason) {
            alert('Failed' + reason);
        });
    }

    $scope.deleteCostCenterDepartment = function (refData, ind) {

        Swal.fire({
            title: 'Are you sure to delete selected DebtorCreditor Type :-' + refData.Name,
            showCancelButton: true,
            confirmButtonText: 'Delete',
        }).then((result) => {
            if (result.isConfirmed) {
                $scope.loadingstatus = "running";
                showPleaseWait();

                var para = {
                    CostCenterDepartmentId: refData.CostCenterDepartmentId
                };

                $http({
                    method: 'POST',
                    url: base_url + "Account/Creation/DeleteCostCenterDepartment",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingstatus = "stop";
                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess) {
                        $scope.GetAllCostCenterDepartment();
                        //$scope.CostCenterDepartmentColl.splice(ind, 1);
                    }

                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }
        });

    }
    


});