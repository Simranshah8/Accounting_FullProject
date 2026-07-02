
app.controller("LedgerVoucherCntrl", function ($scope, $http, $filter, $timeout, GlobalServices, $compile) {
var PrintPreviewAs = 1;
 const contextMenu = GlobalServices.createElementForMenu();
    var glSrv = GlobalServices;
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
         
		  $scope.GenConfig = {};
        GlobalServices.getGenConfig().then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.GenConfig = res.data.Data;
                PrintPreviewAs = $scope.GenConfig.PrintPreviewAs;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });


        $scope.LedgerSearchOptions = [{ text: 'Name', value: 'Led.Name', searchType: 'text' }, { text: 'Group', value: 'LG.Name', searchType: 'text' }, { text: 'Alias', value: 'Led.Alias', searchType: 'text' }, { text: 'Code', value: 'Led.Code', searchType: 'text' }, { text: 'PanVat', value: 'LS.PanVatNo', searchType: 'text' }, { text: 'MobileNo', value: 'Led.CompanyContactNo', searchType: 'text' }];
        $scope.paginationOptions = {
            pageNumber: 1,
            pageSize: glSrv.getPerPageRow(),
            sort: null,
            SearchType: 'text',
            SearchCol: '',
            SearchVal: '',
            SearchColDet: $scope.LedgerSearchOptions[0],
            pagearray: [],
            pageOptions: [5, 10, 20, 30, 40, 50]
        };

        $('.select2').select2({
            allowClear: true,
            openOnEnter: true
        });

        $scope.InterestCalculationOnColl = [{ id: 1, text: 'Debit Balance' }, { id: 2, text: 'Credit Balance' }];

        $scope.LedgerVoucher = {
            DateFrom_TMP: new Date(),
            DateTo_TMP: new Date(),
            VoucherId: 0,
            IsPost: true,
            BranchId: 0,
            IsSummary:true,
            LedgerDetails: {},
            showRelatedLC: false,
            SelectedLedgerIdColl: [],
            ShowPDC: false,
            ShowInventory: false,
            ShowItemDetails:false,
        };

        $scope.ButtonED = {};
        GlobalServices.getButtonDisabled(EntityId).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.ButtonED = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });


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


        $scope.columnDefs = [
            {
                headerName: "Date", width: 240, dataType: 'Text', cellRenderer: 'agGroupCellRenderer',
                valueGetter: function (params) {
                    var beData = params.data;
                    if (beData.IsParent) {
                        return beData.Name;
                    } else
                        return beData.VoucherDate;
                     
                },
                valueFormatter: function (params)
                {
                    if (params.data.IsParent)
                        return params.value;

                    return DateFormatAD(params.value);
                },
                filter: 'agDateColumnFilter', pinned: 'left'
            },
            {
                headerName: "Miti", width: 110, dataType: 'DateTime', valueGetter: function (params) {
                    var beData = params.data;
                    if (beData.IsParent==false) {
                        return beData.NPVoucherDate;
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
                    if (beData.IsParent == false) {
                        return beData.Particulars + " " + beData.LedgerCode;
                    }
                    else
                        return "";                                          
                },
                filter: 'agTextColumnFilter', pinned: 'left'
            },
            { headerName: "VoucherType", width: 130, field: "VoucherName", dataType: 'Text', filter: 'agTextColumnFilter', },
            { headerName: "Voucher No.", width: 130, field: "VoucherNo", dataType: 'Text', filter: 'agTextColumnFilter', },
            { headerName: "Ref.No.", width: 120, field: "RefNo", dataType: 'Text', filter: 'agTextColumnFilter', },
            {
                headerName: "Opening", width: 150, dataType: 'Number', filter: "agNumberColumnFilter",
                valueGetter: function (params) {
                    var beData = params.data;

                    if (beData.IsParent == true || beData.IsTotal==true) {
                        return beData.OpeningAmt;
                    }
                    else
                        return 0;

                },
                valueFormatter: function (params) { return NumberformatAC(params.value); }, cellStyle: { 'text-align': 'right' }, footerTemplate: '<div>totaal: #= sum #</div>',
                filter: 'agNumberColumnFilter',
            },
            {
                headerName: "Debit", width: 150, dataType: 'Number', filter: "agNumberColumnFilter",
                valueGetter: function (params) {
                    var beData = params.data;
                    return beData.DrAmt;
                },
                valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' }, footerTemplate: '<div>totaal: #= sum #</div>',
                filter: 'agNumberColumnFilter',
            },
            {
                headerName: "Credit", width: 150, dataType: 'Number', filter: "agNumberColumnFilter",
                valueGetter: function (params) {
                    var beData = params.data;
                    return beData.CrAmt;
                },
                valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' }, footerTemplate: '<div>totaal: #= sum #</div>',
                filter: 'agNumberColumnFilter',
            },
            {
                headerName: "Current Closing", width: 150, dataType: 'Number', filter: "agNumberColumnFilter",
                valueGetter: function (params) {
                    var beData = params.data;
                    return beData.ClosingAmt;
                },
                valueFormatter: function (params) { return NumberformatAC(params.value); }, cellStyle: { 'text-align': 'right' }, footerTemplate: '<div>totaal: #= sum #</div>',
                filter: 'agNumberColumnFilter',
            },
            
            { headerName: "CostClass", width: 120, dataType: 'Text', field: "CostClassName" },
            { headerName: "User", width: 120, dataType: 'Text', field: "UserName" },
            { headerName: "Narration", width: 150, dataType: 'Text', field: "Narration" },
               
            { headerName: "Branch", width: 150, field: "Branch" },
                  

            {
                headerName: "Action",
                width: 50,
                cellRenderer: function (params) {
                    if (params.data.IsParent == true || params.data.TranId==0)
                        return '';

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
                rowSelection:true,
                // set every column width
                width: 90
            },
			overlayLoadingTemplate: "Please Click the Load Bottom to display the data",
            columnDefs: $scope.columnDefs,
            enableColResize: true,
            rowData: null,
            filter: true,
            enableFilter: true,
            rowSelection: true,
            //rowSelection: 'multiple',
            suppressHorizontalScroll: true,
            alignedGrids: [],
            onGridReady: (params) => {
                document.addEventListener('keydown', keyDownListener);
            },
            getRowStyle :function(params) {
                return params.data.IsTotal == true || params.data.IsParent == true ? { "font-weight": "bold" } : null;
            },
            onFilterChanged: function (e) {
                //console.log('onFilterChanged', e);
                var drAmt = 0, crAmt = 0;
             
            },
            getNodeChildDetails: function (beData) {
                
                if (beData.IsParent==true) {

                    if (beData.dataColl && beData.dataColl.length > 0)
                    {
                        var isDet = $scope.LedgerVoucher.ShowItemDetails;
                        var dataColl = [];
                        beData.dataColl.forEach(function (vch) {
                            dataColl.push(vch);

                            if (vch.ItemDetailsColl && vch.ItemDetailsColl.length > 0) {
                                vch.ItemDetailsColl.forEach(function (itemDet) {
                                    var newItem = {
                                        IsParent: false,
                                        IsTotal: false,
                                        Particulars: '',
                                        LedgerCode: '',
                                        OpeningAmt: 0,
                                        DrAmt: 0,
                                        CrAmt: 0,
                                        ClosingAmt: 0,
                                        RowType: 4,
                                        ProductName: '',
                                        Qty: 0,
                                        Rate: 0,
                                        Amount: 0,
                                        EngineNo: '',
                                        Batch:'',
                                    };

                                    newItem.ProductName = itemDet.ProductName;
                                    newItem.EngineNo = itemDet.EngineNo;
                                    newItem.Qty = itemDet.ActualQty;
                                    newItem.Rate = itemDet.Rate;
                                    newItem.Amount = itemDet.Amount;

                                    if (isDet == true) {
                                        newItem.Particulars = itemDet.ProductName + '-' + itemDet.ProductCode + ' ( ' + itemDet.EngineNo + ' ) = ' + itemDet.Amount;
                                        newItem.ProductName = itemDet.ProductName + '-' + itemDet.ProductCode + ' ( ' + itemDet.EngineNo + ' ) ';
                                    }
                                    else {
                                        newItem.Particulars = itemDet.ProductName + '(' + itemDet.ProductCode + ') ' + itemDet.ActualQty + ' x ' + itemDet.Rate + ' = ' + itemDet.Amount;
                                    }

                                    dataColl.push(newItem);
                                });
                            }

                        });

                        var qry = mx(beData.dataColl);
                        var tranQry = qry.where(p1 => p1.TranId > 0 && p1.VoucherId > 0);
                        var openQry = qry.where(p1 => p1.TranId == 0 && p1.VoucherId == 0);
                        var newTotal = {
                            IsParent: false,
                            IsTotal: true,
                            Particulars: 'TOTAL ',
                            LedgerCode: '',
                            OpeningAmt: openQry.sum(p1 => p1.DrAmt),
                            DrAmt: tranQry.sum(p1 => p1.DrAmt),
                            CrAmt: tranQry.sum(p1 => p1.CrAmt),
                            RowType:2,
                        };

                        newTotal.ClosingAmt = newTotal.OpeningAmt+ newTotal.DrAmt - newTotal.CrAmt;

                        //dataColl.push({});
                        dataColl.push({});
                        dataColl.push(newTotal);
                        dataColl.push({});

                        var drAmt = 0, crAmt = 0;
                        if (beData.pdcColl && beData.pdcColl.length > 0) {
                            beData.pdcColl.forEach(function (pdc) {
                                drAmt += pdc.DrAmt;
                                crAmt += pdc.CrAmt;

                                pdc.ClosingAmt = newTotal.ClosingAmt + drAmt - crAmt;
                                dataColl.push(pdc);
                            });

                            var newPDCTotal = {
                                IsParent: false,
                                IsTotal: true,
                                Particulars: 'PDC TOTAL ',
                                LedgerCode: '',
                                OpeningAmt: 0,
                                DrAmt: drAmt,
                                CrAmt: crAmt,
                                ClosingAmt: 0,
                                RowType: 2,
                            };
                            dataColl.push(newPDCTotal);

                            var newPDCTotal2 = {
                                IsParent: false,
                                IsTotal: true,
                                Particulars: 'PERIODIC BALANCE ',
                                LedgerCode: '',
                                OpeningAmt: 0,
                                DrAmt: newTotal.DrAmt + drAmt,
                                CrAmt: newTotal.CrAmt + crAmt,
                                ClosingAmt: ((newTotal.DrAmt + drAmt) - (newTotal.CrAmt + crAmt)),
                                RowType: 2,
                            };
                            dataColl.push(newPDCTotal2);

                            var newPDCTotal1 = {
                                IsParent: false,
                                IsTotal: true,
                                Particulars: 'LEDGER TOTAL ',
                                LedgerCode: '',
                                OpeningAmt: newTotal.OpeningAmt,
                                DrAmt: newTotal.DrAmt + drAmt,
                                CrAmt: newTotal.CrAmt + crAmt,
                                ClosingAmt: newTotal.ClosingAmt + drAmt - crAmt,
                                RowType: 2,
                            };
                            dataColl.push(newPDCTotal1);

                        }
                        else if($scope.LedgerVoucher.ShowPDC==true)
                        {

                            var newPDCTotal = {
                                IsParent: false,
                                IsTotal: true,
                                Particulars: 'PDC TOTAL ',
                                LedgerCode: '',
                                OpeningAmt: 0,
                                DrAmt: drAmt,
                                CrAmt: crAmt,
                                ClosingAmt: 0,
                                RowType: 2,
                            };
                            dataColl.push(newPDCTotal);

                            var newPDCTotal2 = {
                                IsParent: false,
                                IsTotal: true,
                                Particulars: 'PERIODIC BALANCE ',
                                LedgerCode: '',
                                OpeningAmt: 0,
                                DrAmt: newTotal.DrAmt + drAmt,
                                CrAmt: newTotal.CrAmt + crAmt,
                                ClosingAmt: ((newTotal.DrAmt + drAmt) - (newTotal.CrAmt + crAmt)),
                                RowType: 2,
                            };
                            dataColl.push(newPDCTotal2);

                            var newPDCTotal1 = {
                                IsParent: false,
                                IsTotal: true,
                                Particulars: 'LEDGER TOTAL ',
                                LedgerCode: '',
                                OpeningAmt: newTotal.OpeningAmt,
                                DrAmt: newTotal.DrAmt + drAmt,
                                CrAmt: newTotal.CrAmt + crAmt,
                                ClosingAmt: newTotal.ClosingAmt + drAmt - crAmt,
                                RowType: 2,
                            };
                            dataColl.push(newPDCTotal1);
                        }

                        return {
                            group: true,
                            children: dataColl,
                            expanded: beData.open
                        };
                    }                     
                    else
                        return null;

                }
                else
                    return null;

                
                
            },

        };


        function keyDownListener(e) {
            // delete the rows 
            // keyCode 8 is Backspace
            // keyCode 46 is Delete
            if (e.keyCode === 46) {
                var cell = $scope.gridOptions.api.getFocusedCell();
                if (cell) {
                    var rowInd = cell.rowIndex;
                    if (rowInd >= 0) {
                        const sel = $scope.gridOptions.api.getRowNode(rowInd);
                        var selColl = [];
                        selColl.push(sel);
                        $scope.gridOptions.api.updateRowData({ remove: selColl });
                       
                    }
                }
                
            }
        }
        $scope.dataForBottomGrid = [
            {
                IsParent: true,
                IsTotal: true,
                DateAD: '',
                DateBS: '',
                Particulars: 'Opening Balance =>',
                VoucherType: '',
                VoucherNo: '',
                RefNo: '',
                DrAmt: 0,
                CrAmt: 0,
                CurrentClosing: 0,
                CostClass: '',
                UserName: ''
            },
            {
                IsParent: true,
                IsTotal: true,
                DateAD: '',
                DateBS: '',
                Particulars: 'Current Total =>',
                VoucherType: '',
                VoucherNo: '',
                RefNo: '',
                DrAmt: 0,
                CrAmt: 0,
                CurrentClosing: 0,
                CostClass: '',
                UserName: ''
            },
            {
                IsParent: true,
                IsTotal:true,
                DateAD: '',
                DateBS: '',
                Particulars: 'Closing Balance =>',
                VoucherType: '',
                VoucherNo: '',
                RefNo: '',
                DrAmt: 0,
                CrAmt: 0,
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

        $timeout(function () {
            if (SelectedLedgerId && SelectedLedgerId > 0) {
                $scope.LedgerVoucher.LedgerId = SelectedLedgerId;
                $scope.GetLedgerVoucher();                
            }
        });

$timeout(function () {
            GlobalServices.getListState(EntityId, $scope.gridOptions);
        });
		
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
            ledgerIdColl: ($scope.LedgerVoucher.SelectedLedgerIdColl && $scope.LedgerVoucher.SelectedLedgerIdColl.length > 0 ? $scope.LedgerVoucher.SelectedLedgerIdColl.toString() : ''),            
            branchIdColl: $scope.LedgerVoucher.BranchId,
            ShowPDC: $scope.LedgerVoucher.ShowPDC,
            ShowInventory: $scope.LedgerVoucher.ShowInventory,
            ShowItemDetails: $scope.LedgerVoucher.ShowItemDetails
        };

        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: "post",
            url: base_url + "Account/Reporting/GetMulLedgerVoucher",
            data: JSON.stringify(beData),
            dataType: "json"
        }).then(function (res) {

            var openingAmt = 0, drAmt = 0, crAmt = 0, closingAmt = 0;
            res.data.Data.forEach(function (dc) {
                var qry = mx(dc.dataColl)
                var tranQry = qry.where(p1 => p1.TranId > 0 && p1.VoucherId > 0);
                var openQry = qry.where(p1 => p1.TranId == 0 && p1.VoucherId == 0);
                dc.OpeningAmt = isEmptyAmt(openQry.sum(p1 => p1.DrAmt)) - isEmptyAmt(openQry.sum(p1 => p1.CrAmt));
                if (dc.dataColl && dc.dataColl.length > 0) {
                    dc.DrAmt = tranQry.sum(p1 => p1.DrAmt);
                    dc.CrAmt = tranQry.sum(p1 => p1.CrAmt);
                }
                dc.ClosingAmt = dc.OpeningAmt +  isEmptyAmt(dc.DrAmt) - isEmptyAmt(dc.CrAmt);

                openingAmt += isEmptyAmt(dc.OpeningAmt);
                drAmt += isEmptyAmt(dc.DrAmt);
                crAmt += isEmptyAmt(dc.CrAmt);
            });
            
            var newTotal = {
                IsParent: false,
                IsTotal: true,
                Particulars: 'GRAND TOTAL ',
                LedgerCode: '',
                OpeningAmt: openingAmt,
                DrAmt: drAmt,
                CrAmt: crAmt,
                RowType: 2,
            };

            newTotal.ClosingAmt = openingAmt+drAmt-crAmt;
             
            if (openingAmt > 0)
                $scope.dataForBottomGrid[0].DrAmt = openingAmt;
            else
                $scope.dataForBottomGrid[0].CrAmt = Math.abs(openingAmt);

            $scope.dataForBottomGrid[1].DrAmt = drAmt;
            $scope.dataForBottomGrid[1].CrAmt = crAmt;

            closingAmt =  openingAmt+drAmt - crAmt;
            if (closingAmt > 0)
                $scope.dataForBottomGrid[2].DrAmt = closingAmt;
            else
                $scope.dataForBottomGrid[2].CrAmt = Math.abs(closingAmt);

            $scope.gridOptionsBottom.api.setRowData($scope.dataForBottomGrid);

            

            $scope.DataColl = res.data.Data;

            $scope.DataColl.push({});
            $scope.DataColl.push(newTotal);
            $scope.gridOptions.api.setRowData($scope.DataColl);
  
            $scope.loadingstatus = "stop";
            hidePleaseWait();

        }, function (errormessage) {
            hidePleaseWait();
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
                                                        Address:$scope.LedgerVoucher.LedgerDetails.Address
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
         
        var filterData = [];

        $scope.gridOptions.api.forEachNodeAfterFilterAndSort(function (node) {
            var ledVoucher = node.data;
            if (ledVoucher.RowType > 0) {

            }
            else {
                if (ledVoucher.IsParent == true) {
                    ledVoucher.RowType = 1;
                    ledVoucher.Particulars = ledVoucher.Name;
                }
                else if (ledVoucher.IsTotal == true) {
                    ledVoucher.RowType = 2;
                    ledVoucher.Particulars = ledVoucher.Name;
                }
                else if (ledVoucher.VoucherDate) {
                    ledVoucher.RowType = 3;
                }
            }

            if(ledVoucher.RowType>0)
                filterData.push(ledVoucher);           
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
                down_file(base_url + "//" + res.data.Data.ResponseId, "LedgerVoucher.xlsx");
            }

        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            Swal.fire(errormessage);
        });
    }

    $scope.SelectLedger = function (curRow) {
        if (curRow.IsSelected == true) {
            var find = $scope.LedgerVoucher.SelectedLedgerIdColl.indexOf(curRow.LedgerId);
            if (find==-1) {
                $scope.LedgerVoucher.SelectedLedgerIdColl.push(curRow.LedgerId);
            }
        }
        else {
            var find = $scope.LedgerVoucher.SelectedLedgerIdColl.indexOf(curRow.LedgerId);
            if(find!=-1)
                $scope.LedgerVoucher.SelectedLedgerIdColl.splice(find, 1); //
        }
    }

    $scope.SelectAllLedger = function (isSelected)
    {
        if (isSelected == false) {
            $scope.LedgerVoucher.SelectedLedgerIdColl = [];

            $scope.SearchDataColl.forEach(function (curRow) {
                curRow.IsSelected = false;                
            });

        } else {
            $scope.SearchDataColl.forEach(function (curRow) {
                curRow.IsSelected = true;
                var find = $scope.LedgerVoucher.SelectedLedgerIdColl.indexOf(curRow.LedgerId);
                if (find == -1) {
                    $scope.LedgerVoucher.SelectedLedgerIdColl.push(curRow.LedgerId);
                }
            });
        }         
    }
    $scope.IsSelectedLed = function (curRow) {
        var find = $scope.LedgerVoucher.SelectedLedgerIdColl.indexOf(curRow.LedgerId);
        if (find == -1) {
            return false;
        }
        else
            return true;
    }

    $scope.SearchLedgerDataColl = [];
    $scope.SearchLedgerData = function () {

        $scope.loadingstatus = 'running';
        showPleaseWait();
        $scope.paginationOptions.TotalRows = 0;

        var sCol = $scope.paginationOptions.SearchColDet;

        var para = {
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
            url: base_url + "Account/Creation/GetLedgerLst",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                $scope.SearchDataColl = res.data.Data;
                $scope.paginationOptions.TotalRows = res.data.TotalCount;

                $scope.SearchDataColl.forEach(function (sd) {
                    sd.IsSelected = $scope.IsSelectedLed(sd);
                });

                $('#searVoucherRightBtn').modal('show');

            } else
                alert(res.data.ResponseMSG);

        }, function (reason) {
            alert('Failed' + reason);
        });


    };

    $scope.ReSearchLedgerData = function (pageInd) {

        $timeout(function () {
            if (pageInd && pageInd >= 0)
                $scope.paginationOptions.pageNumber = pageInd;
            else if (pageInd == -1)
                $scope.paginationOptions.pageNumber = 1;

            $scope.loadingstatus = 'running';
            showPleaseWait();
            $scope.paginationOptions.TotalRows = 0;
            var sCol = $scope.paginationOptions.SearchColDet;

            var para = {
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
                url: base_url + "Account/Creation/GetLedgerLst",
                dataType: "json",
                data: JSON.stringify(para)
            }).then(function (res) {
                $scope.loadingstatus = 'stop';
                hidePleaseWait();

                if (res.data.IsSuccess && res.data.Data) {
                    $scope.SearchDataColl = res.data.Data;
                    $scope.SearchDataColl.forEach(function (sd) {
                        sd.IsSelected = $scope.IsSelectedLed(sd);
                    });

                    $scope.paginationOptions.TotalRows = res.data.TotalCount;

                } else
                    alert(res.data.ResponseMSG);

            }, function (reason) {
                alert('Failed' + reason);
            });
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
