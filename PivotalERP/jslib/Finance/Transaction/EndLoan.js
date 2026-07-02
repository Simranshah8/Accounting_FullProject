app.controller('EndLoanController', function ($scope, GlobalServices, $http, $filter, $timeout) {
    $scope.Title = 'EndLoan';

    var glSrv = GlobalServices;
    $scope.LoadData = function () {
        $('.select2').select2();
        $scope.PeriodTypesList = [{ id: 1, text: 'Daily' }, { id: 2, text: 'Weekly' }, { id: 3, text: 'Monthly' }, { id: 4, text: 'Quaterly' }, { id: 5, text: 'HalyYearly' }, { id: 6, text: 'Yearly' }];
        $scope.LoanTypeColl = [{ id: 1, text: 'Diminishing' }, { id: 2, text: 'Flat' }];
        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.perPageColl = GlobalServices.getPerPageList();
        $scope.currentPages = {
            EndLoan: 1,
        };
        $scope.searchData = {
            EndLoan: '',
        };

        $scope.perPage = {
            EndLoan: GlobalServices.getPerPageRow()
        };

        $scope.LoanCreationList = [];
        $http({
            method: 'POST',
            url: base_url + "Finance/Creation/GetAllLoanCreation",
            dataType: "json"
        }).then(function (res) {
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $timeout(function () {
                    $scope.LoanCreationList = res.data.Data;
                });

            } else
                Swal.fire(res.data.ResponseMSG);
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $scope.beData = {
            LedgerId: null,
            VehicleId: null,
            LoanAmount: null,
            Period: '',
            PeriodId: null,
            LoanTypeId: null,
            Rate: null,
            Notes:'',
            Mode: 'Save'
        };
    }

    $scope.ClearEndLoan = function () {
        $scope.beData = {
            LedgerId: null,
            LoanAmt: null,
            Period: '',
            PeriodId: null,
            LoanTypeId: null,
            Rate: null,
            Notes: '',
            Mode: 'Save'
        };
    }

    $scope.GetLoanCreationTranId = function (Be) {
        var para = {
            LedgerId: Be.LedgerId,
            VehicleId: Be.VehicleId,
        };

        $http({
            method: 'POST',
            url: base_url + "Finance/Creation/GetAllLoanCreation",
            dataType: "json"
        }).then(function (res) {
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $timeout(function () {
                    $scope.BeDataColl = res.data.Data;

                    // 🔎 loop through each item in array
                    angular.forEach($scope.BeDataColl, function (item) {
                        if (item.LedgerId === para.LedgerId && item.VehicleId === para.VehicleId) {
                            console.log("TranId:", item.TranId);
                            $scope.beData = item;
                            $scope.beData.Mode= 'Save';

                            if ($scope.beData.StartDate) {
                                $scope.beData.StartDate_TMP = new Date($scope.beData.StartDate);
                            }
                            Mode: 'Save'
                        }
                    });
                });

            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    };

    $scope.GetPartywiseLoanById = function () {
        $scope.loadingstatus = "running";

        var para = {
            LedgerId: $scope.newDet.LedgerId
        };

        $http({
            method: 'POST',
            url: base_url + "Finance/Creation/GetPartywiseLoanById",
            dataType: "json",
            data: para,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function (res) {
            $scope.loadingstatus = "stop";
            if (res.data && res.data.Data) {
                $scope.LoanListLedgerwise = res.data.Data;
            } else {
                Swal.fire(res.data.ResponseMSG || "No data found.");
            }
        }, function (reason) {
            $scope.loadingstatus = "stop";
            alert('Failed: ' + reason.statusText);
        });
    };


    $scope.GetLoanCreationById = function () {
        $scope.loadingstatus = "running";
        var para = {
            TranId: $scope.newDet.LoanId
        }
        $http({
            method: 'POST',
            url: base_url + "Finance/Creation/GetLoanCreationById",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $timeout(function () {
                    $scope.beData = res.data.Data;
                    $scope.beData.AutoNumber = res.data.Data.AutoNumber;

                    if ($scope.beData.EntryDate) {
                        $scope.beData.EntryDate_TMP = new Date($scope.beData.EntryDate);
                    }
                    if ($scope.beData.StartDate) {
                        $scope.beData.StartDate_TMP = new Date($scope.beData.StartDate);
                    }
                    $scope.T = {
                        TotalPrincipal: $scope.beData.EMIColl.reduce((sum, x) => sum + (parseFloat(x.Principal) || 0), 0),
                        TotalInterest: $scope.beData.EMIColl.reduce((sum, x) => sum + (parseFloat(x.Interest) || 0), 0)
                    };

                    $scope.beData.Mode = "Modify";
                    $('#searVoucherRightBtn').modal('hide');
                });

            } else
                Swal.fire(res.data.ResponseMSG);


        }, function (reason) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }

    $scope.IsValidEndLoan = function () {
        //if ($scope.beData.LoanAmt.isEmpty()) {
        //    Swal.fire('Please ! Enter Loan Amount');
        //    return false;
        //}
        return true;
    }

    $scope.SaveUpdateEndLoan = function () {
        if ($scope.IsValidEndLoan() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.beData.Mode;
                Swal.fire({
                    title: 'Do you want to ' + saveModify + ' the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    if (result.isConfirmed) {
                        $scope.CallSaveUpdateEndLoan();
                    }
                });
            } else
                $scope.CallSaveUpdateEndLoan();
        }
    };

    $scope.CallSaveUpdateEndLoan = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();
        $scope.beData.Notes = $scope.beData.Remarks;

        $http({
            method: 'POST',
            url: base_url + "Finance/Transaction/SaveEndLoan",
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
                $scope.ClearEndLoan();

            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }



    $scope.GetAllEndLoan = function () {
        $scope.loadingstatus = "running";
        $http({
            method: 'POST',
            url: base_url + "Finance/Transaction/GetAllEndLoan",
            dataType: "json"
        }).then(function (res) {
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $timeout(function () {
                    $scope.SearchDataColl = res.data.Data;
                });
                $('#searVoucherRightBtn').modal('show');
            } else
                Swal.fire(res.data.ResponseMSG);
        }, function (reason) {
            alert('Failed' + reason);
        });
    }


    $scope.GetAllLoanCreation = function () {
        $scope.loadingstatus = "running";
        $http({
            method: 'POST',
            url: base_url + "Finance/Creation/GetAllLoanCreationForEndLoan",
            dataType: "json"
        }).then(function (res) {
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $timeout(function () {
                    $scope.SearchDataColl = res.data.Data;
                    $('#searVoucherRightBtn').modal('show');
                });

            } else
                Swal.fire(res.data.ResponseMSG);


        }, function (reason) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }

    //$scope.GetLoanCreationById = function (beData) {
    //    $scope.loadingstatus = "running";
    //    var para = {
    //        baseDate: 0
    //    };
    //    $http({
    //        method: 'Get',
    //        url: base_url + "Finance/Creation/GetLoanDetailsByTranId",
    //        dataType: "json",
    //        data: JSON.stringify(para)
    //    }).then(function (res) {
    //        $scope.loadingstatus = "stop";
    //        if (res.data.IsSuccess && res.data.Data) {
    //            $scope.beData = res.data.Data;

    //            if ($scope.beData.StartDate)
    //                $scope.beData.StartDate_TMP = $scope.beData.StartDate;

    //            if (!$scope.beData.PenaltyColl || $scope.beData.PenaltyColl.length == 0) {
    //                $scope.beData.PenaltyColl = [];
    //                $scope.beData.PenaltyColl.push({});
    //            }

    //            if (!$scope.beData.RebateColl || $scope.beData.RebateColl.length == 0) {
    //                $scope.beData.RebateColl = [];
    //                $scope.beData.RebateColl.push({});
    //            }

    //            $scope.beData.Mode = 'Modify';
    //            $('#searVoucherRightBtn').modal('hide');
    //        } else
    //            Swal.fire(res.data.ResponseMSG);


    //    }, function (reason) {
    //        alert('Failed' + reason);
    //    });
    //}


    //$scope.GetEndLoanById = function (beData) {
    //    $scope.loadingstatus = "running";
    //    var para = {
    //        TranId: beData.TranId
    //    };
    //    $http({
    //        method: 'POST',
    //        url: base_url + "Finance/Creation/GetEndLoanById",
    //        dataType: "json",
    //        data: JSON.stringify(para)
    //    }).then(function (res) {
    //        $scope.loadingstatus = "stop";
    //        if (res.data.IsSuccess && res.data.Data) {
    //            $scope.beData = res.data.Data;
    //            if ($scope.beData.StartDate)
    //                $scope.beData.StartDate_TMP = $scope.beData.StartDate;
    //            $scope.beData.Mode = 'Modify';
    //            $('#searchmodal').modal('hide');
    //        } else
    //            Swal.fire(res.data.ResponseMSG);
    //    }, function (reason) {
    //        alert('Failed' + reason);
    //    });
    //}

    $scope.DelEndLoan = function (refData, ind) {
        Swal.fire({
            title: 'Are you sure you want to delete ' + refData.TranId + '?',
            showCancelButton: true,
            confirmButtonText: 'Delete',
        }).then((result) => {
            if (result.isConfirmed) {
                var para = { TranId: refData.TranId };
                $http({
                    method: 'POST',
                    url: base_url + "Finance/Creation/DelLoanEndLoan",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingStatus = "stop";
                    $scope.GetAllLoanVehicleById(refData);
                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess == true) {
                        $scope.EndLoanList.splice(ind, 1);
                    }
                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }
        });
    }




  
});