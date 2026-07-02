app.controller('LoanCreationController', function ($scope, $http, $timeout, $filter, GlobalServices) {
    $scope.Title = 'ReceiptController';
    var glSrv = GlobalServices;
    $scope.confirmMSG = GlobalServices.getConfirmMSG();

    //$scope.sideBarData = [];
    //function Numberformat(val) {
    //    return $filter('number')(val, 2);
    //}
    //function GetDateStr(ny, nm, nd) {
    //    return ny.toString() + '-' + nm.toString().padStart(2, '0') + '-' + nd.toString().padStart(2, '0')
    //}
    //$scope.lastTranId = 0;
    $scope.LoadData = function() {


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

        $scope.CostClassColl = [];
        $http({
            method: 'GET',
            url: base_url + "Account/Creation/GetAllCostClasss",
            dataType: "json"
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.CostClassColl = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $scope.VoucherTypeColl = [];
        $http({
            method: 'GET',
            url: base_url + "Account/Creation/GetVoucherList?voucherType=3",
            dataType: "json"
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.VoucherTypeColl = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });


        $scope.VehicleList = [];
        $http({
            method: 'POST',
            url: base_url + "Finance/Creation/GetAllLoanVehicle",
            dataType: "json"
        }).then(function (res) {
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $timeout(function () {
                    $scope.VehicleList = res.data.Data;
                });
              
            } else
                Swal.fire(res.data.ResponseMSG);
        }, function (reason) {
            alert('Failed' + reason);
        });



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
            VoucherDate_TMP: new Date(),
            LedgerAllocationColl: [],
            Mode: 'Save',
            DocumentColl: [],
            RebateColl: [],
            PenaltyColl: [],
            EMIColl: [],
            VehicleId:null
        };
        $scope.beData.RebateColl.push({});
        $scope.beData.PenaltyColl.push({});
        $scope.GetAutoNumber();
    }



    $scope.GetAutoNumber = function () {
        $scope.loadingstatus = "running";
        $http({
            method: 'GET',
            url: base_url + "Finance/Creation/GetAutoNumber",
            dataType: "json"
        }).then(function (res) {
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $timeout(function () {
                    $scope.beData.AutoNumber = res.data.Data;
                },100);

            } else
                Swal.fire(res.data.ResponseMSG);


        }, function (reason) {
            alert('Failed' + reason);
        });
    }


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
                    $scope.beData.EMIColl = res.data.Data;
                    $scope.T = {
                        TotalPrincipal: $scope.beData.EMIColl.reduce((sum, x) => sum + (parseFloat(x.Principal) || 0), 0),
                        TotalInterest: $scope.beData.EMIColl.reduce((sum, x) => sum + (parseFloat(x.Interest) || 0), 0)
                    };
                }, 100);

            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            alert('Failed' + reason);
        });
    }


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

   
   

    $scope.ClearData = function () {
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
            VoucherDate_TMP: new Date(),
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

        $scope.beData.RebateColl.push({});
        $scope.beData.PenaltyColl.push({});
    };



    $scope.IsValidLoanCreation = function () {
        //if ($scope.beData.LoanAmt.isEmpty()) {
        //    Swal.fire('Please ! Enter Loan Amt');
        //    return false;
        //}
        return true;
    }

    $scope.SaveLoanCreation = function () {
        if ($scope.IsValidLoanCreation() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.beData.Mode;
                Swal.fire({
                    title: 'Do you want to ' + saveModify + ' the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    if (result.isConfirmed) {
                        $scope.CallSaveUpdateLoanCreation();
                    }
                });
            } else
                $scope.CallSaveUpdateLoanCreation();
        }
    };

    $scope.CallSaveUpdateLoanCreation = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();
        var filesColl = $scope.beData.DocumentColl;
        if ($scope.beData.VoucherDateDet) {
            $scope.beData.VoucherDate = $filter('date')(new Date($scope.beData.VoucherDateDet.dateAD), 'yyyy-MM-dd');
        } else
            $scope.beData.VoucherDate = new Date();

        if ($scope.beData.StartDateDet) {
            $scope.beData.StartDate = $filter('date')(new Date($scope.beData.StartDateDet.dateAD), 'yyyy-MM-dd');
            $scope.beData.NY = $scope.beData.StartDateDet.NY;
            $scope.beData.NM = $scope.beData.StartDateDet.NM;
            $scope.beData.ND = $scope.beData.StartDateDet.ND;

        } else
            $scope.beData.StartDate = new Date();

        //Esma date format correct aako theyana. So currenyt date halera save garako xau. Sir eslai melaye denu hola
        if ($scope.beData.EMIColl) {
            $scope.beData.EMIColl.forEach((S) => {
                if (S.EMIDate) {
                  /*  S.EMIDate = $filter('date')(new Date(S.EMIDate.dateAD), 'yyyy-MM-dd');*/
                    S.EMIDate = new Date();
                    S.NY = S.EMIDate.NY;
                    S.NM = S.EMIDate.NM;
                    S.ND = S.EMIDate.ND;
                }
            });
        }

        $http({
            method: 'POST',
            url: base_url + "Finance/Creation/SaveLoanCreation",
            headers: { 'Content-Type': undefined },
            transformRequest: function (data) {
                var formData = new FormData();
                formData.append("jsonData", angular.toJson(data.jsonData));
                if (data.files) {
                    for (var i = 0; i < data.files.length; i++) {
                        formData.append("file" + i, data.files[i].File);
                    }
                }
                return formData;
            },
            data: { jsonData: $scope.beData, files: filesColl }
        }).then(function (res) {
            $scope.loadingstatus = "stop";
            hidePleaseWait();
            Swal.fire(res.data.ResponseMSG);
            if (res.data.IsSuccess == true) {
                $scope.ClearVehicleDetail();

            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }



    $scope.GetLoanCreationById = function (beData) {
        $scope.loadingstatus = "running";
        var para = {
            baseDate: 0
        };
        $http({
            method: 'Get',
            url: base_url + "Finance/Creation/GetLoanDetailsByTranId",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.beData = res.data.Data;

                if ($scope.beData.StartDate)
                    $scope.beData.StartDate_TMP = new Date($scope.beData.StartDate);

                if (!$scope.beData.PenaltyColl || $scope.beData.PenaltyColl.length == 0) {
                    $scope.beData.PenaltyColl = [];
                    $scope.beData.PenaltyColl.push({});
                }

                if (!$scope.beData.RebateColl || $scope.beData.RebateColl.length == 0) {
                    $scope.beData.RebateColl = [];
                    $scope.beData.RebateColl.push({});
                }
                                
                $scope.beData.Mode = 'Modify';
                $('#searVoucherRightBtn').modal('hide');
            } else
                Swal.fire(res.data.ResponseMSG);


        }, function (reason) {
            alert('Failed' + reason);
        });
    }


    $scope.DelLoanCreation = function (refData, ind) {
        Swal.fire({
            title: 'Are you sure you want to delete ' + refData.TranId + '?',
            showCancelButton: true,
            confirmButtonText: 'Delete',
        }).then((result) => {
            if (result.isConfirmed) {
                var para = { TranId: refData.TranId };
                $http({
                    method: 'POST',
                    url: base_url + "Finance/Creation/DeleteLoanCreation",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingStatus = "stop";
                    $scope.GetAllLoanCreation();
                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess == true) {
                        $scope.SearchDataColl.splice(ind, 1);
                    }
                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }
        });
    }


    $scope.Clear = function () {
        Swal.fire({
            title: 'Are you sure?',
            text: " clear current data !",
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes !'

        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                $scope.ClearData();
            }
        });
    };
  
    $scope.GetAllLoanCreation = function () {
        $scope.loadingstatus = "running";
        $http({
            method: 'POST',
            url: base_url + "Finance/Creation/GetAllLoanCreation",
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

    $scope.GetLoanCreationById = function (beData) {
        $scope.loadingstatus = "running";
        var para = {
            TranId : beData.TranId
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
                    if ($scope.beData.VoucherDate) {
                        $scope.beData.VoucherDate_TMP = new Date($scope.beData.VoucherDate);
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
    //$scope.ReSearchData = function (pageInd) {
    //    if (pageInd && pageInd >= 0)
    //        $scope.paginationOptions.pageNumber = pageInd;
    //    else if (pageInd == -1)
    //        $scope.paginationOptions.pageNumber = 1;

    //    $scope.loadingstatus = 'running';
    //    showPleaseWait();
    //    $scope.paginationOptions.TotalRows = 0;
    //    var sCol = $scope.paginationOptions.SearchColDet;

    //    var para = {
    //        voucherType: VoucherType,
    //        filter: {
    //            DateFrom: null,
    //            DateTo: null,
    //            PageNumber: $scope.paginationOptions.pageNumber,
    //            RowsOfPage: $scope.paginationOptions.pageSize,
    //            SearchCol: (sCol ? sCol.value : ''),
    //            SearchVal: $scope.paginationOptions.SearchVal,
    //            SearchType: (sCol ? sCol.searchType : 'text')
    //        }
    //    };

    //    $http({
    //        method: 'POST',
    //        url: base_url + "Inventory/Transaction/GetTransactionLst",
    //        dataType: "json",
    //        data: JSON.stringify(para)
    //    }).then(function (res) {
    //        $scope.loadingstatus = 'stop';
    //        hidePleaseWait();

    //        if (res.data.IsSuccess && res.data.Data) {
    //            $scope.SearchDataColl = res.data.Data;
    //            $scope.paginationOptions.TotalRows = res.data.TotalCount;

    //        } else
    //            alert(res.data.ResponseMSG);

    //    }, function (reason) {
    //        alert('Failed' + reason);
    //    });

    //}
});