app.controller('ComplainTicketController', function ($scope, $http, $timeout, $filter, GlobalServices) {
    $scope.Title = 'Complain Ticket';
    var glSrv = GlobalServices;

    OnClickDefault();

    $scope.LoadData = function () {

        $('.select2').select2({
            allowClear: true,
            openOnEnter: true
        });

         
        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.perPageColl = GlobalServices.getPerPageList();
        $scope.TranSearchOptions = [{ text: 'VinNo', value: 'VE.VinNo', searchType: 'text' }, { text: 'EngineNo', value: 'VE.EngineNo', searchType: 'text' }, { text: 'ChSrlNo', value: 'VE.ChSrlNo', searchType: 'text' }, { text: 'JobCardNo', value: 'JC.AutoNumber', searchType: 'text' }, { text: 'VoucherNo', value: 'JC.AutoManualNo', searchType: 'text' }, { text: 'RegdNo', value: 'JC.RegdNo', searchType: 'text' }, { text: 'Branch', value: 'B.Name', searchType: 'text' }, { text: 'EntryDate', value: 'JC.EntryDate', searchType: 'date' }, { text: 'PartyName', value: 'JC.PartyName', searchType: 'text' }];


        $scope.VehicleSearchOptions = [{ text: 'Vin No.', value: 'V.VinNo' }, { text: 'Engine No.', value: 'V.EngineNo' }, { text: 'Regd . No.', value: 'V.RegdNo' }, { text: 'Chassis/Serial No.', value: 'V.ChSrlNo' }];

        $scope.TypeOfSatisfactionColl = [{ text: 'Instant Feedback', value: 'Instant Feedback' }, { text: 'Voice Recording', value: 'Voice Recording' }, { text: 'Others', value: 'Others' }, { text: 'Post Feedback', value: 'Post Feedback' }, { text: 'Service Postpond', value: 'Service Postpond' }, { text: 'Telephonic Feedback', value: 'Telephonic Feedback' }];
        $scope.ValidationStatusColl = [{ text: 'Validation Successful', value: 'Validation Successful' }, { text: 'Contacted but not reached', value: 'Contacted but not reached' }];
        $scope.RepairStatusColl = [{ text: 'Workshop Repair', value: 'Workshop Repair' }, { text: 'Local Repair', value: 'Local Repair' }, { text: 'Service Not Required', value: 'Service Not Required' }, { text: 'Managed By CG', value: 'Managed By CG' }, { text: 'Managed by FAT', value: 'Managed by FAT' }, { text: 'Telephonic Assistance', value: 'Telephonic Assistance' },]
        $scope.ComplaintStatusColl = [{ text: 'Open', value: 'Open' }, { text: 'InProgress', value: 'InProgress' }, { text: 'Customer Waiting', value: 'Customer Waiting' }, { text: 'Waiting for Spare Parts', value: 'Waiting for Spare Parts' }, { text: 'Feedback pending', value: 'Feedback pending' }, { text: 'Closed', value: 'Closed' }];
         

        $scope.currentPages = {
            TransctionComplain: 1,
        };

        $scope.searchData = {
            TransctionComplain: ''
        };

        $scope.perPage = {
            TransctionComplain: GlobalServices.getPerPageRow()
        };

        $scope.VoucherTypeColl = [];
        $scope.CostClassColl = [];
        $scope.NarrationList = [];
        $scope.SelectedVoucher = null;
        $scope.SelectedCostClass = null;
        $scope.Config = {};


        $scope.HideShow = {
            VoucherType: false,
            CostClass: false,
            AutoVoucherNo: false,
            Agent: true,
            Currency: true,
            RefNo: true,
            ProfitCenter1: true,
            ProfitCenter2: true,
            ProfitCenter3: true,
            ProfitCenter4: true,
            ProfitCenter5: true,
        }


        $scope.beData = {
            TranId: null,
            AutoNumber: 0,
            TicketForId: null,
            VoucherDate: new Date(),
            VoucherDate_TMP: new Date(),
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
            SearchOption: $scope.VehicleSearchOptions[2].value,
            ComplainLinesColl: [],
            ActionTakenColl: [],
            Mode: 'Save'
        };
        $scope.beData.ComplainLinesColl.push({});
        $scope.beData.ActionTakenColl.push({});

        $scope.GetAllTransactionComplain();
        

        $http({
            method: 'GET',
            url: base_url + "Setup/Security/GetConfirmationMSG",
            dataType: "json"
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.confirmMSG = res.data.Data;
            } else {
                Swal.fire(res.data.ResponseMSG);
            }

        }, function (reason) {
            Swal.fire('Failed' + reason);
        });


        $scope.BranchColl = [];
        $http({
            method: 'POST',
            url: base_url + "Setup/Security/GetAllBranchListForEntry",
            dataType: "json"
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.BranchColl = res.data.Data;
            }
        }, function (reason) {
            alert('Failed' + reason);
        });

        $scope.NatureList = [];
        $http({
            method: 'GET',
            url: base_url + "Service/Creation/GetAllNature",
            dataType: "json"
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.NatureList = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });


        $scope.SourceList = [];
        $http({
            method: 'GET',
            url: base_url + "Service/Creation/GetAllSource",
            dataType: "json"
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.SourceList = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $scope.TicketForList = [];
        $http({
            method: 'GET',
            url: base_url + "Service/Creation/GetAllTicketFor",
            dataType: "json"
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.TicketForList = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });


        $http({
            method: 'GET',
            url: base_url + "Account/Creation/GetVoucherWiseNarration?voucherType=" + VoucherType,
            dataType: "json"
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.NarrationList = res.data.Data;
            } else
                Swal.fire(res.data.ResponseMSG);
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });


        $http({
            method: 'GET',
            url: base_url + "Account/Creation/GetVoucherList?voucherType=" + VoucherType,
            dataType: "json"
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.VoucherTypeColl = res.data.Data;

                $http({
                    method: 'GET',
                    url: base_url + "Account/Creation/GetCostClassForEntry",
                    dataType: "json"
                }).then(function (res1) {
                    if (res1.data.IsSuccess && res1.data.Data) {
                        $scope.CostClassColl = res1.data.Data;

                        $timeout(function () {
                            $scope.$apply(function () {
                                if ($scope.VoucherTypeColl.length > 0) {
                                    $scope.SelectedVoucher = $scope.VoucherTypeColl[0];
                                    $scope.beData.VoucherId = $scope.SelectedVoucher.VoucherId;
                                }

                                if ($scope.CostClassColl.length > 0) {
                                    $scope.SelectedCostClass = $scope.CostClassColl[0];
                                    $scope.beData.CostClassId = $scope.SelectedCostClass.CostClassId;
                                }

                                if ($scope.VoucherTypeColl.length <= 1)
                                    $scope.HideShow.VoucherType = true;
                                else
                                    $scope.HideShow.VoucherType = false;

                                if ($scope.CostClassColl.length <= 1)
                                    $scope.HideShow.CostClass = true;
                                else
                                    $scope.HideShow.CostClass = false;

                                $scope.getVoucherNo();

                           
                            });
                        });


                    }
                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });

            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

    }


    $scope.getVoucherNoOnly = function () {

        var isModify = ($scope.beData.TranId > 0 ? true : false);

        if ($scope.SelectedVoucher && isModify == false) {

            if ($scope.beData.VoucherId && $scope.beData.VoucherId > 0) {
                if ($scope.beData.CostClassId && $scope.beData.CostClassId > 0) {
                    var para = {
                        voucherId: $scope.beData.VoucherId,
                        costClassId: $scope.beData.CostClassId,
                        voucherDate: $scope.beData.VoucherDateDet ? ($filter('date')(new Date($scope.beData.VoucherDateDet.dateAD), 'yyyy-MM-dd')) : ($filter('date')(new Date(), 'yyyy-MM-dd'))
                    };

                    $http({
                        method: 'POST',
                        url: base_url + "Account/Creation/GetVoucherNo",
                        dataType: "json",
                        data: JSON.stringify(para)
                    }).then(function (res) {
                        if (res.data.IsSuccess && res.data.Data) {
                            var vDet = res.data.Data;
                            $scope.beData.AutoManualNo = vDet.AutoManualNo;
                            $scope.beData.AutoVoucherNo = vDet.AutoVoucherNo;

                        } else {
                            Swal.fire(res.data.ResponseMSG);
                        }
                    }, function (reason) {
                        Swal.fire('Failed' + reason);
                    });
                }
            } else {
                $scope.beData.AutoManualNo = '';
                $scope.beData.AutoVoucherNo = 0;
            }

        }
    }
    $scope.getVoucherNo = function () {

        if ($scope.beData.VoucherId > 0)
            $scope.SelectedVoucher = mx($scope.VoucherTypeColl).firstOrDefault(p1 => p1.VoucherId == $scope.beData.VoucherId);

        if ($scope.beData.CostClassId > 0)
            $scope.SelectedCostClass = mx($scope.CostClassColl).firstOrDefault(p1 => p1.CostClassId == $scope.beData.CostClassId);

        if ($scope.SelectedVoucher) {

            $scope.loadingstatus = "running";
            showPleaseWait();

            $timeout(function () {
                $scope.$apply(function () {
                    $scope.SelectedVoucher.VoucherId = $scope.SelectedVoucher.VoucherId;
                });
            });

            $http({
                method: 'GET',
                url: base_url + "Account/Creation/GetVoucherModeById?voucherId=" + $scope.SelectedVoucher.VoucherId,
                dataType: "json"
            }).then(function (res) {

                $scope.loadingstatus = "stop";
                hidePleaseWait();

                if (res.data.IsSuccess && res.data.Data) {
                    $scope.SelectedVoucher = res.data.Data;

                    $timeout(function () {
                        $scope.$apply(function () {
                            if ($scope.SelectedVoucher) {

                                $scope.SelectedVoucher.ActiveUDF = false;

                                if ($scope.SelectedVoucher.VoucherUDFColl && $scope.SelectedVoucher.VoucherUDFColl.length > 0) {
                                    $scope.beData.UDFFeildsColl = [];
                                    $scope.SelectedVoucher.ActiveUDF = true;
                                    angular.forEach($scope.SelectedVoucher.VoucherUDFColl, function (udf) {
                                        var ud = {
                                            SNo: udf.SNo,
                                            Name: udf.Label,
                                            Value: udf.DefaultValue,
                                            FieldNo: udf.SNo,
                                            DisplayName: udf.Label,
                                            FieldType: udf.FieldType,
                                            IsMandatory: udf.IsMandatory,
                                            Length: 100,
                                            SelectOptions: udf.DropDownList,
                                            FieldAfter: udf.FieldAfter,
                                            NameId: udf.Name,
                                            Source: udf.Source,
                                            Formula: udf.Formula,
                                            UDFValue: udf.DefaultValue,
                                        };
                                        $scope.beData.UDFFeildsColl.push(ud);
                                    });
                                }

                                if ($scope.SelectedVoucher.VoucherProductUDFColl && $scope.SelectedVoucher.VoucherProductUDFColl.length > 0) {
                                    angular.forEach($scope.beData.LedgerAllocationColl, function (det) {
                                        det.UDFFeildsColl = [];
                                        angular.forEach($scope.SelectedVoucher.VoucherProductUDFColl, function (udf) {

                                            var ud = {
                                                SNo: udf.SNo,
                                                Name: udf.Label,
                                                Value: udf.DefaultValue,
                                                FieldNo: udf.SNo,
                                                DisplayName: udf.Label,
                                                FieldType: udf.FieldType,
                                                IsMandatory: udf.IsMandatory,
                                                Length: 100,
                                                SelectOptions: udf.DropDownList,
                                                FieldAfter: udf.FieldAfter,
                                                NameId: udf.Name,
                                                Source: udf.Source,
                                                Formula: udf.Formula,
                                                UDFValue: udf.DefaultValue,
                                            };

                                            det.UDFFeildsColl.push(ud);
                                        });
                                    });
                                }

                                if ($scope.SelectedVoucher.NumberingMethod == 1)
                                    $scope.HideShow.AutoVoucherNo = false;
                                else
                                    $scope.HideShow.AutoVoucherNo = true;

                                if ($scope.SelectedVoucher.UseRefNo == true)
                                    $scope.HideShow.RefNo = false;
                                else
                                    $scope.HideShow.RefNo = true;

                                if ($scope.SelectedVoucher.ProfitCenter1 == true)
                                    $scope.HideShow.ProfitCenter1 = false;
                                else
                                    $scope.HideShow.ProfitCenter1 = true;

                                if ($scope.SelectedVoucher.ProfitCenter2 == true)
                                    $scope.HideShow.ProfitCenter2 = false;
                                else
                                    $scope.HideShow.ProfitCenter2 = true;

                                if ($scope.SelectedVoucher.ProfitCenter3 == true)
                                    $scope.HideShow.ProfitCenter3 = false;
                                else
                                    $scope.HideShow.ProfitCenter3 = true;

                                if ($scope.SelectedVoucher.ProfitCenter4 == true)
                                    $scope.HideShow.ProfitCenter4 = false;
                                else
                                    $scope.HideShow.ProfitCenter4 = true;

                                if ($scope.SelectedVoucher.ProfitCenter5 == true)
                                    $scope.HideShow.ProfitCenter5 = false;
                                else
                                    $scope.HideShow.ProfitCenter5 = true;


                            }


                        });
                    });

                }
            }, function (reason) {
                Swal.fire('Failed' + reason);
            });
        }

        if ($scope.beData.VoucherId && $scope.beData.VoucherId > 0) {
            if ($scope.beData.CostClassId && $scope.beData.CostClassId > 0) {
                var para = {
                    voucherId: $scope.beData.VoucherId,
                    costClassId: $scope.beData.CostClassId,
                    voucherDate: $scope.beData.VoucherDateDet ? ($filter('date')(new Date($scope.beData.VoucherDateDet.dateAD), 'yyyy-MM-dd')) : ($filter('date')(new Date(), 'yyyy-MM-dd'))
                };

                $http({
                    method: 'POST',
                    url: base_url + "Account/Creation/GetVoucherNo",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    if (res.data.IsSuccess && res.data.Data) {
                        var vDet = res.data.Data;
                        $scope.beData.AutoManualNo = vDet.AutoManualNo;
                        $scope.beData.AutoVoucherNo = vDet.AutoVoucherNo;

                        if ($scope.beData.TranId > 0) {

                        } else {
                            GlobalServices.getCurrentDateTime().then(function (res) {
                                var curDate = res.data.Data;
                                if (curDate) {
                                    $scope.beData.VoucherDate_TMP = new Date(curDate);

                                    if ($scope.SelectedVoucher) {
                                        if ($scope.SelectedVoucher.VoucherDateAs == 2) {
                                            GlobalServices.getLastEntryDate($scope.SelectedVoucher.VoucherId).then(function (res) {
                                                var curDate = res.data.Data;
                                                if (curDate) {
                                                    $scope.beData.VoucherDate_TMP = new Date(curDate);
                                                }
                                            }, function (errormessage) {
                                                alert('Unable to Delete data. pls try again.' + errormessage.responseText);
                                            });
                                        }
                                    }

                                }
                            }, function (errormessage) {
                                alert('Unable to Delete data. pls try again.' + errormessage.responseText);
                            });
                        }


                    } else {
                        Swal.fire(res.data.ResponseMSG);
                    }
                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }
        } else {
            $scope.beData.AutoManualNo = '';
            $scope.beData.AutoVoucherNo = 0;
        }



    }

    $scope.VehicleSelectionChange = function (data, index) {

        if (data.vehicleDetail) {
            var det = data.vehicleDetail;
            $scope.beData.MakeCode = det.VehicleTypeName;
            $scope.beData.ModelCode = det.VehicleModelName;
            $scope.beData.VinNo = det.VinNo;
            $scope.beData.EngineNo = det.EngineNo;
            $scope.beData.ChassisNo = det.ChSrlNo;
            $scope.beData.VehicleWarrantyStatus = det.Warranty;
            $scope.beData.VehicleId = det.TranId;
            $scope.beData.RegistrationNo = det.RegdNo;
            //if (data.TranId > 0) {

            //} else {
            //    data.Party = det.Party;
            //    data.RegistrationNo = det.RegdNo;
            //    data.PartyId = det.PartyId;
            //    data.Address = det.PartyAddress;
            //    data.PartyMobileNo = det.ContactNo;
            //    data.CustomerType = det.CustomerType;
            //    data.CustomerSerialNo = det.CustomerSerialNo;
            //}


            //data.Last_JobNo = det.LastJobNo;
            //data.Last_JobAutoManualNo = det.AutoManualNo;
            //data.LastDate_TMP = det.LastJobDate;
            //data.LastRunningHR = det.LastRunningHR;
            //data.LastRunningKM = det.LastRunningKM;
            //data.LastComplain = det.LastComplain;
            //data.LastFeedBack = det.FeedBack;
            //data.Last_Remarks = det.FeedBackRemarks;

            //if (det.DateOfSale)
            //    data.DateOfSale_TMP = new Date(det.DateOfSale)
        }

        else {
            $scope.beData.VehicleId = null;
            $scope.beData.MakeCode = '';
            $scope.beData.ModelCode = '';
            $scope.beData.VinNo = '';
            $scope.beData.EngineNo = '';
            $scope.beData.ChassisNo = '';
            $scope.beData.VehicleWarrantyStatus = false;
        }
    }
    $scope.ClearFields = function () {
        $scope.loadingstatus = "stop";
        $scope.CurComplain = null;
        
        var sV = $scope.SelectedVoucher;
        var sC = $scope.SelectedCostClass;
                
        $scope.SelectedVoucher = null;
        $scope.SelectedCostClass = null;

        $scope.beData =
        {
            TranId: null,
            AutoNumber: 0,
            TicketForId: null,
            VoucherDate: new Date(),
            VoucherDate_TMP: new Date(),
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
            SearchOption: $scope.VehicleSearchOptions[2].value,
            ComplainLinesColl: [],
            ActionTakenColl: [],
            Mode: 'Save'
        };
        $scope.beData.ComplainLinesColl.push({});
        $scope.beData.ActionTakenColl.push({});

        if ($scope.VoucherTypeColl.length > 0) {
            $scope.SelectedVoucher = $scope.VoucherTypeColl[0];
            $scope.beData.VoucherId = $scope.SelectedVoucher.VoucherId;
        }

        if ($scope.CostClassColl.length > 0) {
            $scope.SelectedCostClass = $scope.CostClassColl[0];
            $scope.beData.CostClassId = $scope.SelectedCostClass.CostClassId;
        }

        if (sV) {
            $scope.SelectedVoucher = sV;
            $scope.beData.VoucherId = sV.VoucherId;
        }

        if (sC) {
            $scope.SelectedCostClass = sC;
            $scope.beData.CostClassId = sC.CostClassId;
        }


        $('input[type=file]').val('');

        $timeout(function () {
            $scope.getVoucherNo();
        })
    }

  

    $scope.CustmerChange = function () {
        if ($scope.beData.PartyLedger && $scope.beData.LedgerId>0) {
            $scope.beData.CustomerAddress = $scope.beData.PartyLedger.Address;
            $scope.beData.PhoneNo = $scope.beData.PartyLedger.MobileNo1;


            $http({
                method: 'GET',
                url: base_url + "Service/Transaction/GetVehicleDet?TranId=0&PartyId=" + $scope.beData.LedgerId,
                dataType: "json"
            }).then(function (res) {
                if (res.data.IsSuccess && res.data.Data) {
                    var det = res.data.Data;

                    $scope.beData.MakeCode = det.VehicleTypeName;
                    $scope.beData.ModelCode = det.VehicleModelName;
                    $scope.beData.VinNo = det.VinNo;
                    $scope.beData.EngineNo = det.EngineNo;
                    $scope.beData.ChassisNo = det.ChSrlNo;
                    $scope.beData.VehicleWarrantyStatus = det.Warranty;
                    $scope.beData.VehicleId = det.TranId;
                    $scope.beData.VehicleEntryId = det.TranId;
                    $scope.beData.RegistrationNo = det.RegdNo;
                } 
            }, function (reason) {
                Swal.fire('Failed' + reason);
            });

             

        } else {
            $scope.beData.CustomerAddress = '';
            $scope.beData.PhoneNo = '';
        }
        

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
        if ($scope.beData.ComplainLinesColl) {
            if ($scope.beData.ComplainLinesColl.length > ind + 1) {
                $scope.beData.ComplainLinesColl.splice(ind + 1, 0, {
                    MobileNo: ''
                })
            } else {
                $scope.beData.ComplainLinesColl.push({
                    MobileNo: ''
                })
            }
        }


    };

    $scope.DelComplaintLineTicket = function (ind) {
        if ($scope.beData.ComplainLinesColl) {
            if ($scope.beData.ComplainLinesColl.length > 1) {
                $scope.beData.ComplainLinesColl.splice(ind, 1);
            }
        }

    };




    //************************* ComplainTicket *********************************
    $scope.IsValidComplainTicket = function () {
        //if ($scope.beData.Name.isEmpty()) {
        //	Swal.fire('Please ! Enter Name');
        //	return false;
        //}
        return true;
    }

    $scope.SaveUpdateComplainTicket = function () {
        if ($scope.IsValidComplainTicket() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.beData.Mode;
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
        
        

        if ($scope.beData.VoucherDateDet) {
            $scope.beData.VoucherDate = $filter('date')(new Date($scope.beData.VoucherDateDet.dateAD), 'yyyy-MM-dd');
        } else
            $scope.beData.VoucherDate = $filter('date')(new Date(), 'yyyy-MM-dd');

        if ($scope.beData.STPLEntryDateDet) {
            $scope.beData.STPLEntryDate = $filter('date')(new Date($scope.beData.STPLEntryDateDet.dateAD), 'yyyy-MM-dd');
        } else
            $scope.beData.STPLEntryDate = $filter('date')(new Date(), 'yyyy-MM-dd');

        if ($scope.beData.SatisfcationVerificationDateDet) {
            $scope.beData.SatisfcationVerificationDate = $filter('date')(new Date($scope.beData.SatisfcationVerificationDateDet.dateAD), 'yyyy-MM-dd');
        } else
            $scope.beData.SatisfcationVerificationDate = $filter('date')(new Date(), 'yyyy-MM-dd');

        if ($scope.beData.ComplaintClosedDateDet) {
            $scope.beData.ComplaintClosedDate = $filter('date')(new Date($scope.beData.ComplaintClosedDateDet.dateAD), 'yyyy-MM-dd');
        } else
            $scope.beData.ComplaintClosedDate = $filter('date')(new Date(), 'yyyy-MM-dd');

        if ($scope.beData.FirstResponseDateAndTimeDet) {
            $scope.beData.FirstResponseDateAndTime = $filter('date')(new Date($scope.beData.FirstResponseDateAndTimeDet.dateAD), 'yyyy-MM-dd');
        } else
            $scope.beData.FirstResponseDateAndTime = $filter('date')(new Date(), 'yyyy-MM-dd');

        if ($scope.beData.AttendedDateAndTimeDet) {
            $scope.beData.AttendedDateAndTime = $filter('date')(new Date($scope.beData.AttendedDateAndTimeDet.dateAD), 'yyyy-MM-dd');
        } else
            $scope.beData.AttendedDateAndTime = $filter('date')(new Date(), 'yyyy-MM-dd');

        if ($scope.beData.VehicleOnRoadDateTimeDet) {
            $scope.beData.VehicleOnRoadDateTime = $filter('date')(new Date($scope.beData.VehicleOnRoadDateTimeDet.dateAD), 'yyyy-MM-dd');
        } else
            $scope.beData.VehicleOnRoadDateTime = $filter('date')(new Date(), 'yyyy-MM-dd');

        if ($scope.beData.TargetDateForComplaintClosureDet) {
            $scope.beData.TargetDateForComplaintClosure = $filter('date')(new Date($scope.beData.TargetDateForComplaintClosureDet.dateAD), 'yyyy-MM-dd');
        } else
            $scope.beData.TargetDateForComplaintClosure = $filter('date')(new Date(), 'yyyy-MM-dd');

        if ($scope.beData.ReopenedDateTimeDet) {
            $scope.beData.ReopenedDateTime = $filter('date')(new Date($scope.beData.ReopenedDateTimeDet.dateAD), 'yyyy-MM-dd');
        } else
            $scope.beData.ReopenedDateTime = $filter('date')(new Date(), 'yyyy-MM-dd');

        if ($scope.beData.ComplaintClosedTime_TMP)
            $scope.beData.ComplaintClosedTime = $scope.beData.ComplaintClosedTime_TMP.toLocaleString();
        else
            $scope.beData.ComplaintClosedTime = null;

        if ($scope.beData.STPLEntryTime_TMP)
            $scope.beData.STPLEntryTime = $scope.beData.STPLEntryTime_TMP.toLocaleString();
        else
            $scope.beData.STPLEntryTime = null;


        if ($scope.beData.ComplainLinesColl) {
            angular.forEach($scope.beData.ComplainLinesColl, function (comL)
            {
                if (comL.STPLForwardedDateDet) {
                    comL.STPLForwardedDate = $filter('date')(new Date(comL.STPLForwardedDateDet.dateAD), 'yyyy-MM-dd');
                }
                else {
                    comL.STPLForwardedDate = null;
                }

                if (comL.ResolvedDateDet) {
                    comL.ResolvedDate = $filter('date')(new Date(comL.ResolvedDateDet.dateAD), 'yyyy-MM-dd');
                }
                else {
                    comL.ResolvedDate = null;
                }

                if (comL.ClosedDateDet) {
                    comL.ClosedDate = $filter('date')(new Date(comL.ClosedDateDet.dateAD), 'yyyy-MM-dd');
                }
                else {
                    comL.ClosedDate = null;
                }
                 
                if (comL.STPLForwardedTime) {
                    comL.STPLForwardedTime = $filter('date')(new Date(comL.STPLForwardedTime), 'yyyy-MM-dd HH:mm:ss');
                }
                else {
                    comL.STPLForwardedTime = null;
                }

                if (comL.ResolvedTime) {
                    comL.ResolvedTime = $filter('date')(new Date(comL.ResolvedTime), 'yyyy-MM-dd HH:mm:ss');
                }
                else {
                    comL.ResolvedTime = null;
                }

                if (comL.ClosedTime) {
                    comL.ClosedTime = $filter('date')(new Date(comL.ClosedTime), 'yyyy-MM-dd HH:mm:ss');
                }
                else {
                    comL.ClosedTime = null;
                }

                if (comL.ActionTakenColl) {
                    comL.ActionTakenColl.forEach(function (act) {

                        if (act.ActionDateDet) {
                            act.ActionDate = $filter('date')(new Date(act.ActionDateDet.dateAD), 'yyyy-MM-dd');
                        }
                        else {
                            act.ActionDate = null;
                        }


                        if (act.CommitmentDateDet) {
                            act.CommitmentDate = $filter('date')(new Date(act.CommitmentDateDet.dateAD), 'yyyy-MM-dd');
                        }
                        else {
                            act.CommitmentDate = null;
                        }


                        if (act.ActionTime) {
                            act.ActionTime = $filter('date')(new Date(act.ActionTime), 'yyyy-MM-dd HH:mm:ss');
                        }
                        else {
                            act.ActionTime = null;
                        }


                        if (act.CommitmentTime) {
                            act.CommitmentTime = $filter('date')(new Date(act.CommitmentTime), 'yyyy-MM-dd HH:mm:ss');
                        }
                        else {
                            act.CommitmentTime = null;
                        }

                        if (act.DeputedTime) {
                            act.DeputedTime = $filter('date')(new Date(act.DeputedTime), 'yyyy-MM-dd HH:mm:ss');
                        }
                        else {
                            act.DeputedTime = null;
                        }

                    });
                }

            });
        }


        $http({ 
            method: 'POST',
            url: base_url + "Service/Transaction/SaveTransactionComplain",
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
                $scope.ClearFields();                
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
            url: base_url + "Service/Transaction/GetAllTransactionComplain",
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
            url: base_url + "Service/Transaction/getTransactionComplainById",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.beData = res.data.Data;

                if ($scope.beData.VoucherDate)
                    $scope.beData.VoucherDate_TMP = new Date($scope.beData.VoucherDate);

                if ($scope.beData.STPLEntryDate)
                    $scope.beData.STPLEntryDate_TMP = new Date($scope.beData.STPLEntryDate);

                if ($scope.beData.SatisfcationVerificationDate)
                    $scope.beData.SatisfcationVerificationDate_TMP = new Date($scope.beData.SatisfcationVerificationDate);

                if ($scope.beData.ComplaintClosedDate)
                    $scope.beData.ComplaintClosedDate_TMP = new Date($scope.beData.ComplaintClosedDate);

                if ($scope.beData.FirstResponseDateAndTime)
                    $scope.beData.FirstResponseDateAndTime_TMP = new Date($scope.beData.FirstResponseDateAndTime);

                if ($scope.beData.AttendedDateAndTime)
                    $scope.beData.AttendedDateAndTime_TMP = new Date($scope.beData.AttendedDateAndTime);

                if ($scope.beData.VehicleOnRoadDateTime)
                    $scope.beData.VehicleOnRoadDateTime_TMP = new Date($scope.beData.VehicleOnRoadDateTime);

                if ($scope.beData.TargetDateForComplaintClosure)
                    $scope.beData.TargetDateForComplaintClosure_TMP = new Date($scope.beData.TargetDateForComplaintClosure);

                if ($scope.beData.ReopenedDateTime)
                    $scope.beData.ReopenedDateTime_TMP = new Date($scope.beData.ReopenedDateTime);


                if (!$scope.beData.ComplainLinesColl || $scope.beData.ComplainLinesColl.length == 0) {
                    $scope.beData.ComplainLinesColl = [];
                    $scope.beData.ComplainLinesColl.push({});
                }

                if (!$scope.beData.ActionTakenColl || $scope.beData.ActionTakenColl.length == 0) {
                    $scope.beData.ActionTakenColl = [];
                    $scope.beData.ActionTakenColl.push({});
                }


                if ($scope.beData.ComplaintClosedTime)
                    $scope.beData.ComplaintClosedTime_TMP = new Date($scope.beData.ComplaintClosedTime);
                else
                    $scope.beData.ComplaintClosedTime_TMP = null;


                if ($scope.beData.STPLEntryTime)
                    $scope.beData.STPLEntryTime_TMP = new Date($scope.beData.STPLEntryTime);
                else
                    $scope.beData.STPLEntryTime_TMP = null;


                if ($scope.beData.ComplainLinesColl) {
                    angular.forEach($scope.beData.ComplainLinesColl, function (comL) {
                        if (comL.STPLForwardedDate) {
                            comL.STPLForwardedDate_TMP =new Date(comL.STPLForwardedDate);
                        }

                        if (comL.STPLForwardedTime)
                            comL.STPLForwardedTime = new Date(comL.STPLForwardedTime);

                        if (comL.ResolvedDate) {
                            comL.ResolvedDate_TMP =  new Date(comL.ResolvedDate);
                        }

                        if (comL.ResolvedTime)
                            comL.ResolvedTime = new Date(comL.ResolvedTime);

                        if (comL.ClosedDate) {
                            comL.ClosedDate_TMP =  new Date(comL.ClosedDate);
                        }

                        if (comL.ClosedTime)
                            comL.ClosedTime = new Date(comL.ClosedTime);
                         

                        if (comL.ActionTakenColl) {
                            comL.ActionTakenColl.forEach(function (act) {

                                if (act.ActionDate) {
                                    act.ActionDate_TMP =  new Date(act.ActionDate);
                                }
                                
                                if (act.CommitmentDate) {
                                    act.CommitmentDate_TMP =   new Date(act.CommitmentDate);
                                }

                                if (act.ActionTime)
                                    act.ActionTime = new Date(act.ActionTime);

                                if (act.CommitmentTime)
                                    act.CommitmentTime = new Date(act.CommitmentTime);

                                if (act.DeputedTime)
                                    act.DeputedTime = new Date(act.DeputedTime);

                            });
                        }

                    });
                }


                $scope.beData.Mode = 'Modify';
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
                    url: base_url + "Service/Transaction/DeleteComplainTicket",
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

    $scope.CurComplain = null;
    $scope.TakeAction = function (C)
    {
        $scope.CurComplain = C;

        if (!C.ActionTakenColl || C.ActionTakenColl.length == 0) {
            C.ActionTakenColl = [];

            $scope.CurComplain.ActionTakenColl.push({
                SubType: C.SubType,
                Type: C.Type,
                Action: C.ComplaintDetails,
                ActionDate_TMP: new Date(),
            });
        }

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

    $scope.ImportDatafromAPI = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();        
        $http({
            method: 'POST',
            url: base_url + "Service/Transaction/ImportComplainCard",
            dataType: "json",
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            Swal.fire(res.data.ResponseMSG);
        }, function (reason) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            Swal.fire('Failed' + reason);
        });
    }

});