app.controller("costCenterVoucherCntrl", function ($scope, $http, $filter, $timeout, GlobalServices, $compile) {
    var PrintPreviewAs = 1;
    const contextMenu = GlobalServices.createElementForMenu();

    LoadData();
    $scope.onBtExportCSV = function () {
        var params = {
            fileName: 'costcenterVoucher.csv',
            sheetName: 'costCenterVoucher'
        };

        $scope.gridOptions.api.exportDataAsCsv(params);
    }
     
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

        $scope.costCenterVoucher = {
            DateFrom_TMP: new Date(),
            DateTo_TMP: new Date(),
            VoucherId: 0,
            IsPost: true,
            BranchId: 0
        };

        $timeout(function () {
            $http({
                method: "GET",
                url: base_url + "Global/GetCompanyDetail",
                dataType: "json"
            }).then(function (res) {
                var comDet = res.data.Data;
                if (comDet) {
                    $scope.costCenterVoucher.DateFrom_TMP = new Date(comDet.StartDate);
                }
            }, function (errormessage) {
                alert('Unable to Delete data. pls try again.' + errormessage.responseText);
            });
        });
        $scope.ReportName = '';

        $scope.noofdecimal = 2;

        $scope.loadingstatus = "stop";


        $scope.columnDefs = [
            {
                headerName: "Date", width: 120, dataType: 'DateTime',
                valueGetter: function (params) {
                    var beData = params.data;
                    if (beData.IsParent) {
                        return beData.VoucherDate;
                    }
                    return null;
                },
                valueFormatter: function (params) { return DateFormatAD(params.value); },
                filter: 'agDateColumnFilter', pinned: 'left'
            },
            {
                headerName: "Miti", width: 120, pinned: 'left', dataType: 'DateTime', valueGetter: function (params) {
                    var beData = params.data;
                    if (beData.IsParent) {
                        return beData.NVoucherDate;
                    } else {
                        return "";
                    }
                }
            },
            { headerName: "Ledger", width: 150, dataType: 'Text', field: "LedgerName", filter: 'agTextColumnFilter' },

            { headerName: "Voucher Type", width: 140, dataType: 'Text', field: "VoucherName", filter: 'agTextColumnFilter' },
            { headerName: "Voucher No.", width: 140, dataType: 'Text', field: "AutoManualNo", filter: 'agTextColumnFilter' },
            { headerName: "Ref.No.", width: 120, dataType: 'Text', field: "RefNo", filter: 'agTextColumnFilter' },
            //{
            //    headerName: "Amount", width: 150,
            //    valueGetter: function (params) {
            //        var beData = params.data;

            //        if (beData.IsParent) {
            //            return '';
            //        }
            //        else
            //            return beData.Amount;

            //    },
            //    valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' },
            //},
            {
                headerName: "Debit", width: 135, dataType: 'Number', filter: "agNumberColumnFilter",
                valueGetter: function (params) {
                    var beData = params.data;

                    if (beData.IsParent) {
                        return beData.DebitAmt;
                    }
                    else
                        return 0;

                },
                valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' }, footerTemplate: '<div>totaal: #= sum #</div>',
            },
            {
                headerName: "Credit", width: 135, dataType: 'Number', filter: "agNumberColumnFilter",
                valueGetter: function (params) {
                    var beData = params.data;
                    if (beData.IsParent) {
                        return beData.CreditAmt;
                    }
                    else
                        return 0;

                },
                valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' }, footerTemplate: '<div>totaal: #= sum #</div>'
            },
            {
                headerName: "Current Closing", width: 160, dataType: 'Number', filter: "agNumberColumnFilter",
                valueGetter: function (params) {
                    var beData = params.data;
                    if (beData.IsParent) {
                        return beData.CurrentClosing;
                    }
                    return 0;
                },
                valueFormatter: function (params) { return NumberformatAC(params.value); }, cellStyle: { 'text-align': 'right' }, footerTemplate: '<div>totaal: #= sum #</div>'
            },
            {
                headerName: "Narration", width: 180, dataType: 'Text',
                valueGetter: function (params) {
                    var beData = params.data;

                    return beData.Narration;
                    //if (beData.IsParent) {
                    //    return beData.Particulars;
                    //}
                    //else if (beData.LedgerName)
                    //    return beData.LedgerName;
                    //else if (beData.LedgerName)
                    //    return beData.LedgerName;
                    //else if (beData.ProductName)
                    //    return beData.ProductName;
                    //else
                    //    return params.data;
                }
            },
            {
                headerName: "Line Narration", width: 180, dataType: 'Text',
                valueGetter: function (params) {
                    var beData = params.data;

                    return beData.LedgerNarration;
                 
                }
            },
            { headerName: "CostClass", width: 120, dataType: 'Text', field: "CostClassName" },
            { headerName: "User", width: 120, dataType: 'Text', field: "UserName" },
            //New Col added for MVDuggar starts
            { headerName: "Branch", width: 140, field: "Branch", dataType: 'Text', filter: 'agTextColumnFilter' },
            //Ends
            //{
            //    headerName: "Action", width: 150, cellRenderer:
            //        function (params) {

            //            var voucherName = params.data.VoucherType;

            //            if (voucherName) {
            //                return '<a class="btn btn-default btn-xs" ng-click="PrintVoucher(' + params.data.TranId + ',' + params.data.VoucherType + ',' + params.data.VoucherId + ')"><i class="fas fa-print text-info"></i></a>';
            //            } else {
            //                return '';
            //            }
            //        }
            //}

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

                // set every column width
                width: 90
            },
			overlayLoadingTemplate: "Please Click the Load Bottom to display the data",
            columnDefs: $scope.columnDefs,
            enableColResize: true,
            rowData: null,
            filter: true,
            enableFilter: true,
            rowSelection: 'multiple',
            suppressHorizontalScroll: true,
            alignedGrids: [],
            treeData: true,
            onCellKeyDown: (event) => {
                if (event.event.key === 'Delete') {
                    var cell = $scope.gridOptions.api.getFocusedCell();
                    if (cell) {
                        var rowInd = cell.rowIndex;
                        if (rowInd >= 0) {
                            var selectData = $scope.gridOptions.api.getDisplayedRowAtIndex(rowInd).data;
                            if (selectData) {
                                rowInd = $scope.DataColl.findIndex(p1 => p1.TranId == selectData.TranId && p1.VoucherId == selectData.VoucherId);
                            }

                            if ($scope.DataColl.length > rowInd && rowInd >= 0) {
                                var fst = $scope.DataColl[rowInd];
                                if (fst && fst.IsParent == true) {
                                    $scope.DataColl.splice(rowInd, 1);
                                    $scope.gridOptions.api.setRowData($scope.DataColl);

                                    var drAmt = 0, crAmt = 0;
                                    var oDr = $scope.dataForBottomGrid[0].DebitAmt;
                                    var oCr = $scope.dataForBottomGrid[0].CreditAmt;

                                    $scope.dataForBottomGrid[1].DebitAmt = 0;
                                    $scope.dataForBottomGrid[1].CreditAmt = 0;
                                    $scope.dataForBottomGrid[2].DebitAmt = 0;
                                    $scope.dataForBottomGrid[2].CreditAmt = 0;

                                    $scope.DataColl.forEach(function (tb) {
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
            onFilterChanged: function (e) {
                //console.log('onFilterChanged', e);
                var drAmt = 0, crAmt = 0;
                var oDr = $scope.dataForBottomGrid[0].DebitAmt;
                var oCr = $scope.dataForBottomGrid[0].CreditAmt;

                $scope.dataForBottomGrid[1].DebitAmt = 0;
                $scope.dataForBottomGrid[1].CreditAmt = 0;
                $scope.dataForBottomGrid[2].DebitAmt = 0;
                $scope.dataForBottomGrid[2].CreditAmt = 0;

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

                if (closingAmt > 0)
                    $scope.dataForBottomGrid[2].DebitAmt = closingAmt;
                else
                    $scope.dataForBottomGrid[2].CreditAmt = Math.abs(closingAmt);

                $scope.gridOptionsBottom.api.setRowData($scope.dataForBottomGrid);

            },
            getNodeChildDetails: function (beData) {
                var dataColl = [];

                if (beData.IsParent == true) {

                    if (beData.ChieldColl) {
                        angular.forEach(beData.ChieldColl, function (cc) {
                            dataColl.push(cc);
                        });
                    }
                    if (beData.InventoryDetailsColl) {
                        angular.forEach(beData.InventoryDetailsColl, function (cc) {
                            dataColl.push(cc);
                        });
                    }


                    if (beData.LedgerNarration && beData.LedgerNarration.length > 0)
                        dataColl.push("(" + beData.LedgerNarration + ")");
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


        // lookup the container we want the Grid to use
        //  $scope.eGridDiv = document.querySelector('#datatable');

        // create the grid passing in the div to use together with the columns & data we want to use
        // new agGrid.Grid($scope.eGridDiv, $scope.gridOptions);


        $scope.dataForBottomGrid = [
            {
                IsParent: true,
                DateAD: '',
                DateBS: '',
                VoucherName: 'Opening Balance =>',
                //Narration: 'Opening Balance =>',
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
                VoucherName: 'Current Total =>',
               // Narration: 'Current Total =>',
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
                VoucherName: 'Closing Balance =>',
              //  Narration: 'Closing Balance =>',
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

        $timeout(function () {
            GlobalServices.getListState(EntityId, $scope.gridOptions);
        });
    }

    $scope.deleteVoucher = function (TranId, VoucherName) {

        var ans = confirm("Are you sure you want to delete this Record?");

        if (ans) {
            $http({
                method: "post",
                url: base_url + "Account/Transaction/Delete" + VoucherName + "?TranId=" + TranId,
                //data: JSON.stringify(beData),
                dataType: "json"
            }).then(function (res) {
                alert(res.data.ResponseMSG);

            }, function (errormessage) {
                alert('Unable to Delete data. pls try again.' + errormessage.responseText);
            });
        }

    }
    $scope.GetCostCenterVoucher = function () {


        $scope.RptDataColl = [];
        $scope.DataColl = []; //declare an empty array
        $scope.dataForBottomGrid[0].DebitAmt = 0;
        $scope.dataForBottomGrid[0].CreditAmt = 0;

        $scope.dataForBottomGrid[1].DebitAmt = 0;
        $scope.dataForBottomGrid[1].CreditAmt = 0;

        $scope.dataForBottomGrid[2].DebitAmt = 0;
        $scope.dataForBottomGrid[2].CreditAmt = 0;

        $scope.gridOptionsBottom.api.setRowData($scope.dataForBottomGrid);
        $scope.gridOptions.api.setRowData($scope.DataColl);


        if (!$scope.costCenterVoucher.CostCenterId || $scope.costCenterVoucher.CostCenterId==0)
            return;

        var dateFrom = new Date(($filter('date')(new Date(), 'yyyy-MM-dd')));
        var dateTo = new Date(($filter('date')(new Date(), 'yyyy-MM-dd')));

        if ($scope.costCenterVoucher.DateFromDet)
            dateFrom =$filter('date')($scope.costCenterVoucher.DateFromDet.dateAD, 'yyyy-MM-dd');

        if ($scope.costCenterVoucher.DateToDet)
            dateTo = $filter('date')($scope.costCenterVoucher.DateToDet.dateAD, 'yyyy-MM-dd');
         
        var beData = {
            DateFrom: dateFrom,
            DateTo: dateTo,
            costCenterId: $scope.costCenterVoucher.CostCenterId,
            ledgerId: $scope.costCenterVoucher.LedgerId
        };


        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: "post",
            url: base_url + "Account/Reporting/GetCostCenterVoucher",
            data: JSON.stringify(beData),
            dataType: "json"
        }).then(function (res) {

            var openingAmt = 0, drAmt = 0, crAmt = 0, closingAmt = 0;
            openingAmt = res.data.Data.OpeningAmt;
            drAmt = res.data.Data.DrAmt;
            crAmt = res.data.Data.CrAmt;
            closingAmt = res.data.Data.ClosingAmt;


            $scope.costCenterVoucher.ODr = (openingAmt > 0 ? openingAmt : 0);
            $scope.costCenterVoucher.OCr = (openingAmt < 0 ? Math.abs(openingAmt) : 0);
            $scope.costCenterVoucher.TDr = drAmt;
            $scope.costCenterVoucher.TCr = crAmt;
            $scope.costCenterVoucher.CDr = (closingAmt > 0 ? closingAmt : 0);
            $scope.costCenterVoucher.CCr = (closingAmt < 0 ? Math.abs(closingAmt) : 0);

            if (openingAmt > 0)
                $scope.dataForBottomGrid[0].DebitAmt = openingAmt;
            else
                $scope.dataForBottomGrid[0].CreditAmt = Math.abs(openingAmt);

            $scope.dataForBottomGrid[1].DebitAmt = drAmt;
            $scope.dataForBottomGrid[1].CreditAmt = crAmt;

            if (closingAmt > 0)
                $scope.dataForBottomGrid[2].DebitAmt = closingAmt;
            else
                $scope.dataForBottomGrid[2].CreditAmt = Math.abs(closingAmt);

            $scope.gridOptionsBottom.api.setRowData($scope.dataForBottomGrid);

            $scope.DataColl = res.data.Data.DataColl;
            $scope.gridOptions.api.setRowData($scope.DataColl);


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
                                                        Period: $scope.costCenterVoucher.DateFromDet.dateBS + " TO " + $scope.costCenterVoucher.DateToDet.dateBS,
                                                        ODr: $scope.costCenterVoucher.ODr,
                                                        OCr: $scope.costCenterVoucher.OCr,
                                                        TDr: $scope.costCenterVoucher.TDr,
                                                        TCr: $scope.costCenterVoucher.TCr,
                                                        CDr: $scope.costCenterVoucher.CDr,
                                                        CCr: $scope.costCenterVoucher.CCr,
                                                        Ledger: $scope.costCenterVoucher.CostCenterDetails.Name,
                                                        Address: $scope.costCenterVoucher.CostCenterDetails.Address
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
                                    Period: $scope.costCenterVoucher.DateFromDet.dateBS + " TO " + $scope.costCenterVoucher.DateToDet.dateBS,
                                    ODr: $scope.costCenterVoucher.ODr,
                                    OCr: $scope.costCenterVoucher.OCr,
                                    TDr: $scope.costCenterVoucher.TDr,
                                    TCr: $scope.costCenterVoucher.TCr,
                                    CDr: $scope.costCenterVoucher.CDr,
                                    CCr: $scope.costCenterVoucher.CCr,
                                    Ledger: $scope.costCenterVoucher.CostCenterDetails.Name,
                                    Address: $scope.costCenterVoucher.CostCenterDetails.Address
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

            if (ledVoucher.IsParent == true) {
                filterData.push(ledVoucher);

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

                if (ledVoucher.InventoryDetailsColl) {
                    angular.forEach(ledVoucher.InventoryDetailsColl, function (invData) {
                        var beData = {};
                        beData.Particulars = invData.ProductName;// +" ( " + GlobalFunction.getNumberStr(invData.BQty) + " @ " + GlobalFunction.getNumberStr(invData.Rate) + " = " + GlobalFunction.getNumberStr(invData.Amount) + " ) ";
                        beData.AQty = invData.AQty;
                        beData.BQty = invData.BQty;
                        beData.Rate = invData.Rate;
                        beData.Amount = invData.Amount;
                        beData.Unit = invData.UnitName;

                        var fixedProduct = invData.ProductName;

                        if (invData.RegdNo && !invData.RegdNo.isEmpty())
                            fixedProduct = fixedProduct + " Regd:-" + invData.RegdNo;

                        if (invData.EngineNo && !invData.EngineNo.isEmpty())
                            fixedProduct = fixedProduct + " Eng:-" + invData.EngineNo;

                        if (invData.ChassisNo && !invData.ChassisNo.isEmpty())
                            fixedProduct = fixedProduct + " Chass:-" + invData.ChassisNo;

                        if (invData.Model && !invData.Model.isEmpty())
                            fixedProduct = fixedProduct + " Model:-" + invData.Model;

                        beData.ProductName = fixedProduct;

                        filterData.push(beData);

                    });
                }

            }

        });


        return filterData;

    };

    //$scope.Print = function () {

    //    $scope.loadingstatus = 'running';
    //    $scope.ReportTemplatesColl = []; //declare an empty array

    //    var getData = $http.get(base_url + "ReportEngine/GetReportTemplatesList?EntityId=" + parseInt(EntityId) + "&IsTransaction=false");

    //    getData.then(
    //        function (data) {
    //            $scope.ReportTemplatesColl = data.data;

    //            if ($scope.ReportTemplatesColl.length == 1)
    //                $scope.SelectedTemplete = $scope.ReportTemplatesColl[0];
    //            else {
    //                angular.forEach($scope.ReportTemplatesColl, function (value, key) {
    //                    if (value.IsDefault)
    //                        $scope.SelectedTemplete = value;
    //                });
    //            }
    //            $scope.loadingstatus = 'stop';
    //            $('#FrmReportTemplates').modal('show');
    //        }
    //        , function (reason) {
    //            alert('Failed: ' + reason);
    //        }
    //    );

    //};

    //$scope.PrintSelectedReport = function () {
    //    $scope.loadingstatus = 'running';
    //    $('#FrmReportTemplates').modal('hide');
    //    document.body.style.cursor = 'wait';
    //    document.getElementById("frmRpt").src = '';
    //    document.getElementById("frmRpt").style.width = '100%';
    //    document.getElementById("frmRpt").style.height = '600px';
    //    document.getElementById("frmRpt").style.visibility = 'visible';

    //    var RptParamentersColl = [];

    //    RptParamentersColl.push({
    //        Name: "Period",
    //        Value: $('#dtDateFrom').val() + ' To ' + $('#dtDateTo').val()
    //    },
    //        {
    //            Name: 'Ledger',
    //            Value: $scope.SelectedLedger.Name
    //        },
    //        {
    //            Name: 'Address',
    //            Value: ($scope.SelectedLedger.Address ? $scope.SelectedLedger.Address : '')
    //        },
    //        {
    //            Name: 'MobileNo',
    //            Value: ($scope.SelectedLedger.MobileNo ? $scope.SelectedLedger.MobileNo : '')
    //        },
    //        {
    //            Name: 'PanVatNo',
    //            Value: ($scope.SelectedLedger.PanVatNo ? $scope.SelectedLedger.PanVatNo : '')
    //        },
    //        {
    //            Name: 'TelNo',
    //            Value: ($scope.SelectedLedger.TelNo ? $scope.SelectedLedger.TelNo : '')
    //        },
    //        {
    //            Name: 'EmailId',
    //            Value: ($scope.SelectedLedger.EmailId ? $scope.SelectedLedger.EmailId : '')
    //        },
    //        {
    //            Name: 'ODr',
    //            Value: $scope.dataForBottomGrid[0].DebitAmt
    //        },
    //        {
    //            Name: 'OCr',
    //            Value: $scope.dataForBottomGrid[0].CreditAmt
    //        },
    //        {
    //            Name: 'TDr',
    //            Value: $scope.dataForBottomGrid[1].DebitAmt
    //        },
    //        {
    //            Name: 'TCr',
    //            Value: $scope.dataForBottomGrid[1].CreditAmt
    //        },
    //        {
    //            Name: 'CDr',
    //            Value: $scope.dataForBottomGrid[2].DebitAmt
    //        },
    //        {
    //            Name: 'CCr',
    //            Value: $scope.dataForBottomGrid[2].CreditAmt
    //        }
    //    );


    //    var filterData = [];

    //    angular.forEach($scope.DataColl, function (ledVoucher) {

    //        filterData.push(ledVoucher);

    //        if (ledVoucher.AccountBillDetailsColl) {
    //            angular.forEach(ledVoucher.AccountBillDetailsColl, function (bd) {
    //                filterData.push({
    //                    Particulars: "(" + bd.VoucherDetails + " :- Rs." + GlobalFunction.getNumberStr(bd.Amount) + " / " + bd.Remarks + " ) "
    //                });
    //            });
    //        }

    //        if (ledVoucher.LedgerNarration) {
    //            filterData.push({
    //                Particulars: "( " + ledVoucher.LedgerNarration + " )"
    //            });
    //        }

    //        if (ledVoucher.CostCenterColl) {
    //            angular.forEach(ledVoucher.CostCenterColl, function (all) {
    //                var str = "";

    //                if (all.DebitAmt > 0)
    //                    str = NumberformatAC(all.DebitAmt);
    //                else
    //                    str = NumberformatAC(all.CreditAmt);
    //                filterData.push({
    //                    Particulars: all.LedgerName + " " + str
    //                });
    //            });
    //        }

    //        if (ledVoucher.ChieldColl) {
    //            angular.forEach(ledVoucher.ChieldColl, function (all) {

    //                var str = "";
    //                if (all.DebitAmt > 0)
    //                    str = NumberformatAC(all.DebitAmt);
    //                else
    //                    str = NumberformatAC(all.CreditAmt);

    //                filterData.push({
    //                    Particulars: all.LedgerName + " " + str
    //                });

    //                if (all.CostCenterColl) {
    //                    angular.forEach(all.CostCenterColl, function (all1) {
    //                        if (all1.DebitAmt > 0)
    //                            str = NumberformatAC(all1.DebitAmt);
    //                        else
    //                            str = NumberformatAC(all1.CreditAmt);

    //                        filterData.push({
    //                            Particulars: all1.LedgerName + " " + str
    //                        });

    //                    });
    //                }


    //            });
    //        }

    //        if (ledVoucher.InventoryDetailsColl) {
    //            angular.forEach(ledVoucher.InventoryDetailsColl, function (invData) {
    //                filterData.push({
    //                    Particulars: invData.ProductName + " ( " + Numberformat(invData.BQty) + " @ " + Numberformat(invData.Rate) + " = " + Numberformat(invData.Amount) + " ) "
    //                });
    //            });
    //        }


    //    });
    //    //$scope.gridOptions.api.forEachNodeAfterFilterAndSort(function (node) {

    //    //    filterData.push(node.data);
    //    //});

    //    if (!angular.isString($scope.SelectedTemplete))
    //        $scope.SelectedTemplete = angular.toJson($scope.SelectedTemplete);

    //    $http({
    //        method: 'POST',
    //        url: base_url + "ReportEngine/LoadReportViewer",
    //        headers: { 'Content-Type': undefined },

    //        transformRequest: function (data) {

    //            var formData = new FormData();
    //            formData.append("jsonData", angular.toJson(data.jsonData));
    //            formData.append("rptParaColl", angular.toJson(data.rptParaColl));
    //            formData.append("entityId", parseInt(EntityId));
    //            formData.append("reportTemp", data.reportTemplates);

    //            return formData;
    //        },
    //        data: { jsonData: filterData, files: null, reportTemplates: $scope.SelectedTemplete, rptParaColl: RptParamentersColl }
    //    }).
    //        success(function (data, status, headers, config) {
    //            $scope.loadingstatus = 'stop';
    //            if (data.IsSuccess) {
    //                document.getElementById("frmRpt").src = base_url + "web/ReportViewer.aspx?entityid=" + parseInt(EntityId);
    //                document.body.style.cursor = 'default';
    //                $('#FrmPrintReport').modal('show');
    //            }
    //        }).
    //        error(function (data, status, headers, config) {
    //            $scope.loadingstatus = 'stop';
    //            document.body.style.cursor = 'default';
    //            alert("failed!" + config);
    //        });


    //};

    $scope.onFilterTextBoxChanged = function () {
        $scope.gridOptions.api.setQuickFilter($scope.search);
    }
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
	
	$scope.DownloadAsXls = function () {

        $scope.loadingstatus = 'running';
        showPleaseWait();

        var dataColl = $scope.GetDataForPrint();
        var paraData = {
             
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
                down_file(base_url + "//" + res.data.Data.ResponseId, "CostcenterVoucher.xlsx");
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