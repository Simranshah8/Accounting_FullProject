
app.controller("CostCenterBreakupLedgerWise", function ($scope, $http, $filter, $timeout, GlobalServices, $compile) {

 const contextMenu = GlobalServices.createElementForMenu();
    LoadData();
    $scope.onBtExportCSV = function () {
        const mainGridData = [];
        $scope.gridOptions.api.forEachNodeAfterFilterAndSort((node) => {
            mainGridData.push(node.data);
        });

        // Retrieve the data from the bottom grid
        const bottomGridData = [];
        $scope.gridOptionsBottom.api.forEachNodeAfterFilterAndSort((node) => {
            bottomGridData.push(node.data);
        });

        // Merge both datasets with a blank row in between for clarity
        const exportData = [...mainGridData, {}, ...bottomGridData];

        var params = {
            fileName: 'CostCenterBreakupLedgerWise.csv',
            sheetName: 'CostCenterBreakupLedgerWise',
            processRowGroupCallback: undefined, 
            customHeader: 'Cost Center Ledger Details',
            processCellCallback: undefined,
            data: exportData,
        };

        $scope.gridOptions.api.exportDataAsCsv(params);
    }
    $scope.onFilterTextBoxChanged = function () {
        $scope.gridOptions.api.setQuickFilter($scope.search);
    }

    function LoadData() {

        $('.select2').select2();

        $scope.CostCenterBreakupLedgerWise = {
            DateFrom_TMP: new Date(),
            DateTo_TMP: new Date(),

            CostCenterId: 0,

        };
         

        $timeout(function () {
            $http({
                method: "GET",
                url: base_url + "Global/GetCompanyDetail",
                dataType: "json"
            }).then(function (res) {
                var comDet = res.data.Data;
                if (comDet) {
                    $scope.CostCenterBreakupLedgerWise.DateFrom_TMP = new Date(comDet.StartDate);
                }
            }, function (errormessage) {
                alert('Unable to Delete data. pls try again.' + errormessage.responseText);
            });
        });

        $scope.ReportName = '';

        $scope.noofdecimal = 2;

        $scope.loadingstatus = "stop";


        $scope.columnDefs = [

            { headerName: "Ledger", width: 250, field: "LedgerName", filter: 'agTextColumnFilter', pinned: 'left', dataType: 'Text', cellStyle: { 'text-align': 'text' } },
            { headerName: "OpeningDr", width: 150, field: "OpeningDr", dataType: 'Number', cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "OpeningCr", width: 150, field: "OpeningCr", dataType: 'Number', cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "Opening", width: 120, field: "Opening", dataType: 'Number', cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "DrAmt", width: 120, field: "DrAmt", dataType: 'Number', cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "CrAmt", width: 120, field: "CrAmt", dataType: 'Number', cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "ClosingCr", width: 180, dataType: 'Number', field: "ClosingCr", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "ClosingDr", width: 180, dataType: 'Number', field: "ClosingDr", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "Closing", width: 120, dataType: 'Number', field: "Closing", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            //{ headerName: "Branch", width: 170, dataType: 'Text', field: "Branch", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },

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
         
            onFilterChanged: function () {

                var dt = {
                    LedgerName: 'TOTAL =>',
                    OpeningDr: 0,
                    OpeningCr: 0,
                    Opening: 0,
                    DrAmt: 0,
                    CrAmt: 0,
                    ClosingCr: 0,
                    ClosingDr: 0,
                    Closing: 0,
                   
                }
                $scope.gridOptions.api.forEachNodeAfterFilterAndSort(function (node) {
                    var fData = node.data;
                    dt.OpeningDr += fData.OpeningDr;
                    dt.OpeningCr += fData.OpeningCr;
                    dt.Opening += fData.Opening;
                    dt.DrAmt += fData.DrAmt;
                    dt.CrAmt += fData.CrAmt;
                    dt.ClosingCr += fData.ClosingCr;
                    dt.ClosingDr += fData.ClosingDr;                  
                    dt.Closing += fData.Closing;

                });


                var filterDataColl = [];
                filterDataColl.push(dt);

                $scope.gridOptionsBottom.api.setRowData(filterDataColl);
            }

        };


        // lookup the container we want the Grid to use
        //  $scope.eGridDiv = document.querySelector('#datatable');

        // create the grid passing in the div to use together with the columns & data we want to use
        // new agGrid.Grid($scope.eGridDiv, $scope.gridOptions);


        $scope.dataForBottomGrid = [
            {
                IsParent: true,
                
                LedgerName: 'Opening Balance =>',
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
               
                LedgerName: 'Current Total =>',
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
                
                LedgerName: 'Closing Balance =>',
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

   

    $scope.ClearData = function () {

        var DataColl = [];
        $scope.gridOptionsBottom.api.setRowData(DataColl);

        $scope.gridOptions.api.setRowData(DataColl);
    };


    $scope.GetCostCenterBreakupLedgerWise = function () {
        //$scope.ClearData();

        //if (!$scope.CostCenterBreakupLedgerWise.AgentId)
        //    return;

        var DateFrom = new Date(($filter('date')(new Date(), 'yyyy-MM-dd')));
        var DateTo = new Date(($filter('date')(new Date(), 'yyyy-MM-dd')));

        if ($scope.CostCenterBreakupLedgerWise.DateFromDet)
            DateFrom = new Date(($filter('date')($scope.CostCenterBreakupLedgerWise.DateFromDet.dateAD, 'yyyy-MM-dd')));

        if ($scope.CostCenterBreakupLedgerWise.DateToDet)
            DateTo = new Date(($filter('date')($scope.CostCenterBreakupLedgerWise.DateToDet.dateAD, 'yyyy-MM-dd')));

        $scope.DataColl = []; //declare an empty array

        var para = {
            CostCenterId: $scope.CostCenterBreakupLedgerWise.CostCenterId,
            dateFrom: DateFrom,
            dateTo: DateTo,
        };
        $scope.loadingstatus = 'running';
        $http({
            method: "POST",
            url: base_url + "Account/Reporting/getCostCenterBreakupLedgerWises",
            data: JSON.stringify(para),
            dataType: "json"
        }).then(function (res) {
            var openingAmt = 0, drAmt = 0, crAmt = 0, closingAmt = 0;
            openingAmt = res.data.Data.OpeningAmt;
            drAmt = res.data.Data.DrAmt;
            crAmt = res.data.Data.CrAmt;
            closingAmt = res.data.Data.ClosingAmt;

            $scope.CostCenterBreakupLedgerWise.ODr = (openingAmt > 0 ? openingAmt : 0);
            $scope.CostCenterBreakupLedgerWise.OCr = (openingAmt < 0 ? Math.abs(openingAmt) : 0);
            $scope.CostCenterBreakupLedgerWise.TDr = drAmt;
            $scope.CostCenterBreakupLedgerWise.TCr = crAmt;
            $scope.CostCenterBreakupLedgerWise.CDr = (closingAmt > 0 ? closingAmt : 0);
            $scope.CostCenterBreakupLedgerWise.CCr = (closingAmt < 0 ? Math.abs(closingAmt) : 0);

            if (openingAmt > 0)
                $scope.dataForBottomGrid[0].DrAmt = openingAmt;
            else
                $scope.dataForBottomGrid[0].CrAmt = Math.abs(openingAmt);

            $scope.dataForBottomGrid[1].DrAmt = drAmt;
            $scope.dataForBottomGrid[1].CrAmt = crAmt;

            if (closingAmt > 0)
                $scope.dataForBottomGrid[2].DrAmt = closingAmt;
            else
                $scope.dataForBottomGrid[2].CrAmt = Math.abs(closingAmt);

            $scope.gridOptionsBottom.api.setRowData($scope.dataForBottomGrid);

            $scope.DataColl = res.data.Data.DataColl;
            $scope.gridOptions.api.setRowData($scope.DataColl);

            $scope.loadingstatus = 'done';

        }, function (errormessage) {

            $scope.loadingstatus = 'stop';

            Swal.fire('Unable to Store data. pls try again.' + errormessage.responseText);
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
                                                        Period: $scope.CostCenterBreakupLedgerWise.DateFromDet.dateBS + " TO " + $scope.CostCenterBreakupLedgerWise.DateToDet.dateBS,
                                                        ODr: $scope.CostCenterBreakupLedgerWise.ODr,
                                                        OCr: $scope.CostCenterBreakupLedgerWise.OCr,
                                                        TDr: $scope.CostCenterBreakupLedgerWise.TDr,
                                                        TCr: $scope.CostCenterBreakupLedgerWise.TCr,
                                                        CDr: $scope.CostCenterBreakupLedgerWise.CDr,
                                                        CCr: $scope.CostCenterBreakupLedgerWise.CCr
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
                                    Period: $scope.CostCenterBreakupLedgerWise.DateFromDet.dateBS + " TO " + $scope.CostCenterBreakupLedgerWise.DateToDet.dateBS,
                                    ODr: $scope.CostCenterBreakupLedgerWise.ODr,
                                    OCr: $scope.CostCenterBreakupLedgerWise.OCr,
                                    TDr: $scope.CostCenterBreakupLedgerWise.TDr,
                                    TCr: $scope.CostCenterBreakupLedgerWise.TCr,
                                    CDr: $scope.CostCenterBreakupLedgerWise.CDr,
                                    CCr: $scope.CostCenterBreakupLedgerWise.CCr
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
            var dayBook = node.data;
            filterData.push(dayBook);
        });

        return filterData;

    };

    $scope.onBtExport = function () {
        $scope.loadingstatus = 'running';
        showPleaseWait();
        var dataColl = $scope.GetDataForPrint();

        var DateFrom = new Date(($filter('date')(new Date(), 'yyyy-MM-dd')));
        var DateTo = new Date(($filter('date')(new Date(), 'yyyy-MM-dd')));

        if ($scope.CostCenterBreakupLedgerWise.DateFromDet)
            DateFrom = new Date(($filter('date')($scope.CostCenterBreakupLedgerWise.DateFromDet.dateAD, 'yyyy-MM-dd')));

        if ($scope.CostCenterBreakupLedgerWise.DateToDet)
            DateTo = new Date(($filter('date')($scope.CostCenterBreakupLedgerWise.DateToDet.dateAD, 'yyyy-MM-dd')));

        $scope.DataColl = []; //declare an empty array

        var paraData = {
            CostCenterId: $scope.CostCenterBreakupLedgerWise.CostCenterId,
            dateFrom: DateFrom,
            dateTo: DateTo,
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
                down_file(base_url + "//" + res.data.Data.ResponseId, "CostCenterBreakupLedgerWise.xlsx");
            }

        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            Swal.fire(errormessage);
        });

    }
    $scope.onFilterTextBoxChanged = function () {
        $scope.gridOptions.api.setQuickFilter($scope.search);
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
