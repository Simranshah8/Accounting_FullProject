app.controller('RescheduleLoanController', function ($scope, $http, $timeout, $filter, GlobalServices) {
    $scope.Title = 'Reschedue Loan';

    $scope.confirmMSG = GlobalServices.getConfirmMSG();
    var glSrv = GlobalServices;
    LoadData();

    $scope.sideBarData = [];
    function Numberformat(val) {
        return $filter('number')(val, 2);
    }
    function GetDateStr(ny, nm, nd) {
        return ny.toString() + '-' + nm.toString().padStart(2, '0') + '-' + nd.toString().padStart(2, '0')
    }
    $scope.lastTranId = 0;
    function LoadData() {
        $scope.paginationOptions = {
            pageNumber: 1,
            pageSize: glSrv.getPerPageRow(),
            sort: null,
            SearchType: 'text',
            SearchCol: '',
            SearchVal: '',
            SearchColDet: null,
            pagearray: [],
            pageOptions: [5, 10, 20, 30, 40, 50]
        };
        $scope.VoucherSearchOptions = [{ text: 'VoucherNo', value: 'ADS.VoucherNo', searchType: 'Number' }, { text: 'RefNo', value: 'TS.[No]', searchType: 'text' }, { text: 'VoucherDate', value: 'TS.VoucherDate', searchType: 'date' }, { text: 'Voucher Name', value: 'V.VoucherName', searchType: 'text' }, { text: 'CostClass', value: 'CC.Name', searchType: 'text' }, { text: 'Ledger', value: 'LL.Name', searchType: 'text' }, { text: 'Amount', value: 'DD.Amount', searchType: 'Number' },];
        $scope.PeriodTypesList = [{ id: 1, text: 'Daily' }, { id: 2, text: 'Weekly' }, { id: 3, text: 'Monthly' }, { id: 4, text: 'Quaterly' }, { id: 5, text: 'HalyYearly' }, { id: 6, text: 'Yearly' }];
        $scope.LoanTypeColl = [{ id: 1, text: 'Diminishing' }, { id: 2, text: 'Flat' }];

        $scope.beData =
        {
            VoucherId: null,
            CostClassId: null,
            TranId: 0,
            AutoManualNo: '',
            AutoVoucherNo: 0,
            CurRate: 1,
            AttechFiles: [],
            SubTotal: 0,
            Total: 0,
            Narration: '',
            VoucherDate: new Date(),
            VoucherDate_TMP: new Date(),
            LedgerAllocationColl: [],
            Mode: 'Save',
            DocumentColl: [],
            RebateRulesColl: [],
            PenaltyRulesColl: []
        };
        $scope.beData.RebateRulesColl.push({});
        $scope.beData.PenaltyRulesColl.push({});
    }

    $scope.ClearData = function () {
        $scope.newDet = {
            LedgerId: null,
            LoanId: null
        }
        $scope.beData =
        {           
            VoucherId: null,
            CostClassId: null,
            TranId: 0,
            AutoManualNo: '',
            AutoVoucherNo: 0,
            AttechFiles: [],
            SubTotal: 0,
            Total: 0,
            Narration: '',
            EntryDate_TMP: new Date(),
            LedgerAllocationColl: [],
            Mode: 'Save'
        };

        $scope.beData.LedgerAllocationColl.push(
            {
                LedgerId: 0,
                AgentId: 0,
                LFNO: '',
                Narration: '',
                DrAmount: 0,
                CrAmount: 0,
                ForBranchId: null
            }
        );

        if ($scope.VoucherTypeColl.length > 0) {
            $scope.SelectedVoucher = $scope.VoucherTypeColl[0];
            $scope.beData.VoucherId = $scope.SelectedVoucher.VoucherId;
        }

        if ($scope.CostClassColl.length > 0) {
            $scope.SelectedCostClass = $scope.CostClassColl[0];
            $scope.beData.CostClassId = $scope.SelectedCostClass.CostClassId;
        }

        $timeout(function () {
            $scope.getVoucherNo();
        })
    };

    //Added For Attachment files starts
    $scope.AddMoreFiles = function (files, des) {
        if (files) {
            if (files != null) {
                angular.forEach(files, function (file) {
                    $scope.beData.DocumentColl.push({
                        File: file,
                        Name: file.name,
                        Type: file.type,
                        Size: file.size,
                        Description: des,
                        Path: null
                    });
                })
                $scope.attachFile = null;
                $scope.docDescription = '';
                $('#flMoreFiles').val('');
            }
        }
    };

    $scope.delAttachmentFiles = function (ind) {
        if ($scope.beData.DocumentColl) {
            if ($scope.beData.DocumentColl.length > 0) {
                $scope.beData.DocumentColl.splice(ind, 1);
            }
        }
    }

    $scope.ShowPersonalImg = function (item) {
        $scope.viewImg = {
            ContentPath: '',
            FileType: null
        };

        if (item.DocPath && item.DocPath.length > 0) {
            $scope.viewImg.ContentPath = item.DocPath;
            $scope.viewImg.FileType = 'pdf';  // Assuming DocPath is for PDFs
            document.getElementById('pdfViewer').src = item.DocPath;
            $('#PersonalImg').modal('show');
        } else if (item.PhotoPath && item.PhotoPath.length > 0) {
            $scope.viewImg.ContentPath = item.PhotoPath;
            $scope.viewImg.FileType = 'image';  // Assuming PhotoPath is for images
            $('#PersonalImg').modal('show');
        } else if (item.File) {
            var blob = new Blob([item.File], { type: item.File?.type });
            $scope.viewImg.ContentPath = URL.createObjectURL(blob);
            $scope.viewImg.FileType = item.File.type.startsWith('image/') ? 'image' : 'pdf';

            if ($scope.viewImg.FileType === 'pdf') {
                document.getElementById('pdfViewer').src = $scope.viewImg.ContentPath;
            }

            $('#PersonalImg').modal('show');
        } else {
            Swal.fire('No Image Found');
        }
    };

    //Ends here
    $scope.AddRebateRules = function (ind) {
        if ($scope.beData.RebateRulesColl) {
            if ($scope.beData.RebateRulesColl.length > ind + 1) {
                $scope.beData.RebateRulesColl.splice(ind + 1, 0, {
                    RebatePer: ''
                })
            } else {
                $scope.beData.RebateRulesColl.push({
                    RebatePer: ''
                })
            }
        }
    };
    $scope.delRebateRules = function (ind) {
        if ($scope.beData.RebateRulesColl) {
            if ($scope.beData.RebateRulesColl.length > 1) {
                $scope.beData.RebateRulesColl.splice(ind, 1);
            }
        }
    };

    $scope.AddPenaltyRules = function (ind) {
        if ($scope.beData.PenaltyRulesColl) {
            if ($scope.beData.PenaltyRulesColl.length > ind + 1) {
                $scope.beData.PenaltyRulesColl.splice(ind + 1, 0, {
                    PenaltyPer: ''
                })
            } else {
                $scope.beData.PenaltyRulesColl.push({
                    PenaltyPer: ''
                })
            }
        }
    };
    $scope.delPenaltyRules = function (ind) {
        if ($scope.beData.PenaltyRulesColl) {
            if ($scope.beData.PenaltyRulesColl.length > 1) {
                $scope.beData.PenaltyRulesColl.splice(ind, 1);
            }
        }
    };


    $scope.GetEMICalculator = function () {
        $scope.loadingstatus = "running";
        var para = {
            DateStyle: 0,
            Principal: $scope.beData.LoanAmount,
            InterestRate: $scope.beData.InterestRate,
            LoanType: $scope.beData.LoanType,
            PeriodType: $scope.beData.PeriodType,
            Period: $scope.beData.Period
        }
        $http({
            method: 'POST',
            url: base_url + "Finance/Creation/GetEMICalculator",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $timeout(function () {
                    $scope.EMIList = res.data.Data;
                }, 100);
            } else
                Swal.fire(res.data.ResponseMSG);
        }, function (reason) {
            alert('Failed' + reason);
        });
    }


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

  //Get Dues EMI modal js
    $scope.GetDuesEMI = function () {
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
                    $scope.T = {
                        TotalPrincipal: $scope.beData.EMIColl.reduce((sum, x) => sum + (parseFloat(x.Principal) || 0), 0),
                        TotalInterest: $scope.beData.EMIColl.reduce((sum, x) => sum + (parseFloat(x.Interest) || 0), 0)
                    };
                    $scope.beData.Mode = "Modify";
                    $('#EmiDetail').modal('show');
                });
            } else
                Swal.fire(res.data.ResponseMSG);
        }, function (reason) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }


    $scope.IsValidLoanReschedule = function () {
        //if ($scope.beData.LoanAmt.isEmpty()) {
        //    Swal.fire('Please ! Enter Loan Amt');
        //    return false;
        //}
        return true;
    }

    $scope.SaveLoanReschedule = function () {
        if ($scope.IsValidLoanReschedule() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.beData.Mode;
                Swal.fire({
                    title: 'Do you want to ' + saveModify + ' the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    if (result.isConfirmed) {
                        $scope.CallSaveUpdateLoanReschedule();
                    }
                });
            } else
                $scope.CallSaveUpdateLoanReschedule();
        }
    };

    $scope.CallSaveUpdateLoanReschedule = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();


        if ($scope.beData.EntryDateDet) {
            $scope.beData.EntryDate = $filter('date')(new Date($scope.beData.EntryDateDet.dateAD), 'yyyy-MM-dd');
        } else
            $scope.beData.EntryDate = new Date();

        if ($scope.beData.StartDateDet) {
            $scope.beData.StartDate = $filter('date')(new Date($scope.beData.StartDateDet.dateAD), 'yyyy-MM-dd');
        } else
            $scope.beData.StartDate = new Date();


        $http({
            method: 'POST',
            url: base_url + "Finance/Transaction/SaveLoanReschedule",
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
                $scope.ClearData();

            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }



    $scope.SearchDataColl = [];
    $scope.SearchData = function () {

        $scope.loadingstatus = 'running';
        showPleaseWait();
        $scope.paginationOptions.TotalRows = 0;

        var sCol = $scope.paginationOptions.SearchColDet;

        var para = {
            voucherType: VoucherType,
            filter: {
                DateFrom: null,
                DateTo: null,
                PageNumber: $scope.paginationOptions.pageNumber,
                RowsOfPage: $scope.paginationOptions.pageSize,
                SearchCol: (sCol ? sCol.value : ''),
                SearchVal: $scope.paginationOptions.SearchVal,
                SearchType: (sCol ? sCol.searchType : 'text')
            }
        };

        $http({
            method: 'POST',
            url: base_url + "Inventory/Transaction/GetTransactionLst",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                $scope.SearchDataColl = res.data.Data;
                $scope.paginationOptions.TotalRows = res.data.TotalCount;
                $('#searVoucherRightBtn').modal('show');

            } else
                alert(res.data.ResponseMSG);

        }, function (reason) {
            alert('Failed' + reason);
        });


    };
    $scope.PrintVoucher = function (tranId, vid) {
        $scope.lastTranId = tranId;
        $scope.lastVoucherId = vid;
        $scope.Print();
    }
    $scope.Print = function () {
        if ($scope.lastTranId || $scope.lastVoucherId > 0) {
            var TranId = $scope.lastTranId;

            var vId = $scope.lastVoucherId;

            $http({
                method: 'GET',
                url: base_url + "ReportEngine/GetReportTemplates?entityId=" + EntityId + "&voucherId=" + vId + "&isTran=true",
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
                                            printDone = true;

                                            if (rptTranId > 0) {
                                                document.body.style.cursor = 'wait';
                                                document.getElementById("frmRpt").src = '';
                                                document.getElementById("frmRpt").src = base_url + "web/ReportViewer.aspx?rpttranid=" + rptTranId + "&istransaction=true&entityid=" + EntityId + "&voucherid=" + $scope.SelectedVoucher.VoucherId + "&tranid=" + TranId + "&vouchertype=" + VoucherType;
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
                            document.getElementById("frmRpt").src = base_url + "web/ReportViewer.aspx?rpttranid=" + rptTranId + "&istransaction=true&entityid=" + EntityId + "&voucherid=" + $scope.SelectedVoucher.VoucherId + "&tranid=" + TranId + "&vouchertype=" + VoucherType;
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


    };
    $scope.ReSearchData = function (pageInd) {
        if (pageInd && pageInd >= 0)
            $scope.paginationOptions.pageNumber = pageInd;
        else if (pageInd == -1)
            $scope.paginationOptions.pageNumber = 1;

        $scope.loadingstatus = 'running';
        showPleaseWait();
        $scope.paginationOptions.TotalRows = 0;
        var sCol = $scope.paginationOptions.SearchColDet;

        var para = {
            voucherType: VoucherType,
            filter: {
                DateFrom: null,
                DateTo: null,
                PageNumber: $scope.paginationOptions.pageNumber,
                RowsOfPage: $scope.paginationOptions.pageSize,
                SearchCol: (sCol ? sCol.value : ''),
                SearchVal: $scope.paginationOptions.SearchVal,
                SearchType: (sCol ? sCol.searchType : 'text')
            }
        };

        $http({
            method: 'POST',
            url: base_url + "Inventory/Transaction/GetTransactionLst",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                $scope.SearchDataColl = res.data.Data;
                $scope.paginationOptions.TotalRows = res.data.TotalCount;

            } else
                alert(res.data.ResponseMSG);

        }, function (reason) {
            alert('Failed' + reason);
        });

    }

    $scope.AddRebateRules = function (ind) {
        if ($scope.beData.RebateColl) {
            if ($scope.beData.RebateColl.length > ind + 1) {
                $scope.beData.RebateColl.splice(ind + 1, 0, {
                    RebatePer: ''
                })
            } else {
                $scope.beData.RebateColl.push({
                    RebatePer: ''
                })
            }
        }
    };
    $scope.delRebateRules = function (ind) {
        if ($scope.beData.RebateColl) {
            if ($scope.beData.RebateColl.length > 1) {
                $scope.beData.RebateColl.splice(ind, 1);
            }
        }
    };

    $scope.AddPenaltyRules = function (ind) {
        if ($scope.beData.PenaltyColl) {
            if ($scope.beData.PenaltyColl.length > ind + 1) {
                $scope.beData.PenaltyColl.splice(ind + 1, 0, {
                    PenaltyPer: ''
                })
            } else {
                $scope.beData.PenaltyColl.push({
                    PenaltyPer: ''
                })
            }
        }
    };
    $scope.delPenaltyRules = function (ind) {
        if ($scope.beData.PenaltyColl) {
            if ($scope.beData.PenaltyColl.length > 1) {
                $scope.beData.PenaltyColl.splice(ind, 1);
            }
        }
    };


   
});