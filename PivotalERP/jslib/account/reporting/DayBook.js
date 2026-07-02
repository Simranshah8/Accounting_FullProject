
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

}]);
