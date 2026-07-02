app.controller("trnPendingVendorPaymentCntrl", function ($scope, $http, $filter, $compile, $timeout, GlobalServices, $compile) {

    LoadData();

    function LoadData() {

        $('.select2').select2({
            allowClear: true,
            openOnEnter: true
        });

        $scope.paginationOptions = {
            pageNumber: 1,
            pageSize: GlobalServices.getPerPageRow(),
            sort: null,
            SearchType: 'text',
            SearchCol: '',
            SearchVal: '',
            SearchColDet: null,
            pagearray: [],
            pageOptions: [5, 10, 20, 30, 40, 50],
        };       
        //Added by suresh
        $scope.getEndIndex = function () {
            const start = ($scope.paginationOptions.pageNumber - 1) * $scope.paginationOptions.pageSize;
            const end = start + $scope.paginationOptions.pageSize;
            return Math.min(end, $scope.PendingVoucherColl.length || 0);
        };

        $scope.pageChangeHandler = function (newPageNumber) {
            $scope.paginationOptions.pageNumber = newPageNumber;
        };
        //Ends
        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.perPageColl = GlobalServices.getPerPageList();
        $scope.currentPages = {
            PendingOrder: 1,
        };

        $scope.searchData = {
            PendingOrder: '',
        };

        $scope.perPage = {
            PendingOrder: 25,
        };


        $scope.BranchList = [];
        $http({
            method: 'POST',
            url: base_url + "Setup/Security/GetAllBranchList",
            dataType: "json"
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.BranchList = res.data.Data;

                if ($scope.BranchList.length == 1) {
                    $scope.dayBook.BranchId = $scope.BranchList[0].BranchId;
                }
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $scope.DebtorTypeList = [];
        $http({
            method: 'GET',
            url: base_url + "Account/Creation/GetAllDebtorTypeList",
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.DebtorTypeList = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $scope.RouteList = [];
        $http({
            method: 'GET',
            url: base_url + "Account/Creation/GetAllDebtorRouteList",
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.RouteList = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        var vt_Para = {
            voucherType: VoucherType,
            filterPara: null,
        };

        $http({
            method: 'POST',
            url: base_url + "Account/Creation/GetVoucherList",
            dataType: "json",
            data: JSON.stringify(vt_Para)
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
                                    $scope.dayBook.VoucherId = $scope.SelectedVoucher.VoucherId;
                                }

                                if ($scope.CostClassColl.length > 0) {
                                    $scope.SelectedCostClass = $scope.CostClassColl[0];
                                    $scope.dayBook.CostClassId = $scope.SelectedCostClass.CostClassId;
                                }

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

        $scope.CreditorGroupList = [];
        $http({
            method: 'GET',
            url: base_url + "Account/Creation/GetCreditGroup",
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.CreditorGroupList = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $scope.dayBook = {
            DateFrom_TMP: new Date(),
            DateTo_TMP: new Date(),
            LedgerGroupId: 26,
        };

        $scope.comDet = {};
        GlobalServices.getCompanyDet().then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.comDet = res.data.Data;
                $scope.dayBook.DateFrom_TMP = new Date($scope.comDet.StartDate);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

    }
    $scope.ChangeVoucherType = function () {
        if ($scope.dayBook.VoucherId > 0) {
            var findVoucher = mx($scope.VoucherTypeColl).firstOrDefault(p1 => p1.VoucherId == $scope.dayBook.VoucherId);
            if (findVoucher)
                $scope.SelectedVoucher = findVoucher;

        } else {
            $scope.SelectedVoucher = null;
        }

    }

    //$scope.toggleExpand = function (pv) {
    //    if (!pv.hasOwnProperty('expanded')) {
    //        pv.expanded = false;
    //    }
    //    pv.expanded = !pv.expanded;
    //};
    $scope.GetDuesBills = function () {

        $scope.paginationOptions.TotalRows = 0;

        $scope.PendingVoucherColl = [];
        var dateFrom = $filter('date')(new Date(), 'yyyy-MM-dd');
        var dateTo = $filter('date')(new Date(), 'yyyy-MM-dd');

        if ($scope.dayBook.DateFromDet)
            dateFrom = $filter('date')($scope.dayBook.DateFromDet.dateAD, 'yyyy-MM-dd');

        if ($scope.dayBook.DateToDet)
            dateTo = $filter('date')($scope.dayBook.DateToDet.dateAD, 'yyyy-MM-dd');


        $scope.loadingstatus = 'running';
        showPleaseWait();

        var para = {
            dateFrom: dateFrom,
            dateTo: dateTo,
            LedgerGroupId: $scope.dayBook.LedgerGroupId,
            ledgerIdColl: '',
            isCreditor: true,
            branchIdColl: '',
            DebtorTypeId: $scope.dayBook.DebtorTypeId,
            DebtorRouteId: $scope.dayBook.DebtorRouteId
        };

        $http({
            method: "post",
            url: base_url + "Account/Reporting/GetPartyWiseDuesBillList",
            data: JSON.stringify(para),
            dataType: "json"
        }).then(function (res) {
            $scope.loadingstatus = 'done';
            hidePleaseWait();
            if (res.data.IsSuccess == true) {
                $scope.dayBook.Amount = 0;
                res.data.Data.forEach(function (dc) {
                    if (dc.Closing < 0) {
                        dc.Paid = 0;
                        $scope.dayBook.Amount += dc.Amount;
                        $scope.PendingVoucherColl.push(dc);
                        //added by suresh
                        dc.expanded = false; // Initialize expanded to false
                    }
                })

                $scope.paginationOptions.TotalRows = $scope.PendingVoucherColl.length;

                $scope.dayBook.Dues = $scope.dayBook.Amount;
                $scope.dayBook.UniqueId = GlobalServices.getUniqueId();

            } else if (res.data.IsSuccess != undefined) {
                Swal.fire(res.data.ResponseMSG);
            }

        }, function (errormessage) {

            $scope.loadingstatus = 'stop';

            alert('Unable to Store data. pls try again.' + errormessage.responseText);
        });

    };

    $scope.ChangePaidAmt = function (curRow, curBill, colName, ind) {
        if (colName == 'totalPaid') {
            if (curRow && curRow.ChieldColl) {
                var totalPaid = curRow.Paid;
                curRow.ChieldColl.forEach(function (itemRow) {

                    if (totalPaid > 0) {

                        if (itemRow.Amount >= totalPaid) {
                            itemRow.Paid = totalPaid;
                            totalPaid = 0;
                        }
                        else if (itemRow.Amount < totalPaid) {
                            itemRow.Paid = itemRow.Amount;
                            totalPaid -= itemRow.Amount;
                        }
                    }

                });
            }
        }
        else if (colName == 'paid') {

            var totalPaid = 0;
            curRow.ChieldColl.forEach(function (itemRow) {
                totalPaid += isEmptyAmt(itemRow.Paid);
            });
            curRow.Paid = totalPaid;

        }

        $scope.CalculateTotal();

    }

    $scope.CalculateTotal = function () {
        $scope.dayBook.Paid = 0;
        $scope.PendingVoucherColl.forEach(function (v) {
            $scope.dayBook.Paid += isEmptyAmt(v.Paid);
        });

        $scope.dayBook.Dues = $scope.dayBook.Amount - $scope.dayBook.Paid;
    }

    $scope.ChangeCashBankLedger = function (curRow) {

        if (curRow.LastBankId != curRow.CashBankLedgerId) {
            curRow.PendingChequeColl = [];
            curRow.PendingChequeColl_Qry = [];

            if (curRow.CashBankLedgerId > 0) {
                $scope.loadingstatus = 'running';
                showPleaseWait();
                var para = {
                    LedgerId: curRow.CashBankLedgerId
                }
                $http({
                    method: 'POST',
                    url: base_url + "Account/Creation/GetPendingCheque",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    $scope.loadingstatus = 'done';
                    hidePleaseWait();
                    if (res.data.IsSuccess && res.data.Data) {
                        curRow.PendingChequeColl = res.data.Data;
                        curRow.PendingChequeColl_Qry = mx(res.data.Data);
                        curRow.LastBankId = curRow.CashBankLedgerId;

                    } else {
                        Swal.fire(res.data.ResponseMSG);
                    }
                }, function (reason) {
                    $scope.loadingstatus = 'done';
                    hidePleaseWait();
                    Swal.fire('Failed' + reason);
                });
            }
        }


    }

    $scope.ChequeNoSelect = function (ledAllocation) {
        if (ledAllocation) {
            ledAllocation.ChequeNo = '';
            ledAllocation.AccountNo = '';

            if (ledAllocation.ChequeId || ledAllocation.ChequeId > 0) {
                var findCh = ledAllocation.PendingChequeColl_Qry.firstOrDefault(p1 => p1.ChequeId == ledAllocation.ChequeId);
                if (findCh) {
                    ledAllocation.ChequeNo = findCh.DisplayChequeNo;
                    ledAllocation.AccountNo = findCh.AccountNo;
                }
            }
        }
    }

    $scope.ChangeSelection = function (curRow) {
        if (curRow.IsSelected == true) {
            if (curRow && curRow.ChieldColl) {
                curRow.Paid = curRow.Amount;
                curRow.ChieldColl.forEach(function (itemRow) {
                    itemRow.Paid = itemRow.Amount;
                    itemRow.IsSelected = true;
                });
                curRow.Paid = curRow.Amount;
            }
        } else {
            if (curRow && curRow.ChieldColl) {
                curRow.Paid = 0;
                curRow.ChieldColl.forEach(function (itemRow) {
                    itemRow.Paid = 0;
                    itemRow.IsSelected = false;
                });
                curRow.Paid = 0;
            }
        }

        $scope.CalculateTotal();

    }

    $scope.ChangeSelectionCH = function (curRow, itemRow) {
        if (itemRow.IsSelected == true) {
            itemRow.Paid = itemRow.Amount;
        }
        else {
            itemRow.Paid = 0;
        }

        if (curRow && curRow.ChieldColl) {
            var totalPaid = 0;
            curRow.ChieldColl.forEach(function (itemR) {
                totalPaid += isEmptyAmt(itemR.Paid);
            });
            curRow.Paid = totalPaid;
        }

        $scope.CalculateTotal();

    }
    $scope.MakePayment = function () {
        Swal.fire({
            title: 'Do you want to make payment selected bills ?',
            showCancelButton: true,
            confirmButtonText: "Make Payment",
        }).then((result) => {
            if (result.isConfirmed) {

                var dataColl = $scope.GetDataForPayment();

                if (dataColl == null || dataColl.length == 0) {
                    Swal.fire('Invalid Data');
                    return;
                }

                $scope.loadingstatus = "running";
                showPleaseWait();

                $http({
                    method: 'POST',
                    url: base_url + "Account/Transaction/SavePayment",
                    headers: { 'Content-Type': undefined },

                    transformRequest: function (data) {

                        var formData = new FormData();
                        formData.append("uniqueId", $scope.dayBook.UniqueId);
                        formData.append("jsonData", angular.toJson(data.jsonData));

                        return formData;
                    },
                    data: { jsonData: dataColl }
                }).then(function (res) {

                    $scope.loadingstatus = "stop";
                    hidePleaseWait();

                    if (res.data.IsSuccess == true) {
                        var resData = res.data.Data;
                        $scope.dayBook.TranIdColl = resData.ResponseId;
                        $scope.Print($scope.dayBook.UniqueId);
                        $scope.PrintVoucher(resData.ResponseId);
                        $scope.GetDuesBills();
                    }
                    else {
                        Swal.fire(res.data.ResponseMSG);
                    }

                }, function (errormessage) {
                    $scope.loadingstatus = "stop";
                    hidePleaseWait();
                    Swal.fire(errormessage);
                });

            }
        });

    }

    $scope.GetDataForPayment = function () {
        if (!$scope.SelectedCostClass || $scope.SelectedCostClass == undefined) {
            Swal.fire('Please ! Select For Year Missing ')
            return null;
        }

        if (!$scope.SelectedVoucher || $scope.SelectedVoucher == undefined) {
            Swal.fire('Please ! Selected Voucher Name')
            return null;
        }

        var tranColl = [];

        var vDate = $filter('date')(new Date(), 'yyyy-MM-dd');
        var eDate = vDate;

        $scope.PendingVoucherColl.forEach(function (pv) {

            if (pv.Paid > 0 && pv.CashBankLedgerId > 0 && pv.LedgerId > 0) {

                if (pv.Paid > pv.Amount) {
                    var diff = pv.Paid - pv.Amount;
                    Swal.fire('Dues and Paid Amount does not match of party ' + pv.Name);
                    return null;
                }

                var tmpPayment = {
                    UniqueId: '',
                    TranId: 0,
                    VoucherId: $scope.SelectedVoucher.VoucherId,
                    CostClassId: $scope.SelectedCostClass.CostClassId,
                    AutoVoucherNo: 0,
                    ManualVoucherNO: '',
                    Narration: pv.Remarks,
                    VoucherDate: vDate,
                    RefNo: '',
                    AutoManualNo: '',
                    EntryDate: eDate,
                    BranchId: $scope.SelectedVoucher.BDId,
                    LedgerAllocationColl: [],
                    DocumentColl: [],
                    ProjectId: null,
                    Attributes: '',
                    UDFKeyVal: '',
                    ForCV: 2,
                };

                var drLedAllocation = {
                    DrCr: 1,
                    LedgerId: pv.LedgerId,
                    AgentId: 0,
                    LFNO: '',
                    Narration: '',
                    CrAmount: 0,
                    DrAmount: pv.Paid,
                    ForBranchId: null,
                    Dimension1: null,
                    Dimension2: null,
                    Dimension3: null,
                    Dimension4: null,
                    Dimension5: null,
                    CostCenterColl: [],
                    ItemDetailsCOll: [],
                    TDSVatDetailColl: [],
                    PendingTDSColl: [],
                    CheckDetails: {},
                    FundDetails: {},
                    BillRefColl: [],
                };


                if (pv.ChieldColl) {
                    angular.forEach(pv.ChieldColl, function (br) {
                        if (br.Paid > 0) {
                            var billRef = {
                                Amount: br.Paid,
                                BillRefType: 2,
                                BillRefId: br.TranId,
                                CreditDays: 0,
                                DrCr: drLedAllocation.DrCr,
                                DueDate: $filter('date')(new Date(br.VoucherDate), 'yyyy-MM-dd'),
                                RefName: br.VoucherName,
                                RefVoucherType: br.VoucherType,
                                RefTranId: br.TranId,
                                RefVNo: br.InvoiceNo,
                                DuesAmount: br.Amount,
                            };
                            drLedAllocation.BillRefColl.push(billRef);
                        };
                    });
                }


                var crLedAllocation = {
                    LedgerAttributes: '',
                    UDFKeyVal: '',
                    Attributes: '',
                    DrCr: 2,
                    LedgerId: pv.CashBankLedgerId,
                    AgentId: 0,
                    LFNO: '',
                    Narration: pv.Remarks,
                    CrAmount: pv.Paid,
                    DrAmount: 0,
                    ForBranchId: null,
                    CostCenterColl: [],
                    Dimension1: null,
                    Dimension2: null,
                    Dimension3: null,
                    Dimension4: null,
                    Dimension5: null,
                    SubLedgerId: null,
                    ItemDetailsCOll: [],
                    TDSVatDetailColl: [],
                    CheckDetails: {},
                    PendingTDSColl: [],
                    BillRefColl: [],
                    FundDetails: {},
                };

                crLedAllocation.CheckDetails.ChequeId = pv.ChequeId;
                crLedAllocation.CheckDetails.ChequeNo = pv.ChequeNo;
                crLedAllocation.CheckDetails.AccountNo = pv.AccountNo;
                crLedAllocation.CheckDetails.Remarks = pv.Remarks;
                crLedAllocation.CheckDetails.CheckType = 1;
                crLedAllocation.CheckDetails.PartyName = pv.Name;
                crLedAllocation.CheckDetails.ChequeDate = $filter('date')(new Date(), 'yyyy-MM-dd');


                tmpPayment.LedgerAllocationColl.push(drLedAllocation);
                tmpPayment.LedgerAllocationColl.push(crLedAllocation);

                tranColl.push(tmpPayment);
            }


        });
        return tranColl;

    };

    $scope.Print = function (uid) {

        var TranId = 0;
        var vId = $scope.SelectedVoucher.VoucherId;

        $http({
            method: 'GET',
            url: base_url + "ReportEngine/GetReportTemplates?entityId=" + EntityId2 + "&voucherId=" + vId + "&isTran=true&vtranId=" + TranId,
            dataType: "json"
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                var templatesColl = res.data.Data;
                if (templatesColl && templatesColl.length > 0) {
                    var templatesName = [];
                    var sno = 1;
                    angular.forEach(templatesColl, function (tc) {
                        templatesName.push(sno + '-' + tc.ReportName);
                        sno++;
                    });
                    var printDone = false;
                    var rptTranId = 0;
                    var selectedRpt = null;

                    if (templatesColl.length == 1) {
                        rptTranId = templatesColl[0].RptTranId;
                        selectedRpt = templatesColl[0];
                    }
                    else {
                        Swal.fire({
                            title: 'Report Templates For Print',
                            input: 'select',
                            inputOptions: templatesName,
                            inputPlaceholder: 'Select a template',
                            showCancelButton: true,
                            inputValidator: (value) => {
                                return new Promise((resolve) => {
                                    if (value >= 0) {
                                        resolve()
                                        rptTranId = templatesColl[value].RptTranId;
                                        selectedRpt = templatesColl[value];
                                        printDone = true;

                                        if (rptTranId > 0) {
                                            document.body.style.cursor = 'wait';
                                            document.getElementById("frmRpt").src = '';
                                            document.getElementById("frmRpt").src = base_url + "web/ReportViewer.aspx?rpttranid=" + rptTranId + "&istransaction=true&entityid=" + EntityId2 + "&voucherid=0&tranid=0&UniqueId=" + uid + "&vouchertype=" + VoucherType + '&FileName=' + selectedRpt.PDFFileName;
                                            document.body.style.cursor = 'default';
                                            $('#FrmPrintReport').modal('show');
                                        }
                                    } else {
                                        resolve('You need to select:)')
                                    }
                                })
                            }
                        })
                    }

                    if (rptTranId > 0) {
                        document.body.style.cursor = 'wait';
                        document.getElementById("frmRpt").src = '';
                        document.getElementById("frmRpt").src = base_url + "web/ReportViewer.aspx?rpttranid=" + rptTranId + "&istransaction=true&entityid=" + EntityId2 + "&voucherid=0&tranid=0&UniqueId=" + uid + "&vouchertype=" + VoucherType + '&FileName=' + selectedRpt.PDFFileName;
                        document.body.style.cursor = 'default';
                        $('#FrmPrintReport').modal('show');
                    }

                } else
                    Swal.fire('No Templates found for print');
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

    };

    $scope.PrintVoucher = function (tranIdColl) {
        var tranIdSpli = tranIdColl.split(',');
        var TranId = tranIdSpli[0];
        var vId = $scope.SelectedVoucher.VoucherId;

        $http({
            method: 'GET',
            url: base_url + "ReportEngine/GetReportTemplates?entityId=" + EntityId + "&voucherId=" + vId + "&isTran=true&vtranId=" + TranId,
            dataType: "json"
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                var templatesColl = res.data.Data;
                if (templatesColl && templatesColl.length > 0) {
                    var templatesName = [];
                    var sno = 1;
                    angular.forEach(templatesColl, function (tc) {
                        templatesName.push(sno + '-' + tc.ReportName);
                        sno++;
                    });
                    var printDone = false;
                    var rptTranId = 0;
                    var selectedRpt = null;

                    if (templatesColl.length == 1) {
                        rptTranId = templatesColl[0].RptTranId;
                        selectedRpt = templatesColl[0];
                    }
                    else {
                        Swal.fire({
                            title: 'Report Templates For Print',
                            input: 'select',
                            inputOptions: templatesName,
                            inputPlaceholder: 'Select a template',
                            showCancelButton: true,
                            inputValidator: (value) => {
                                return new Promise((resolve) => {
                                    if (value >= 0) {
                                        resolve()
                                        rptTranId = templatesColl[value].RptTranId;
                                        selectedRpt = templatesColl[value];
                                        printDone = true;

                                        if (rptTranId > 0) {
                                            document.body.style.cursor = 'wait';
                                            document.getElementById("frmRpt").src = '';
                                            document.getElementById("frmRpt").src = base_url + "web/ReportViewer.aspx?rpttranid=" + rptTranId + "&istransaction=true&entityid=" + EntityId + "&voucherid=" + $scope.SelectedVoucher.VoucherId + "&tranid=0&TranIdColl=" + tranIdColl + "&vouchertype=" + VoucherType + '&FileName=' + selectedRpt.PDFFileName;
                                            document.body.style.cursor = 'default';
                                            $('#FrmPrintReport').modal('show');
                                        }
                                    } else {
                                        resolve('You need to select:)')
                                    }
                                })
                            }
                        })
                    }

                    if (rptTranId > 0) {
                        document.body.style.cursor = 'wait';
                        document.getElementById("frmRpt").src = '';
                        document.getElementById("frmRpt").src = base_url + "web/ReportViewer.aspx?rpttranid=" + rptTranId + "&istransaction=true&entityid=" + EntityId + "&voucherid=" + $scope.SelectedVoucher.VoucherId + "&tranid=0&TranIdColl=" + tranIdColl + "&vouchertype=" + VoucherType + '&FileName=' + selectedRpt.PDFFileName;
                        document.body.style.cursor = 'default';
                        $('#FrmPrintReport').modal('show');
                    }

                } else
                    Swal.fire('No Templates found for print');
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

    };

    $scope.SearchData = function () {
        $scope.SearchDataColl = [];
        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: 'POST',
            url: base_url + "Account/Transaction/GetAllVendorPayment",
            dataType: "json",
            //data: JSON.stringify(para)
        }).then(function (res) {
            $scope.loadingstatus = 'stop';
            hidePleaseWait();
            if (res.data.IsSuccess && res.data.Data) {
                $scope.SearchDataColl = res.data.Data;
                $('#searVoucherRightBtn').modal('show');
            } else
                alert(res.data.ResponseMSG);

        }, function (reason) {
            alert('Failed' + reason);
        });

    }

});