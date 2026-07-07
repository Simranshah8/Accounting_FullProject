
agGrid.initialiseAgGridWithAngular1(angular);

app.controller("dayBookCntrl", ['$scope', '$http', '$filter', '$timeout', 'GlobalServices', '$compile', function ($scope, $http, $filter, $timeout, GlobalServices, $compile) {
    
    var PrintPreviewAs = 1;
    const contextMenu = GlobalServices.createElementForMenu();
    LoadData();

    $scope.onBtExportCSV = function () {
        var params = {
            fileName: 'daybook.csv',
            sheetName: 'daybook'
        };

        $scope.gridOptions.api.exportDataAsCsv(params);
    }

    $scope.ExpandData = function () {
        $scope.gridOptions.api.expandAll();
    }
    $scope.CollapseData = function () {
        $scope.gridOptions.api.collapseAll();
    }
    function LoadData() {

      //  $scope.generalConfig = generalConfig;

        $('.select2').select2({
            allowClear: true,
            openOnEnter: true
        });

        $scope.RefTableColColl = GlobalServices.getRptTableColColl();

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

        GetCustomRptColumns();

        $scope.GenConfig = {};
        GlobalServices.getGenConfig().then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.GenConfig = res.data.Data;
                PrintPreviewAs = $scope.GenConfig.PrintPreviewAs;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $scope.InvConfig = {};
        GlobalServices.getInvConfig().then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.InvConfig = res.data.Data;               
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $scope.ButtonED = {};
        GlobalServices.getButtonDisabled(EntityId).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.ButtonED = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $scope.comDet = {};
        GlobalServices.getCompanyDet().then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.comDet = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        //agGrid.initialiseAgGridWithAngular1(angular);
        $scope.VoucherTypeList = [];
        $http({
            method: 'GET',
            //url: base_url + "Account/Creation/GetVoucherTypes",
            url: base_url + "Account/Creation/GetUserWiseVoucherTypes",
            dataType: "json",
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.VoucherTypeList = res.data.Data;
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $scope.BranchList = [];
        $http({
            method: 'POST',
            url: base_url + "Setup/Security/GetAllBranchList",
            dataType: "json"
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.BranchList = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $scope.PaymentTermColl = [];
        $scope.PaymentTermColl_Qry = [];
        GlobalServices.getPaymentTerms().then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.PaymentTermColl = res.data.Data;
                $scope.PaymentTermColl_Qry = mx(res.data.Data);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $scope.DayBookTypes = [{ id: 1, text: 'Post' }, { id: 2, text: 'Pending' }, { id: 3, text: 'Cancel' }];
        $scope.dayBook = {
            DateFrom_TMP: new Date(),
            DateTo_TMP: new Date(),
            VoucherId: 0,
            IsPost: true,
            BranchId: 0,
            IsSummary: true,
            For: 1,
            ExpandCollapse: false,
            currenttime: new Date()
        };

        $scope.searchData = {
            UserColl: '',
            DayBook: ''
        };

        $scope.loadingstatus = "stop";

        $scope.columnDefs = [
            {
                headerName: "Date", width: 170, field: "VoucherDate", dataType: 'DateTime', cellRenderer: 'agGroupCellRenderer',
                valueFormatter: function (params) { return DateFormatAD(params.value); },
                showRowGroup: true,
                cellRendererParams: {
                    suppressCount: false, // turn off the row count                   
                }, pinned: 'left'
            },
            {
                headerName: "Miti", width: 120, dataType: 'DateTime',
                cellRenderer:
                    function (params) {
                        return DateFormatBS(params.data.NY, params.data.NM, params.data.ND) + '</a ></center>';
                    }, pinned: 'left'

            },
            {
                headerName: "Particular's", width: 220, dataType: 'Text',
                valueGetter: function (params) {
                    var beData = params.data;

                    if (beData.IsInventory) {
                        return beData.PartyLedger;
                    }
                    else if (beData.VoucherType == 3) {
                        var drAmt = beData.LedgerAllocationColl[0].DrAmount;
                        if (drAmt != beData.TransactionAmt) {
                            return '( As per details )';
                        } else {
                            return beData.LedgerAllocationColl[0].LedgerName;
                        }
                    }
                    else if (beData.LedgerAllocationColl && beData.LedgerAllocationColl.length > 0)
                        return beData.LedgerAllocationColl[0].LedgerName;
                    else if (beData.LedgerName)
                        return beData.LedgerName;
                    else if (beData.DispalyValue)
                        return beData.DispalyValue;
                    else
                        return params.data;
                }, pinned: 'left', filter: "agTextColumnFilter",
            },
            {
                headerName: "Amount", width: 150, filter: "agNumberColumnFilter", dataType: 'Number',
                valueGetter: function (params) {
                    var beData = params.data;
                    return beData.Amount;
                },
                valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' }, footerTemplate: '<div>totaal: #= sum #</div>'
            },
            { headerName: "VoucherType", width: 150, field: "VoucherName", filter: true, dataType: 'Text', filter: "agTextColumnFilter", },
            { headerName: "Voucher No.", width: 150, field: "AutoManualNo", filter: true, dataType: 'Text', filter: "agTextColumnFilter", },
            { headerName: "Ref.No.", width: 120, field: "RefNo", filter: true, dataType: 'Text', filter: "agTextColumnFilter", },
            {
                headerName: "Debit", width: 150, dataType: 'Number', filter: "agNumberColumnFilter",
                valueGetter: function (params) {
                    var beData = params.data;

                    if (beData.IsInventory) {
                        return beData.DrAmount;
                    }
                    else if (beData.LedgerAllocationColl && beData.LedgerAllocationColl.length == 0)
                        return 0;
                    else if (beData.VoucherType == 3 || beData.VoucherType == 2) {
                        return beData.TransactionAmt;
                    }
                    else if (beData.LedgerAllocationColl && beData.LedgerAllocationColl.length > 0)
                        return beData.LedgerAllocationColl[0].DrAmount;
                    else if (beData.DrAmount)
                        return beData.DrAmount;
                    else
                        return 0;

                }, filter: "agNumberColumnFilter",
                valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' }, footerTemplate: '<div>totaal: #= sum #</div>'
            },
            {
                headerName: "Credit", width: 150, dataType: 'Number', filter: "agNumberColumnFilter",
                valueGetter: function (params) {
                    var beData = params.data;

                    if (beData.IsInventory) {
                        return beData.CrAmount;
                    } else if (beData.LedgerAllocationColl && beData.LedgerAllocationColl.length == 0)
                        return 0;
                    else if (beData.VoucherType == 1) {
                        return beData.TransactionAmt;
                    }
                    else if (beData.VoucherType == 3)
                        return 0;
                    else if (beData.LedgerAllocationColl && beData.LedgerAllocationColl.length > 0)
                        return beData.LedgerAllocationColl[0].CrAmount;
                    else if (beData.CrAmount)
                        return beData.CrAmount;
                    else
                        return 0;

                }, filter: "agNumberColumnFilter",
                valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' }, footerTemplate: '<div>totaal: #= sum #</div>'
            },
            { headerName: "CostClass", width: 120, dataType: 'Text', field: "CostClassName", filter: true, filter: "agTextColumnFilter", },
            { headerName: "User", width: 120, dataType: 'Text', field: "CreatedByName", filter: "agTextColumnFilter", },

            { headerName: "Branch", width: 120, dataType: 'Text', field: "BranchName", filter: "agTextColumnFilter", },


            { headerName: "Party Name", width: 140, field: "Buyes", dataType: 'Text', filter: true, filter: "agTextColumnFilter", },
            { headerName: "PAN/VAT No.", width: 110, field: "PanVatNo", dataType: 'Text', filter: true, filter: "agTextColumnFilter", },
            { headerName: "Address", width: 140, field: "Address", dataType: 'Text', filter: true, filter: "agTextColumnFilter", },
            { headerName: "PaymentTerms", width: 150, field: "PaymentTerms", dataType: 'Text', filter: true, filter: "agTextColumnFilter", },
            { headerName: "DSE", width: 150, field: "Agent", filter: true, dataType: 'Text', filter: "agTextColumnFilter", },
            { headerName: "Ref. VoucherNo", width: 130, field: "RefAutoManualNo", filter: true, dataType: 'Text', filter: "agTextColumnFilter", },

            { headerName: "Verify Remarks", width: 130, field: "VerifyRemarks", filter: true, dataType: 'Text', filter: "agTextColumnFilter", },
            { headerName: "Reject Remarks", width: 130, field: "RejectRemarks", filter: true, dataType: 'Text', filter: "agTextColumnFilter", },

            { headerName: "ModifyBy", width: 120, dataType: 'Text', field: "ModifyBy", filter: "agTextColumnFilter", },
            { headerName: "PostBy", width: 120, dataType: 'Text', field: "PostBy", filter: "agTextColumnFilter", },
            { headerName: "CancelBy", width: 120, dataType: 'Text', field: "CancelBy", filter: "agTextColumnFilter", },
            { headerName: "SSFCode", width: 120, dataType: 'Text', field: "SSFCode", filter: "agTextColumnFilter", },
            //{
            //    headerName: "Action", width: 165, cellRenderer:
            //        function (params) {

            //            var voucherName = params.data.VoucherName;

            //            if (voucherName) {

            //                if (params.data.VoucherType < 5) {
            //                    return '<a class="btn btn-default btn-xs" data-toggle="tooltip" data-placement="top" title="Show Document" ng-click="ShowDocument(this.data)"><i class="fas fa-file text-info"></i></a> <a class="btn btn-default btn-xs" data-toggle="tooltip" data-placement="top" title="Print" ng-click="PrintVoucher(' + params.data.TranId + ',' + params.data.VoucherType + ',' + params.data.VoucherId + ')"><i class="fas fa-print text-info"></i></a>' +
            //                        '<a class="btn btn-default btn-xs"data-toggle="tooltip" data-placement="top" title="Post" ng-click="PostModal(this)"><i class="fas fa-sticky-note"></i></a>' +
            //                        '<a class="btn btn-default btn-xs"data-toggle="tooltip" data-placement="top" title="Cancel" ng-click="CancelModal(this)"><i class="fa fa-times"></i></a>' +
            //                        '<a class="btn btn-default btn-xs"data-toggle="tooltip" data-placement="top" title="Generate Receipt" ng-click="GenerateReceipt(this)"><i class="fa fa-receipt"></i></a>' +
            //                        '<a class="btn btn-default btn-xs"data-toggle="tooltip" data-placement="top" title="Delete" ng-click="deleteVoucher(' + params.data.TranId + ',' + params.data.VoucherType + ',' + params.data.VoucherId + ',\'' + voucherName + '\'' + ', \'' + params.data.AutoManualNo + '\')"><i class="fas fa-trash-alt text-danger"></i></a>';

            //                } else {
            //                    return '<a class="btn btn-default btn-xs"data-toggle="tooltip" data-placement="top" title="Show Document" ng-click="ShowDocument(this.data)"><i class="fas fa-file text-info"></i></a> <a class="btn btn-default btn-xs" data-toggle="tooltip" data-placement="top" title="Print" ng-click="PrintVoucher(' + params.data.TranId + ',' + params.data.VoucherType + ',' + params.data.VoucherId + ')"><i class="fas fa-print text-info"></i></a>' +
            //                        '<a class="btn btn-default btn-xs"data-toggle="tooltip" data-placement="top" title="Post" ng-click="PostModal(this)"><i class="fas fa-sticky-note"></i></a>' +
            //                        '<a class="btn btn-default btn-xs"data-toggle="tooltip" data-placement="top" title="Cancel" ng-click="CancelModal(this)"><i class="fa fa-times"></i></a>' +
            //                        '<a class="btn btn-default btn-xs"data-toggle="tooltip" data-placement="top" title="Generate Receipt" ng-click="GenerateReceipt(this)"><i class="fa fa-receipt"></i></a>' +
            //                        '<a class="btn btn-default btn-xs"data-toggle="tooltip" data-placement="top" title="Delete" ng-click="deleteVoucher(' + params.data.TranId + ',' + params.data.VoucherType + ',' + params.data.VoucherId + ',\'' + voucherName + '\'' + ', \'' + params.data.AutoManualNo + '\')"><i class="fas fa-trash-alt text-danger"></i></a>';
            //                }

            //            } else {
            //                return '';
            //            }
            //        }
            //},

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
                        '<li><a data-toggle="tooltip" data-placement="top" title="Print" ng-click="PrintVoucher(' + params.data.TranId + ',' + params.data.VoucherType + ',' + params.data.VoucherId + ',false)"><i class="fas fa-print text-info"></i> Print</a></li>' +
                        '<li ng-hide="this.data.VoucherType==14 && ButtonED.IRD == true"><a data-toggle="tooltip" data-placement="top" title="Post" ng-click="PostModal(this)"><i class="fas fa-sticky-note"></i> Post</a> </li>' +
                        '<li ng-hide="this.data.VoucherType==14 && ButtonED.IRD == true"><a data-toggle="tooltip" data-placement="top" title="Un Post" ng-click="UnPostModal(this)"><i class="fas fa-sticky-note"></i> Un Post</a> </li>' +
                        '<li ng-hide="this.data.VoucherType==14 && ButtonED.IRD == true"><a data-toggle="tooltip" data-placement="top" title="Cancel" ng-click="CancelModal(this)"><i class="fa fa-times text-danger"></i> Cancel</a> </li>' +
                        '<li ng-hide="this.data.VoucherType==14 && ButtonED.IRD == true"><a data-toggle="tooltip" data-placement="top" title="Verify Voucher" ng-click="VerifyModal(this)"><i class="fa fa-times text-info"></i> Verify</a> </li>' +
                        '<li ng-hide="this.data.VoucherType==14 && ButtonED.IRD == true"><a data-toggle="tooltip" data-placement="top" title="Reject Voucher" ng-click="RejectModal(this)"><i class="fa fa-times text-danger"></i> Reject</a> </li>' +
                        '<li><a data-toggle="tooltip" data-placement="top" title="Generate Receipt" ng-click="GenerateReceipt(this)"><i class="fa fa-receipt"></i> Generate Receipt</a> </li>' +
                        '<li ng-hide="this.data.VoucherType==14 && ButtonED.IRD == true"><a data-toggle="tooltip" data-placement="top" title="Delete Voucher" ng-click="deleteVoucher(this)"><i class="fas fa-trash-alt text-danger"></i> Delete</a></li>' +
                        '<li><a data-toggle="tooltip" data-placement="top" title="Show Voucher" ng-click="ShowVoucher(this)"><i class="fas fa-info text-infor"></i> Show Voucher</a></li>' +
                        '<li><a data-toggle="tooltip" data-placement="top" title="Show Transaction Relation" ng-click="ShowTranRelation(this.data)"><i class="fas fa-info text-infor"></i> Show Relation</a></li>' +
                        '<li ng-show="this.data.VoucherType==3"><a data-toggle="tooltip" data-placement="top" title="Tag With Purchase Invoice" ng-click="GetPurchaseList(this.data)"><i class="fa fa-info text-info"></i> Tag PI</a> </li>' +
                        '<li ng-show="this.data.VoucherType==3"><a data-toggle="tooltip" data-placement="top" title="Un-Tag From Purchase Invoice" ng-click="UnTagJournal(this.data)"><i class="fa fa-info text-info"></i> Un-Tag PI</a> </li>' +
                        '</ul>' +
                        '</div>';
                },
                pinned: 'right'
            },
        ];


        $scope.gridOptions = {
            onCellContextMenu: onCellContextMenu, // Handle right-click event
            // a default column definition with properties that get applied to every column
            angularCompileRows: true,
            defaultColDef: {
                filter: true,
                resizable: true,
                sortable: true,

                // set every column width
                width: 90
            },
            columnDefs: $scope.columnDefs,
			overlayLoadingTemplate: "Please Click the Load Bottom to display the data",
            enableColResize: true,
            rowData: null,
            filter: true,
            enableFilter: true,
            rowSelection: 'multiple',
            suppressHorizontalScroll: true,
            cellSelection: true,
            alignedGrids: [],
            onFilterChanged: function (e) {
                //console.log('onFilterChanged', e);

                var dt = {
                    DispalyValue: "TOTAL =>",
                    DrAmount: 0,
                    CrAmount: 0
                };

                $scope.gridOptions.api.forEachNodeAfterFilterAndSort(function (node) {
                    var dc = node.data;
                    if (dc.IsParent == true) {
                        dt.DrAmount += dc.DrAmount;
                        dt.CrAmount += dc.CrAmount;
                    }
                });
                var filterDataColl = [];
                filterDataColl.push(dt);

                $scope.gridOptionsBottom.api.setRowData(filterDataColl);

            },
            getNodeChildDetails: function (beData) {
                var dataColl = [];
                if (beData.IsInventory==false) {

                    if (beData.VoucherType == 3)
                    {
                        if (beData.LedgerAllocationColl && beData.LedgerAllocationColl.length > 0) {
                            var drAmt =isEmptyAmt(beData.LedgerAllocationColl[0].DrAmount);
                            if (drAmt != beData.TransactionAmt) {
                                angular.forEach(beData.LedgerAllocationColl, function (data) {
                                    dataColl.push(data);
                                });
                            }
                            else {
                                var first = true;
                                if (beData.LedgerAllocationColl) {
                                    if (beData.LedgerAllocationColl.length > 0) {
                                        angular.forEach(beData.LedgerAllocationColl, function (data) {

                                            if (first == true) {
                                                first = false;
                                            } else
                                                dataColl.push(data);
                                        });
                                    }
                                }
                            }
                        }
                        
                    }
                    else {
                        var first = true;
                        if (beData.LedgerAllocationColl) {
                            if (beData.LedgerAllocationColl.length > 0) {
                                angular.forEach(beData.LedgerAllocationColl, function (data) {

                                    if (first == true) {
                                        first = false;
                                    } else
                                        dataColl.push(data);
                                });
                            }
                        }
                    }
                    

              
                    if (beData.Narration && beData.Narration.length > 0)
                        dataColl.push("(" + beData.Narration + ")");
                }
                else if (beData.IsInventory==true) {

                    //Dynamic.BusinessEntity.Account.VoucherTypes.StockTransfor=19
                    if (beData.VoucherType != 19) {
                        if (beData.Particulars && beData.Particulars.trim().Length > 0)
                            dataColl.Add(beData.Particulars);
                    }
                     

                    if (beData.ItemAllocationColl && beData.ItemAllocationColl.length > 0) {
                        angular.forEach(beData.ItemAllocationColl, function (ias) {
                            dataColl.push(ias);
                        });
                    }

                    if (beData.AditionalCostColl && beData.AditionalCostColl.length > 0) {
                        angular.forEach(beData.AditionalCostColl, function (ad) {
                            dataColl.push(ad);
                        });
                    }

                    if (beData.Narration && beData.Narration.length > 0)
                        dataColl.push("(" + beData.Narration + ")");

                } else
                    return null;

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


        $scope.dataForBottomGrid = [
            {
                DispalyValue: 'Total =>',
            }];

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

        $timeout(function () {
            GlobalServices.getListState(EntityId, $scope.gridOptions);
        });

        $scope.comDet = {};
        GlobalServices.getCompanyDet().then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.comDet = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        //$scope.ProjectColl = [];
        //GlobalServices.getProject().then(function (res) {
        //    if (res.data.IsSuccess && res.data.Data) {
        //        $scope.ProjectColl = res.data.Data;
        //    }
        //}, function (reason) {
        //    Swal.fire('Failed' + reason);
        //});

        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        //$scope.VoucherSearchOptions = [{ text: 'ToGodown', value: 'G1.Name', searchType: 'text' }, { text: 'FromGodown', value: 'G.Name', searchType: 'text' }, { text: 'Transfer No.', value: 'TS.AutoManualNo', searchType: 'text' }, { text: 'RefNo', value: 'TS.[No]', searchType: 'text' }, { text: 'VoucherDate', value: 'TS.VoucherDate', searchType: 'date' }, { text: 'Voucher', value: 'V.VoucherName', searchType: 'text' }, { text: 'CostClass', value: 'CC.Name', searchType: 'text' }];
        //$scope.paginationOptions = {
        //    pageNumber: 1,
        //    pageSize: GlobalServices.getPerPageRow(),
        //    sort: null,
        //    SearchType: 'text',
        //    SearchCol: '',
        //    SearchVal: '',
        //    SearchColDet: $scope.VoucherSearchOptions[4],
        //    pagearray: [],
        //    pageOptions: [5, 10, 20, 30, 40, 50]
        //};


        //$scope.mandetoryFields = {};
        /*$scope.PaymentTermList = [];*/
        //$scope.PaymentTermList.push('CASH');
        //$scope.PaymentTermList.push('BANK');
        //$scope.PaymentTermList.push('CREDIT');
        $scope.VoucherTypeColl = [];
        $scope.CostClassColl = [];
        //$scope.NarrationList = [];
        $scope.SelectedVoucher = null;
        $scope.SelectedCostClass = null;
        //$scope.SalesFeatures = {};
        //$scope.Config = {};
        $scope.RefItemAllocationColl = [];
        $scope.GodownColl = [];

        $scope.HideShow = {
            Godown: true,
            VoucherType: true,
            CostClass: true,
            AutoVoucherNo: true,
            PartyCostCenter: true,
            TranCostCenter: true,
            Agent: true,
            Currency: true,
            RefNo: true,
            SalesLedger: true,
            BilledQty: true,
            Discount: true,
            DiscountAmt: true,
            DiscountPer: true,
            CurrentBalance: true,
            FreeQty: true,
            Scheme: true,
            SchemeAmt: true,
            SchemePer: true,
            ProductDescript: true,
            ProductPoint: true,
            ProductLedger: true,
            ShowProductWiseLedger: true,
            AlternetUnit: true,
            AlternetUnit1: true,
            AlternetUnit2: true,
            EntryDate: true,
            Batch: true,
            EachNarration: true,
            ExciseDuty: true,
            Vat: true,
            Amount: false,
            Rate: false,
            NotEffectQty: true,
            ActiveBarCode: true,
            MRP: true,
            SalesRate: true,
            TradeRate: true,
        }

        $scope.beData =
        {
            UniqueId: GlobalServices.getUniqueId(),
            VoucherId: 0,
            TranId: 0,
            ProductBrandId: 0,
            AutoManualNo: '',
            AutoVoucherNo: 0,

            partySideBarData: null,
            SalesMan: null,
            salesmanSideBarData: null,
            CurRate: 1,
            SourceItemDetailsColl: [],
            TargetItemDetailsColl: [],
            SourceItemColl: [],
            TargetItemColl: [],
            AttechFiles: [],
            SubTotal: 0,
            Total: 0,
            SourceGodownId: 0,
            TargetGodownId: 0,
            Narration: '',
            VoucherDate: new Date(),
            SalesQuotationDetail: {},
            RefTranIdColl: [],
            UDFFeildsColl: [],
            DocumentColl: [],
        };

        $scope.beData.SourceItemDetailsColl.push(
            {
                RowType: 'P',
                ProductId: 0,
                productDetail: null,
                ActualQty: 0,
                BilledQty: 0,
                FreeQty: 0,
                Rate: 0,
                DiscountPer: 0,
                DiscountAmt: 0,
                SchameAmt: 0,
                SchamePer: 0,
                Amount: 0,
                Description: '',
                QtyPoint: 0,
                UnitId: null,
                CanEditRate: false,
                ALValue1: 0,
                ALValue2: 0,
                ALUnitId1: null,
                ALUnitId2: null,
                SchemeAmt: 0,
                SchemeAmt: 0,
                QtyDecimal: 2,
                RateDecimal: 2,
                AmountDecimal: 2,
                UDFFeildsColl: [],
            });
        $('.hideSideBar').on('focus', function (e) {
            $('#sidebarzz').removeClass();
            $('#sidebarzz').addClass('order-last float-right active');
        })

        $scope.ProductBrandColl = []; //declare an empty array 
        $http({
            method: 'GET',
            url: base_url + "Inventory/Creation/GetAllProductBrand",
            dataType: "json"
            //data:JSON.stringify(para)
        }).then(function (res) {
            $scope.ProductBrandColl = res.data.Data;
        }, function (reason) {
            alert('Failed' + reason);
        });
        $scope.UnitColl = [];
        $http({
            method: 'GET',
            url: base_url + "Inventory/Creation/GetAllUnit",
            dataType: "json"
            //data:JSON.stringify(para)
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.UnitColl = mx(res.data.Data);
            }
        }, function (reason) {
            alert('Failed' + reason);
        });

        $scope.CurrencyColl = [];
        $http({
            method: 'GET',
            url: base_url + "Account/Creation/GetAllCurrency",
            dataType: "json"
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.CurrencyColl = res.data.Data;
            }
        }, function (reason) {
            alert('Failed' + reason);
        });


        $scope.EPDet = {};
        $scope.EPColl = [];
        $scope.ItemFormula = {};
        GlobalServices.getEntityProperties(EntityId).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.EPColl = res.data.Data;
                angular.forEach($scope.EPColl, function (ep) {
                    $scope.EPDet[ep.Name] = ep;
                    //$scope.newProduct[ep.Name] = ep.DefaultValue;
                });

                if ($scope.EPDet) {
                    for (key in $scope.EPDet) {
                        if (key.startsWith("ItemAllocationColl") == true) {
                            var proName = key.replace("ItemAllocationColl.", "");

                            if ($scope.EPDet[key].Formula && $scope.EPDet[key].Formula.length > 0)
                                $scope.ItemFormula[proName] = $scope.EPDet[key].Formula;
                        }
                    }
                }
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

       
        $scope.RefVoucherNoColl = [];
        $('#cboRefVoucherNo').select2();
        $('#cboRefVoucherNo').on("change", function (e) {
            var selectedData = $('#cboRefVoucherNo').select2('data');
            if (selectedData && selectedData.length > 0) {
                $scope.beData.RefTranIdColl = [];
                $scope.beData.RefAllotationIdColl = [];

                angular.forEach(selectedData, function (sd) {
                    $scope.beData.RefTranIdColl.push(parseInt(sd.id));
                });
                var refTranIdColl = mx($scope.beData.RefTranIdColl);
                var lstSelectedItem = null;
                angular.forEach($scope.RefItemAllocationColl, function (ri) {
                    if (refTranIdColl.contains(ri.TranId)) {
                        ri.IsSelected = true;
                        lstSelectedItem = ri;
                        $scope.beData.RefAllotationIdColl.push(ri.ItemAllocationId);
                    } else
                        ri.IsSelected = false;
                });
            }

        });

        $scope.TableIdColl = [{ id: 'main-table', text: 'Table', visible: false }];

    }

    function GetCustomRptColumns() {
        $scope.CustomRptColumn = {
            Qry: '',
            ColumnList: '',
            MapColl: [],
        };

        GlobalServices.getCustomRptColumns(EntityId).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.CustomRptColumn = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

    }
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
    $scope.toggleExpandCollapse = function () {
        if ($scope.dayBook.ExpandCollapse == true) {
            $scope.gridOptions.api.expandAll();
        } else {
            $scope.gridOptions.api.collapseAll();
        }
    };

    $scope.PostAllVoucher = function (e) {

        if ($scope.dayBook.For != 2)
            return;


        Swal.fire({
            title: 'Do you want to post all voucher ?',
            showCancelButton: true,
            confirmButtonText: 'Post',
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                $scope.loadingstatus = "running";
                showPleaseWait();

                var tranColl = [];

                $scope.gridOptions.api.forEachNodeAfterFilterAndSort(function (node) {

                    if (node.data.VoucherType != 19) {
                        if (node.data.VoucherType && node.data.IsParent == true) {
                            var nd = node.data;
                            tranColl.push({
                                TranId: nd.TranId,
                                VoucherType: nd.VoucherType,
                                VoucherId: nd.VoucherId,
                                VoucherDate: nd.VoucherDate
                            });
                        }
                    }

                });

                $http({
                    method: 'POST',
                    url: base_url + "Global/PostAccInvTransaction",
                    headers: { 'Content-Type': undefined },

                    transformRequest: function (data) {
                        var formData = new FormData();
                        formData.append("jsonData", angular.toJson(data.jsonData));
                        return formData;
                    },
                    data: { jsonData: tranColl }
                }).then(function (res1) {

                    hidePleaseWait();
                    $scope.loadingstatus = "stop";
                    if (res.data.IsSuccess) {
                        $scope.GetDayBook();
                    } else {
                        Swal.fire(res.data.ResponseMSG);
                    }

                }, function (errormessage) {
                    hidePleaseWait();
                    //$scope.loadingstatus = "stop";
                    Swal.fire(errormessage);
                });


            }
        });

    }

    $scope.SelectedVoucherP = null;
    $scope.PostModal = function (e) {

        if ($scope.dayBook.For != 2)
            return;

        var obj = e.data; 

        if (!obj)
            return;

        $scope.SelectedVoucherP = obj;

        if (obj.VoucherType == 19 || obj.VoucherType==41)
            return;

        var para = {
            voucherId: obj.VoucherId
        };

        $http({
            method: 'POST',
            url: base_url + "Account/Creation/GetVMForDayBook",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                var vm = res.data.Data;

                if (vm.NeedPostRemarks == true) {
                    $scope.SelectedVoucherP.NeedPostRemarks = vm.NeedPostRemarks;
                    $('#modal-post').modal('show');

                } else {
                    $scope.SelectedVoucherP.NeedPostRemarks = false;
                    $scope.PostVoucher();
                }

            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });



    }
    $scope.PostVoucher = function () {

        if ($scope.dayBook.For != 2 || !$scope.SelectedVoucherP)
            return;

        var obj = $scope.SelectedVoucherP;

        Swal.fire({
            title: 'Do you want to post the selected voucher(' + obj.VoucherName + ') :- ' + obj.AutoManualNo + ' ? ',
            showCancelButton: true,
            confirmButtonText: 'Post',
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                $scope.loadingstatus = "running";
                showPleaseWait();

                var tranColl= [];
                //tranColl.push(obj);

                if ($scope.SelectedVoucherP.NeedPostRemarks == true && isEmptyObj($scope.SelectedVoucherP.VerifyRemarks) == true) {
                    Swal.fire('Remarks missing');
                    return;
                }

                tranColl.push({
                    TranId: obj.TranId,
                    VoucherType: obj.VoucherType,
                    VoucherId: obj.VoucherId,
                    VoucherDate: obj.VoucherDate,
                    VerifyRemarks: obj.VerifyRemarks
                });

                
                if ($scope.InvConfig.GenerateInvoiceOnDeliveryPost == true && obj.VoucherType == 12) {

                    hidePleaseWait();
                    $scope.loadingstatus = "stop";
                    Swal.fire('Post Not Allow From Day Book');

                    //$http({
                    //    method: 'POST',
                    //    url: base_url + "Global/PostDNWithInvTransaction",
                    //    dataType: "json",
                    //    data: JSON.stringify(tranColl)
                    //}).then(function (res) {
                    //    hidePleaseWait();
                    //    $scope.loadingstatus = "stop";
                    //    if (res.data.IsSuccess) {
                    //        var saveRes = res.data.Data;
                    //        $('#modal-post').modal('hide');
                    //        $scope.GetDayBook();
                    //        $scope.PrintVoucher(saveRes.TranId, 14, saveRes.VoucherId);

                    //    } else {
                    //        Swal.fire(res.data.ResponseMSG);
                    //    }

                    //}, function (reason) {
                    //    Swal.fire('Failed' + reason);
                    //});
                }
                else {
                    $http({
                        method: 'POST',
                        url: base_url + "Global/PostAccInvTransaction",
                        dataType: "json",
                        data: JSON.stringify(tranColl)
                    }).then(function (res) {
                        hidePleaseWait();
                        $scope.loadingstatus = "stop";
                        if (res.data.IsSuccess) {
                            $scope.GetDayBook();
                            $('#modal-post').modal('hide');
                        } else {
                            Swal.fire(res.data.ResponseMSG);
                        }

                    }, function (reason) {
                        Swal.fire('Failed' + reason);
                    });
                }

              
            }
        });

    }


    $scope.SelectedVoucherUnPost = null;
    $scope.UnPostModal = function (e) {

        if ($scope.dayBook.For != 1)
            return;

        var obj = e.data;

        if (!obj)
            return;

        $scope.SelectedVoucherUnPost = obj;

        if (obj.VoucherType == 19 || obj.VoucherType == 41)
            return;
 
        $scope.UnPostVoucher();

    }
    $scope.UnPostVoucher = function () {

        if ($scope.dayBook.For != 1 || !$scope.SelectedVoucherUnPost)
            return;

        var obj = $scope.SelectedVoucherUnPost;

        Swal.fire({
            title: 'Do you want to un-post the selected voucher(' + obj.VoucherName + ') :- ' + obj.AutoManualNo + ' ? ',
            showCancelButton: true,
            confirmButtonText: 'UnPost',
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                $scope.loadingstatus = "running";
                showPleaseWait();

                var tranColl = [];
 
                tranColl.push({
                    TranId: obj.TranId,
                    VoucherType: obj.VoucherType,
                    VoucherId: obj.VoucherId,
                    VoucherDate: obj.VoucherDate,
                    VerifyRemarks: obj.VerifyRemarks
                });

                $http({
                    method: 'POST',
                    url: base_url + "Global/UnPostAcInvTransaction",
                    dataType: "json",
                    data: JSON.stringify(tranColl)
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

    }

    $scope.SelectedVoucher = null;
    $scope.CancelModal = function (e) {

        if ($scope.dayBook.For == 3)
            return;

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


    $scope.VerifyModal = function (e) {


        var obj = e.data;

        if (!obj)
            return;

        $scope.SelectedVoucher = obj;
        $scope.GetTransactionById(obj);
        $('#modal-verifyv').modal('show');

    }
    $scope.VerifyVoucher = function () {
        $('#modal-verifyv').modal('hide');

        var obj = $scope.SelectedVoucher;

        if (obj.VoucherType == 19 || obj.VoucherType == 41)
            return;

        Swal.fire({
            title: 'Do you want to verify the selected voucher(' + obj.VoucherName + ') :- ' + obj.AutoManualNo + ' ? ',
            showCancelButton: true,
            confirmButtonText: 'Yes',
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                $scope.loadingstatus = "running";
                showPleaseWait();

                var tr = {
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
                };



                $http({
                    method: 'POST',
                    url: base_url + "Global/VerifyAccInvTransaction",
                    dataType: "json",
                    data: JSON.stringify(tr)
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

    $scope.RejectModal = function (e) {


        var obj = e.data;

        if (!obj)
            return;

        if (obj.VoucherType == 19 || obj.VoucherType == 41)
            return;

        $scope.SelectedVoucher = obj;

        $('#modal-rejectv').modal('show');

    }
    $scope.RejectVoucher = function () {
        $('#modal-rejectv').modal('hide');

        var obj = $scope.SelectedVoucher;

        Swal.fire({
            title: 'Do you want to reject the selected voucher(' + obj.VoucherName + ') :- ' + obj.AutoManualNo + ' ? ',
            showCancelButton: true,
            confirmButtonText: 'Yes',
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                $scope.loadingstatus = "running";
                showPleaseWait();

                var tr = {
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
                };

                $http({
                    method: 'POST',
                    url: base_url + "Global/RejectAccInvTransaction",
                    dataType: "json",
                    data: JSON.stringify(tr)
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

    $scope.ShowVoucher = function (e) {
        var obj = e.data;

        $(document).ready(function () {
            $('body').css('cursor', 'wait');
        });

        var para = {
            voucherType:obj.VoucherType,
            tranId :obj.TranId,
        };
        var frame = document.getElementById("frmChieldForm");
        var frameDoc = frame.contentDocument || frame.contentWindow.document;
        if(frameDoc)
            frameDoc.removeChild(frameDoc.documentElement);

        frame.src = '';
        frame.src = base_url + "Global/ShowAccInvTransaction?" + param(para);
        document.body.style.cursor = 'default';

        $('#frmChieldForm').on('load', function () {
            $('body').css('cursor', 'default');
        });

        $('#frmChield').modal('show');
    }
    $scope.deleteVoucher = function (e) {

        var obj = e.data;

        var tranId = obj.TranId, voucherType = obj.VoucherType, voucherId = obj.VoucherId, voucherName = obj.VoucherName, voucherNo = obj.AutoManualNo;

        if (obj.VoucherType == 14 || obj.VoucherType == 16) {
            if ($scope.ButtonED.IRD == true) {
                Swal.fire('Access denied');
                return;
            }
        }

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
                    tranId: tranId,
                    voucherDate: obj.VoucherDate,
                    CostClassId:obj.CostClassId,
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
                        $scope.GetDayBook();
                    } else {
                        Swal.fire(res.data.ResponseMSG);
                    }

                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }
        });

    }

    $scope.UserWiseColl = [];
    $scope.GetDayBook = function () {

        $scope.RptDataColl = [];
        $scope.DataColl = []; //declare an empty array
        $scope.gridOptions.api.setRowData($scope.DataColl);

        $scope.UserWiseColl = [];
        var dateFrom = new Date(($filter('date')(new Date(), 'yyyy-MM-dd')));
        var dateTo = new Date(($filter('date')(new Date(), 'yyyy-MM-dd')));

        if ($scope.dayBook.DateFromDet)
            dateFrom = new Date(($filter('date')($scope.dayBook.DateFromDet.dateAD, 'yyyy-MM-dd')));

        if ($scope.dayBook.DateToDet)
            dateTo = new Date(($filter('date')($scope.dayBook.DateToDet.dateAD, 'yyyy-MM-dd')));
         

        $scope.loadingstatus = 'running';
        showPleaseWait();

        var beData = {
            DateFrom: dateFrom,
            DateTo: dateTo,
            VoucherType: ($scope.dayBook.VoucherId ? $scope.dayBook.VoucherId : 0),
            isPost: $scope.dayBook.IsPost,
            branchId: $scope.dayBook.BranchId,
            For: $scope.dayBook.For,
            PaymentTermsId: $scope.dayBook.PaymentTermsId
        };

        $scope.loadingstatus = 'running';

        $http({
            method: "post",
            url: base_url + "Account/Reporting/GetDayBook",
            data: JSON.stringify(beData),
            dataType: "json"
        }).then(function (res) {

            $scope.dayBook.currenttime= new Date();

            if (res.data.Data.length > 0) {
                $scope.RptDataColl = res.data.Data;
                $scope.ForCustomColumn = $scope.RptDataColl[0];
            }
             
            var dt = {
                DispalyValue: "TOTAL =>",
                DrAmount: 0,
                CrAmount: 0
            };
            angular.forEach($scope.RptDataColl, function (dc) {
                dt.DrAmount += dc.DrAmount;
                dt.CrAmount += dc.CrAmount;
            });
            var filterDataColl = [];
            filterDataColl.push(dt);

            $scope.gridOptionsBottom.api.setRowData(filterDataColl);

            $scope.gridOptions.api.setRowData($scope.RptDataColl);

            if ($scope.comDet.Maintain == 3) {
                var tmpUserTran = [];
                angular.forEach($scope.RptDataColl, function (trn) {
                    if (trn.VoucherType == 14) {
                        var iscash = false;
                        var findPT = $scope.PaymentTermColl_Qry.firstOrDefault(p1 => p1.Name == trn.PaymentTerms);
                        if (findPT)
                            iscash = findPT.IsCash;

                        var trnData = {
                            User: trn.CreatedByName,
                            SalesCash: (iscash ? trn.DrAmount : 0),
                            SalesCredit: (iscash ? 0 : trn.DrAmount),
                            ReturnCash: 0,
                            ReturnCredit: 0,
                            Receipt: 0,
                            Payment: 0,
                        };
                        tmpUserTran.push(trnData);

                    } else if (trn.VoucherType == 16) {

                        var iscash = false;
                        var findPT = $scope.PaymentTermColl_Qry.firstOrDefault(p1 => p1.Name == trn.PaymentTerms);
                        if (findPT)
                            iscash = findPT.IsCash;

                        var trnData = {
                            User: trn.CreatedByName,
                            SalesCash: 0,
                            SalesCredit: 0,
                            ReturnCash: (iscash ? trn.CrAmount : 0),
                            ReturnCredit: (iscash ? 0 : trn.CrAmount),
                            Receipt: 0,
                            Payment: 0,
                        };
                        tmpUserTran.push(trnData);

                    } else if (trn.VoucherType == 1) {

                        var trnData = {
                            User: trn.CreatedByName,
                            SalesCash: 0,
                            SalesCredit: 0,
                            ReturnCash: 0,
                            ReturnCredit: 0,
                            Receipt: trn.TransactionAmt,
                            Payment: 0,
                        };
                        tmpUserTran.push(trnData);

                    } else if (trn.VoucherType == 2) {
                        var trnData = {
                            User: trn.CreatedByName,
                            SalesCash: 0,
                            SalesCredit: 0,
                            ReturnCash: 0,
                            ReturnCredit: 0,
                            Receipt: 0,
                            Payment: trn.TransactionAmt,
                        };
                        tmpUserTran.push(trnData);
                    }
                });

                var groupTran = mx(tmpUserTran).groupBy(t => t.User);
                angular.forEach(groupTran, function (gt) {
                    var newTran = {
                        User: gt.key,
                        SalesCash: 0,
                        SalesCredit: 0,
                        ReturnCash: 0,
                        ReturnCredit: 0,
                        Receipt: 0,
                        Payment: 0,
                        NetSales: 0,
                        NetCash: 0,
                        NetCashBal: 0
                    };
                    angular.forEach(gt.elements, function (el) {
                        newTran.SalesCash = newTran.SalesCash + el.SalesCash;
                        newTran.SalesCredit = newTran.SalesCredit + el.SalesCredit;
                        newTran.ReturnCash = newTran.ReturnCash + el.ReturnCash;
                        newTran.ReturnCredit = newTran.ReturnCredit + el.ReturnCredit;
                        newTran.Receipt = newTran.Receipt + el.Receipt;
                        newTran.Payment = newTran.Payment + el.Payment;
                    });
                    newTran.NetSales = newTran.SalesCash - newTran.ReturnCash;
                    newTran.NetCash = newTran.Receipt - newTran.Payment;
                    newTran.NetCashBal = newTran.NetSales + newTran.NetCash;
                    $scope.UserWiseColl.push(newTran);
                });
            }

            $scope.loadingstatus = "stop";
            hidePleaseWait();

        }, function (errormessage) {

            $scope.loadingstatus = 'stop';

            alert('Unable to Store data. pls try again.' + errormessage.responseText);
        });

    };



    $scope.PostSelectedVoucher = function () {

        var pendingDataColl = []; //declare an empty array

        $scope.gridOptions.api.forEachNodeAfterFilterAndSort(function (node) {

            if (node.data.VoucherType)
                pendingDataColl.push(node.data);
        });

        $scope.loadingstatus = 'running';

        $http({
            method: "post",
            url: base_url + "Account/Reporting/PostPendingVoucher",
            data: JSON.stringify(pendingDataColl),
            dataType: "json"
        }).then(function (res) {

            $scope.loadingstatus = 'done';
            alert(res.data.ResponseMSG);

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

                                                    var findV = mx($scope.VoucherTypeList).firstOrDefault(p1 => p1.id == $scope.dayBook.VoucherId);

                                                    var rptPara = {
                                                        rpttranid: rptTranId,
                                                        istransaction: false,
                                                        entityid: EntityId,
                                                        voucherid: 0,
                                                        tranid: 0,
                                                        vouchertype: 0,
                                                        sessionid: res.data.Data.ResponseId,
                                                        Period: $scope.dayBook.DateFromDet.dateBS + " TO " + $scope.dayBook.DateToDet.dateBS,
                                                        Voucher: findV ? findV.text : '',
                                                        FileName:(selectedRpt ? selectedRpt.PDFFileName : ''),
                                                    };
                                                    var paraQuery = param(rptPara);
                                                     
                                                    GlobalServices.ShowPrintPreview(PrintPreviewAs, base_url + "web/ReportViewer.aspx?" + paraQuery);

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

                                var findV = mx($scope.VoucherTypeList).firstOrDefault(p1 => p1.id == $scope.dayBook.VoucherId);

                                var rptPara = {
                                    rpttranid: rptTranId,
                                    istransaction: false,
                                    entityid: EntityId,
                                    voucherid: 0,
                                    tranid: 0,
                                    vouchertype: 0,
                                    sessionid: res.data.Data.ResponseId,
                                    Period: $scope.dayBook.DateFromDet.dateBS + " TO " + $scope.dayBook.DateToDet.dateBS,
                                    Voucher: findV ? findV.text : '',
                                    FileName: (selectedRpt ? selectedRpt.PDFFileName : ''),
                                };
                                var paraQuery = param(rptPara);

                                GlobalServices.ShowPrintPreview(PrintPreviewAs, base_url + "web/ReportViewer.aspx?" + paraQuery);

                                

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
        });


        var filterData = [];

        $scope.gridOptions.api.forEachNodeAfterFilterAndSort(function (node) {
            var dayBook = node.data;
            if (dayBook.IsParent == true) {
                var beData = {};

                beData.VoucherName = dayBook.VoucherName;
                beData.VoucherType = dayBook.VoucherType;
                beData.AutoManualNo = dayBook.AutoManualNo;
                beData.AutoVoucherNo = dayBook.AutoVoucherNo;
                beData.CanUpdateDocument = dayBook.CanUpdateDocument;
                beData.CostClassName = dayBook.CostClassName;
                beData.IsInventory = dayBook.IsInventory;
                beData.IsParent = true;
                beData.Narration = dayBook.Narration;
                beData.ND = dayBook.ND;
                beData.NM = dayBook.NM;
                beData.NY = dayBook.NY;
                beData.RefNo = dayBook.RefNo;
                beData.VoucherDate = dayBook.VoucherDate;
                beData.VoucherDateStr = DateFormatAD(dayBook.VoucherDate);
                beData.VoucherDateStrNP = DateFormatBS(beData.NY, beData.NM, beData.ND);
                beData.CreatedByName = dayBook.CreatedByName;
                beData.SSFCode = dayBook.SSFCode;                 
                beData.Buyes = dayBook.Buyes;
                beData.PanVatNo = dayBook.PanVatNo;
                beData.Address = dayBook.Address;
                beData.PaymentTerms = dayBook.PaymentTerms;
                beData.Agent = dayBook.Agent;
                beData.RefAutoManualNo = dayBook.RefAutoManualNo;
                beData.VerifyRemarks = dayBook.VerifyRemarks;
                beData.RejectRemarks = dayBook.RejectRemarks;

                if (beData.IsInventory == true) {
                    beData.Particulars = dayBook.PartyLedger;
                    beData.DrAmount = dayBook.DrAmount;
                    beData.CrAmount = dayBook.CrAmount;
                    filterData.push(beData);

                    if ($scope.dayBook.IsSummary == false) {
                        var ledData = {};
                        ledData.Particulars = "  " + dayBook.Particulars;

                        if (!dayBook.AditionalCostColl)
                            dayBook.AditionalCostColl = [];

                        if (dayBook.DrAmount != 0 && dayBook.AditionalCostColl.length > 0)
                            ledData.CrAmount = dayBook.DrAmount - mx(dayBook.AditionalCostColl).sum(p1 => p1.Amount);
                        else if (dayBook.AditionalCostColl.length > 0)
                            ledData.DrAmount = dayBook.CrAmount - mx(dayBook.AditionalCostColl).sum(p1 => p1.Amount);

                        filterData.push(ledData);

                        angular.forEach(dayBook.AditionalCostColl, function (add) {

                            var addData = {};
                            addData.Particulars = "  " + add.LedgerName;
                            if (dayBook.DrAmount != 0) {
                                addData.CrAmount = add.Amount;
                            }
                            else {
                                addData.DrAmount = add.Amount;
                            }
                            filterData.push(addData);
                        });

                        if (!dayBook.ItemAllocationColl)
                            dayBook.ItemAllocationColl = [];

                        angular.forEach(dayBook.ItemAllocationColl, function (item) {

                            var itemData = {};
                            itemData.Particulars = "    " + item.ProductName + " ( " + item.BilledQty + item.UnitName + " @ " + item.Rate + " = " + item.Amount + " )";
                            filterData.push(itemData);

                        });

                    }

                } else {
                    var firstTime = true;

                    if (!dayBook.LedgerAllocationColl)
                        dayBook.LedgerAllocationColl = [];

                    angular.forEach(dayBook.LedgerAllocationColl, function (ledAll) {
                        if (firstTime) {
                            beData.Particulars = ledAll.LedgerName;
                            beData.DrAmount = ledAll.DrAmount;
                            beData.CrAmount = ledAll.CrAmount;
                            firstTime = false;

                            filterData.push(beData);
                        }
                        else {

                            if ($scope.dayBook.IsSummary == false) {
                                var chieldData = {};
                                chieldData.Particulars = "  " + ledAll.LedgerName;
                                chieldData.Narration = ledAll.Narration;
                                chieldData.DrAmount = ledAll.DrAmount;
                                chieldData.CrAmount = ledAll.CrAmount;
                                filterData.push(chieldData);
                            }

                        }
                    });
                }
            }

        });

        return filterData;

    };

    $scope.onFilterTextBoxChanged = function () {
        $scope.gridOptions.api.setQuickFilter($scope.search);
    }

    $scope.PrintVoucher = function (tranId, voucherType, voucherId,directPrint) {


        if (voucherType == 14 && directPrint==false) {
            Swal.fire('Please ! Print Invoice From Voucher Entry');
            return;
        }

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
                            url: base_url + "ReportEngine/GetReportTemplates?entityId=" + entityId + "&voucherId=" + voucherId + "&isTran=true&vtranId=" + tranId,
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

                    if ($scope.SelectedTran.DocumentColl) {
                        $scope.SelectedTran.DocumentColl.forEach(function (dc) {
                            dc.DocPath = base_url + dc.DocPath;
                        });
                    }

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


    $scope.GenerateReceipt = function (e) {

        var obj = e.data;

        if (!obj)
            return;

        Swal.fire({
            title: 'Do you want to generate receipt the selected voucher(' + obj.VoucherName + ') :- ' + obj.AutoManualNo + ' ? ',
            showCancelButton: true,
            confirmButtonText: 'Yes',
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                $scope.loadingstatus = "running";
                showPleaseWait();

                var tranColl1 = [];

                var para = {
                    TranId: obj.TranId,
                    VoucherType: obj.VoucherType
                }

                $http({
                    method: 'POST',
                    url: base_url + "Account/Reporting/GenerateRec",
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


    $scope.DownloadAsXls = function () {

        $scope.loadingstatus = 'running';
        showPleaseWait();

        var dataColl = $scope.GetDataForPrint();

        var paraData = {
            Period: $scope.dayBook.DateFromDet.dateBS + " TO " + $scope.dayBook.DateToDet.dateBS,
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
                down_file(base_url + "//" + res.data.Data.ResponseId, "DayBook.xlsx");
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
            CostClassId: curRow.CostClassId,
            JournalTranId: 0,
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

        angular.forEach($scope.PurchaseColl, function (pc) {
            if (pc.IsSelected == true) {
                tmpSelectedVoucherColl.push({
                    JournalTranId: $scope.CurJV.TranId,
                    PurchaseTranId: pc.TranId
                });
            }
        });

        if (tmpSelectedVoucherColl.length > 0) {

            $http({
                method: 'POST',
                url: base_url + "Account/Transaction/TagJournalToPI",
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

        Swal.fire({
            title: 'Do you want to un-tag the selected voucher(' + curRow.VoucherName + ') :- ' + curRow.AutoManualNo + ' ? ',
            showCancelButton: true,
            confirmButtonText: 'Un-Tag',
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                $scope.loadingstatus = "running";
                showPleaseWait();

                $http({
                    method: 'POST',
                    url: base_url + "Account/Transaction/UnTagJournalToPI?TranId=" + curRow.TranId,
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
            GlobalServices.ShowTransactionRelation(curRow.VoucherType, curRow.TranId).then(function (res1) {
                $scope.loadingstatus = "stop";
                hidePleaseWait();
                if (res1.data.IsSuccess && res1.data.Data) {
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


  

    $scope.CurItemAllocation = null;
    $scope.ProductSelectionChange = function (itemDet, ind) {
        $scope.sideBarData = itemDet.sideBarData;
        $scope.CurItemAllocation = itemDet;
        var isModify = $scope.beData.TranId > 0 ? true : false;

        if (itemDet.ProductId > 0 && (itemDet.productDetail == null || itemDet.productDetail === undefined)) {

            $scope.loadingstatus = 'running';
            showPleaseWait();
            $http({
                method: 'GET',
                url: base_url + "Global/GetProductDetail?ProductId=" + itemDet.ProductId + " & VoucherType=" + $scope.SelectedVoucher.VoucherType + "&VoucherId=" + $scope.SelectedVoucher.VoucherId,
                dataType: "json"
            }).then(function (resLD) {

                $scope.loadingstatus = 'stop';
                hidePleaseWait();
                if (resLD.data.IsSuccess && resLD.data.Data) {
                    itemDet.productDetail = resLD.data.Data;
                    $scope.ProductSelectionChange(itemDet, ind);
                }
            }, function (reason) {
                alert('Failed' + reason);
            });

        }

        if (itemDet.ProductId == null || itemDet.ProductId == 0) {
            itemDet.ActualQty = 0;
            itemDet.BilledQty = 0;
            itemDet.Rate = 0;
            itemDet.ClosingQty = '';
            itemDet.UnitId = null;
            itemDet.UnitName = '';
            itemDet.DiscountAmt = 0;
            itemDet.DiscountPer = 0;
            itemDet.SchameAmt = 0;
            itemDet.SchamePer = 0;
            itemDet.ProductLedgerId = null;
            itemDet.LossRate = 0;
            itemDet.Makeing = 0;
            itemDet.Stone = 0;
            itemDet.NetWeight = 0;
            itemDet.LossWeight = 0;
            itemDet.BatchBalQty = 0;
            itemDet.TranUnitId = null;

            itemDet.FineRate = 0;
            itemDet.FineWeight = 0;
            itemDet.ProcessingRate = 0;
            itemDet.ProcessingWeight = 0;

            $scope.ChangeItemRowValue(itemDet, 'product');
        } else if (itemDet.productDetail) {

            itemDet.TranUnitId = itemDet.productDetail.SalesUnitId;
            itemDet.CanEditRate = itemDet.productDetail.CanEditRate;

            var refStockItem = false;
            if (itemDet.DeliveryNoteItemAllocationId > 0 || itemDet.OrderItemAllocationId > 0 || itemDet.DispatchSectionItemAllocationId > 0
                || itemDet.ReceivedNoteItemAllocationId > 0 || itemDet.ItemAllocationId > 0 || itemDet.DispatchSectionItemAllocationId > 0 || itemDet.ReceivedNoteItemAllocationId > 0 || itemDet.QuotationItemAllocationId > 0) {
                refStockItem = true;
            }

            if (isModify == false && refStockItem == false) {
                itemDet.Rate = itemDet.productDetail.SalesRate;
                itemDet.ProductLedgerId = itemDet.productDetail.SalesLedgerId;
                itemDet.LedgerId = itemDet.productDetail.SalesLedgerId;
            } else {

                if (!itemDet.ProductLedgerId || itemDet.ProductLedgerId == 0)
                    itemDet.ProductLedgerId = itemDet.productDetail.SalesLedgerId;

                if (!itemDet.LedgerId || itemDet.LedgerId == 0)
                    itemDet.LedgerId = itemDet.productDetail.SalesLedgerId;
            }

            itemDet.ClosingQty = $filter('formatNumber')((itemDet.productDetail.ClosingQty + (itemDet.RefQty > 0 ? itemDet.RefQty : 0))) + ' ' + itemDet.productDetail.BaseUnit;
            itemDet.UnitId = itemDet.productDetail.BaseUnitId;
            itemDet.UnitName = itemDet.productDetail.BaseUnit;
            itemDet.RateOf = itemDet.productDetail.RateOf;
            itemDet.LossRate = itemDet.productDetail.LossRate;
            itemDet.Makeing = 0;
            itemDet.Stone = 0;
            itemDet.BatchBalQty = 0;
            itemDet.FineRate = 0;
            itemDet.FineWeight = 0;
            itemDet.ProcessingRate = 0;
            itemDet.ProcessingWeight = 0;
            //itemDet.ActualQty = 0;
            //itemDet.BilledQty = 0;
            //itemDet.DiscountAmt = 0;
            //itemDet.DiscountPer = 0;

            if ($scope.SelectedVoucher.IsAbbInvoice == true && itemDet.productDetail.IsTaxable == true) {
                itemDet.Rate = itemDet.Rate + (itemDet.Rate * 13 / 100);
            }

            if ($scope.SelectedVoucher.Product && $scope.SelectedVoucher.Product.VoucherWiseDecimalPlaces == true) {
                itemDet.QtyDecimal = $scope.SelectedVoucher.Product.QtyNoOfDecimalPlaces;
                itemDet.RateDecimal = $scope.SelectedVoucher.Product.RateNoOfDecimalPlaces;
                itemDet.AmountDecimal = $scope.SelectedVoucher.Product.AmountNoOfDecimalPlaces;
            } else {
                var findUnit = $scope.UnitColl.firstOrDefault(p1 => p1.UnitId == itemDet.productDetail.BaseUnitId);
                if (findUnit) {
                    itemDet.QtyDecimal = findUnit.NoOfDecimalPlaces;
                    itemDet.RateDecimal = findUnit.RateNoOfDecimalPlaces;
                    itemDet.AmountDecimal = findUnit.AmountNoOfDecimalPlaces;
                }
            }


            if (isEmptyObj(itemDet.QtyDecimal))
                itemDet.QtyDecimal = 0;

            if (isEmptyObj(itemDet.RateDecimal))
                itemDet.RateDecimal = 2;

            if (isEmptyObj(itemDet.AmountDecimal))
                itemDet.AmountDecimal = 2;


            var clQty = ($filter('number')(itemDet.productDetail.ClosingQty, itemDet.QtyDecimal)).parseDBL();
            itemDet.productDetail.ClosingQty = clQty;
            itemDet.ClosingQty = clQty + ' ' + itemDet.productDetail.BaseUnit;

            if (itemDet.productDetail.IsFixedProduct == true) {
                $http({
                    method: 'GET',
                    url: base_url + "Inventory/Transaction/getDueFixedProductList?productId=" + itemDet.productDetail.ProductId + "&GodownId=" + $scope.beData.SourceGodownId,
                    dataType: "json"
                }).then(function (res) {
                    if (res.data.IsSuccess && res.data.Data) {
                        itemDet.productDetail.FixedProductColl = res.data.Data;
                        itemDet.FixedProductColl = res.data.Data;

                        if (isModify) {
                            itemDet.productDetail.FixedProductColl.push({
                                EngineNo: itemDet.EngineNo,
                                ChassissNo: itemDet.ChassissNo,
                                RegdNo: itemDet.RegdNo,
                                Model: itemDet.Model,
                                Type: itemDet.Type,
                                Color: itemDet.Color,
                                KeyNo: itemDet.KeyNo,
                                CodeNo: itemDet.CodeNo,
                                MFGYear: itemDet.MFGYear,
                            });
                        }

                        angular.forEach(itemDet.FixedProductColl, function (fp) {
                            fp.Amount = itemDet.Rate;
                        });

                        $('#mdlFixedProduct').modal('show');
                    }
                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }

            if (isModify == true) {
                var findB = mx(itemDet.productDetail.BatchWiseColl).firstOrDefault(p1 => p1.BatchNo == itemDet.Batch);
                if (findB) {
                    findB.BalQty = findB.BalQty + itemDet.ActualQty;
                    findB.BatchBalQty = findB.BalQty;
                    itemDet.BatchBalQty = itemDet.BatchBalQty + itemDet.ActualQty;
                    itemDet.productDetail.ClosingQty = itemDet.productDetail.ClosingQty + itemDet.ActualQty;
                } else {
                    itemDet.productDetail.ClosingQty = itemDet.productDetail.ClosingQty + itemDet.ActualQty;

                    itemDet.productDetail.BatchWiseColl.push({
                        Batch: itemDet.Batch,
                        BatchNo: itemDet.Batch,
                        EXPDate: itemDet.EXPDate,
                        MFGDate: itemDet.MFGDate,
                        BalQty: itemDet.ActualQty,
                        EngineNo: itemDet.EngineNo,
                        SalesRate: itemDet.SalesRate,
                        PurchaseRate: itemDet.PurchaseRate,
                        TradeRate: itemDet.TradeRate,
                        MRP: itemDet.MRP,
                        ClosingQty: itemDet.ActualQty,
                    });
                    itemDet.BatchBalQty = itemDet.BatchBalQty + itemDet.ActualQty;
                }
            }

            $scope.ChangeItemRowValue(itemDet, 'product');

            if (itemDet.productDetail.BatchWiseColl && itemDet.productDetail.BatchWiseColl.length > 0) {

                if (isModify == false)
                    itemDet.Batch = itemDet.productDetail.BatchWiseColl[0].BatchNo;
                else
                    itemDet.Batch = itemDet.Batch;

                $scope.ChangeBatch(itemDet);
            }

            if ($scope.SelectedVoucher.Product.ActiveRack == true) {

                if (itemDet.ModifyDetailsColl && itemDet.ModifyDetailsColl.length > 0 && (!itemDet.RackList || itemDet.RackList.length == 0)) {
                    itemDet.RackList = [];
                    itemDet.ModifyDetailsColl.forEach(function (idet) {
                        var findB = mx(itemDet.productDetail.RackWiseColl).firstOrDefault(p1 => p1.RackId == idet.RackId);
                        if (findB) {
                            findB.BalQty = findB ? findB.BalQty + idet.ActualQty : idet.ActualQty;
                            findB.IsSelected = true;
                            itemDet.RackList.push(findB);
                        } else {
                            var newBatch = {
                                RackId: idet.RackId,
                                Name: 'RName',
                                Description: '',
                                BalQty: findB ? findB.BalQty + idet.ActualQty : idet.ActualQty,
                                IsSelected: true
                            };
                            itemDet.RackList.push(newBatch);
                        }

                    });
                }
                else if ((!itemDet.RackList || itemDet.RackList.length == 0)) {
                    itemDet.RackList = [];
                    itemDet.RackList = angular.copy(itemDet.productDetail.RackWiseColl);
                }
            }

            var itemC = mx($scope.beData.ItemDetailsColl).where(p1 => p1.RowType == 'P').count();
            if (ind == (itemC - 1))
                $scope.AddRowInTable(ind);

        }

    }

    $scope.ChangeEngineNo = function (itemDet) {
        if (itemDet.EngineNo && itemDet.EngineNo.length > 0 && itemDet.productDetail) {

            var findB = mx(itemDet.productDetail.FixedProductColl).firstOrDefault(p1 => p1.EngineNo == itemDet.EngineNo);
            if (findB) {
                itemDet.ChassisNo = findB.ChassisNo;
                itemDet.RegdNo = findB.RegdNo;
                itemDet.Model = findB.Model;
                itemDet.Color = findB.Color;
                itemDet.KeyNo = findB.KeyNo;
                itemDet.CodeNo = findB.CodeNo;
                itemDet.MFGYear = findB.MFGYear;
                itemDet.Type = findB.Type;
                itemDet.ActualQty = 1;
                itemDet.BilledQty = 1;
                if (findB.Rate || findB.Rate > 0)
                    itemDet.Rate = findB.Rate;
            }

        } else {
            itemDet.ChassisNo = '';
            itemDet.RegdNo = '';
            itemDet.Model = '';
            itemDet.Color = '';
            itemDet.KeyNo = '';
            itemDet.CodeNo = '';
            itemDet.MFGYear = 0;
            itemDet.Type = '';
            itemDet.ActualQty = 0;
            itemDet.BilledQty = 0;
        }

        $scope.ChangeItemRowValue(itemDet, 'product');

        $scope.CalculateTotalAndSubTotal();
    }

    $scope.ChangeBatch = function (itemDet) {
        if (itemDet.Batch && itemDet.Batch.length > 0 && itemDet.productDetail) {

            var findB = mx(itemDet.productDetail.BatchWiseColl).firstOrDefault(p1 => p1.BatchNo == itemDet.Batch);
            if (findB) {
                itemDet.EXPDate = findB.EXPDate;
                itemDet.MFGDate = findB.MFGDate;
                itemDet.BatchBalQty = findB.BalQty;
                itemDet.EngineNo = findB.EngineNo;

                itemDet.SalesRate = findB.SalesRate;
                itemDet.TradeRate = findB.TradeRate;
                itemDet.MRP = findB.MRP;

                if ($scope.SelectedVoucher.Product.ProductRateAs == 1) {
                    if (findB.PurchaseRate > 0)
                        itemDet.Rate = findB.PurchaseRate;

                } else if ($scope.SelectedVoucher.Product.ProductRateAs == 2) {
                    if (findB.SalesRate > 0)
                        itemDet.Rate = findB.SalesRate;
                }
                else if ($scope.SelectedVoucher.Product.ProductRateAs == 3) {
                    if (findB.TradeRate > 0)
                        itemDet.Rate = findB.TradeRate;
                }
                else if ($scope.SelectedVoucher.Product.ProductRateAs == 4) {
                    if (findB.MRP > 0)
                        itemDet.Rate = findB.MRP;
                } else {

                    if (findB.SalesRate > 0)
                        itemDet.Rate = findB.SalesRate;
                }

            }

        } else {
            itemDet.EXPDate = null;
            itemDet.MFGDate = null;
            itemDet.BatchBalQty = 0;
            itemDet.EngineNo = '';

            itemDet.SalesRate = 0;
            itemDet.TradeRate = 0;
            itemDet.MRP = 0;
        }

        $scope.CalculateTotalAndSubTotal();
    }

  
  
    $scope.RefVoucherChange = function (refVType) {

        $scope.RefVoucherNoColl = [];
        $scope.RefItemAllocationColl = [];

        if ($scope.beData.SourceGodownId > 0 && $scope.beData.TargetGodownId > 0) {
            var funName = "getPendingDemand";


            var para = "fromGodownId=" + $scope.beData.TargetGodownId + "&ToGodownId=" + $scope.beData.SourceGodownId;

            $http({
                method: 'GET',
                url: base_url + "Inventory/Transaction/" + funName + "?" + para,
                dataType: "json"
            }).then(function (res1) {
                if (res1.data.IsSuccess && res1.data.Data) {
                    $scope.RefItemAllocationColl = res1.data.Data;

                    var refTranIdColl = mx($scope.beData.RefTranIdColl);
                    var refAllocationIdCol = mx($scope.beData.RefAllotationIdColl);

                    angular.forEach($scope.RefItemAllocationColl, function (ri) {
                        if (refTranIdColl.contains(ri.TranId)) {
                            ri.IsSelected = true;
                        } else {

                            ri.IsSelected = false;

                            if (refAllocationIdCol.contains(ri.ItemAllocationId)) {
                                ri.IsSelected = true;
                            } else
                                ri.IsSelected = false;
                        }

                    });

                    var grp = mx($scope.RefItemAllocationColl)
                        .groupBy(t => ({ id: t.TranId, text: t.AutoManualNo }))   // group `key`
                        .select(t => t.key)
                        .toArray();

                    angular.forEach(grp, function (v) {
                        $scope.RefVoucherNoColl.push({
                            id: v.id,
                            text: v.text.toString().trim()
                        });
                    });

                    $('#newfrmDemandDetailsModel').modal('show');
                }
            }, function (reason) {
                Swal.fire('Failed' + reason);
            });
        }


    };

    $scope.CalculateTotalAndSubTotal = function () {

        if ($scope.SelectedVoucher) {
            var subTotal = 0;
            var totalQty = 0;
            angular.forEach($scope.beData.SourceItemDetailsColl, function (item) {
                subTotal += item.Amount ? item.Amount : 0;
                totalQty += item.ActualQty ? item.ActualQty : 0;
            });

            $scope.beData.SubTotal = ($filter('number')(subTotal, $scope.SelectedVoucher.NoOfDecimalPlaces)).parseDBL();
            $scope.beData.TotalAmount = ($filter('number')(subTotal, $scope.SelectedVoucher.NoOfDecimalPlaces)).parseDBL();
        }

    };

    $scope.ChangeItemRowValue = function (itemDet, col) {

        var amt = 0, qty = 0, rate = 0, disAmt = 0, disPer = 0, schAmt = 0, schPer = 0;

        var aQty = 0;
        if (itemDet.ActualQty)
            aQty = itemDet.ActualQty;

        if ($scope.HideShow.BilledQty == true) {
            if (itemDet.ActualQty)
                qty = itemDet.ActualQty;
        } else {
            if (itemDet.BilledQty)
                qty = itemDet.BilledQty;
        }


        if (itemDet.productDetail) {
            if (itemDet.Batch && itemDet.Batch.length > 0) {
                var bBal = itemDet.BatchBalQty || itemDet.BatchBalQty > 0 ? itemDet.BatchBalQty : 0;
                if (itemDet.ActualQty > bBal) {

                    if (itemDet.productDetail.IgnoreNegativeBalance == false) {
                        itemDet.ActualQty = 0;
                        itemDet.BilledQty = 0;
                        Swal.fire('Please ! Enter Qty Less Then Equal ' + bBal);
                    }
                }
            }
            else {

                var bBal = (itemDet.productDetail.ClosingQty + (itemDet.RefQty > 0 ? itemDet.RefQty : 0));
                if (itemDet.QtyDecimal == undefined || itemDet.QtyDecimal == null)
                    itemDet.QtyDecimal = 2;

                bBal = ($filter('number')(bBal, itemDet.QtyDecimal)).parseDBL();
                var outQty = mx($scope.beData.SourceItemDetailsColl).where(p1 => p1.ProductId == itemDet.ProductId).sum(p1 => p1.ActualQty);

                if (bBal < outQty) {

                    if (itemDet.productDetail.IgnoreNegativeBalance == false) {
                        itemDet.ActualQty = 0;
                        itemDet.BilledQty = 0;
                        Swal.fire('Please ! Enter Qty Less Then Equal ' + itemDet.productDetail.ClosingQty);
                    }

                }

                if (itemDet.productDetail.ClosingQty < itemDet.ActualQty) {

                    if (itemDet.productDetail.IgnoreNegativeBalance == false) {
                        itemDet.ActualQty = 0;
                        itemDet.BilledQty = 0;
                        Swal.fire('Please ! Enter Qty Less Then Equal ' + itemDet.productDetail.ClosingQty);
                    }

                }
            }
        }


        if (itemDet.Rate)
            rate = itemDet.Rate;

        if (itemDet.productDetail) {
            if (itemDet.productDetail.ClosingQty < qty)
                itemDet.IsNegativeQty = true;
            else if (itemDet.RefQty && itemDet.RefQty < qty)
                itemDet.IsNegativeQty = true;
            else
                itemDet.IsNegativeQty = false;


        }
        if (itemDet.Amount && col == "amt") {

        }

        amt = qty * rate;

        if (itemDet.DiscountAmt)
            disAmt = itemDet.DiscountAmt;

        if (itemDet.DiscountPer)
            disPer = itemDet.DiscountPer;

        if (col == "disAmt") {

            if (disAmt > 0) {
                disPer = (disAmt / amt) * 100;
            } else
                disPer = 0;

        }
        else if (col == "disPer" || col == "product") {

            if (disPer > 0) {
                disAmt = amt * disPer / 100;
            } else
                disAmt = 0;
        }


        itemDet.Amount = amt - disAmt;

        if (col == "disAmt")
            itemDet.DiscountPer = disPer;
        else if (col == "disPer" || col == "product")
            itemDet.DiscountAmt = disAmt;


        if ($scope.HideShow.BilledQty == true) {
            itemDet.BilledQty = aQty;
        }

        if (itemDet.productDetail) {
            if (itemDet.productDetail.AlternetUnitColl) {
                if (col == 'aQty' || col == 'bQty' || col == 'product') {
                    var alterUnit_Qry = mx(itemDet.productDetail.AlternetUnitColl);

                    var alternetUnit1 = null, alternetUnit2 = null;

                    if (itemDet.productDetail.AlternetUnitColl.length > 0) {

                        alternetUnit1 = alterUnit_Qry.firstOrDefault(p1 => p1.SNo == 1);
                        if (alternetUnit1) {
                            itemDet.ALValue1 = parseFloat(parseFloat((alternetUnit1.AlternetUnitValue * aQty) / alternetUnit1.BaseUnitValue).toFixed(alternetUnit1.NoOfDecimalPlaces));
                            itemDet.ALUnitId1 = alternetUnit1.UnitId;
                            itemDet.UnitName1 = alternetUnit1.UnitName;
                        }
                    }

                    if (itemDet.productDetail.AlternetUnitColl.length > 1) {
                        alternetUnit2 = alterUnit_Qry.firstOrDefault(p1 => p1.SNo == 2);
                        if (alternetUnit2) {
                            itemDet.ALValue2 = parseFloat(parseFloat((alternetUnit2.AlternetUnitValue * aQty) / alternetUnit2.BaseUnitValue).toFixed(alternetUnit2.NoOfDecimalPlaces));
                            itemDet.ALUnitId2 = alternetUnit2.UnitId;
                            itemDet.UnitName2 = alternetUnit2.UnitName;
                        }
                    }
                }
            }

            var exciseAbleQty = 0;
            var excisAbleAmt = itemDet.ActualQty * itemDet.Rate;

            if (itemDet.ExDutyUnitId && itemDet.ExDutyUnitId > 0) {
                if (itemDet.UnitId == itemDet.ExDutyUnitId)
                    exciseAbleQty = itemDet.ActualQty;
                else if (itemDet.ALUnitId1 && itemDet.ALUnitId1 == itemDet.ExDutyUnitId)
                    exciseAbleQty = itemDet.ALValue1;
                else if (itemDet.ALUnitId2 && itemDet.ALUnitId2 == itemDet.ExDutyUnitId)
                    exciseAbleQty = itemDet.ALValue1;
            }
            else
                exciseAbleQty += itemDet.ActualQty;

            itemDet.ExciseAbleQty = exciseAbleQty;
            itemDet.ExciseAbtAmt = excisAbleAmt;
            itemDet.VatAbleAmt = 0;

            if (itemDet.productDetail.IsTaxable == true) {
                itemDet.VatAbleAmt = itemDet.Amount;
                itemDet.TaxableAmt = itemDet.Amount;

                if ($scope.SelectedVoucher.Product.ProductWiseVat == false) {
                    itemDet.VatRate = 0;
                    itemDet.VatAmount = 0;
                }
                else if ($scope.SelectedVoucher.Product.ProductWiseVat == true) {
                    itemDet.VatRate = itemDet.productDetail.VatRate;
                    itemDet.VatAmount = itemDet.Amount * itemDet.productDetail.VatRate / 100;
                }
            }

            if ($scope.SelectedVoucher.Product.ProductWiseExciseDuty == false) {
                itemDet.ExDutyRate = 0;
                itemDet.ExDutyAmount = 0;
            }
            else if ($scope.SelectedVoucher.Product.ProductWiseVat == true) {
                itemDet.ExDutyRate = itemDet.productDetail.EXDutyRate;
                itemDet.ExDutyAmount = exciseAbleQty * itemDet.productDetail.EXDutyRate / 100;
            }

        }

        itemDet.Formula = ($scope.ItemFormula ? angular.copy($scope.ItemFormula) : null);


        $scope.CalculateTotalAndSubTotal();
    }


    $scope.ChangeItemAlternetQty = function (itemDet, col) {

        if (col == 'unit1') {
            if ($scope.SelectedVoucher.Product.ActiveRateUOM == true && itemDet.productDetail.AlternetUnitColl) {
                var alColl = mx(itemDet.productDetail.AlternetUnitColl);
                itemDet.RateUOMColl = [];
                itemDet.RateUOMColl.push({
                    UnitId: itemDet.UnitId,
                    Name: itemDet.UnitName
                });
                if (itemDet.ALUnitId1 > 0 && ($scope.HideShow.AlternetUnit1 == false || $scope.HideShow.AlternetUnitMultiple == false)) {
                    if (itemDet.ALUnitId1 != itemDet.UnitId) {
                        var findU = alColl.firstOrDefault(p1 => p1.UnitId == itemDet.ALUnitId1);
                        if (findU) {
                            itemDet.RateUOMColl.push({
                                UnitId: findU.UnitId,
                                Name: findU.UnitName
                            });
                        }
                    }
                }
                if (itemDet.ALUnitId2 > 0 && $scope.HideShow.AlternetUnit2 == false) {
                    if (itemDet.ALUnitId2 != itemDet.UnitId && itemDet.ALUnitId2 != itemDet.ALUnitId1) {
                        var findU = alColl.firstOrDefault(p1 => p1.UnitId == itemDet.ALUnitId2);
                        if (findU) {
                            itemDet.RateUOMColl.push({
                                UnitId: findU.UnitId,
                                Name: findU.UnitName
                            });
                        }
                    }
                }
                if (itemDet.RateUnitId > 0) {

                } else {
                    itemDet.RateUnitId = itemDet.UnitId;
                }
            }
        }

        var aQty = 0;

        if (col == 'aQty') {
            itemDet.BilledQty = itemDet.ActualQty;
        } else if (col == 'bQty') {
            if (itemDet.ActualQty == 0 || itemDet.ActualQty < itemDet.BilledQty)
                itemDet.ActualQty = itemDet.BilledQty;
        }

        if (itemDet.ActualQty)
            aQty = itemDet.ActualQty;


        if (itemDet.productDetail) {
            if (itemDet.productDetail.AlternetUnitColl) {
                var alterUnit_Qry = mx(itemDet.productDetail.AlternetUnitColl);

                var alternetUnit1 = null, alternetUnit2 = null;

                alternetUnit1 = alterUnit_Qry.firstOrDefault(p1 => p1.UnitId == itemDet.ALUnitId1);
                alternetUnit2 = alterUnit_Qry.firstOrDefault(p1 => p1.UnitId == itemDet.ALUnitId2);

                if (!alternetUnit1)
                    alternetUnit1 = alterUnit_Qry.firstOrDefault(p1 => p1.SNo == 1);

                if (!alternetUnit2)
                    alternetUnit2 = alterUnit_Qry.firstOrDefault(p1 => p1.SNo == 2);

                var baseQty = 0;
                var findUnit = $scope.UnitColl.firstOrDefault(p1 => p1.UnitId == itemDet.productDetail.BaseUnitId);
                if (alternetUnit1 && col == 'unit1') {

                    if (findUnit) {
                        //baseQty = parseFloat(parseFloat((alternetUnit1.BaseUnitValue * itemDet.ALValue1) / alternetUnit1.AlternetUnitValue).toFixed(alternetUnit1.NoOfDecimalPlaces));
                        baseQty = parseFloat(parseFloat((alternetUnit1.BaseUnitValue * itemDet.ALValue1) / alternetUnit1.AlternetUnitValue));//.toFixed(itemDet.QtyDecimal));
                        if ($scope.SelectedVoucher.Product.NotEffectInBaseUnit == false)
                            itemDet.ActualQty = baseQty;

                        if (alternetUnit2)
                            itemDet.ALValue2 = parseFloat(parseFloat((alternetUnit2.AlternetUnitValue * baseQty) / alternetUnit2.BaseUnitValue));//.toFixed(alternetUnit2.NoOfDecimalPlaces));
                    }

                } else if (alternetUnit2 && col == "unit2") {

                    if (findUnit) {
                        //  baseQty = parseFloat(parseFloat(itemDet.ALValue2 * alternetUnit2.AlternetUnitValue).toFixed(findUnit.NoOfDecimalPlaces));
                        baseQty = parseFloat(parseFloat((alternetUnit2.BaseUnitValue * itemDet.ALValue2) / alternetUnit2.AlternetUnitValue));//.toFixed(itemDet.QtyDecimal));

                        if ($scope.SelectedVoucher.Product.NotEffectInBaseUnit == false)
                            itemDet.ActualQty = baseQty;

                        if (alternetUnit1)
                            itemDet.ALValue1 = parseFloat(parseFloat((alternetUnit1.AlternetUnitValue * baseQty) / alternetUnit1.BaseUnitValue));//.toFixed(alternetUnit1.NoOfDecimalPlaces));
                    }

                }
            }
        }

        $scope.ChangeItemRowValue(itemDet, 'rate');

    }

    $scope.getVoucherNoOnly = function (dateStyle) {

        $timeout(function () {
            if ($scope.SelectedVoucher.DateStyle == 3 || $scope.SelectedVoucher.DateStyle == 4) {
                if (dateStyle == 1) //AD
                {
                    if ($scope.beData.VoucherDateADDet && $scope.beData.VoucherDateADDet.dateAD != $scope.beData.VoucherDate_TMP) {
                        $scope.beData.VoucherDate_TMP = new Date($scope.beData.VoucherDateADDet.dateAD);
                    }
                }
                else if (dateStyle == 2) //BS
                {
                    if ($scope.beData.VoucherDateDet && $scope.beData.VoucherDateAD_TMP != $scope.beData.VoucherDateDet.dateAD) {
                        $scope.beData.VoucherDateAD_TMP = new Date($scope.beData.VoucherDateDet.dateAD);
                    }
                }
            }
        });

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

    $scope.reloadVoucherDate = function () {

        const container = angular.element(document.getElementById('dvDTVoucher'));
        container.empty(); // Clear the container


        if ($scope.SelectedVoucher.VoucherDate) {
            var forDate = new Date($scope.SelectedVoucher.VoucherDate);

            if (forDate != $scope.beData.VoucherDateAD_TMP)
                $scope.beData.VoucherDateAD_TMP = new Date(forDate);

            if (forDate != $scope.beData.VoucherDate_TMP)
                $scope.beData.VoucherDate_TMP = new Date(forDate);
        }
        else {
            if ($scope.beData.VoucherDateDet && $scope.beData.VoucherDateDet.dateAD && $scope.beData.VoucherDateDet.dateAD != $scope.beData.VoucherDateAD_TMP)
                $scope.beData.VoucherDateAD_TMP = new Date($scope.beData.VoucherDateDet.dateAD);
            else if ($scope.beData.VoucherDate && $scope.beData.VoucherDateAD_TMP != $scope.beData.VoucherDate)
                $scope.beData.VoucherDateAD_TMP = new Date($scope.beData.VoucherDate);
        }

        $timeout(function () {
            var dtPicker = `<label for="inputEmail3" style="min-width: 100px;">{{SelectedVoucher.VoucherDateLabel ? SelectedVoucher.VoucherDateLabel : ' Date'}}<span style="color:red">*</span></label>`;
            if ($scope.SelectedVoucher.DateStyle == 2) //BS
            {
                dtPicker = dtPicker + '<div class="nepalidate-wrapper-uiux"><input type="text"  class="form-control form-control-sm nepalidate-uiux" date-picker ng-model="beData.VoucherDate_TMP" date-detail="beData.VoucherDateDet" confirm-action="getVoucherNoOnly(2)" title ="{{beData.VoucherDateDet.dateAD |dateFormat}}" date-style="2" id ="dtVoucherDateBS" voucherid ="SelectedVoucher.VoucherId"  model-name="beData.VoucherDate"></div>';
            }
            else if ($scope.SelectedVoucher.DateStyle == 1) //AD
            {
                dtPicker = dtPicker + '<input type="text"  class="form-control form-control-sm" date-picker ng-model="beData.VoucherDate_TMP" date-detail="beData.VoucherDateDet" confirm-action="getVoucherNoOnly(1)" title ="{{ beData.VoucherDateDet.dateBS }}" date-style="1" id ="dtVoucherDateAD" voucherid ="SelectedVoucher.VoucherId"  model-name="beData.VoucherDate">';
            }
            else if ($scope.SelectedVoucher.DateStyle == 3) //BS & AD
            {

                dtPicker = dtPicker + `<div class="d-inline-block">
                    <div class="input-group input-group-sm">
                        <div class="input-group-prepend">
                            <span class="input-group-text">BS:</span>
                        </div>                        
                        <div class="nepalidate-wrapper-uiux"><input type="text"  class="form-control form-control-sm nepalidate-uiux" date-picker ng-model="beData.VoucherDate_TMP" date-detail="beData.VoucherDateDet" confirm-action="getVoucherNoOnly(2)" title ="{{beData.VoucherDateDet.dateAD |dateFormat}}" date-style="2" id ="dtVoucherDateBS" voucherid ="SelectedVoucher.VoucherId"  model-name="beData.VoucherDate" ></div>
                        <div class="input-group-prepend">
                            <span class="input-group-text">AD:</span>
                        </div>                        
                        <input type="text"  class="form-control form-control-sm" date-picker ng-model="beData.VoucherDateAD_TMP" date-detail="beData.VoucherDateADDet" confirm-action="getVoucherNoOnly(1)" title ="{{ beData.VoucherDateADDet.dateBS }}" date-style="1" id ="dtVoucherDateAD" voucherid ="SelectedVoucher.VoucherId"  model-name="beData.VoucherDate" >
                    </div>
                </div>`;
            }
            else if ($scope.SelectedVoucher.DateStyle == 4) //AD & BS
            {
                dtPicker = dtPicker + `<div class="d-inline-block">
                    <div class="input-group input-group-sm">                       
                        <div class="input-group-prepend">
                            <span class="input-group-text">AD:</span>
                        </div>                        
                        <input type="text"  class="form-control form-control-sm" date-picker ng-model="beData.VoucherDateAD_TMP" date-detail="beData.VoucherDateADDet" confirm-action="getVoucherNoOnly(1)" title ="{{ beData.VoucherDateADDet.dateBS }}" date-style="1" id ="dtVoucherDateAD" voucherid ="SelectedVoucher.VoucherId"  model-name="beData.VoucherDate" >
 <div class="input-group-prepend">
                            <span class="input-group-text">BS:</span>
                        </div>
                       <div class="nepalidate-wrapper-uiux"> <input type="text"  class="form-control form-control-sm nepalidate-uiux" date-picker ng-model="beData.VoucherDate_TMP" date-detail="beData.VoucherDateDet" confirm-action="getVoucherNoOnly(2)" title ="{{beData.VoucherDateDet.dateAD |dateFormat}}" date-style="2" id ="dtVoucherDateBS" voucherid ="SelectedVoucher.VoucherId"  model-name="beData.VoucherDate" ></div>
                    </div>
                </div>`;
            }
            else  //BOTH
            {
                dtPicker = dtPicker + '<input type="text"  class="form-control form-control-sm" date-picker ng-model="beData.VoucherDate_TMP" date-detail="beData.VoucherDateDet" confirm-action="getVoucherNoOnly(2)" title ="{{beData.VoucherDateDet.dateAD |dateFormat}}" date-style="2" id ="dtVoucherDateBS" voucherid ="SelectedVoucher.VoucherId"  model-name="beData.VoucherDate" >';
            }
            const newElement = angular.element(dtPicker);
            //container.append($compile(newElement)($scope));

            container.append(newElement);
            $compile(newElement)($scope);
            //Added  by UIUX
            //$timeout(function () {
            //    container.find('.nepalidate-uiux').nepaliDatePicker({
            //        container: '.nepalidate-wrapper-uiux'
            //    });
            //}, 0);
            //Ends
        });
    };

    $scope.getVoucherNo = function () {
        $scope.beData.AditionalCostColl = [];

        if ($scope.beData.VoucherId > 0)
            $scope.SelectedVoucher = mx($scope.VoucherTypeColl).firstOrDefault(p1 => p1.VoucherId == $scope.beData.VoucherId);

        if ($scope.beData.CostClassId > 0)
            $scope.SelectedCostClass = mx($scope.CostClassColl).firstOrDefault(p1 => p1.CostClassId == $scope.beData.CostClassId);

        if ($scope.SelectedVoucher) {
            $http({
                method: 'GET',
                url: base_url + "Account/Creation/GetVoucherModeById?voucherId=" + $scope.SelectedVoucher.VoucherId,
                dataType: "json"
            }).then(function (res) {
                if (res.data.IsSuccess && res.data.Data) {
                    $scope.SelectedVoucher = res.data.Data;

                    if ($scope.SelectedVoucher.VoucherDate) {
                        $scope.beData.VoucherDateDet = null;
                        var forDate = new Date($scope.SelectedVoucher.VoucherDate);
                        $scope.beData.VoucherDate = forDate;
                        $scope.beData.VoucherDate_TMP = forDate;
                        $scope.beData.VoucherDateAD_TMP = forDate;
                    }

                    $timeout(function () {
                        //$scope.$broadcast('date.refresh');
                        $scope.reloadVoucherDate();
                    });

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
                                            ColWidth: udf.ColWidth,
                                            UDFValue: udf.DefaultValue,
                                            RefTable: udf.RefTable,
                                            RefColumn: udf.RefColumn,
                                            TextColumn: udf.TextColumn,
                                        };
                                        $scope.beData.UDFFeildsColl.push(ud);
                                    });
                                }


                                if ($scope.SelectedVoucher.NumberingMethod == 1)
                                    $scope.HideShow.AutoVoucherNo = false;
                                else
                                    $scope.HideShow.AutoVoucherNo = true;

                                if ($scope.SelectedVoucher.UsePartyCostCenter == true)
                                    $scope.HideShow.PartyCostCenter = false;
                                else
                                    $scope.HideShow.PartyCostCenter = true;

                                if ($scope.SelectedVoucher.UseTranCostCenter == true)
                                    $scope.HideShow.TranCostCenter = false;
                                else
                                    $scope.HideShow.TranCostCenter = true;

                                if ($scope.SelectedVoucher.UseRefNo == true)
                                    $scope.HideShow.RefNo = false;
                                else
                                    $scope.HideShow.RefNo = true;


                                if ($scope.SelectedVoucher.CanChangeLedgerAndAgent == true)
                                    $scope.HideShow.Agent = false;
                                else
                                    $scope.HideShow.Agent = true;

                                if ($scope.SelectedVoucher.AllowMultipleCurrency == true)
                                    $scope.HideShow.Currency = false;
                                else
                                    $scope.HideShow.Currency = true;

                                if ($scope.SelectedVoucher.Product.ProductWiseLedger == true) {
                                    $scope.HideShow.SalesLedger = true;

                                    if ($scope.SelectedVoucher.Product.ShowProductWiseLedger == true)
                                        $scope.HideShow.ProductLedger = false;
                                    else
                                        $scope.HideShow.ProductLedger = true;
                                }
                                else {
                                    $scope.HideShow.SalesLedger = false;
                                    $scope.HideShow.ProductLedger = true;
                                }


                                if ($scope.SelectedVoucher.Product.ActiveActualAndBillQty == true)
                                    $scope.HideShow.BilledQty = false;
                                else
                                    $scope.HideShow.BilledQty = true;

                                if ($scope.SelectedVoucher.Product.AllowDiscount == true) {

                                    $scope.HideShow.Discount = false;
                                    if ($scope.SelectedVoucher.Product.ShowDiscountAmt)
                                        $scope.HideShow.DiscountAmt = false;
                                    else
                                        $scope.HideShow.DiscountAmt = true;

                                    if ($scope.SelectedVoucher.Product.ShowDiscountAmt)
                                        $scope.HideShow.DiscountPer = false;
                                    else
                                        $scope.HideShow.DiscountPer = true;
                                }
                                else {
                                    $scope.HideShow.Discount = true;
                                    $scope.HideShow.DiscountPer = true;
                                    $scope.HideShow.DiscountAmt = true;
                                }


                                if ($scope.SelectedVoucher.Product.ShowCurrentStock == true)
                                    $scope.HideShow.CurrentBalance = false;
                                else
                                    $scope.HideShow.CurrentBalance = true;

                                if ($scope.SelectedVoucher.Product.AllowFreeQty == true)
                                    $scope.HideShow.FreeQty = false;
                                else
                                    $scope.HideShow.FreeQty = true;

                                if ($scope.SelectedVoucher.Product.AllowScheme == true) {
                                    $scope.HideShow.Scheme = false;

                                    if ($scope.SelectedVoucher.Product.ShowSchemeAmt == true)
                                        $scope.HideShow.SchemeAmt = false;
                                    else
                                        $scope.HideShow.SchemeAmt = true;

                                    if ($scope.SelectedVoucher.Product.ShowSchemePer == true)
                                        $scope.HideShow.SchemePer = false;
                                    else
                                        $scope.HideShow.SchemePer = true;

                                } else {
                                    $scope.HideShow.Scheme = true;
                                    $scope.HideShow.SchemeAmt = true;
                                    $scope.HideShow.SchemePer = true;
                                }

                                if ($scope.SelectedVoucher.Product.ShowProductDescription == true)
                                    $scope.HideShow.ProductDescription = false;
                                else
                                    $scope.HideShow.ProductDescription = true;

                                if ($scope.SelectedVoucher.Product.ShowProductQuantityPoint == true)
                                    $scope.HideShow.ProductPoint = false;
                                else
                                    $scope.HideShow.ProductPoint = true;

                                if ($scope.SelectedVoucher.Product.UseMRP == true)
                                    $scope.HideShow.MRP = false;
                                else
                                    $scope.HideShow.MRP = true;

                                if ($scope.SelectedVoucher.Product.UsePurchaseSalesRate == true)
                                    $scope.HideShow.SalesRate = false;
                                else
                                    $scope.HideShow.SalesRate = true;

                                if ($scope.SelectedVoucher.Product.UseTradeRate == true)
                                    $scope.HideShow.TradeRate = false;
                                else
                                    $scope.HideShow.TradeRate = true;

                                //if ($scope.SelectedVoucher.Product.ProductWiseLedger == true) {
                                //    $scope.HideShow.ProductLedger = false;

                                //    if ($scope.SelectedVoucher.Product.ShowProductWiseLedger == true)
                                //        $scope.HideShow.ShowProductWiseLedger = false;
                                //    else
                                //        $scope.HideShow.ShowProductWiseLedger = true;
                                //}
                                //else {
                                //    $scope.HideShow.ProductLedger = true;
                                //    $scope.HideShow.ShowProductWiseLedger = true;
                                //}


                                if ($scope.SelectedVoucher.Product.ShowAlternateUnit == true) {
                                    $scope.HideShow.AlternetUnit = false;

                                    if ($scope.SelectedVoucher.Product.ActiveAlternateUnitColumn1 == true)
                                        $scope.HideShow.AlternetUnit1 = false;
                                    else
                                        $scope.HideShow.AlternetUnit1 = true;

                                    if ($scope.SelectedVoucher.Product.ActiveAlternateUnitColumn1 == true)
                                        $scope.HideShow.AlternetUnit2 = false;
                                    else
                                        $scope.HideShow.AlternetUnit2 = true;

                                }
                                else {
                                    $scope.HideShow.AlternetUnit = true;
                                    $scope.HideShow.AlternetUnit1 = true;
                                    $scope.HideShow.AlternetUnit2 = true;
                                }


                                if ($scope.SelectedVoucher.UseEffectiveDate == true)
                                    $scope.HideShow.EntryDate = false;
                                else
                                    $scope.HideShow.EntryDate = true;

                                if ($scope.SelectedVoucher.Product.BatchNo == true)
                                    $scope.HideShow.Batch = false;
                                else
                                    $scope.HideShow.Batch = true;

                                if ($scope.SelectedVoucher.Product.UseEXP == true)
                                    $scope.HideShow.EXPDate = false;
                                else
                                    $scope.HideShow.EXPDate = true;

                                if ($scope.SelectedVoucher.Product.UseMFG == true)
                                    $scope.HideShow.MFGDate = false;
                                else
                                    $scope.HideShow.MFGDate = true;

                                if ($scope.SelectedVoucher.EachNarrationEntry == true)
                                    $scope.HideShow.EachNarration = false;
                                else
                                    $scope.HideShow.EachNarration = true;

                                if ($scope.SelectedVoucher.Product.ProductWiseExciseDuty == true)
                                    $scope.HideShow.ExciseDuty = false;
                                else
                                    $scope.HideShow.ExciseDuty = true;

                                if ($scope.SelectedVoucher.Product.ProductWiseVat == true)
                                    $scope.HideShow.Vat = false;
                                else
                                    $scope.HideShow.Vat = true;

                                if (!$scope.SelectedVoucher.VoucherDateLabel || $scope.SelectedVoucher.VoucherDateLabel.length == 0)
                                    $scope.SelectedVoucher.VoucherDateLabel = "Invoice Date";

                                if (!$scope.SelectedVoucher.EntryDateLabel || $scope.SelectedVoucher.EntryDateLabel.length == 0)
                                    $scope.SelectedVoucher.EntryDateLabel = "Entry Date";

                                if (!$scope.SelectedVoucher.RefNoName || $scope.SelectedVoucher.RefNoName.length == 0)
                                    $scope.SelectedVoucher.RefNoName = 'Ref. No.';

                                if ($scope.SelectedVoucher.Product.ShowRate == true)
                                    $scope.HideShow.Rate = false;
                                else
                                    $scope.HideShow.Rate = true;

                                if ($scope.SelectedVoucher.Product.ShowAmount == true)
                                    $scope.HideShow.Amount = false;
                                else
                                    $scope.HideShow.Amount = true;


                                if ($scope.SelectedVoucher.VoucherProductUDFColl && $scope.SelectedVoucher.VoucherProductUDFColl.length > 0) {
                                    angular.forEach($scope.beData.ItemDetailsColl, function (det) {
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
                                                ColWidth: udf.ColWidth,
                                                UDFValue: udf.DefaultValue,
                                                RefTable: udf.RefTable,
                                                RefColumn: udf.RefColumn,
                                                TextColumn: udf.TextColumn,
                                            };

                                            det.UDFFeildsColl.push(ud);
                                        });
                                    });
                                } else {
                                    angular.forEach($scope.beData.ItemDetailsColl, function (det) {
                                        det.UDFFeildsColl = [];
                                    });
                                }

                                if ($scope.SelectedVoucher.GodownColl && $scope.SelectedVoucher.GodownColl.length > 0) {
                                    var tmpGodownColl = [];
                                    var godown_Qry = mx($scope.SelectedVoucher.GodownColl);
                                    angular.forEach($scope.GodownColl, function (gd) {
                                        if (godown_Qry.contains(gd.GodownId)) {
                                            tmpGodownColl.push(gd);
                                        }
                                    });

                                    if (tmpGodownColl.length == 1) {
                                        $scope.beData.GodownId = tmpGodownColl[0].GodownId;
                                        $scope.HideShow.Godown = true;
                                    }
                                    else if (tmpGodownColl.length > 1) {
                                        $scope.HideShow.Godown = false;
                                        $scope.beData.GodownId = tmpGodownColl[0].GodownId;
                                    }
                                    else {
                                        $scope.HideShow.Godown = false;
                                        $scope.beData.GodownId = null;
                                    }

                                    if ($scope.beData.GodownId && $scope.beData.GodownId > 0) {
                                        if (angular.forEach($scope.beData.ItemDetailsColl, function (idet) {
                                            if (idet.RowType == 'P') {
                                                if (!idet.GodownId || idet.GodownId == 0)
                                                    idet.GodownId = $scope.beData.GodownId;
                                            }
                                        }));
                                    }
                                } else
                                    $scope.SelectedVoucher.VoucherWiseGodownColl = $scope.GodownColl;


                                $timeout(function () {
                                    if (TranId && TranId > 0) {
                                        var newEdit = {
                                            TranId: TranId,
                                        };
                                        $scope.GetTransactionById(newEdit);
                                        TranId = null;
                                    }
                                });

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

    $scope.GetTransactionById = function (tran) {
        $timeout(function () {

            if (tran.TranId && tran.TranId > 0) {
                var para = {
                    tranId: tran.TranId
                };
                $http({
                    method: 'POST',
                    url: base_url + "Inventory/Transaction/GetStockTransforById",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    $timeout(function () {
                        if (res.data.IsSuccess && res.data.Data) {
                            var tran = res.data.Data;
                            $scope.SetData(tran);
                            $('#searVoucherRightBtn').modal('hide');
                        } else {
                            hidePleaseWait();
                            $scope.loadingstatus = "stop";
                            Swal.fire(res.data.ResponseMSG);
                        }
                    });
                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }
        });
    }

}]);
