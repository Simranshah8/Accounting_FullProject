
app.controller("BankReconciliation", function ($scope, $http, $filter, $timeout, GlobalServices, $compile) {

 var PrintPreviewAs = 1;
  const contextMenu = GlobalServices.createElementForMenu();
    LoadData();
    $scope.onBtExportCSV = function () {
        var params = {
            fileName: 'LedgerVoucher.csv',
            sheetName: 'LedgerVoucher'
        };

        $scope.gridOptions.api.exportDataAsCsv(params);
    }
    $scope.onFilterTextBoxChanged = function () {
        $scope.gridOptions.api.setQuickFilter($scope.search);
    }

    function LoadData() {
        $('.select2').select2({
            allowClear: true,
            openOnEnter: true
        });

 $scope.GenConfig = {};
        GlobalServices.getGenConfig().then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.GenConfig = res.data.Data;
                PrintPreviewAs = $scope.GenConfig.PrintPreviewAs;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
		
        $scope.InterestCalculationOnColl = [{ id: 1, text: 'Debit Balance' }, { id: 2, text: 'Credit Balance' }];        
        $scope.Filterlist = [{ id: 1, text: 'Reconcilied Transaction' }, { id: 2, text: 'Unreconcilied Transaction' }, { id: 3, text: 'Bank Statement' }];
        $scope.ClearanceDateList = [{ id: 1, text: 'Cheque Date' }, { id: 2, text: 'Voucher Date' }, { id: 3, text: 'New Date' }];
        

        $scope.LedgerVoucher = {
            DateFrom_TMP: new Date(),
            DateTo_TMP: new Date(),
            VoucherId: 0,
            IsPost: true,
            BranchId: 0,
            IsSummary: true,
            LedgerDetails: {},
            ClearanceDateAs: 1,
            TranType:0,
        };

        $scope.comDet = {};
        $timeout(function () {
            $http({
                method: "GET",
                url: base_url + "Global/GetCompanyDetail",
                dataType: "json"
            }).then(function (res) {
                $scope.comDet = res.data.Data;
                if ($scope.comDet) {
                    $scope.LedgerVoucher.DateFrom_TMP = new Date($scope.comDet.StartDate);
                }
            }, function (errormessage) {
                alert('Unable to Delete data. pls try again.' + errormessage.responseText);
            });
        });

        $scope.LedgerTypeList = [];
        $http({
            method: 'GET',
            url: base_url + "Global/GetLedgerType",
            dataType: "json"
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.LedgerTypeList = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

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

        $scope.ReportName = '';

        $scope.noofdecimal = 2;

        $scope.loadingstatus = "stop";
         

    }

    $scope.ClearData = function () {

        $scope.DataColl = [];

    };

    $scope.ChangeClearanceDateAs = function () {
        if ($scope.DataColl) {
            $scope.DataColl.forEach(function (dc) {
                $timeout(function () {
                    if ($scope.LedgerVoucher.ClearanceDateAs == 1) {
                        if (dc.ClearanceDate) {
                            dc.ClearanceDate_TMP = new Date(dc.ClearanceDate);
                        }                       
                    }
                    else if ($scope.LedgerVoucher.ClearanceDateAs == 2) {
                        if (dc.VoucherDate) {
                            dc.ClearanceDate_TMP = new Date(dc.VoucherDate);
                        }
                    }
                    else if ($scope.LedgerVoucher.ClearanceDateAs == 3) {
                        dc.ClearanceDate_TMP = null;
                    }
                });
            });
        }
    }
    $scope.GetLedgerVoucher = function () {

        $scope.ClearData();

        if (!$scope.LedgerVoucher.LedgerId && !$scope.LedgerVoucher.PatientId)
            return;

        $scope.loadingstatus = 'running';
        showPleaseWait();

        var dateFrom = new Date(($filter('date')(new Date(), 'yyyy-MM-dd')));
        var dateTo = new Date(($filter('date')(new Date(), 'yyyy-MM-dd')));

        if ($scope.LedgerVoucher.DateFromDet)
            dateFrom = new Date(($filter('date')($scope.LedgerVoucher.DateFromDet.dateAD, 'yyyy-MM-dd')));

        if ($scope.LedgerVoucher.DateToDet)
            dateTo = new Date(($filter('date')($scope.LedgerVoucher.DateToDet.dateAD, 'yyyy-MM-dd')));

        $scope.DataColl = []; //declare an empty array

        var beData = {
            ledgerId: ($scope.LedgerVoucher.LedgerId ? $scope.LedgerVoucher.LedgerId : 0),
            dateFrom: dateFrom,
            dateTo: dateTo,
            branchIdColl: ($scope.LedgerVoucher.BranchId == 0 ? '' : $scope.LedgerVoucher.BranchId),
            ClearanceDateAs:$scope.LedgerVoucher.ClearanceDateAs,
            TranType: $scope.LedgerVoucher.TranType,
        };

        $scope.loadingstatus = 'running';

        $http({
            method: "post",
            url: base_url + "Account/Reporting/GetBankReconciliation",
            data: JSON.stringify(beData),
            dataType: "json"
        }).then(function (res) {

            var OpeningAmt = 0, BankOpeningAmt = 0,DrAmt = 0,CrAmt = 0,ClosingAmt = 0,
                DrAmtB = 0,CrAmtB = 0,DrAmtC = 0,CrAmtC = 0,DrAmtB_N = 0,CrAmtB_N = 0,
                DrAmtC_N = 0, CrAmtC_N = 0;

            OpeningAmt = res.data.Data.OpeningAmt;
            BankOpeningAmt = res.data.Data.BankOpeningAmt;
            DrAmt = res.data.Data.DrAmt;
            CrAmt = res.data.Data.CrAmt;
            ClosingAmt = res.data.Data.ClosingAmt;
            DrAmtB = res.data.Data.DrAmtB;
            CrAmtB = res.data.Data.CrAmtB;
            DrAmtC = res.data.Data.DrAmtC;
            CrAmtC = res.data.Data.CrAmtC;
            DrAmtB_N = res.data.Data.DrAmtB_N;
            CrAmtB_N = res.data.Data.CrAmtB_N;
            DrAmtC_N = res.data.Data.DrAmtC_N;
            CrAmtC_N = res.data.Data.CrAmtC_N;


            $scope.LedgerVoucher.OpeningAmt = OpeningAmt;
            $scope.LedgerVoucher.BankOpeningAmt = BankOpeningAmt;
            $scope.LedgerVoucher.DrAmt = DrAmt;
            $scope.LedgerVoucher.CrAmt = CrAmt;
            $scope.LedgerVoucher.ClosingAmt = ClosingAmt;

            $scope.LedgerVoucher.DrAmtB = DrAmtB+(BankOpeningAmt>0 ? BankOpeningAmt : 0);
            $scope.LedgerVoucher.CrAmtB = CrAmtB + (BankOpeningAmt < 0 ? Math.abs(BankOpeningAmt) : 0);
            var bclosing = $scope.LedgerVoucher.DrAmtB - $scope.LedgerVoucher.CrAmtB;
            if (bclosing > 0) {
                $scope.LedgerVoucher.BankClosing_DR = bclosing;
                $scope.LedgerVoucher.BankClosing_CR = 0;
            }
            else {
                $scope.LedgerVoucher.BankClosing_DR = 0;
                $scope.LedgerVoucher.BankClosing_CR = Math.abs(bclosing);
            }

            $scope.LedgerVoucher.DrAmtC = DrAmtC + (OpeningAmt > 0 ? OpeningAmt : 0);
            $scope.LedgerVoucher.CrAmtC = CrAmtC + (OpeningAmt < 0 ? Math.abs(OpeningAmt) : 0);

            var cclosing = $scope.LedgerVoucher.DrAmtC - $scope.LedgerVoucher.CrAmtC;
            if (cclosing > 0) {
                $scope.LedgerVoucher.CompanyClosing_DR = cclosing;
                $scope.LedgerVoucher.CompanyClosing_CR = 0;
            }
            else {
                $scope.LedgerVoucher.CompanyClosing_DR = 0;
                $scope.LedgerVoucher.CompanyClosing_CR = Math.abs(cclosing);
            }


            $scope.LedgerVoucher.DrAmtB_N = DrAmtB_N;
            $scope.LedgerVoucher.CrAmtB_N = CrAmtB_N;
            $scope.LedgerVoucher.DrAmtC_N = DrAmtC_N;
            $scope.LedgerVoucher.CrAmtC_N = CrAmtC_N;


            $scope.DataColl = res.data.Data.DataColl;        

            $scope.loadingstatus = "stop";
            hidePleaseWait();

        }, function (errormessage) {

            $scope.loadingstatus = 'stop';

            alert('Unable to Store data. pls try again.' + errormessage.responseText);
        });

    };

    $scope.Print = function () {
        $http({
            method: 'GET',
            url: base_url + "ReportEngine/GetReportTemplates?entityId=" + EntityId + "&voucherId=0&isTran=false",
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

                    var print = false;

                    var rptTranId = 0;
                    if (templatesColl.length == 1)
                        rptTranId = templatesColl[0].RptTranId;
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

                                        if (rptTranId > 0) {
                                            var dataColl = $scope.GetDataForPrint();
                                            print = true;

                                            $http({
                                                method: 'POST',
                                                url: base_url + "Global/PrintReportData",
                                                headers: { 'Content-Type': undefined },

                                                transformRequest: function (data) {

                                                    var formData = new FormData();
                                                    formData.append("entityId", EntityId);
                                                    formData.append("jsonData", angular.toJson(data.jsonData));

                                                    return formData;
                                                },
                                                data: { jsonData: dataColl }
                                            }).then(function (res) {

                                                $scope.loadingstatus = "stop";
                                                hidePleaseWait();
                                                if (res.data.IsSuccess && res.data.Data) {

                                                    var rptPara = {
                                                        rpttranid: rptTranId,
                                                        istransaction: false,
                                                        entityid: EntityId,
                                                        voucherid: 0,
                                                        tranid: 0,
                                                        vouchertype: 0,
                                                        sessionid: res.data.Data.ResponseId,
                                                        Period: $scope.LedgerVoucher.DateFromDet.dateBS + " TO " + $scope.LedgerVoucher.DateToDet.dateBS,
                                                        ODr: $scope.LedgerVoucher.ODr,
                                                        OCr: $scope.LedgerVoucher.OCr,
                                                        TDr: $scope.LedgerVoucher.TDr,
                                                        TCr: $scope.LedgerVoucher.TCr,
                                                        TDr_P: $scope.LedgerVoucher.TDr_P,
                                                        TCr_P: $scope.LedgerVoucher.TCr_P,
                                                        TDr_C: $scope.LedgerVoucher.TDr_C,
                                                        TCr_C: $scope.LedgerVoucher.TCr_C,
                                                        CDr: $scope.LedgerVoucher.CDr,
                                                        CCr: $scope.LedgerVoucher.CCr,
                                                        TClosingCr: $scope.LedgerVoucher.TClosingCr,
                                                        TClosingDr: $scope.LedgerVoucher.TClosingDr,
                                                        Ledger: $scope.LedgerVoucher.LedgerDetails.Name,
                                                        Address: $scope.LedgerVoucher.LedgerDetails.Address
                                                    };
                                                    var paraQuery = param(rptPara);

                                                    document.body.style.cursor = 'wait';
                                                    document.getElementById("frmRpt").src = '';
                                                    document.getElementById("frmRpt").src = base_url + "web/ReportViewer.aspx?" + paraQuery;
                                                    document.body.style.cursor = 'default';
                                                    $('#FrmPrintReport').modal('show');

                                                } else
                                                    Swal.fire('No Templates found for print');

                                            }, function (errormessage) {
                                                hidePleaseWait();
                                                $scope.loadingstatus = "stop";
                                                Swal.fire(errormessage);
                                            });

                                        }

                                    } else {
                                        resolve('You need to select:)')
                                    }
                                })
                            }
                        })
                    }

                    if (rptTranId > 0 && print == false) {
                        var dataColl = $scope.GetDataForPrint();
                        print = true;

                        $http({
                            method: 'POST',
                            url: base_url + "Global/PrintReportData",
                            headers: { 'Content-Type': undefined },

                            transformRequest: function (data) {

                                var formData = new FormData();
                                formData.append("entityId", EntityId);
                                formData.append("jsonData", angular.toJson(data.jsonData));

                                return formData;
                            },
                            data: { jsonData: dataColl }
                        }).then(function (res) {

                            $scope.loadingstatus = "stop";
                            hidePleaseWait();
                            if (res.data.IsSuccess && res.data.Data) {

                                var rptPara = {
                                    rpttranid: rptTranId,
                                    istransaction: false,
                                    entityid: EntityId,
                                    voucherid: 0,
                                    tranid: 0,
                                    vouchertype: 0,
                                    sessionid: res.data.Data.ResponseId,
                                    Period: $scope.LedgerVoucher.DateFromDet.dateBS + " TO " + $scope.LedgerVoucher.DateToDet.dateBS,
                                    ODr: $scope.LedgerVoucher.ODr,
                                    OCr: $scope.LedgerVoucher.OCr,
                                    TDr: $scope.LedgerVoucher.TDr,
                                    TCr: $scope.LedgerVoucher.TCr,
                                    TDr_P: $scope.LedgerVoucher.TDr_P,
                                    TCr_P: $scope.LedgerVoucher.TCr_P,
                                    TDr_C: $scope.LedgerVoucher.TDr_C,
                                    TCr_C: $scope.LedgerVoucher.TCr_C,
                                    CDr: $scope.LedgerVoucher.CDr,
                                    CCr: $scope.LedgerVoucher.CCr,
                                    TClosingCr: $scope.LedgerVoucher.TClosingCr,
                                    TClosingDr: $scope.LedgerVoucher.TClosingDr,
                                    Ledger: $scope.LedgerVoucher.LedgerDetails.Name,
                                    Address: $scope.LedgerVoucher.LedgerDetails.Address
                                };
                                var paraQuery = param(rptPara);

                                document.body.style.cursor = 'wait';
                                document.getElementById("frmRpt").src = '';
                                document.getElementById("frmRpt").src = base_url + "web/ReportViewer.aspx?" + paraQuery;
                                document.body.style.cursor = 'default';
                                $('#FrmPrintReport').modal('show');

                            } else
                                Swal.fire('No Templates found for print');

                        }, function (errormessage) {
                            hidePleaseWait();
                            $scope.loadingstatus = "stop";
                            Swal.fire(errormessage);
                        });

                    }

                } else
                    Swal.fire('No Templates found for print');
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    };

    $scope.GetDataForPrint = function () {

        var filterData = $scope.DataColl;
 
        return filterData;

    };

    $scope.PrintVoucher = function (tranId, voucherType, voucherId) {
        var para = {
            VoucherType: voucherType
        }
        $http({
            method: 'POST',
            url: base_url + "Global/GetEntityByVoucherType",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (rs) {
            if (rs.data.Data) {
                var entityId = rs.data.Data.RId;
                $timeout(function () {

                    if (tranId && tranId > 0) {

                        $http({
                            method: 'GET',
                            url: base_url + "ReportEngine/GetReportTemplates?entityId=" + entityId + "&voucherId=" + voucherId + "&isTran=true",
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

                                    var printed = false;
                                    var rptTranId = 0;
                                    if (templatesColl.length == 1)
                                        rptTranId = templatesColl[0].RptTranId;
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
                                                        printed = true;
                                                        if (rptTranId > 0) {
                                                            document.body.style.cursor = 'wait';
                                                            document.getElementById("frmRpt").src = '';
                                                            document.getElementById("frmRpt").src = base_url + "web/ReportViewer.aspx?rpttranid=" + rptTranId + "&istransaction=true&entityid=" + entityId + "&voucherid=" + voucherId + "&tranid=" + tranId + "&vouchertype=" + voucherType;
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

                                    if (rptTranId > 0 && printed == false) {
                                        document.body.style.cursor = 'wait';
                                        document.getElementById("frmRpt").src = '';
                                        document.getElementById("frmRpt").src = base_url + "web/ReportViewer.aspx?rpttranid=" + rptTranId + "&istransaction=true&entityid=" + entityId + "&voucherid=" + voucherId + "&tranid=" + tranId + "&vouchertype=" + voucherType;
                                        document.body.style.cursor = 'default';
                                        $('#FrmPrintReport').modal('show');
                                    }

                                } else
                                    Swal.fire('No Templates found for print');
                            }
                        }, function (reason) {
                            Swal.fire('Failed' + reason);
                        });
                    }

                });
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });


    };

     
    $scope.SelectedTran = {};
    $scope.ShowDocument = function (beData) {

        if (beData.TranId && beData.VoucherType) {
            $scope.SelectedTran = beData;

            var para = {
                TranId: beData.TranId,
                VoucherType: beData.VoucherType
            };

            $http({
                method: 'POST',
                url: base_url + "Global/GetTranDocAttachment",
                dataType: "json",
                data: JSON.stringify(para)
            }).then(function (res) {
                hidePleaseWait();
                $scope.loadingstatus = "stop";
                if (res.data.IsSuccess) {
                    $scope.SelectedTran.DocumentColl = res.data.Data;


                    $('#modal-showDocument').modal('show');

                } else {
                    Swal.fire(res.data.ResponseMSG);
                }

            }, function (reason) {
                Swal.fire('Failed' + reason);
            });
        }

    }
    $scope.ShowPersonalImg = function (docDet) {
        $scope.viewImg = {
            ContentPath: '',
            File: null,
            FileData: null
        };
        if (docDet.DocPath || docDet.File) {
            $scope.viewImg.ContentPath = docDet.DocPath;
            $scope.viewImg.File = docDet.File;
            $scope.viewImg.FileData = docDet.DocumentData;
            $('#PersonalImg').modal('show');
        } else
            Swal.fire('No Image Found');

    };

    $scope.CurParty = {};
    $scope.ShowInterest = function () {

        if ($scope.LedgerVoucher.LedgerDetails) {

            $scope.CurParty.LedgerId = $scope.LedgerVoucher.LedgerId;
            $scope.CurParty.CustomerName = $scope.LedgerVoucher.LedgerDetails.Name;
            $scope.CurParty.Address = $scope.LedgerVoucher.LedgerDetails.Address;
            $scope.CurParty.InterestRate = 0;
            $scope.CurParty.CreditDays = 0;
            $scope.CurParty.InterestOn = 1;
            $scope.CurParty.InterestColl = [];

            $scope.loadingstatus = 'running';
            showPleaseWait();
            var para = {
                ledgerId: $scope.LedgerVoucher.LedgerId
            };

            $http({
                method: "post",
                url: base_url + "Account/Creation/GetLedgerById",
                data: JSON.stringify(para),
                dataType: "json"
            }).then(function (res) {
                $scope.loadingstatus = "stop";
                hidePleaseWait();
                if (res.data.IsSuccess == true) {
                    var det = res.data.Data;

                    $scope.CurParty.InterestRate = det.InterestRate;
                    $scope.CurParty.CreditDays = det.CreditLimitDays;
                    $scope.CurParty.InterestOn = det.InterestOn;

                    $scope.ReCalculateInt();
                }
                else {
                    Swal.fire(res.data.ResponseMSG);
                }

            }, function (errormessage) {

                $scope.loadingstatus = 'stop';

                alert('Unable to Store data. pls try again.' + errormessage.responseText);
            });



        }
    }

    $scope.ReCalculateInt = function () {
        $scope.loadingstatus = 'running';
        showPleaseWait();

        var intData = null;
        if ($scope.CurParty.IntCutOffDateDet)
            intData = $filter('date')($scope.CurParty.IntCutOffDateDet.dateAD, 'yyyy-MM-dd');

        var beData = {

            ledgerId: ($scope.CurParty.LedgerId ? $scope.CurParty.LedgerId : 0),
            interestRate: $scope.CurParty.InterestRate,
            creditDays: $scope.CurParty.CreditDays,
            IntCutOffDate: intData,
            InterestOn: $scope.CurParty.InterestOn,
        };

        $http({
            method: "post",
            url: base_url + "Account/Reporting/GetLedgerInt",
            data: JSON.stringify(beData),
            dataType: "json"
        }).then(function (res) {
            $scope.loadingstatus = "stop";
            hidePleaseWait();

            if (res.data.IsSuccess == true) {
                $scope.CurParty.InterestColl = res.data.Data;

                $('#frmMdlInterest').modal('show');
            }
            else {
                Swal.fire(res.data.ResponseMSG);
            }

        }, function (errormessage) {

            $scope.loadingstatus = 'stop';

            alert('Unable to Store data. pls try again.' + errormessage.responseText);
        });
    }

    $scope.CheckAll = function () {
        var val =$scope.LedgerVoucher.CheckAll;
        if ($scope.DataColl) {
            if ($scope.DataColl.length > 0) {
                $scope.DataColl.forEach(function (dc) {
                    if (dc.IsCleared==false)
                        dc.IsSelected = val;
                });
            }
        }
    }
    $scope.SelectedVoucherColl = [];
    $scope.ReconciliationModal = function ()
    {
        $scope.SelectedVoucherColl = [];
        if ($scope.DataColl && $scope.DataColl.length > 0)
        {
            $scope.SelectedVoucher = {};

            $scope.DataColl.forEach(function (dc) {
                if (dc.IsCleared == false) {
                    if (dc.IsSelected == true) {

                        if (dc.ClearanceDate_TMP) {
                            dc.ClearanceDate = $filter('date')(dc.ClearanceDateDet.dateAD, 'yyyy-MM-dd');
                        } else {
                            Swal.fire('Please ! Enter Clearance Date');
                            return;
                        }
                        if (!dc.ClearanceRemarks || dc.ClearanceRemarks == null || dc.ClearanceRemarks.length==0) {
                            Swal.fire('Please ! Enter Clearance Remarks');
                            return;
                        }

                        if(dc.ClearanceDate && isEmptyObj(dc.ClearanceRemarks)==false)
                            $scope.SelectedVoucherColl.push(dc);
                    }
                }
            })

            if ($scope.SelectedVoucherColl && $scope.SelectedVoucherColl.length > 0) {

                $scope.loadingstatus = "running";
                showPleaseWait();
                $http({
                    method: 'POST',
                    url: base_url + "Account/Reporting/SaveBRSColl",
                    headers: { 'Content-Type': undefined },
                    transformRequest: function (data) {
                        var formData = new FormData();
                        formData.append("jsonData", angular.toJson(data.jsonData));
                        return formData;
                    },
                    data: { jsonData: $scope.SelectedVoucherColl }
                }).then(function (res) {
                    $scope.loadingstatus = "stop";
                    hidePleaseWait();
                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess == true)
                    {
                        $scope.GetLedgerVoucher();
                    }
                }, function (errormessage) {
                    hidePleaseWait();
                    $scope.loadingstatus = "stop";
                });

            } 
             
        }

    }
    $scope.SaveRecon = function () {

        if (!$scope.SelectedVoucher)
            return;

        if (!$scope.SelectedVoucher.ClearanceDateDet) {
            Swal.fire('Please ! Enter Clearance Date')
            return;
        }

        if (!$scope.SelectedVoucher.ClearanceBy || $scope.SelectedVoucher.ClearanceBy.length == 0) {
            Swal.fire('Please ! Enter Clearance By Person Name')
            return;
        }

        if (!$scope.SelectedVoucher.ClearanceRemarks || $scope.SelectedVoucher.ClearanceRemarks.length == 0) {
            Swal.fire('Please ! Enter Clearance Remarks')
            return;
        }

        $scope.SelectedVoucher.ClearanceDate = $filter('date')($scope.SelectedVoucher.ClearanceDateDet.dateAD, 'yyyy-MM-dd');
        $scope.loadingstatus = "running";
        showPleaseWait();
        $http({
            method: 'POST',
            url: base_url + "Account/Reporting/SaveBRS",
            headers: { 'Content-Type': undefined },
            transformRequest: function (data) {
                var formData = new FormData();
                formData.append("jsonData", angular.toJson(data.jsonData));
                return formData;
            },
            data: { jsonData: $scope.SelectedVoucher }
        }).then(function (res) {
            $scope.loadingstatus = "stop";
            hidePleaseWait();
            Swal.fire(res.data.ResponseMSG);
            if (res.data.IsSuccess == true) {
                $('#modal-reconsile').modal('hide');
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }

    $scope.DownloadAsXls = function () {

        $scope.loadingstatus = 'running';
        showPleaseWait();

        var dataColl = $scope.GetDataForPrint();


        var paraData = {                     
            Period: $scope.LedgerVoucher.DateFromDet.dateBS + " TO " + $scope.LedgerVoucher.DateToDet.dateBS,
            ODr: $scope.LedgerVoucher.ODr,
            OCr: $scope.LedgerVoucher.OCr,
            TDr: $scope.LedgerVoucher.TDr,
            TCr: $scope.LedgerVoucher.TCr,
            TDr_P: $scope.LedgerVoucher.TDr_P,
            TCr_P: $scope.LedgerVoucher.TCr_P,
            TDr_C: $scope.LedgerVoucher.TDr_C,
            TCr_C: $scope.LedgerVoucher.TCr_C,
            CDr: $scope.LedgerVoucher.CDr,
            CCr: $scope.LedgerVoucher.CCr,
            TClosingCr: $scope.LedgerVoucher.TClosingCr,
            TClosingDr: $scope.LedgerVoucher.TClosingDr,
            Ledger: $scope.LedgerVoucher.LedgerDetails.Name,
            Address: $scope.LedgerVoucher.LedgerDetails.Address
        };

        $http({
            method: 'POST',
            url: base_url + "Global/PrintXlsReportData",
            headers: { 'Content-Type': undefined },

            transformRequest: function (data) {

                var formData = new FormData();
                formData.append("entityId", EntityId);
                formData.append("jsonData", angular.toJson(data.jsonData));
                formData.append("paraData", angular.toJson(paraData));
                formData.append("RptPath", "");
                return formData;
            },
            data: { jsonData: dataColl }
        }).then(function (res) {

            $scope.loadingstatus = "stop";
            hidePleaseWait();
            if (res.data.IsSuccess && res.data.Data) {
                down_file(base_url + "//" + res.data.Data.ResponseId, "BRS.xlsx");
            }

        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            Swal.fire(errormessage);
        });
    }
	
	 $scope.saveRptListState = function () {
        GlobalServices.saveRptListState(EntityId, $scope.gridOptions);
    };
    $scope.DelListState = function () {
        GlobalServices.delListStateRpt(EntityId);
    }
    function onCellContextMenu(event) {
        GlobalServices.onCellContextMenu(event, $scope.gridOptions, contextMenu);
    }

    // Hide context menu when clicking outside
    document.addEventListener('click', function () {
        contextMenu.style.display = 'none';
    });

    $(document).ready(function () {
        $(this).bind("contextmenu", function (e) {
            e.preventDefault();
        });
    });
});
