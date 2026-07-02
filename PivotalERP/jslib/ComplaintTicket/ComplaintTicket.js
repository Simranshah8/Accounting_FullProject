app.controller('ComplainTicketController', function ($scope, $http, $timeout, $filter, GlobalServices) {
    $scope.Title = 'Complain Ticket';

    OnClickDefault();

    $scope.LoadData = function () {
        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.perPageColl = GlobalServices.getPerPageList();
        $scope.TranSearchOptions = [{ text: 'VinNo', value: 'VE.VinNo', searchType: 'text' }, { text: 'EngineNo', value: 'VE.EngineNo', searchType: 'text' }, { text: 'ChSrlNo', value: 'VE.ChSrlNo', searchType: 'text' }, { text: 'JobCardNo', value: 'JC.AutoNumber', searchType: 'text' }, { text: 'VoucherNo', value: 'JC.AutoManualNo', searchType: 'text' }, { text: 'RegdNo', value: 'JC.RegdNo', searchType: 'text' }, { text: 'Branch', value: 'B.Name', searchType: 'text' }, { text: 'EntryDate', value: 'JC.EntryDate', searchType: 'date' }, { text: 'PartyName', value: 'JC.PartyName', searchType: 'text' }];


        $scope.VehicleSearchOptions = [{ text: 'ChassisNo', value: 'V.ChassisNo' }, { text: 'Engine No.', value: 'V.EngineNo' }, { text: 'Regd . No.', value: 'V.RegdNo' }, { text: 'Serial No.', value: 'V.ChSrlNo' }];

        $scope.currentPages = {
            TransctionComplain: 1,

        };

        $scope.searchData = {
            TransctionComplain: ''
        };

        $scope.perPage = {
            TransctionComplain: GlobalServices.getPerPageRow()
        };



        $scope.newcomplaintTicket = {
            TranId: null,
            AutoNumber: 0,
            TicketForId: null,
            VoucherDate: new Date(),
            LedgerId: null,
            PhoneNo: '',
            CustomerAddress: '',
            SourceId: null,
            NatureId: null,
            VehicleId: null,
            STPLComplaintNo: '',
            STPLEntryTime: '',
            STPLContactCode: '',
            STPLEntryDate: new Date(),
            STPLContactName: '',
            SyncedwithSupplierErp: false,
            STPlEntryDatebyUser: null,
            SatisfcationVerificationDate: new Date(),
            ComplaintStatus: '',
            TypeofSatisfactionVerify: '',
            ComplaintClosedDate: new Date(),
            ValidationRemarks: '',
            ComplaintClosedTime: '',
            FirstResponseDateAndTime: '',
            ComplaintClosedBy: '',
            AttendedDateAndTime: '',
            IsCorrectiveActionRequired: false,
            VehicleOnRoadDateTime: '',
            TargetDateForComplaintClosure: '',
            ValidationStatus: '',
            Reopened: false,
            RepairStatus: '',
            ReopenedDateTime: '',
            SearchOption: $scope.VehicleSearchOptions[0].value,
            ComplainLinesColl: [],
            ActionTakenColl: [],
            Mode: 'Save'
        };
        $scope.newcomplaintTicket.ComplainLinesColl.push({});
        $scope.newcomplaintTicket.ActionTakenColl.push({});

        $scope.GetAllTransactionComplain();
        $scope.GetAutoVouchertNo();



        $timeout(function () {
            $scope.NatureList = [];
            $http({
                method: 'GET',
                url: base_url + "ComplaintTicket/Creation/GetAllNature",
                dataType: "json"
            }).then(function (res) {
                if (res.data.IsSuccess && res.data.Data) {
                    $scope.NatureList = res.data.Data;
                }
            }, function (reason) {
                Swal.fire('Failed' + reason);
            });
        });

        $timeout(function () {
            $scope.SourceList = [];
            $http({
                method: 'GET',
                url: base_url + "ComplaintTicket/Creation/GetAllSource",
                dataType: "json"
            }).then(function (res) {
                if (res.data.IsSuccess && res.data.Data) {
                    $scope.SourceList = res.data.Data;
                }
            }, function (reason) {
                Swal.fire('Failed' + reason);
            });
        });

        $timeout(function () {
            $scope.TicketForList = [];
            $http({
                method: 'GET',
                url: base_url + "ComplaintTicket/Creation/GetAllTicketFor",
                dataType: "json"
            }).then(function (res) {
                if (res.data.IsSuccess && res.data.Data) {
                    $scope.TicketForList = res.data.Data;
                }
            }, function (reason) {
                Swal.fire('Failed' + reason);
            });
        });




    }


    $scope.ClearFields = function () {
        $scope.loadingstatus = "stop";
        $scope.newcomplaintTicket =
        {
            TranId: null,
            AutoNumber: 0,
            TicketForId: null,
            VoucherDate: new Date(),
            LedgerId: null,
            PhoneNo: '',
            CustomerAddress: '',
            SourceId: null,
            NatureId: null,
            VehicleId: null,
            STPLComplaintNo: '',
            STPLEntryTime: '',
            STPLContactCode: '',
            STPLEntryDate: new Date(),
            STPLContactName: '',
            SyncedwithSupplierErp: false,
            STPlEntryDatebyUser: null,
            SatisfcationVerificationDate: new Date(),
            ComplaintStatus: '',
            TypeofSatisfactionVerify: '',
            ComplaintClosedDate: new Date(),
            ValidationRemarks: '',
            ComplaintClosedTime: '',
            FirstResponseDateAndTime: '',
            ComplaintClosedBy: '',
            AttendedDateAndTime: '',
            IsCorrectiveActionRequired: false,
            VehicleOnRoadDateTime: '',
            TargetDateForComplaintClosure: '',
            ValidationStatus: '',
            Reopened: false,
            RepairStatus: '',
            ReopenedDateTime: '',
            SearchOption: $scope.VehicleSearchOptions[0].value,
            ComplainLinesColl: [],
            ActionTakenColl: [],
            Mode: 'Save'
        };
        $scope.newcomplaintTicket.ComplainLinesColl.push({});
        $scope.newcomplaintTicket.ActionTakenColl.push({});
        $scope.GetAutoVouchertNo();
    }

    $scope.GetAutoVouchertNo = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();
        $http({
            method: 'POST',
            url: base_url + "ComplaintTicket/Creation/GetAutoVoucherNo",
            dataType: "json"

        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                var vDet = res.data.Data;
                $scope.newcomplaintTicket.AutoVoucherNo = vDet.RId;
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    }


    $scope.CustmerChange = function () {
        $scope.newcomplaintTicket.CustomerAddress = $scope.newcomplaintTicket.PartyLedger.Address;

    }


    function OnClickDefault() {
        document.getElementById('ComplainForm').style.display = "none";

        document.getElementById('open-ComplainForm').onclick = function () {
            document.getElementById('Ticket-Section').style.display = "none";
            document.getElementById('ComplainForm').style.display = "block";
        }

        document.getElementById('back-to-list').onclick = function () {
            document.getElementById('ComplainForm').style.display = "none";
            document.getElementById('Ticket-Section').style.display = "block";
        }


    }



    $scope.AddComplaintLineTicket = function (ind) {
        if ($scope.newcomplaintTicket.ComplainLinesColl) {
            if ($scope.newcomplaintTicket.ComplainLinesColl.length > ind + 1) {
                $scope.newcomplaintTicket.ComplainLinesColl.splice(ind + 1, 0, {
                    MobileNo: ''
                })
            } else {
                $scope.newcomplaintTicket.ComplainLinesColl.push({
                    MobileNo: ''
                })
            }
        }


    };

    $scope.DelComplaintLineTicket = function (ind) {
        if ($scope.newcomplaintTicket.ComplainLinesColl) {
            if ($scope.newcomplaintTicket.ComplainLinesColl.length > 1) {
                $scope.newcomplaintTicket.ComplainLinesColl.splice(ind, 1);
            }
        }

    };




    //************************* ComplainTicket *********************************
    $scope.IsValidComplainTicket = function () {
        //if ($scope.newcomplaintTicket.Name.isEmpty()) {
        //	Swal.fire('Please ! Enter Name');
        //	return false;
        //}
        return true;
    }

    $scope.SaveUpdateComplainTicket = function () {
        if ($scope.IsValidComplainTicket() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.newcomplaintTicket.Mode;
                Swal.fire({
                    title: 'Do you want to ' + saveModify + ' the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    /* Read more about isConfirmed, isDenied below */
                    if (result.isConfirmed) {
                        $scope.CallSaveUpdateComplainTicket();
                    }
                });
            } else
                $scope.CallSaveUpdateComplainTicket();
        }
    };

    $scope.CallSaveUpdateComplainTicket = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();
        $scope.newcomplaintTicket.VoucherId = 1;
        $scope.newcomplaintTicket.CostClassId = 1;
        $scope.newcomplaintTicket.VehicleId = 1;

        if ($scope.newcomplaintTicket.VoucherDateDet) {
            $scope.newcomplaintTicket.VoucherDate = $filter('date')(new Date($scope.newcomplaintTicket.VoucherDateDet.dateAD), 'yyyy-MM-dd');
        } else
            $scope.newcomplaintTicket.VoucherDate = $filter('date')(new Date(), 'yyyy-MM-dd');

        if ($scope.newcomplaintTicket.STPLEntryDateDet) {
            $scope.newcomplaintTicket.STPLEntryDate = $filter('date')(new Date($scope.newcomplaintTicket.STPLEntryDateDet.dateAD), 'yyyy-MM-dd');
        } else
            $scope.newcomplaintTicket.STPLEntryDate = $filter('date')(new Date(), 'yyyy-MM-dd');

        if ($scope.newcomplaintTicket.SatisfcationVerificationDateDet) {
            $scope.newcomplaintTicket.SatisfcationVerificationDate = $filter('date')(new Date($scope.newcomplaintTicket.SatisfcationVerificationDateDet.dateAD), 'yyyy-MM-dd');
        } else
            $scope.newcomplaintTicket.SatisfcationVerificationDate = $filter('date')(new Date(), 'yyyy-MM-dd');

        if ($scope.newcomplaintTicket.ComplaintClosedDateDet) {
            $scope.newcomplaintTicket.ComplaintClosedDate = $filter('date')(new Date($scope.newcomplaintTicket.ComplaintClosedDateDet.dateAD), 'yyyy-MM-dd');
        } else
            $scope.newcomplaintTicket.ComplaintClosedDate = $filter('date')(new Date(), 'yyyy-MM-dd');

        if ($scope.newcomplaintTicket.FirstResponseDateAndTimeDet) {
            $scope.newcomplaintTicket.FirstResponseDateAndTime = $filter('date')(new Date($scope.newcomplaintTicket.FirstResponseDateAndTimeDet.dateAD), 'yyyy-MM-dd');
        } else
            $scope.newcomplaintTicket.FirstResponseDateAndTime = $filter('date')(new Date(), 'yyyy-MM-dd');

        if ($scope.newcomplaintTicket.AttendedDateAndTimeDet) {
            $scope.newcomplaintTicket.AttendedDateAndTime = $filter('date')(new Date($scope.newcomplaintTicket.AttendedDateAndTimeDet.dateAD), 'yyyy-MM-dd');
        } else
            $scope.newcomplaintTicket.AttendedDateAndTime = $filter('date')(new Date(), 'yyyy-MM-dd');

        if ($scope.newcomplaintTicket.VehicleOnRoadDateTimeDet) {
            $scope.newcomplaintTicket.VehicleOnRoadDateTime = $filter('date')(new Date($scope.newcomplaintTicket.VehicleOnRoadDateTimeDet.dateAD), 'yyyy-MM-dd');
        } else
            $scope.newcomplaintTicket.VehicleOnRoadDateTime = $filter('date')(new Date(), 'yyyy-MM-dd');

        if ($scope.newcomplaintTicket.TargetDateForComplaintClosureDet) {
            $scope.newcomplaintTicket.TargetDateForComplaintClosure = $filter('date')(new Date($scope.newcomplaintTicket.TargetDateForComplaintClosureDet.dateAD), 'yyyy-MM-dd');
        } else
            $scope.newcomplaintTicket.TargetDateForComplaintClosure = $filter('date')(new Date(), 'yyyy-MM-dd');

        if ($scope.newcomplaintTicket.ReopenedDateTimeDet) {
            $scope.newcomplaintTicket.ReopenedDateTime = $filter('date')(new Date($scope.newcomplaintTicket.ReopenedDateTimeDet.dateAD), 'yyyy-MM-dd');
        } else
            $scope.newcomplaintTicket.ReopenedDateTime = $filter('date')(new Date(), 'yyyy-MM-dd');

        if ($scope.newcomplaintTicket.ComplaintClosedTime_TMP)
            $scope.newcomplaintTicket.ComplaintClosedTime = $scope.newcomplaintTicket.ComplaintClosedTime_TMP.toLocaleString();
        else
            $scope.newcomplaintTicket.ComplaintClosedTime = null;

        if ($scope.newcomplaintTicket.STPLEntryTime_TMP)
            $scope.newcomplaintTicket.STPLEntryTime = $scope.newcomplaintTicket.STPLEntryTime_TMP.toLocaleString();
        else
            $scope.newcomplaintTicket.STPLEntryTime = null;

        $http({
            method: 'POST',
            url: base_url + "ComplaintTicket/Creation/SaveTransactionComplain",
            headers: { 'Content-Type': undefined },
            transformRequest: function (data) {
                var formData = new FormData();
                formData.append("jsonData", angular.toJson(data.jsonData));
                return formData;
            },
            data: { jsonData: $scope.newcomplaintTicket }
        }).then(function (res) {
            $scope.loadingstatus = "stop";
            hidePleaseWait();
            Swal.fire(res.data.ResponseMSG);
            if (res.data.IsSuccess == true) {
                $scope.ClearFields();
                $scope.GetAutoVouchertNo();
                /*$scope.GetAllComplainTicket();*/
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }

    $scope.GetAllTransactionComplain = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();
        $scope.TransctionComplainColl = [];
        $http({
            method: 'GET',
            url: base_url + "ComplaintTicket/Creation/GetAllTransactionComplain",
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.TransctionComplainColl = res.data.Data;
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    }

    $scope.GetTransactionComplainById = function (refData) {
        $scope.loadingstatus = "running";
        showPleaseWait();
        var para = {
            TranId: refData.TranId
        };
        $http({
            method: 'POST',
            url: base_url + "ComplaintTicket/Creation/getTransactionComplainById",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.newcomplaintTicket = res.data.Data;

                if ($scope.newcomplaintTicket.VoucherDate)
                    $scope.newcomplaintTicket.VoucherDate_TMP = new Date($scope.newcomplaintTicket.VoucherDate);

                if ($scope.newcomplaintTicket.STPLEntryDate)
                    $scope.newcomplaintTicket.STPLEntryDate_TMP = new Date($scope.newcomplaintTicket.STPLEntryDate);

                if ($scope.newcomplaintTicket.SatisfcationVerificationDate)
                    $scope.newcomplaintTicket.SatisfcationVerificationDate_TMP = new Date($scope.newcomplaintTicket.SatisfcationVerificationDate);

                if ($scope.newcomplaintTicket.ComplaintClosedDate)
                    $scope.newcomplaintTicket.ComplaintClosedDate_TMP = new Date($scope.newcomplaintTicket.ComplaintClosedDate);

                if ($scope.newcomplaintTicket.FirstResponseDateAndTime)
                    $scope.newcomplaintTicket.FirstResponseDateAndTime_TMP = new Date($scope.newcomplaintTicket.FirstResponseDateAndTime);

                if ($scope.newcomplaintTicket.AttendedDateAndTime)
                    $scope.newcomplaintTicket.AttendedDateAndTime_TMP = new Date($scope.newcomplaintTicket.AttendedDateAndTime);

                if ($scope.newcomplaintTicket.VehicleOnRoadDateTime)
                    $scope.newcomplaintTicket.VehicleOnRoadDateTime_TMP = new Date($scope.newcomplaintTicket.VehicleOnRoadDateTime);

                if ($scope.newcomplaintTicket.TargetDateForComplaintClosure)
                    $scope.newcomplaintTicket.TargetDateForComplaintClosure_TMP = new Date($scope.newcomplaintTicket.TargetDateForComplaintClosure);

                if ($scope.newcomplaintTicket.ReopenedDateTime)
                    $scope.newcomplaintTicket.ReopenedDateTime_TMP = new Date($scope.newcomplaintTicket.ReopenedDateTime);


                if (!$scope.newcomplaintTicket.ComplainLinesColl || $scope.newcomplaintTicket.ComplainLinesColl.length == 0) {
                    $scope.newcomplaintTicket.ComplainLinesColl = [];
                    $scope.newcomplaintTicket.ComplainLinesColl.push({});
                }

                if (!$scope.newcomplaintTicket.ActionTakenColl || $scope.newcomplaintTicket.ActionTakenColl.length == 0) {
                    $scope.newcomplaintTicket.ActionTakenColl = [];
                    $scope.newcomplaintTicket.ActionTakenColl.push({});
                }


                if ($scope.newcomplaintTicket.ComplaintClosedTime)
                    $scope.newcomplaintTicket.ComplaintClosedTime_TMP = new Date($scope.newcomplaintTicket.ComplaintClosedTime);
                else
                    $scope.newcomplaintTicket.ComplaintClosedTime_TMP = null;


                if ($scope.newcomplaintTicket.STPLEntryTime)
                    $scope.newcomplaintTicket.STPLEntryTime_TMP = new Date($scope.newcomplaintTicket.STPLEntryTime);
                else
                    $scope.newcomplaintTicket.STPLEntryTime_TMP = null;

                $scope.newcomplaintTicket.Mode = 'Modify';
                document.getElementById('Ticket-Section').style.display = "none";
                document.getElementById('ComplainForm').style.display = "block";

            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    };

    $scope.DelComplainTicketById = function (refData) {
        Swal.fire({
            title: 'Do you want to delete the selected data?',
            showCancelButton: true,
            confirmButtonText: 'Delete',
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                $scope.loadingstatus = "running";
                showPleaseWait();
                var para = {
                    ComplainTicketId: refData.ComplainTicketId
                };
                $http({
                    method: 'POST',
                    url: base_url + "Bank/Creation/DeleteComplainTicket",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingstatus = "stop";
                    if (res.data.IsSuccess) {
                        $scope.GetAllComplainTicket();
                    } else {
                        Swal.fire(res.data.ResponseMSG);
                    }
                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }
        });
    };

    $scope.CurComplain = {

    };
    $scope.TakeAction = function (C)
    {
        $scope.CurComplain = C;
         $scope.CurComplain.ActionTakenColl = [];
        $scope.newcomplaintTicket.ActionTakenColl = [];
        CurComplain.ActionTakenColl.push({             
            SubType: C.SubType,
            Type: C.Type           
        });
    }

    $scope.AddActionTaken = function (ind) {
        if ($scope.CurComplain.ActionTakenColl) {
            if ($scope.CurComplain.ActionTakenColl.length > ind + 1) {
                $scope.CurComplain.ActionTakenColl.splice(ind + 1, 0, {
                    Type: ''
                })
            } else {
                $scope.CurComplain.ActionTakenColl.push({
                    Type: ''
                })
            }
        }
    };

    $scope.DelActionTaken = function (ind) {
        if ($scope.CurComplain.ActionTakenColl) {
            if ($scope.CurComplain.ActionTakenColl.length > 1) {
                $scope.CurComplain.ActionTakenColl.splice(ind, 1);
            }
        }
    };

    $scope.pageChangeHandler = function (num) {
        console.log('page changed to ' + num);
    };

});