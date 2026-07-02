
app.controller("LedgerVoucherCntrl", function ($scope, $http, $filter, $timeout, GlobalServices, $compile) {
    var PrintPreviewAs = 1;

    // Context menu element
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
    $scope.toggleExpandCollapse = function () {
        if ($scope.LedgerVoucher.ExpandCollapse == true) {
            $scope.gridOptions.api.expandAll();
        } else {
            $scope.gridOptions.api.collapseAll();
        }
    };
    function LoadData() {
        $('.select2').select2({
            allowClear: true,
            openOnEnter: true
        });
        $scope.searchFields = {
            Purchase: ''
        };
        $scope.perPage = {
            ReceiptNote: GlobalServices.getPerPageRow(),
        };
        $scope.currentPages = {
            ReceiptNote: 1
        };
        $scope.searchData = {
            ReceiptNote: ''
        };

        $scope.RefTableColColl = GlobalServices.getRptTableColColl();

       /* GetCustomRptColumns();*/

        $scope.InterestCalculationOnColl = [{ id: 1, text: 'Debit Balance' }, { id: 2, text: 'Credit Balance' }];

        $scope.CostClassColl = [];
        $http({
            method: 'GET',
            url: base_url + "Account/Creation/GetCostClassForEntry",
            dataType: "json"
        }).then(function (res1) {
            if (res1.data.IsSuccess && res1.data.Data) {
                $scope.CostClassColl = res1.data.Data;                 
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
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


        $scope.LedgerVoucher = {
            DateFrom_TMP: new Date(),
            DateTo_TMP: new Date(),
            VoucherId: 0,
            IsPost: true,
            BranchId: 0,
            IsSummary:true,
            LedgerDetails: {},
            showRelatedLC: false,
            showInventory: false,
            showLedgerAllocation: false,
            showNarration: true,
            showCostCenter: false,
            showBillDetails:false,
        };

        $scope.EPDet = {};
        $scope.EPColl = [];
        //GlobalServices.getRptEntityProperties(EntityId).then(function (res) {
        //    if (res.data.IsSuccess && res.data.Data) {
        //        $scope.EPColl = res.data.Data;
        //        angular.forEach($scope.EPColl, function (ep) {
        //            $scope.EPDet[ep.Name] = ep;

        //            if (ep.DataType == 'DateTime') {
        //                if (ep.DefaultValue) {
        //                    $scope.LedgerVoucher[ep.Name] = new Date(ep.DefaultValue);
        //                }                        
        //            } else {
        //                $scope.LedgerVoucher[ep.Name] = ep.DefaultValue;
        //            } 
        //        });
        //    }
        //}, function (reason) {
        //    Swal.fire('Failed' + reason);
        //});
        //$scope.ButtonED = {};
        //GlobalServices.getButtonDisabled(EntityId).then(function (res) {
        //    if (res.data.IsSuccess && res.data.Data) {
        //        $scope.ButtonED = res.data.Data;
        //    }
        //}, function (reason) {
        //    Swal.fire('Failed' + reason);
        //});


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
                     
                    $timeout(function () {
                        if (SelectedLedgerId && SelectedLedgerId > 0) {
                            $scope.LedgerVoucher.LedgerId = SelectedLedgerId;
                            $scope.GetLedgerVoucher();
                        }
                    });

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


        $scope.columnDefs = [
            
            {
                headerName: "Date", width: 150, dataType: 'DateTime', cellRenderer: 'agGroupCellRenderer',
                valueGetter: function (params) {
                    var beData = params.data;
                    if (beData.IsParent) {
                        return beData.VoucherDate;
                    }
                    return null;
                },
                valueFormatter: function (params) { return DateFormatAD(params.value); },
                filter: 'agDateColumnFilter', pinned: 'left',
                //cellRendererParams: {
                //    checkbox: true, // Enable checkbox in the group row
                //},
                //checkboxSelection: true,
            },
            {
                headerName: "Miti", width: 110, dataType: 'DateTime', valueGetter: function (params) {
                    var beData = params.data;
                    if (beData.IsParent) {
                        return beData.NVoucherDate;
                    } else {
                        return "";
                    }
                    //return DateFormatBS(params.data.NY, params.data.NM, params.data.ND);
                },
                filter: 'agTextColumnFilter', pinned: 'left'
            },
            {
                headerName: "Particular's", width: 230, dataType: 'Text',
                valueGetter: function (params) {
                    var beData = params.data;

                    if (beData.IsParent) {
                        return beData.Particulars;
                    }
                    else {
                        if (beData.RowType) {

                            if (beData.RowType == 'LedgerAllocation') {
                                return "  "+beData.LedgerName;
                            } else if (beData.RowType == 'ItemAllocation') {

                                var fixedProduct = beData.ProductName;

                                if (beData.RegdNo && !beData.RegdNo.isEmpty())
                                    fixedProduct = fixedProduct + " Regd:-" + beData.RegdNo;

                                if (beData.EngineNo && !beData.EngineNo.isEmpty())
                                    fixedProduct = fixedProduct + " Eng:-" + beData.EngineNo;

                                if (beData.ChassisNo && !beData.ChassisNo.isEmpty())
                                    fixedProduct = fixedProduct + " Chass:-" + beData.ChassisNo;

                                if (beData.Model && !beData.Model.isEmpty())
                                    fixedProduct = fixedProduct + " Model:-" + beData.Model;

                                return "  => " + fixedProduct;
                            } else if (beData.RowType == 'BillDetails') {
                                return "  " + "(" + beData.VoucherDetails + " :- Rs." + beData.Amount + " / " + beData.Remarks + " ) ";;
                            }
                            else
                                return params.data;

                        } else
                            return params.data;
                    }
                        
                },
                filter: 'agTextColumnFilter', pinned: 'left'
            },
            { headerName: "VoucherType", width: 130, field: "VoucherName", dataType: 'Text', filter: 'agTextColumnFilter', },
            { headerName: "Voucher No.", width: 130, field: "AutoManualNo", dataType: 'Text', filter: 'agTextColumnFilter', },
            { headerName: "Ref.No.", width: 120, field: "RefNo", dataType: 'Text', filter: 'agTextColumnFilter', },

            
           
            {
                headerName: "Debit", width: 150, dataType: 'Number', filter: "agNumberColumnFilter",
                valueGetter: function (params) {
                    var beData = params.data;

                    if (beData.IsParent) {
                        return beData.DebitAmt;
                    }
                    else
                        return 0;

                },
                valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' }, footerTemplate: '<div>totaal: #= sum #</div>',
                filter: 'agNumberColumnFilter',
            },
            {
                headerName: "Credit", width: 150, dataType: 'Number', filter: "agNumberColumnFilter",
                valueGetter: function (params) {
                    var beData = params.data;
                    if (beData.IsParent) {
                        return beData.CreditAmt;
                    }
                    else
                        return 0;

                },
                valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' }, footerTemplate: '<div>totaal: #= sum #</div>',
                filter: 'agNumberColumnFilter',
            },
            {
                headerName: "Current Closing", width: 150, dataType: 'Number', filter: "agNumberColumnFilter",
                valueGetter: function (params) {
                    var beData = params.data;
                    if (beData.IsParent) {
                        return beData.CurrentClosing;
                    }
                    return 0;
                },
                valueFormatter: function (params) { return NumberformatAC(params.value); }, cellStyle: { 'text-align': 'right' }, footerTemplate: '<div>totaal: #= sum #</div>',
                filter: 'agNumberColumnFilter',
            },
            {
                headerName: "Qty", width: 110, dataType: 'Number', filter: "agNumberColumnFilter",
                valueGetter: function (params) {
                    var beData = params.data;
                    if (beData.RowType == 'ItemAllocation') {
                        return beData.AQty + ' ' + beData.UnitName;
                    }
                },
                valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' }, footerTemplate: '<div>totaal: #= sum #</div>',
                filter: 'agNumberColumnFilter',
            },
            {
                headerName: "Rate", width: 130, dataType: 'Number', filter: "agNumberColumnFilter",
                valueGetter: function (params) {
                    var beData = params.data;
                    if (beData.RowType == 'ItemAllocation') {
                        return beData.Rate;
                    } else
                        return '';

                },
                valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' }, footerTemplate: '<div>totaal: #= sum #</div>',
                filter: 'agNumberColumnFilter',
            },
            {
                headerName: "Amount", width: 140, dataType: 'Number', filter: "agNumberColumnFilter",
                valueGetter: function (params) {
                    var beData = params.data;
                    if (beData.RowType == 'ItemAllocation') {
                        return beData.Amount;
                    } else if (beData.RowType == 'LedgerAllocation')
                    {
                        return beData.DebitAmt-beData.CreditAmt;
                    }
                    else
                        return '';
                },
                valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' }, footerTemplate: '<div>totaal: #= sum #</div>',
                filter: 'agNumberColumnFilter',
            },
            { headerName: "CostClass", width: 120, dataType: 'Text', field: "CostClassName" },
            { headerName: "User", width: 120, dataType: 'Text', field: "UserName" },
            { headerName: "Narration", width: 150, dataType: 'Text', field: "Narration" },
            {
                headerName: "Age", width: 110, dataType: 'Number', filter: "agNumberColumnFilter",
                valueGetter: function (params) {
                    var beData = params.data;
                    if (beData.IsParent == true && beData.VoucherAge) {
                        return beData.VoucherAge;
                    } else
                        return '';
                },
                cellStyle: { 'text-align': 'center' }, footerTemplate: '<div>totaal: #= sum #</div>',
                filter: 'agNumberColumnFilter',
            },
            {
                headerName: "Dues Amt.", width: 120, dataType: 'Number', filter: "agNumberColumnFilter",
                valueGetter: function (params) {
                    var beData = params.data;
                    if (beData.IsParent == true) {
                        return beData.DuesAmt;
                    } else
                        return '';
                },
                valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' }, footerTemplate: '<div>totaal: #= sum #</div>',
                filter: 'agNumberColumnFilter',
            },
            //{
            //    headerName: "Action", width: 150, cellRenderer:
            //        function (params) {

            //            var voucherName = params.data.VoucherName;

            //            if (voucherName) {

            //                if (params.data.VoucherType < 5) {
            //                    return '<a class="btn btn-default btn-xs" ng-click="ShowDocument(this.data)"><i class="fas fa-file text-info"></i></a> <a class="btn btn-default btn-xs" ng-click="PrintVoucher(' + params.data.TranId + ',' + params.data.VoucherType + ',' + params.data.VoucherId + ')"><i class="fas fa-print text-info"></i></a>';
            //                } else {
            //                    return '<a class="btn btn-default btn-xs" ng-click="ShowDocument(this.data)"><i class="fas fa-file text-info"></i></a> <a class="btn btn-default btn-xs" ng-click="PrintVoucher(' + params.data.TranId + ',' + params.data.VoucherType + ',' + params.data.VoucherId + ')"><i class="fas fa-print text-info"></i></a>';
            //                }

            //                //if (params.data.VoucherType < 5) {
            //                //    return '<a class="btn btn-default btn-xs" href="' + base_url + 'Account/Transaction/' + voucherName + '?TranId={{' + params.data.TranId + '}}"><i class="fas fa-edit text-info"></i></a>' +
            //                //        '<a class="btn btn-default btn-xs" ng-click="PrintVoucher(' + params.data.TranId + ',' + params.data.VoucherType + ',' + params.data.VoucherId + ')"><i class="fas fa-print text-info"></i></a>' +
            //                //        '<a class="btn btn-default btn-xs" ng-click="deleteVoucher(' + params.data.TranId + ',' + params.data.VoucherType + ',' + params.data.VoucherId + ',\'' + voucherName + '\'' + ', \'' + params.data.AutoManualNo + '\')"><i class="fas fa-trash-alt text-danger"></i></a>';
            //                //} else {
            //                //    return '<a class="btn btn-default btn-xs" href="' + base_url + 'Inventory/Transaction/' + voucherName + '?TranId={{' + params.data.TranId + '}}"><i class="fas fa-edit text-info"></i></a>' +
            //                //        '<a class="btn btn-default btn-xs" ng-click="PrintVoucher(' + params.data.TranId + ',' + params.data.VoucherType + ',' + params.data.VoucherId + ')"><i class="fas fa-print text-info"></i></a>' +
            //                //        '<a class="btn btn-default btn-xs" ng-click="deleteVoucher(' + params.data.TranId + ',' + params.data.VoucherType + ',' + params.data.VoucherId + ',\'' + voucherName + '\'' + ', \'' + params.data.AutoManualNo + '\')"><i class="fas fa-trash-alt text-danger"></i></a>';
            //                //}

            //            } else {
            //                return '';
            //            }
            //        }
            //},
            { headerName: "Modify By", width: 100, field: "ModifyBy" },
            { headerName: "Post By", width: 100, field: "PostBy" },
            { headerName: "Payment Term", width: 150, field: "TermsOfPayment_BankName" },
            { headerName: "Branch", width: 150, field: "Branch", filter: "agTextColumnFilter", },
            {
                headerName: "Tran. Amount", width: 150, dataType: 'VoucherAmt', filter: "agNumberColumnFilter",
                valueGetter: function (params) {
                    var beData = params.data;
                    if (beData.IsParent) {
                        return beData.VoucherAmt;
                    }
                    else
                        return 0;
                },
                valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' }, footerTemplate: '<div>totaal: #= sum #</div>',
                filter: 'agNumberColumnFilter',
            },
            //OTHERS=0,VAT = 1,TSC = 2,EXCISE = 3,CST = 4,TDS = 5,SCHEME = 6,FREIGHT = 7,INSURANCE = 8,ROUNDOFF = 9,DISCOUNT = 10,
            //LABOURCHARGE = 11,EXTRACHARGE = 12,ASSETS = 13,CUSTOM_SERVICE_CHARGE = 14,IMPORT_DUTY = 15,ADITIONAL_IMPORT_DUTY = 16,
            //SGST = 17,CGST = 18,LoadingUnLoading = 19,OTHERS1 = 20,OTHERS2 = 21,OTHERS3 = 22,OTHERS4 = 23,OTHERS5 = 24,IGST = 25,CUSTOMER = 26,VENDOR = 27

            {
                headerName: "OTHERS Amt.", width: 140, dataType: 'Number', filter: "agNumberColumnFilter", hide: true, colId: 'ledDet0',
                valueGetter: function (params) {
                    var beData = params.data;
                    if (beData.VoucherAllocationColl && beData.VoucherAllocationColl.length > 0)
                    {
                        return beData.VoucherAllocationColl[0];
                    }
                    else
                        return 0;
                },
                valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' }, footerTemplate: '<div>totaal: #= sum #</div>',
                filter: 'agNumberColumnFilter',
            },
            {
                headerName: "VAT Amt.", width: 140, dataType: 'Number', filter: "agNumberColumnFilter", hide: true, colId: 'ledDet1',
                valueGetter: function (params) {
                    var beData = params.data;
                    if (beData.VoucherAllocationColl && beData.VoucherAllocationColl.length > 0) {
                        return beData.VoucherAllocationColl[1];
                    }
                    else
                        return 0;
                },
                valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' }, footerTemplate: '<div>totaal: #= sum #</div>',
                filter: 'agNumberColumnFilter',
            },
            {
                headerName: "TSC Amt.", width: 140, dataType: 'Number', filter: "agNumberColumnFilter", hide: true, colId: 'ledDet2',
                valueGetter: function (params) {
                    var beData = params.data;
                    if (beData.VoucherAllocationColl && beData.VoucherAllocationColl.length > 0) {
                        return beData.VoucherAllocationColl[2];
                    }
                    else
                        return 0;
                },
                valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' }, footerTemplate: '<div>totaal: #= sum #</div>',
                filter: 'agNumberColumnFilter',
            },
            {
                headerName: "EXCISE Amt.", width: 140, dataType: 'Number', filter: "agNumberColumnFilter", hide: true, colId: 'ledDet3',
                valueGetter: function (params) {
                    var beData = params.data;
                    if (beData.VoucherAllocationColl && beData.VoucherAllocationColl.length > 0) {
                        return beData.VoucherAllocationColl[3];
                    }
                    else
                        return 0;
                },
                valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' }, footerTemplate: '<div>totaal: #= sum #</div>',
                filter: 'agNumberColumnFilter',
            },
            {
                headerName: "CST Amt.", width: 140, dataType: 'Number', filter: "agNumberColumnFilter", hide: true, colId: 'ledDet4',
                valueGetter: function (params) {
                    var beData = params.data;
                    if (beData.VoucherAllocationColl && beData.VoucherAllocationColl.length > 0) {
                        return beData.VoucherAllocationColl[4];
                    }
                    else
                        return 0;
                },
                valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' }, footerTemplate: '<div>totaal: #= sum #</div>',
                filter: 'agNumberColumnFilter',
            },            
            {
                headerName: "TDS Amt.", width: 140, dataType: 'Number', filter: "agNumberColumnFilter", hide: true, colId: 'ledDet5',
                valueGetter: function (params) {
                    var beData = params.data;
                    if (beData.VoucherAllocationColl && beData.VoucherAllocationColl.length > 0) {
                        return beData.VoucherAllocationColl[5];
                    }
                    else
                        return 0;
                },
                valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' }, footerTemplate: '<div>totaal: #= sum #</div>',
                filter: 'agNumberColumnFilter',
            },
            {
                headerName: "SCHEME Amt.", width: 140, dataType: 'Number', filter: "agNumberColumnFilter", hide: true, colId: 'ledDet6',
                valueGetter: function (params) {
                    var beData = params.data;
                    if (beData.VoucherAllocationColl && beData.VoucherAllocationColl.length > 0) {
                        return beData.VoucherAllocationColl[6];
                    }
                    else
                        return 0;
                },
                valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' }, footerTemplate: '<div>totaal: #= sum #</div>',
                filter: 'agNumberColumnFilter',
            },
            {
                headerName: "FREIGHT Amt.", width: 140, dataType: 'Number', filter: "agNumberColumnFilter", hide: true, colId: 'ledDet7',
                valueGetter: function (params) {
                    var beData = params.data;
                    if (beData.VoucherAllocationColl && beData.VoucherAllocationColl.length > 0) {
                        return beData.VoucherAllocationColl[7];
                    }
                    else
                        return 0;
                },
                valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' }, footerTemplate: '<div>totaal: #= sum #</div>',
                filter: 'agNumberColumnFilter',
            },
            {
                headerName: "INSURANCE Amt.", width: 140, dataType: 'Number', filter: "agNumberColumnFilter", hide: true, colId: 'ledDet8',
                valueGetter: function (params) {
                    var beData = params.data;
                    if (beData.VoucherAllocationColl && beData.VoucherAllocationColl.length > 0) {
                        return beData.VoucherAllocationColl[8];
                    }
                    else
                        return 0;
                },
                valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' }, footerTemplate: '<div>totaal: #= sum #</div>',
                filter: 'agNumberColumnFilter',
            },
            
            {
                headerName: "ROUNDOFF Amt.", width: 140, dataType: 'Number', filter: "agNumberColumnFilter", hide: true, colId: 'ledDet9',
                valueGetter: function (params) {
                    var beData = params.data;
                    if (beData.VoucherAllocationColl && beData.VoucherAllocationColl.length > 0) {
                        return beData.VoucherAllocationColl[9];
                    }
                    else
                        return 0;
                },
                valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' }, footerTemplate: '<div>totaal: #= sum #</div>',
                filter: 'agNumberColumnFilter',
            },
            {
                headerName: "DISCOUNT Amt.", width: 140, dataType: 'Number', filter: "agNumberColumnFilter", hide: true, colId: 'ledDet10',
                valueGetter: function (params) {
                    var beData = params.data;
                    if (beData.VoucherAllocationColl && beData.VoucherAllocationColl.length > 0) {
                        return beData.VoucherAllocationColl[10];
                    }
                    else
                        return 0;
                },
                valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' }, footerTemplate: '<div>totaal: #= sum #</div>',
                filter: 'agNumberColumnFilter',
            },
            {
                headerName: "LABOURCHARGE Amt.", width: 140, dataType: 'Number', filter: "agNumberColumnFilter", hide: true, colId: 'ledDet11',
                valueGetter: function (params) {
                    var beData = params.data;
                    if (beData.VoucherAllocationColl && beData.VoucherAllocationColl.length > 0) {
                        return beData.VoucherAllocationColl[11];
                    }
                    else
                        return 0;
                },
                valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' }, footerTemplate: '<div>totaal: #= sum #</div>',
                filter: 'agNumberColumnFilter',
            },
            {
                headerName: "EXTRACHARGE Amt.", width: 140, dataType: 'Number', filter: "agNumberColumnFilter", hide: true, colId: 'ledDet12',
                valueGetter: function (params) {
                    var beData = params.data;
                    if (beData.VoucherAllocationColl && beData.VoucherAllocationColl.length > 0) {
                        return beData.VoucherAllocationColl[12];
                    }
                    else
                        return 0;
                },
                valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' }, footerTemplate: '<div>totaal: #= sum #</div>',
                filter: 'agNumberColumnFilter',
            },
            {
                headerName: "ASSETS Amt.", width: 140, dataType: 'Number', filter: "agNumberColumnFilter", hide: true, colId: 'ledDet13',
                valueGetter: function (params) {
                    var beData = params.data;
                    if (beData.VoucherAllocationColl && beData.VoucherAllocationColl.length > 0) {
                        return beData.VoucherAllocationColl[13];
                    }
                    else
                        return 0;
                },
                valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' }, footerTemplate: '<div>totaal: #= sum #</div>',
                filter: 'agNumberColumnFilter',
            },
            
            
            {
                headerName: "CUSTOM_SERVICE_CHARGE Amt.", width: 140, dataType: 'Number', filter: "agNumberColumnFilter", hide: true, colId: 'ledDet14',
                valueGetter: function (params) {
                    var beData = params.data;
                    if (beData.VoucherAllocationColl && beData.VoucherAllocationColl.length > 0) {
                        return beData.VoucherAllocationColl[14];
                    }
                    else
                        return 0;
                },
                valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' }, footerTemplate: '<div>totaal: #= sum #</div>',
                filter: 'agNumberColumnFilter',
            },
            {
                headerName: "IMPORT_DUTY Amt.", width: 140, dataType: 'Number', filter: "agNumberColumnFilter", hide: true, colId: 'ledDet15',
                valueGetter: function (params) {
                    var beData = params.data;
                    if (beData.VoucherAllocationColl && beData.VoucherAllocationColl.length > 0) {
                        return beData.VoucherAllocationColl[15];
                    }
                    else
                        return 0;
                },
                valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' }, footerTemplate: '<div>totaal: #= sum #</div>',
                filter: 'agNumberColumnFilter',
            },
            {
                headerName: "ADITIONAL_IMPORT_DUTY Amt.", width: 140, dataType: 'Number', filter: "agNumberColumnFilter", hide: true, colId: 'ledDet16',
                valueGetter: function (params) {
                    var beData = params.data;
                    if (beData.VoucherAllocationColl && beData.VoucherAllocationColl.length > 0) {
                        return beData.VoucherAllocationColl[16];
                    }
                    else
                        return 0;
                },
                valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' }, footerTemplate: '<div>totaal: #= sum #</div>',
                filter: 'agNumberColumnFilter',
            },
            {
                headerName: "SGST Amt.", width: 140, dataType: 'Number', filter: "agNumberColumnFilter", hide: true, colId: 'ledDet17',
                valueGetter: function (params) {
                    var beData = params.data;
                    if (beData.VoucherAllocationColl && beData.VoucherAllocationColl.length > 0) {
                        return beData.VoucherAllocationColl[17];
                    }
                    else
                        return 0;
                },
                valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' }, footerTemplate: '<div>totaal: #= sum #</div>',
                filter: 'agNumberColumnFilter',
            },
            {
                headerName: "CGST Amt.", width: 140, dataType: 'Number', filter: "agNumberColumnFilter", hide: true, colId: 'ledDet18',
                valueGetter: function (params) {
                    var beData = params.data;
                    if (beData.VoucherAllocationColl && beData.VoucherAllocationColl.length > 0) {
                        return beData.VoucherAllocationColl[18];
                    }
                    else
                        return 0;
                },
                valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' }, footerTemplate: '<div>totaal: #= sum #</div>',
                filter: 'agNumberColumnFilter',
            },
            
            {
                headerName: "LoadingUnLoading Amt.", width: 140, dataType: 'Number', filter: "agNumberColumnFilter", hide: true, colId: 'ledDet19',
                valueGetter: function (params) {
                    var beData = params.data;
                    if (beData.VoucherAllocationColl && beData.VoucherAllocationColl.length > 0) {
                        return beData.VoucherAllocationColl[19];
                    }
                    else
                        return 0;
                },
                valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' }, footerTemplate: '<div>totaal: #= sum #</div>',
                filter: 'agNumberColumnFilter',
            },
            {
                headerName: "OTHERS1 Amt.", width: 140, dataType: 'Number', filter: "agNumberColumnFilter", hide: true, colId: 'ledDet20',
                valueGetter: function (params) {
                    var beData = params.data;
                    if (beData.VoucherAllocationColl && beData.VoucherAllocationColl.length > 0) {
                        return beData.VoucherAllocationColl[20];
                    }
                    else
                        return 0;
                },
                valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' }, footerTemplate: '<div>totaal: #= sum #</div>',
                filter: 'agNumberColumnFilter',
            },
            {
                headerName: "OTHERS2 Amt.", width: 140, dataType: 'Number', filter: "agNumberColumnFilter", hide: true, colId: 'ledDet21',
                valueGetter: function (params) {
                    var beData = params.data;
                    if (beData.VoucherAllocationColl && beData.VoucherAllocationColl.length > 0) {
                        return beData.VoucherAllocationColl[21];
                    }
                    else
                        return 0;
                },
                valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' }, footerTemplate: '<div>totaal: #= sum #</div>',
                filter: 'agNumberColumnFilter',
            },
            {
                headerName: "OTHERS3 Amt.", width: 140, dataType: 'Number', filter: "agNumberColumnFilter", hide: true, colId: 'ledDet22',
                valueGetter: function (params) {
                    var beData = params.data;
                    if (beData.VoucherAllocationColl && beData.VoucherAllocationColl.length > 0) {
                        return beData.VoucherAllocationColl[22];
                    }
                    else
                        return 0;
                },
                valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' }, footerTemplate: '<div>totaal: #= sum #</div>',
                filter: 'agNumberColumnFilter',
            },            
            {
                headerName: "OTHERS4 Amt.", width: 140, dataType: 'Number', filter: "agNumberColumnFilter", hide: true, colId: 'ledDet23',
                valueGetter: function (params) {
                    var beData = params.data;
                    if (beData.VoucherAllocationColl && beData.VoucherAllocationColl.length > 0) {
                        return beData.VoucherAllocationColl[23];
                    }
                    else
                        return 0;
                },
                valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' }, footerTemplate: '<div>totaal: #= sum #</div>',
                filter: 'agNumberColumnFilter',
            },
            {
                headerName: "OTHERS5 Amt.", width: 140, dataType: 'Number', filter: "agNumberColumnFilter", hide: true, colId: 'ledDet24',
                valueGetter: function (params) {
                    var beData = params.data;
                    if (beData.VoucherAllocationColl && beData.VoucherAllocationColl.length > 0) {
                        return beData.VoucherAllocationColl[24];
                    }
                    else
                        return 0;
                },
                valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' }, footerTemplate: '<div>totaal: #= sum #</div>',
                filter: 'agNumberColumnFilter',
            },
            {
                headerName: "IGST Amt.", width: 140, dataType: 'Number', filter: "agNumberColumnFilter", hide: true, colId: 'ledDet25',
                valueGetter: function (params) {
                    var beData = params.data;
                    if (beData.VoucherAllocationColl && beData.VoucherAllocationColl.length > 0) {
                        return beData.VoucherAllocationColl[25];
                    }
                    else
                        return 0;
                },
                valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' }, footerTemplate: '<div>totaal: #= sum #</div>',
                filter: 'agNumberColumnFilter',
            },
            {
                headerName: "CUSTOMER Amt.", width: 140, dataType: 'Number', filter: "agNumberColumnFilter", hide: true, colId: 'ledDet26',
                valueGetter: function (params) {
                    var beData = params.data;
                    if (beData.VoucherAllocationColl && beData.VoucherAllocationColl.length > 0) {
                        return beData.VoucherAllocationColl[26];
                    }
                    else
                        return 0;
                },
                valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' }, footerTemplate: '<div>totaal: #= sum #</div>',
                filter: 'agNumberColumnFilter',
            },
            {
                headerName: "VENDOR Amt.", width: 140, dataType: 'Number', filter: "agNumberColumnFilter", hide: true, colId: 'ledDet27',
                valueGetter: function (params) {
                    var beData = params.data;
                    if (beData.VoucherAllocationColl && beData.VoucherAllocationColl.length > 0) {
                        return beData.VoucherAllocationColl[27];
                    }
                    else
                        return 0;
                },
                valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' }, footerTemplate: '<div>totaal: #= sum #</div>',
                filter: 'agNumberColumnFilter',
            },

            {
                headerName: "Action",
                width: 50,
                cellRenderer: function (params) {
                    return '<div class="btn-group" style="position: fixed; ">' +
                        '<button type="button" class="btn btn-default px-1 dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
                        '<span class="caret"></span>' +
                        '</button>' +
                        '<ul class="dropdown-menu dropdown-menu-right p-2" style="position: absolute; left: 0;">' +
                        '<li><a data-toggle="tooltip" data-placement="top" title="Show Document" ng-click="ShowDocument(this.data)"><i class="fas fa-file text-info"></i> Show Document</a>  </li>' +
                        '<li><a data-toggle="tooltip" data-placement="top" title="Print" ng-click="PrintVoucher(' + params.data.TranId + ',' + params.data.VoucherType + ',' + params.data.VoucherId + ')"><i class="fas fa-print text-info"></i> Print</a></li>' +                        
                        '<li ng-hide="this.data.VoucherType==14 && ButtonED.IRD == true"><a data-toggle="tooltip" data-placement="top" title="Cancel" ng-click="CancelModal(this)"><i class="fa fa-times text-danger"></i> Cancel</a> </li>' +                        
                        '<li ng-hide="this.data.VoucherType==14 && ButtonED.IRD == true"><a data-toggle="tooltip" data-placement="top" title="Delete Voucher" ng-click="deleteVoucher(this)"><i class="fas fa-trash-alt text-danger"></i> Delete</a></li>' +
                        '<li><a data-toggle="tooltip" data-placement="top" title="Show Voucher" ng-click="ShowVoucher(this)"><i class="fas fa-info text-infor"></i> Show Voucher</a></li>' +
                        '<li><a data-toggle="tooltip" data-placement="top" title="Show Transaction Relation" ng-click="ShowTranRelation(this.data)"><i class="fas fa-info text-infor"></i> Show Relation</a></li>' +
                        '<li ng-show="this.data.VoucherType==3 || this.data.VoucherType==2"><a data-toggle="tooltip" data-placement="top" title="Tag With Purchase Invoice" ng-click="GetPurchaseList(this.data)"><i class="fa fa-info text-info"></i> Tag PI</a> </li>' +
                        '<li ng-show="this.data.VoucherType==3 || this.data.VoucherType==2"><a data-toggle="tooltip" data-placement="top" title="Un-Tag From Purchase Invoice" ng-click="UnTagJournal(this.data)"><i class="fa fa-info text-info"></i> Un-Tag PI</a> </li>' +
                        '</ul>' +
                        '</div>';
                },
                pinned: 'right'
            },
            
        ];


        $scope.gridOptions = {
            onCellContextMenu: onCellContextMenu, // Handle right-click event
            angularCompileRows: true,
            // a default column definition with properties that get applied to every column
            defaultColDef: {
                filter: true,
                resizable: true,
                sortable: true,
                //rowSelection:true,
                // set every column width
                width: 90,                
            },
            columnDefs: $scope.columnDefs,
			overlayLoadingTemplate: "Please Click the Load Bottom to display the data",
            enableColResize: true,
            rowData: null,
            filter: true,
            enableFilter: true,            
            //rowSelection: 'multiple', // Enable row selection            
            rowSelection: 'single', // Enable row selection            
            suppressHorizontalScroll: true,
            groupSelectsChildren: true,
            suppressRowClickSelection: false,           
            alignedGrids: [],
            treeData:true,
            onCellKeyDown: (event) => {
                if (event.event.key === 'Delete') {
                    var cell = $scope.gridOptions.api.getFocusedCell();
                    if (cell) {
                        var rowInd = cell.rowIndex;
                        if (rowInd >= 0)
                        {
                            var selectData = $scope.gridOptions.api.getDisplayedRowAtIndex(rowInd).data;
                            if (selectData) {
                                rowInd = $scope.RptDataColl.findIndex(p1 => p1.TranId == selectData.TranId && p1.VoucherId == selectData.VoucherId);
                            }

                            if ($scope.RptDataColl.length > rowInd && rowInd>=0) {
                                var fst = $scope.RptDataColl[rowInd];
                                if (fst && fst.IsParent == true) {
                                    $scope.RptDataColl.splice(rowInd, 1);
                                    $scope.gridOptions.api.setRowData($scope.RptDataColl);

                                    var drAmt = 0, crAmt = 0;
                                    var oDr = $scope.dataForBottomGrid[0].DebitAmt;
                                    var oCr = $scope.dataForBottomGrid[0].CreditAmt;

                                    $scope.dataForBottomGrid[1].DebitAmt = 0;
                                    $scope.dataForBottomGrid[1].CreditAmt = 0;
                                    $scope.dataForBottomGrid[2].DebitAmt = 0;
                                    $scope.dataForBottomGrid[2].CreditAmt = 0;

                                    $scope.RptDataColl.forEach(function (tb) {
                                        if (tb.IsParent == true) {
                                            drAmt += tb.DebitAmt;
                                            crAmt += tb.CreditAmt;
                                        }
                                    });

                                    var closingAmt = oDr - oCr + drAmt - crAmt;
                                    $scope.dataForBottomGrid[1].DebitAmt = drAmt;
                                    $scope.dataForBottomGrid[1].CreditAmt = crAmt;

                                    if (closingAmt > 0)
                                        $scope.dataForBottomGrid[2].DebitAmt = closingAmt;
                                    else
                                        $scope.dataForBottomGrid[2].CreditAmt = Math.abs(closingAmt);

                                    $scope.gridOptionsBottom.api.setRowData($scope.dataForBottomGrid);

                                }
                            }
                            

                        }
                    }

                
                    
                }
            },
            //getRowId: params => params.data.SNo, // Use `id` field as the unique identifier
            //onGridReady: (params) => {
            //    document.addEventListener('keydown', keyDownListener);
            //},
            onFilterChanged: function (e) {
                //console.log('onFilterChanged', e);
                var drAmt = 0, crAmt = 0;
                var oDr = $scope.dataForBottomGrid[0].DebitAmt;
                var oCr = $scope.dataForBottomGrid[0].CreditAmt;

                $scope.dataForBottomGrid[1].DebitAmt = 0;
                $scope.dataForBottomGrid[1].CreditAmt = 0;
                $scope.dataForBottomGrid[1].CurrentClosing = 0;
                

                $scope.dataForBottomGrid[2].DebitAmt = 0;
                $scope.dataForBottomGrid[2].CreditAmt = 0;
                $scope.dataForBottomGrid[2].CurrentClosing = 0;

                $scope.gridOptions.api.forEachNodeAfterFilterAndSort(function (node) {
                    var tb = node.data;
                    if (tb.IsParent == true) {
                        drAmt += tb.DebitAmt;
                        crAmt += tb.CreditAmt;
                    }
                });

                var closingAmt = oDr - oCr + drAmt - crAmt;
                $scope.dataForBottomGrid[1].DebitAmt = drAmt;
                $scope.dataForBottomGrid[1].CreditAmt = crAmt;
                $scope.dataForBottomGrid[1].CurrentClosing = drAmt-crAmt;

                if (closingAmt > 0)
                    $scope.dataForBottomGrid[2].DebitAmt = closingAmt;
                else
                    $scope.dataForBottomGrid[2].CreditAmt = Math.abs(closingAmt);

                $scope.gridOptionsBottom.api.setRowData($scope.dataForBottomGrid);

            },
            getNodeChildDetails: function (beData) {
                var dataColl = [];
                if (beData.IsParent==true) {

                   

                    if ($scope.LedgerVoucher.showInventory == true) {
                        if (beData.InventoryDetailsColl && beData.InventoryDetailsColl.length > 0) {
                            angular.forEach(beData.InventoryDetailsColl, function (data) {
                                data.RowType = 'ItemAllocation';
                                dataColl.push(data);
                            });
                        }
                    }

                    if ($scope.LedgerVoucher.showLedgerAllocation == true) {
                        if (beData.ChieldColl && beData.ChieldColl.length > 0) {
                            angular.forEach(beData.ChieldColl, function (data) {
                                data.RowType = 'LedgerAllocation';
                                dataColl.push(data);
                            });
                        }
                    }

                    if ($scope.LedgerVoucher.showNarration == true) {
                        if (beData.LedgerNarration && beData.LedgerNarration.length > 0)
                            dataColl.push("(" + beData.LedgerNarration + ")");
                    }

                    if ($scope.LedgerVoucher.showCostCenter == true) {
                        if (beData.CostCenterColl && beData.CostCenterColl.length > 0) {
                            angular.forEach(beData.CostCenterColl, function (data) {
                                data.RowType = 'LedgerAllocation';
                                dataColl.push(data);
                            });
                        }
                    }

                    if ($scope.LedgerVoucher.showBillDetails == true) {
                        if (beData.AccountBillDetailsColl && beData.AccountBillDetailsColl.length > 0) {
                            angular.forEach(beData.AccountBillDetailsColl, function (data) {
                                data.RowType = 'BillDetails';
                                dataColl.push(data);
                            });
                        }
                    }
                     
                    if (beData.Narration && beData.Narration.length > 0)
                        dataColl.push("(" + beData.Narration + ")");
                }
                
                if (dataColl.length > 0) {
                    return {
                        group: true,
                        children: dataColl,
                        expanded: beData.open
                    };
                } else
                    return null;


            },

        };


        function keyDownListener(e) {
            // delete the rows 
            // keyCode 8 is Backspace
            // keyCode 46 is Delete
            if (e.keyCode === 46) {
                $scope.gridOptions.api.forEachNode(node => {
                    console.log(`Row ID: ${node.id}`);
                });

                var cell = $scope.gridOptions.api.getFocusedCell();
                if (cell) {
                    var rowInd = cell.rowIndex;
                    if (rowInd >= 0) {
                        const rowNode = $scope.gridOptions.api.getRowNode(rowInd.toString());
                        if (rowNode) {
                            $scope.gridOptions.api.applyTransaction({ remove: [rowNode.data] });
                        }                         
                    }
                }
                
            }
        }
        $scope.dataForBottomGrid = [
            {
                IsParent: true,
                DateAD: '',
                DateBS: '',
                Particulars: 'Opening Balance =>',
                VoucherType: '',
                VoucherNo: '',
                RefNo: '',
                DebitAmt: 0,
                CreditAmt: 0,
                CurrentClosing: 0,
                CostClass: '',
                UserName: ''
            },
            {
                IsParent: true,
                DateAD: '',
                DateBS: '',
                Particulars: 'Current Total =>',
                VoucherType: '',
                VoucherNo: '',
                RefNo: '',
                DebitAmt: 0,
                CreditAmt: 0,
                CurrentClosing: 0,
                CostClass: '',
                UserName: ''
            },
            {
                IsParent: true,
                DateAD: '',
                DateBS: '',
                Particulars: 'Closing Balance =>',
                VoucherType: '',
                VoucherNo: '',
                RefNo: '',
                DebitAmt: 0,
                CreditAmt: 0,
                CurrentClosing: 0,
                CostClass: '',
                UserName: ''
            }
        ];
        $scope.gridOptionsBottom = {
            defaultColDef: {
                resizable: true,
                width: 90
            },
            columnDefs: $scope.columnDefs,
            // we are hard coding the data here, it's just for demo purposes
            rowData: $scope.dataForBottomGrid,
            debug: true,
            rowClass: 'bold-row',
            // hide the header on the bottom grid
            headerHeight: 0,
            alignedGrids: []
        };

        $scope.gridOptions.alignedGrids.push($scope.gridOptionsBottom);
        $scope.gridOptionsBottom.alignedGrids.push($scope.gridOptions);

        $scope.gridDivBottom = document.querySelector('#myGridBottom');
        new agGrid.Grid($scope.gridDivBottom, $scope.gridOptionsBottom);


        $timeout(function ()
        {
            GlobalServices.getListState(EntityId, $scope.gridOptions,$scope.gridOptionsBottom);
        });

     

    }
    //function GetCustomRptColumns() {
    //    $scope.CustomRptColumn = {
    //        Qry: '',
    //        ColumnList: '',
    //        MapColl: [],
    //    };

    //    GlobalServices.getCustomRptColumns(EntityId).then(function (res) {
    //        if (res.data.IsSuccess && res.data.Data) {
    //            $scope.CustomRptColumn = res.data.Data;
    //        }
    //    }, function (reason) {
    //        Swal.fire('Failed' + reason);
    //    });

    //}
    $scope.RefTableRows = [];
    $scope.SourceColColl = [];
    $scope.ShowCustomColumns = function () {
        if (!$scope.RefTableRows || $scope.RefTableRows.length == 0) {
            $scope.RefTableRows = [];

            if ($scope.CustomRptColumn && $scope.CustomRptColumn.TranId > 0) {
                $scope.CustomRptColumn.MapColl.forEach(function (cc) {
                    $scope.RefTableRows.push(cc);
                });
            } else {
                $scope.RefTableRows.push({});
            }

        }

        if (!$scope.SourceColColl || $scope.SourceColColl.length == 0) {
            $scope.SourceColColl = [];
            for (var v in $scope.ForCustomColumn) {
                $scope.SourceColColl.push({
                    name: v,
                    text: v,
                });
            }
        }

        if ($scope.SourceColColl.length > 0) {
            $('#frmCustomColumns').modal('show');
        }
    }

    $scope.AddRowIntoRefTblRow = function (ind) {
        $scope.RefTableRows.splice(ind + 1, 0, {});
    };
    $scope.delRowIntoRefTblRow = function (ind) {
        $scope.RefTableRows.splice(ind, 1);
    };

    $scope.OkRefTableRows = function () {
        $scope.CustomRptColumn.EntityId = EntityId;
        $scope.CustomRptColumn.ColumnList = '';
        $scope.CustomRptColumn.MapColl = [];

        $scope.RefTableRows.forEach(function (r) {
            if (r.RefColName && r.SourceColName && r.RefColName.length > 0 && r.SourceColName.length > 0) {
                $scope.CustomRptColumn.MapColl.push({
                    SNo: 0,
                    ColName: r.ColName,
                    RefColName: r.RefColName,
                    SourceColName: r.SourceColName,
                    Formula: r.Formula,
                });
            }
            else if (r.ColName && r.Formula && r.ColName.length > 0 && r.Formula.length > 0) {
                $scope.CustomRptColumn.MapColl.push({
                    SNo: 0,
                    ColName: r.ColName,
                    RefColName: r.RefColName,
                    SourceColName: r.SourceColName,
                    Formula: r.Formula,
                });
            }
        });

        var tmpDataColl = [];
        $scope.RptDataColl.forEach(function (rptRow) {
            var newRow = {};
            var hasValue = false;
            $scope.RefTableRows.forEach(function (r) {
                if (r.RefColName && r.SourceColName) {
                    if (r.RefColName.length > 0 && r.SourceColName.length > 0) {
                        newRow[r.RefColName] = rptRow[r.SourceColName];
                        hasValue = true;
                    }
                }
            });

            if (hasValue == true) {
                tmpDataColl.push(newRow);
            }
        });


        $http({
            method: 'POST',
            url: base_url + "Global/GetCustomColForRpt",
            headers: { 'Content-Type': undefined },

            transformRequest: function (data) {
                var formData = new FormData();
                formData.append("customData", angular.toJson(data.jsonData));
                formData.append("qry", $scope.CustomRptColumn.Qry);
                return formData;
            },
            data: { jsonData: tmpDataColl }
        }).then(function (res) {

            $scope.loadingstatus = "stop";
            hidePleaseWait();
            if (res.data.IsSuccess == true) {

                if (res.data.Data && res.data.Data.length > 0) {
                    var fstRow = res.data.Data[0];
                    for (var fr in fstRow) {

                        if (fr != 'RptSNo') {
                            if ($scope.CustomRptColumn.ColumnList.length > 0)
                                $scope.CustomRptColumn.ColumnList = $scope.CustomRptColumn.ColumnList + ',';

                            $scope.CustomRptColumn.ColumnList = $scope.CustomRptColumn.ColumnList + fr;
                        }
                    }

                    $http({
                        method: 'POST',
                        url: base_url + "Global/SaveCustomColForRpt",
                        headers: { 'Content-Type': undefined },

                        transformRequest: function (data) {

                            var formData = new FormData();
                            formData.append("customData", angular.toJson(data.jsonData));

                            return formData;
                        },
                        data: { jsonData: $scope.CustomRptColumn }
                    }).then(function (res1) {

                        $scope.loadingstatus = "stop";
                        hidePleaseWait();
                        if (res1.data.IsSuccess == true) {
                            $('#frmCustomColumns').modal('hide');
                        }
                        else {
                            Swal.fire(res1.data.ResponseMSG);
                        }
                    }, function (errormessage) {
                        hidePleaseWait();
                        $scope.loadingstatus = "stop";

                    });
                }
            }
            else if (res.data.IsSuccess != undefined) {
                Swal.fire(res.data.ResponseMSG);
            }

        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";

        });
    }

    $scope.GetCustomColData = function () {

        var tmpDataColl = [];
        if ($scope.CustomRptColumn.Qry && $scope.CustomRptColumn.Qry.length > 0) {
            var sno = 1;
            $scope.RptDataColl.forEach(function (rptRow) {
                var newRow = {};
                var hasValue = false;
                newRow.RptSNo = sno;
                $scope.CustomRptColumn.MapColl.forEach(function (r) {
                    if (r.RefColName && r.SourceColName) {
                        if (r.RefColName.length > 0 && r.SourceColName.length > 0) {
                            newRow[r.RefColName] = rptRow[r.SourceColName];
                            hasValue = true;
                        }
                    }
                });

                if (hasValue == true) {
                    tmpDataColl.push(newRow);
                }

                sno++;
            });
        }


        var tmpNewColl = [];
        if ($scope.CustomRptColumn.ColumnList) {
            $scope.CustomRptColumn.ColumnList.split(',').forEach(function (col) {
                tmpNewColl.push(col);
            });
        }

        var tmpCustColColl = [];
        if ($scope.CustomRptColumn.MapColl) {
            $scope.CustomRptColumn.MapColl.forEach(function (mc) {
                if (mc.Formula.length > 0) {
                    mc.FormulaColumnColl = extractStringVariables(mc.Formula);
                    tmpCustColColl.push(mc);
                }
            });
        }

        if ($scope.CustomRptColumn.Qry && $scope.CustomRptColumn.Qry.length > 0) {
            $http({
                method: 'POST',
                url: base_url + "Global/GetCustomColForRpt",
                headers: { 'Content-Type': undefined },

                transformRequest: function (data) {
                    var formData = new FormData();
                    formData.append("customData", angular.toJson(data.jsonData));
                    formData.append("qry", $scope.CustomRptColumn.Qry);
                    return formData;
                },
                data: { jsonData: tmpDataColl }
            }).then(function (res) {

                $scope.loadingstatus = "stop";
                hidePleaseWait();
                if (res.data.IsSuccess == true) {
                    if (res.data.Data && res.data.Data.length > 0) {
                        if (tmpNewColl.length > 0) {
                            res.data.Data.forEach(function (nRow) {
                                var findRow = $scope.RptDataColl[nRow.RptSNo - 1];
                                if (findRow) {
                                    tmpNewColl.forEach(function (r) {
                                        findRow[r] = nRow[r];
                                    });
                                }
                            });
                        }


                        if (tmpCustColColl.length > 0) {
                            $scope.RptDataColl.forEach(function (findRow) {
                                tmpCustColColl.forEach(function (cc) {
                                    var formula = cc.Formula;
                                    try {

                                        cc.FormulaColumnColl.forEach(function (fc) {
                                            var pval = isEmptyAmt(findRow[fc]);
                                            formula = formula.replaceAll(fc, pval);
                                        });

                                        var nVal = math.evaluate(formula);
                                        findRow[cc.ColName] = isEmptyAmt(nVal);
                                    } catch { }

                                });

                            });
                        }


                        /**** Start Data Load into List *****/

                        var qryColumnDefs = mx($scope.columnDefs);

                        tmpNewColl.forEach(function (col) {
                            var find = qryColumnDefs.firstOrDefault(p1 => p1.field == col);
                            if (find == null) {
                                var newCol = { headerName: col, width: 140, field: col, cellStyle: { 'text-align': 'left' } };
                                $scope.columnDefs.push(newCol);
                            }

                        });

                        tmpCustColColl.forEach(function (mc) {
                            if (mc.ColName && mc.ColName.length > 0) {

                                var find = qryColumnDefs.firstOrDefault(p1 => p1.field == mc.ColName);
                                if (find == null) {
                                    var newCol = { headerName: mc.ColName, width: 140, field: mc.ColName, cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } };
                                    $scope.columnDefs.push(newCol);
                                }
                            }
                        });

                        $scope.gridOptionsBottom.columnDefs = $scope.columnDefs;
                        $scope.gridOptionsBottom.api.setColumnDefs($scope.columnDefs);

                        $scope.gridOptions.columnDefs = $scope.columnDefs;
                        $scope.gridOptions.api.setColumnDefs($scope.columnDefs);

                        
                        $scope.gridOptions.api.setRowData($scope.RptDataColl);

                    }
                }
                else if (res.data.IsSuccess != undefined) {
                    Swal.fire(res.data.ResponseMSG);
                }

            }, function (errormessage) {
                hidePleaseWait();
                $scope.loadingstatus = "stop";

            });
        }
        else {

            if (tmpCustColColl.length > 0) {
                $scope.RptDataColl.forEach(function (findRow) {
                    tmpCustColColl.forEach(function (cc) {
                        var formula = cc.Formula;
                        try {

                            cc.FormulaColumnColl.forEach(function (fc) {
                                var pval = isEmptyAmt(findRow[fc]);
                                formula = formula.replaceAll(fc, pval);
                            });

                            var nVal = math.evaluate(formula);
                            findRow[cc.ColName] = isEmptyAmt(nVal);
                        } catch { }

                    });

                });
            }

            var qryColumnDefs = mx($scope.columnDefs);
            tmpCustColColl.forEach(function (mc) {
                if (mc.ColName && mc.ColName.length > 0) {

                    var find = qryColumnDefs.firstOrDefault(p1 => p1.field == mc.ColName);
                    if (find == null) {
                        var newCol = { headerName: mc.ColName, width: 140, field: mc.ColName, cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } };
                        $scope.columnDefs.push(newCol);
                    }
                }
            });

            $scope.gridOptionsBottom.columnDefs = $scope.columnDefs;
            $scope.gridOptionsBottom.api.setColumnDefs($scope.columnDefs);

            $scope.gridOptions.columnDefs = $scope.columnDefs;
            $scope.gridOptions.api.setColumnDefs($scope.columnDefs);

            
            $scope.gridOptions.api.setRowData($scope.RptDataColl);


        }

    }

    $scope.saveRptListState = function () {
        GlobalServices.saveRptListState(EntityId, $scope.gridOptions);
    };
    $scope.DelListState = function () {
        GlobalServices.delListStateRpt(EntityId);
    }
    $scope.ShowAditionalLedger = function () {

        for (var i = 0; i < 28; i++) {
            var colName = 'ledDet' + i;
            $scope.gridOptions.columnApi.setColumnVisible(colName, false);
        }

        if ($scope.LedgerVoucher.LedgerTypeIdColl && $scope.LedgerVoucher.LedgerTypeIdColl.length > 0) {
            $scope.LedgerVoucher.LedgerTypeIdColl.forEach(function (colInd) {
                var colName = 'ledDet' + colInd;                
                $scope.gridOptions.columnApi.setColumnVisible(colName, true);
            });
        }
        console.log($scope.LedgerVoucher.LedgerTypeIdColl);
    }

    $scope.editVoucher = function (tranId, voucherType, voucherId, voucherName, voucherNo) {

        Swal.fire({
            title: 'Do you want to edit the selected voucher(' + voucherName + ') :- ' + voucherNo + ' ? ',
            showCancelButton: true,
            confirmButtonText: 'Edit',
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {

                var tabContent = "";
                if (voucherType < 5) {
                    tabContent = base_url + "Account/Transaction/" + voucherName + "?TranId=" + tranId;
                } else {
                    tabContent = base_url + "Inventory/Transaction/" + voucherName + "?TranId=" + tranId;
                }

                var tabTitle = voucherName;
                var tabs = window.parent.document.getElementById('tabs');
                var ul = tabs.children[0];
                var rand = function () {
                    return Math.random().toString(36).substr(2); // remove `0.`
                };
                var tabId = "Tab-" + rand();

                $("<li class='nav-item ui-tabs-active ui-state-active' role='presentation'><a id='al-" + tabId + "' class='nav-link active' role='tab' aria-controls='pills-second' aria-selected='false' OnClick='TabClick(\"" + tabId + "\")' href='#" + tabId + "'>" + tabTitle + "</a><a href='#' class='fas fa-times-circle'></a></li>").appendTo(ul);
                $("<div id='" + tabId + "'><iframe id='Frm_" + tabId + "' src='" + tabContent + "' width='100%'></iframe></div>").appendTo(tabs);

            }
        });

    }

    $scope.ShowVoucher = function (e) {
        var obj = e.data;

        $(document).ready(function () {
            $('body').css('cursor', 'wait');
        });

        var para = {
            voucherType: obj.VoucherType,
            tranId: obj.TranId,
        };
        var frame = document.getElementById("frmChieldForm");
        var frameDoc = frame.contentDocument || frame.contentWindow.document;
        if (frameDoc)
            frameDoc.removeChild(frameDoc.documentElement);

        frame.src = '';
        frame.src = base_url + "Global/ShowAccInvTransaction?" + param(para);
        document.body.style.cursor = 'default';

        $('#frmChieldForm').on('load', function () {
            $('body').css('cursor', 'default');
        });

        $('#frmChield').modal('show');
    }
    $scope.deleteVoucher = function (tranId, voucherType, voucherId, voucherName, voucherNo) {

        Swal.fire({
            title: 'Do you want to delete the selected voucher(' + voucherName + ') :- ' + voucherNo + ' ? ',
            showCancelButton: true,
            confirmButtonText: 'Delete',
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                $scope.loadingstatus = "running";
                showPleaseWait();

                var para = {
                    voucherType: voucherType,
                    voucherId: voucherId,
                    tranId: tranId
                };

                $http({
                    method: 'POST',
                    url: base_url + "Global/DelAccInvTransaction",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingstatus = "stop";
                    if (res.data.IsSuccess) {
                        $scope.GetLedgerVoucher();
                    } else {
                        Swal.fire(res.data.ResponseMSG);
                    }

                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }
        });

    }

    $scope.ClearData = function () {

        $timeout(function () {

            $scope.dataForBottomGrid[0].DebitAmt = 0;
            $scope.dataForBottomGrid[0].CreditAmt = 0;
            $scope.dataForBottomGrid[1].DebitAmt = 0;
            $scope.dataForBottomGrid[1].CreditAmt = 0;
            $scope.dataForBottomGrid[2].DebitAmt = 0;
            $scope.dataForBottomGrid[2].CreditAmt = 0;

            $scope.RptDataColl = [];
            var DataColl = [];
            $scope.gridOptionsBottom.api.setRowData(DataColl);
            $scope.gridOptions.api.setRowData(DataColl);

            $scope.LedgerVoucher.ODr = 0;
            $scope.LedgerVoucher.OCr = 0;
            $scope.LedgerVoucher.TDr = 0;
            $scope.LedgerVoucher.TCr = 0;
            $scope.LedgerVoucher.CDr = 0;
            $scope.LedgerVoucher.CCr = 0; 
               
        });
     
    };

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
            DateFrom: dateFrom,
            DateTo: dateTo,
            ledgerId: ($scope.LedgerVoucher.LedgerId ? $scope.LedgerVoucher.LedgerId : 0),
            PatientId: $scope.LedgerVoucher.PatientId,
            branchIdColl: ($scope.LedgerVoucher.BranchId ? $scope.LedgerVoucher.BranchId.toString() : ''),
            showRelatedLC: $scope.LedgerVoucher.showRelatedLC,
        };

        $scope.loadingstatus = 'running';

        $http({
            method: "post",
            url: base_url + "Account/Reporting/GetLedgerVoucher",
            data: JSON.stringify(beData),
            dataType: "json"
        }).then(function (res) {

            if (res.data.Data.DataColl.length > 0) {
                $scope.RptDataColl = res.data.Data.DataColl;
                $scope.ForCustomColumn = $scope.RptDataColl[0];
            }

            var openingAmt = 0, drAmt = 0, crAmt = 0, closingAmt = 0;
            openingAmt = res.data.Data.OpeningAmt;
            drAmt = res.data.Data.DrAmt;
            crAmt = res.data.Data.CrAmt;
            closingAmt = res.data.Data.ClosingAmt;

            $scope.LedgerVoucher.ODr = (openingAmt > 0 ? openingAmt : 0);
            $scope.LedgerVoucher.OCr = (openingAmt < 0 ? Math.abs(openingAmt) : 0);
            $scope.LedgerVoucher.TDr = drAmt;
            $scope.LedgerVoucher.TCr = crAmt;
            $scope.LedgerVoucher.CDr = (closingAmt > 0 ? closingAmt : 0);
            $scope.LedgerVoucher.CCr = (closingAmt < 0 ? Math.abs(closingAmt) : 0);

            if (openingAmt > 0)
                $scope.dataForBottomGrid[0].DebitAmt = openingAmt;
            else
                $scope.dataForBottomGrid[0].CreditAmt = Math.abs(openingAmt);

            $scope.dataForBottomGrid[1].DebitAmt = drAmt;
            $scope.dataForBottomGrid[1].CreditAmt = crAmt;
            $scope.dataForBottomGrid[1].CurrentClosing = drAmt-crAmt;

            if (closingAmt > 0)
                $scope.dataForBottomGrid[2].DebitAmt = closingAmt;
            else
                $scope.dataForBottomGrid[2].CreditAmt = Math.abs(closingAmt);

            $scope.gridOptionsBottom.api.setRowData($scope.dataForBottomGrid);
            
            $scope.gridOptions.api.setRowData($scope.RptDataColl);

            var allotmentAmt = 0;
            $scope.DataColl.forEach(function (dc) {
                if (dc.VoucherType == 41) {
                    allotmentAmt += dc.VoucherAmt;
                }
            });
            $scope.LedgerVoucher.LedgerDetails.AllotmentAmt = allotmentAmt;
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

                                        if (rptTranId > 0)
                                        {
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
                                                        CDr: $scope.LedgerVoucher.CDr,
                                                        CCr: $scope.LedgerVoucher.CCr,
                                                        Ledger: $scope.LedgerVoucher.LedgerDetails.Name,
                                                        Address: $scope.LedgerVoucher.LedgerDetails.Address,
                                                        FileName: $scope.LedgerVoucher.LedgerDetails.Name + '.pdf',
                                                        PanVatNo: $scope.LedgerVoucher.LedgerDetails.PanVat ? $scope.LedgerVoucher.LedgerDetails.PanVat : '',
                                                        MobileNo: $scope.LedgerVoucher.LedgerDetails.MobileNo1 ? $scope.LedgerVoucher.LedgerDetails.MobileNo1 : '',
                                                        EmailId: $scope.LedgerVoucher.LedgerDetails.EmailId ? $scope.LedgerVoucher.LedgerDetails.EmailId : '',
                                                        PDCAmt: $scope.LedgerVoucher.LedgerDetails.PDCAmt,
                                                        BGAmt: $scope.LedgerVoucher.LedgerDetails.BGAmt,
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
                                    CDr: $scope.LedgerVoucher.CDr,
                                    CCr: $scope.LedgerVoucher.CCr,
                                    Ledger: $scope.LedgerVoucher.LedgerDetails.Name,
                                    Address: $scope.LedgerVoucher.LedgerDetails.Address,
                                    FileName: $scope.LedgerVoucher.LedgerDetails.Name + '.pdf',
                                    PanVatNo: $scope.LedgerVoucher.LedgerDetails.PanVat ? $scope.LedgerVoucher.LedgerDetails.PanVat : '',
                                    MobileNo: $scope.LedgerVoucher.LedgerDetails.MobileNo1 ? $scope.LedgerVoucher.LedgerDetails.MobileNo1 : '',
                                    EmailId: $scope.LedgerVoucher.LedgerDetails.EmailId ? $scope.LedgerVoucher.LedgerDetails.EmailId : '',
                                    PDCAmt: $scope.LedgerVoucher.LedgerDetails.PDCAmt,
                                    BGAmt: $scope.LedgerVoucher.LedgerDetails.BGAmt,
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

        var RptParamentersColl = [];

        RptParamentersColl.push({
            Name: "Period",
            Value: $('#dtDateFrom').val() + ' To ' + $('#dtDateTo').val()
        },
            {
                Name: 'Ledger',
                Value: $scope.LedgerVoucher.LedgerDetails.Name
            },
            {
                Name: 'Address',
                Value: ($scope.LedgerVoucher.LedgerDetails.Address ? $scope.LedgerVoucher.LedgerDetails.Address : '')
            },
            {
                Name: 'MobileNo',
                Value: ($scope.LedgerVoucher.LedgerDetails.MobileNo1 ? $scope.LedgerVoucher.LedgerDetails.MobileNo1 : '')
            },
            {
                Name: 'PanVatNo',
                Value: ($scope.LedgerVoucher.LedgerDetails.PanVat ? $scope.LedgerVoucher.LedgerDetails.PanVat : '')
            },
            {
                Name: 'TelNo',
                Value: ($scope.LedgerVoucher.LedgerDetails.MobileNo2 ? $scope.LedgerVoucher.LedgerDetails.MobileNo2 : '')
            },
            {
                Name: 'EmailId',
                Value: ($scope.LedgerVoucher.LedgerDetails.EmailId ? $scope.LedgerVoucher.LedgerDetails.EmailId : '')
            },
            {
                Name: 'ODr',
                Value: $scope.dataForBottomGrid[0].DebitAmt
            },
            {
                Name: 'OCr',
                Value: $scope.dataForBottomGrid[0].CreditAmt
            },
            {
                Name: 'TDr',
                Value: $scope.dataForBottomGrid[1].DebitAmt
            },
            {
                Name: 'TCr',
                Value: $scope.dataForBottomGrid[1].CreditAmt
            },
            {
                Name: 'CDr',
                Value: $scope.dataForBottomGrid[2].DebitAmt
            },
            {
                Name: 'CCr',
                Value: $scope.dataForBottomGrid[2].CreditAmt
            }
        );

        var filterData = [];

        $scope.gridOptions.api.forEachNodeAfterFilterAndSort(function (node) {
            var ledVoucher = node.data;

            if (ledVoucher.IsParent == true) {
                filterData.push(ledVoucher);
                 
                if ($scope.LedgerVoucher.IsSummary == false)
                {

                    if (ledVoucher.InventoryDetailsColl) {
                        angular.forEach(ledVoucher.InventoryDetailsColl, function (invData) {
                            var beData = {};
                            beData.Particulars = invData.ProductName;// +" ( " + GlobalFunction.getNumberStr(invData.BQty) + " @ " + GlobalFunction.getNumberStr(invData.Rate) + " = " + GlobalFunction.getNumberStr(invData.Amount) + " ) ";
                            beData.AQty = invData.AQty;
                            beData.BQty = invData.BQty;
                            beData.Rate = invData.Rate;
                            beData.Amount = invData.Amount;
                            beData.Unit = invData.UnitName;
                            beData.ProductName = invData.ProductName;

                            var fixedProduct = invData.ProductName;

                            if (invData.RegdNo && !invData.RegdNo.isEmpty())
                                fixedProduct = fixedProduct + " Regd:-" + invData.RegdNo;

                            if (invData.EngineNo && !invData.EngineNo.isEmpty())
                                fixedProduct = fixedProduct + " Eng:-" + invData.EngineNo;

                            if (invData.ChassisNo && !invData.ChassisNo.isEmpty())
                                fixedProduct = fixedProduct + " Chass:-" + invData.ChassisNo;

                            if (invData.Model && !invData.Model.isEmpty())
                                fixedProduct = fixedProduct + " Model:-" + invData.Model;

                            //beData.ProductName = fixedProduct;
                            beData.Particulars = fixedProduct;

                            filterData.push(beData);

                        });
                    }

                    if (ledVoucher.ChieldColl) {
                        angular.forEach(ledVoucher.ChieldColl, function (all) {

                            var str = "";
                            if (all.DebitAmt > 0)
                                str = NumberformatAC(all.DebitAmt);
                            else
                                str = NumberformatAC(all.CreditAmt);

                            filterData.push({
                                Particulars: all.LedgerName + " " + str
                            });

                            if (all.CostCenterColl) {
                                angular.forEach(all.CostCenterColl, function (all1) {
                                    if (all1.DebitAmt > 0)
                                        str = NumberformatAC(all1.DebitAmt);
                                    else
                                        str = NumberformatAC(all1.CreditAmt);

                                    filterData.push({
                                        Particulars: all1.LedgerName + " " + str
                                    });

                                });
                            }

                        });
                    }

                    angular.forEach(ledVoucher.AccountBillDetailsColl, function (bd) {
                        filterData.push({
                            Particulars: "(" + bd.VoucherDetails + " :- Rs." + Numberformat(bd.Amount) + " / " + bd.Remarks + " ) "
                        });
                    });

                    if (ledVoucher.LedgerNarration) {
                        filterData.push({
                            Particulars: "( " + ledVoucher.LedgerNarration + " )"
                        });
                    }

                    if (ledVoucher.CostCenterColl) {
                        angular.forEach(ledVoucher.CostCenterColl, function (all) {
                            var str = "";

                            if (all.DebitAmt > 0)
                                str = NumberformatAC(all.DebitAmt);
                            else
                                str = NumberformatAC(all.CreditAmt);
                            filterData.push({
                                Particulars: all.LedgerName + " " + str
                            });
                        });
                    }
                     
                 
                }
                
            }

        });


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
                                                        printed = true;
                                                        if (rptTranId > 0) {
                                                            document.body.style.cursor = 'wait';
                                                            document.getElementById("frmRpt").src = '';
                                                            document.getElementById("frmRpt").src = base_url + "web/ReportViewer.aspx?rpttranid=" + rptTranId + "&istransaction=true&entityid=" + entityId + "&voucherid=" + voucherId + "&tranid=" + tranId + "&vouchertype=" + voucherType + '&FileName=' + selectedRpt.PDFFileName;
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
                                        document.getElementById("frmRpt").src = base_url + "web/ReportViewer.aspx?rpttranid=" + rptTranId + "&istransaction=true&entityid=" + entityId + "&voucherid=" + voucherId + "&tranid=" + tranId + "&vouchertype=" + voucherType + '&FileName=' + selectedRpt.PDFFileName;
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
      
    $scope.GetSalesVatRegister = function () {
         

        var dateFrom = new Date(($filter('date')(new Date(), 'yyyy-MM-dd')));
        var dateTo = new Date(($filter('date')(new Date(), 'yyyy-MM-dd')));

        if ($scope.LedgerVoucher.DateFromDet)
            dateFrom = new Date(($filter('date')($scope.LedgerVoucher.DateFromDet.dateAD, 'yyyy-MM-dd')));

        if ($scope.LedgerVoucher.DateToDet)
            dateTo = new Date(($filter('date')($scope.LedgerVoucher.DateToDet.dateAD, 'yyyy-MM-dd')));

        var beData =
        {
            dateFrom: dateFrom,
            dateTo: dateTo,
            VoucherId: 0,
            BranchId: 0,
            PartyLedgerId: $scope.LedgerVoucher.LedgerId
        };

        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: "post",
            url: base_url + "Account/Reporting/GetSalesVatRegister",
            data: JSON.stringify(beData),
            dataType: "json"
        }).then(function (res) {

            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                var SalesDataColl = res.data.Data;
                 
                document.getElementById("frmRpt").src = '';
                reload_message_frame('frmRpt');

                $http({
                    method: 'GET',
                    url: base_url + "ReportEngine/GetReportTemplates?entityId=" + SalesVatEntityId + "&voucherId=0&isTran=false",
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
                            var selectedRpt = null;
                            if (templatesColl.length == 1) {
                                selectedRpt = templatesColl[0];
                                rptTranId = templatesColl[0].RptTranId;
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
                                                if (rptTranId > 0) {                                                   
                                                    print = true;
                                                    $http({
                                                        method: 'POST',
                                                        url: base_url + "Global/PrintReportData",
                                                        headers: { 'Content-Type': undefined },

                                                        transformRequest: function (data) {

                                                            var formData = new FormData();
                                                            formData.append("entityId", SalesVatEntityId);
                                                            formData.append("jsonData", angular.toJson(data.jsonData));

                                                            return formData;
                                                        },
                                                        data: { jsonData: SalesDataColl }
                                                    }).then(function (res) {

                                                        $scope.loadingstatus = "stop";
                                                        hidePleaseWait();
                                                        if (res.data.IsSuccess && res.data.Data) {

                                                            document.body.style.cursor = 'wait';
                                                            document.getElementById("frmRpt").src = '';

                                                            var rptPara = {
                                                                rpttranid: rptTranId,
                                                                istransaction: false,
                                                                entityid: SalesVatEntityId,
                                                                voucherid: 0,
                                                                tranid: 0,
                                                                vouchertype: 0,
                                                                sessionid: res.data.Data.ResponseId,
                                                                Period: $scope.LedgerVoucher.DateFromDet.dateBS + " TO " + $scope.LedgerVoucher.DateToDet.dateBS,
                                                            };
                                                            var paraQuery = param(rptPara);
                                                            document.body.style.cursor = 'wait';
                                                            if (selectedRpt.IsRDLC == true)
                                                                document.getElementById("frmRpt").src = base_url + "Home/RdlcViewer?" + paraQuery;
                                                            else
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
                                 print = true;

                                $http({
                                    method: 'POST',
                                    url: base_url + "Global/PrintReportData",
                                    headers: { 'Content-Type': undefined },

                                    transformRequest: function (data) {

                                        var formData = new FormData();
                                        formData.append("entityId", SalesVatEntityId);
                                        formData.append("jsonData", angular.toJson(data.jsonData));

                                        return formData;
                                    },
                                    data: { jsonData: SalesDataColl }
                                }).then(function (res) {

                                    $scope.loadingstatus = "stop";
                                    hidePleaseWait();
                                    if (res.data.IsSuccess && res.data.Data) {

                                        var rptPara = {
                                            rpttranid: rptTranId,
                                            istransaction: false,
                                            entityid: SalesVatEntityId,
                                            voucherid: 0,
                                            tranid: 0,
                                            vouchertype: 0,
                                            sessionid: res.data.Data.ResponseId,
                                            Period: $scope.LedgerVoucher.DateFromDet.dateBS + " TO " + $scope.LedgerVoucher.DateToDet.dateBS,
                                        };
                                        var paraQuery = param(rptPara);
                                        document.body.style.cursor = 'wait';
                                        if (selectedRpt.IsRDLC == true)
                                            document.getElementById("frmRpt").src = base_url + "Home/RdlcViewer?" + paraQuery;
                                        else
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
            
            } else
                alert(res.data.ResponseMSG);

        }, function (reason) {
            $scope.loadingstatus = "stop";
            alert('Failed' + reason);
        });

    };
     
    $scope.GetPatientById = function ()
    { 
        $scope.LedgerVoucher.LedgerId = null;
        $scope.LedgerVoucher.PatientId = null;
        $scope.LedgerVoucher.LedgerDetails = {};

        if ($scope.LedgerVoucher.PatientNo || $scope.LedgerVoucher.PatientNo > 0) {

            $scope.loadingstatus = 'running';
            showPleaseWait();

            $http({
                method: 'GET',
                url: base_url + "Global/GetPatientDetails?patientId=" + $scope.LedgerVoucher.PatientNo + '&voucherId=0',
                dataType: "json"
            }).then(function (res1) {

                $scope.loadingstatus = 'stop';
                hidePleaseWait();

                var patient = res1.data.Data;
                if (patient.IsSuccess == true) {
                    
                    $scope.LedgerVoucher.PatientId = patient.PatientId;
                    $scope.LedgerVoucher.LedgerDetails.Code = $scope.LedgerVoucher.PatientNo;
                    $scope.LedgerVoucher.LedgerDetails.Name = patient.PatientName;
                    $scope.LedgerVoucher.LedgerDetails.Address = patient.Address;
                    $scope.LedgerVoucher.LedgerDetails.GroupName = 'Patient';
                    $scope.LedgerVoucher.LedgerDetails.MobileNo1 = patient.MobileNo;

                    $scope.GetLedgerVoucher();


                } else {
                  
                    Swal.fire('Invalid Patient Id');
                }


            }, function (reason) {
                Swal.fire('Failed' + reason);
            });

        } 
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
    //$scope.ShowPersonalImg = function (docDet) {
    //    $scope.viewImg = {
    //        ContentPath: '',
    //        File: null,
    //        FileData: null
    //    };
    //    if (docDet.DocPath || docDet.File) {
    //        $scope.viewImg.ContentPath = docDet.DocPath;
    //        $scope.viewImg.File = docDet.File;
    //        $scope.viewImg.FileData = docDet.DocumentData;
    //        $('#PersonalImg').modal('show');
    //    } else
    //        Swal.fire('No Image Found');

    //};

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
                ledgerId:$scope.LedgerVoucher.LedgerId
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
            CDr: $scope.LedgerVoucher.CDr,
            CCr: $scope.LedgerVoucher.CCr,
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
                var fileName = $scope.LedgerVoucher.LedgerDetails.Name + ".xlsx";
                down_file(base_url + "//" + res.data.Data.ResponseId, fileName);
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

    $scope.CurJV = {};
    $scope.GetPurchaseList = function (curRow) {
        $scope.PurchaseColl = [];
        $scope.CurJV = curRow;
        if (curRow.VoucherId > 0 && curRow.CostClassId > 0) {

        } else {
            return;
        }
             
        $scope.loadingstatus = 'running';
        showPleaseWait();
        var para = {
            voucherDate: $filter('date')(new Date(), 'yyyy-MM-dd'),
            VoucherId: curRow.VoucherId,
            CostClassId: ($scope.searchFields.CostClassId > 0 ? $scope.searchFields.CostClassId : curRow.CostClassId),
            JournalTranId:   0,
        };
        $http({
            method: 'POST',
            url: base_url + "Inventory/Transaction/GetPurchaseListForAditionalInvoice",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                $scope.PurchaseColl = res.data.Data;
                 $('#PurchaseList').modal('show');

            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    };

    $scope.clickOnPurchaseAccept = function () {
        var tmpSelectedVoucherColl = [];

        var vtype = $scope.CurJV.VoucherType;
        angular.forEach($scope.PurchaseColl, function (pc) {
            if (pc.IsSelected == true) {                
                tmpSelectedVoucherColl.push({
                    VoucherType:$scope.CurJV.VoucherType,
                    JournalTranId: ($scope.CurJV.VoucherType == 3 ? $scope.CurJV.TranId : 0),
                    PaymentTranId: ($scope.CurJV.VoucherType == 2 ? $scope.CurJV.TranId : 0),
                    PurchaseTranId:pc.TranId
                });
            }
        });

        var endpoint = vtype == 2 ? 'TagPaymentToPI' : 'TagJournalToPI';

        if (tmpSelectedVoucherColl.length > 0) {
             
            $http({
                method: 'POST',
                url: base_url + "Account/Transaction/" + endpoint,
                headers: { 'Content-Type': undefined },

                transformRequest: function (data) {

                    var formData = new FormData();
                    formData.append("jsonData", angular.toJson(data.jsonData));
 
                    return formData;
                },
                data: { jsonData: tmpSelectedVoucherColl }
            }).then(function (res) {

                $scope.loadingstatus = "stop";
                hidePleaseWait();
                if (res.data.IsSuccess == true) {
                    $('#PurchaseList').modal('hide');
                }
                Swal.fire(res.data.ResponseMSG);


            }, function (errormessage) {
                hidePleaseWait();
                $scope.loadingstatus = "stop";

            });
        }

    };

    $scope.UnTagJournal = function (curRow) {

        var vtype = curRow.VoucherType;

        Swal.fire({
            title: 'Do you want to un-tag the selected voucher(' + curRow.VoucherName + ') :- ' + curRow.AutoManualNo + ' ? ',
            showCancelButton: true,
            confirmButtonText: 'Un-Tag',
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                $scope.loadingstatus = "running";
                showPleaseWait();

                var endpoint = vtype == 2 ? 'UnTagPaymentToPI' : 'UnTagJournalToPI';

                $http({
                    method: 'POST',
                    url: base_url + "Account/Transaction/"+endpoint+"?TranId="+curRow.TranId,
                    dataType: "json",                    
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingstatus = "stop";
                    Swal.fire(res.data.ResponseMSG);
                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }
        });
    }

    $scope.TranRelation = {};
    $scope.ShowTranRelation = function (curRow) {

        $scope.TranRelation = {};
        if (curRow.TranId > 0) {

            $scope.loadingstatus = "running";
            showPleaseWait();
            GlobalServices.ShowTransactionRelation(curRow.VoucherType, curRow.TranId).then(function (res1)
            {
                $scope.loadingstatus = "stop";
                hidePleaseWait();
                if (res1.data.IsSuccess && res1.data.Data)
                {
                    var tranData = res1.data.Data;
                    if (tranData.length > 0) {
                        $scope.TranRelation.Parent = res1.data.Data[0];
                        $scope.TranRelation.ChieldColl = [];
                        angular.forEach(tranData, function (td) {
                            if (td.LevelId > 1)
                                $scope.TranRelation.ChieldColl.push(td);
                        });

                        $('#frmMDLTranRelation').modal('show');
                    }
                }
            }, function (reason) {
                Swal.fire('Failed' + reason);
            });
        }
    }

    $scope.ShowTranVoucher = function (voucherType, tranId) {
        GlobalServices.ShowVoucher(voucherType, tranId);
    }

    $scope.SelectedVoucher = null;
    $scope.CancelModal = function (e) {
         
        var obj = e.data;

        if (!obj)
            return;

        $scope.SelectedVoucher = obj;

        $('#modal-cancel').modal('show');

    }
    $scope.CancelVoucher = function () {
        $('#modal-cancel').modal('hide');

        var obj = $scope.SelectedVoucher;

        Swal.fire({
            title: 'Do you want to cancel the selected voucher(' + obj.VoucherName + ') :- ' + obj.AutoManualNo + ' ? ',
            showCancelButton: true,
            confirmButtonText: 'Yes',
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                $scope.loadingstatus = "running";
                showPleaseWait();

                var tranColl1 = [];
                tranColl1.push({
                    TranId: obj.TranId,
                    VoucherId: obj.VoucherId,
                    VoucherType: obj.VoucherType,
                    CostClassId: obj.CostClassId,
                    IsCancel: obj.IsCancel,
                    VoucherType: obj.VoucherType,
                    CancelRemarks: obj.CancelRemarks,
                    EntryDate: obj.EntryDate,
                    VoucherDate: obj.VoucherDate,
                    IsPost: obj.IsPost,
                    AutoVoucherNo: obj.AutoVoucherNo,
                    ManualVoucherNO: obj.ManualVoucherNO,
                    AutoManualNo: obj.AutoManualNo,
                    RefNo: obj.RefNo,
                    TranType: obj.TranType,
                    CreatedBy: obj.CreatedBy,
                    CreatedByName: obj.CreatedByName,
                    BranchId: obj.BranchId,
                    IsLocked: obj.IsLocked,
                    IsOpening: obj.IsOpening,
                    IsVerify: obj.IsVerify,
                    VerifyRemarks: obj.VerifyRemarks,
                    IsReject: obj.IsReject,
                    RejectRemarks: obj.RejectRemarks,
                    VoucherDateTime: obj.VoucherDateTime,
                    ReferanceTranId: obj.ReferanceTranId,
                    IsInventory: obj.IsInventory,
                    CancelDateTime: obj.CancelDateTime,
                });

                var para = {
                    tranColl: tranColl1,
                    reason: obj.CancelRemarks
                }

                $http({
                    method: 'POST',
                    url: base_url + "Global/CancelAccInvTransaction",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingstatus = "stop";
                    if (res.data.IsSuccess) {
                        $scope.GetDayBook();
                    } else {
                        Swal.fire(res.data.ResponseMSG);
                    }

                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }
        });

    };
});
