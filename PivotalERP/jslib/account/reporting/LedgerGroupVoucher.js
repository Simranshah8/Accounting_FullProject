app.controller("LedgerGroupVoucher", function ($scope, $http, $filter, $timeout, GlobalServices, $compile) {
var PrintPreviewAs = 1;
 const contextMenu = GlobalServices.createElementForMenu();
    LoadData();
    $scope.onBtExportCSV = function () {
        var params = {
            fileName: 'LedgerGroupVoucher.csv',
            sheetName: 'LedgerGroupVoucher'
        };

        $scope.gridOptions.api.exportDataAsCsv(params);
    }
   
    function LoadData() {
        $('.select2').select2({
            allowClear: true,
            openOnEnter: true
        });
        $scope.LedgerGroupVoucher = {
            LedgerGroupId: 0,
            DateFrom_TMP: new Date(),
            DateTo_TMP: new Date(),


        };
		
		 $scope.GenConfig = {};
        GlobalServices.getGenConfig().then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.GenConfig = res.data.Data;
                PrintPreviewAs = $scope.GenConfig.PrintPreviewAs;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });


        $scope.LedgerList = [];
        $http({
            method: 'GET',
            url: base_url + "Account/Creation/GetLedgerList",
            dataType: "json"
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.LedgerList = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
        $scope.LedgerGroupList = [];
        $http({
            method: 'GET',
            url: base_url + "Account/Creation/GetLedgerGroupList",
            dataType: "json"
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.LedgerGroupList = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
        
        $scope.CostCategoriesList = [];
        $http({
            method: 'GET',
            url: base_url + "Account/Creation/GetCostCategories",
            dataType: "json"
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.CostCategoriesList = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $timeout(function () {
            $http({
                method: "GET",
                url: base_url + "Global/GetCompanyDetail",
                dataType: "json"
            }).then(function (res) {
                var comDet = res.data.Data;
                if (comDet) {
                    $scope.LedgerGroupVoucher.DateFrom_TMP = new Date(comDet.StartDate);
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
                headerName: "Date(A.D.)", width: 150, field: "VoucherDate", cellRenderer: 'agGroupCellRenderer', dataType: 'DateTime', pinned: 'left',cellStyle: { 'text-align': 'center' },
                valueFormatter: function (params) { return DateFormatAD(params.value); },
                showRowGroup: true,
                cellRendererParams: {
                    suppressCount: false, // turn off the row count
                }
            },
            {
                headerName: "Date(B.S.)", width: 150, field: "VoucherDateBS", cellRenderer: 'agGroupCellRenderer', dataType: 'DateTime', pinned: 'left',cellStyle: { 'text-align': 'center' },
                valueFormatter: function (params) { return DateFormatBS(params.value); },
                showRowGroup: true,
                cellRendererParams: {
                    suppressCount: false, // turn off the row count
                }
            },
            { headerName: "Particulars", width: 250, field: "Particulars", filter: 'agTextColumnFilter', dataType: 'Text',cellStyle: { 'text-align': 'left' } },
            { headerName: "VoucherType", width: 200, field: "VoucherName", filter: 'agTextColumnFilter', dataType: 'Text',cellStyle: { 'text-align': 'left' } },
            { headerName: "Voucher No.", width: 180, field: "VoucherNo", filter: 'agTextColumnFilter', dataType: 'Text',cellStyle: { 'text-align': 'center' } },
            { headerName: "RefNo", width: 200, field: "RefNo", filter: 'agTextColumnFilter', dataType: 'Text',cellStyle: { 'text-align': 'center' } },
            { headerName: "Debit", width: 180, field: "DrAmt", filter: 'agTextColumnFilter', dataType: 'Number', cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "Credit", width: 180, field: "CrAmt", filter: 'agTextColumnFilter', dataType: 'Number', cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "CostClass", width: 200, field: "CostClassName", dataType: 'Text',cellStyle: { 'text-align': 'left' } },
            { headerName: "User", width: 200, field: "UserName", dataType: 'Text',cellStyle: { 'text-align': 'left' } },
                       
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
            
            enableSorting: true,
            multiSortKey: 'ctrl',
            enableColResize: true,
            overlayLoadingTemplate: "Please Click the Load Bottom to display the data",
            overlayNoRowsTemplate: "No Records found",
            rowSelection: 'multiple',
            columnDefs: $scope.columnDefs,
            rowData: null,
            filter: true,
            suppressHorizontalScroll: true,
            alignedGrids: [],
            enableFilter: true,

            onFilterChanged: function () {

                var dt = {
                    Particulars: 'TOTAL =>',
                    DrAmt: 0,
                    CrAmt: 0,
                   
                }
                $scope.gridOptions.api.forEachNodeAfterFilterAndSort(function (node) {
                    var fData = node.data;
                    dt.DrAmt += fData.DrAmt;
                    dt.CrAmt += fData.CrAmt;
                    
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
                DateAD: '',
                DateBS: '',

                VoucherName: 'Opening Balance =>',
                VoucherNo: '',
                CheckNo: '',
                ChequeDate: '',
                AccountNo: '',
                Remarks: '',
                DrAmt: 0,
                CrAmt: 0,
            },
            {
                IsParent: true,
                DateAD: '',
                DateBS: '',

                VoucherName: 'Current Total =>',
                VoucherNo: '',
                CheckNo: '',
                ChequeDate: '',
                AccountNo: '',
                Remarks: '',
                DrAmt: 0,
                CrAmt: 0,
            },
            {
                IsParent: true,
                DateAD: '',
                DateBS: '',

                VoucherName: 'Closing Balance =>',
                VoucherNo: '',
                CheckNo: '',
                ChequeDate: '',
                AccountNo: '',
                Remarks: '',
                DrAmt: 0,
                CrAmt: 0,
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

    $scope.GetLedgerGroupVoucher = function () {

        $scope.ClearData();

        if (!$scope.LedgerGroupVoucher.LedgerGroupId)
            return;

        var dateFrom = new Date(($filter('date')(new Date(), 'yyyy-MM-dd')));
        var dateTo = new Date(($filter('date')(new Date(), 'yyyy-MM-dd')));

        if ($scope.LedgerGroupVoucher.DateFromDet)
            dateFrom = new Date(($filter('date')($scope.LedgerGroupVoucher.DateFromDet.dateAD, 'yyyy-MM-dd')));

        if ($scope.LedgerGroupVoucher.DateToDet)
            dateTo = new Date(($filter('date')($scope.LedgerGroupVoucher.DateToDet.dateAD, 'yyyy-MM-dd')));

        $scope.DataColl = []; //declare an empty array

        var beData = {
            DateFrom: dateFrom,
            DateTo: dateTo,
            LedgerGroupId: $scope.LedgerGroupVoucher.LedgerGroupId
        };

        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: "post",
            url: base_url + "Account/Reporting/GetLedgerGroupVoucher",
            data: JSON.stringify(beData),
            data: JSON.stringify(beData),
            dataType: "json"
        }).then(function (res) {

            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                var DataColl = mx(res.data.Data);

                var dt = {
                    Particulars: 'TOTAL =>',
                    DrAmt: DataColl.sum(p1 => p1.DrAmt),
                    CrAmt: DataColl.sum(p1 => p1.CrAmt),
                    
                }

                var filterDataColl = [];
                filterDataColl.push(dt);

                $scope.gridOptionsBottom.api.setRowData(filterDataColl);

                $scope.gridOptions.api.setRowData(res.data.Data);
            } else
                alert(res.data.ResponseMSG);

        }, function (reason) {
            $scope.loadingstatus = "stop";
            alert('Failed' + reason);
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
                                                        Period: $scope.LedgerGroupVoucher.DateFromDet.dateBS + " TO " + $scope.LedgerGroupVoucher.DateToDet.dateBS,
                                                        ODr: $scope.LedgerGroupVoucher.ODr,
                                                        OCr: $scope.LedgerGroupVoucher.OCr,
                                                        TDr: $scope.LedgerGroupVoucher.TDr,
                                                        TCr: $scope.LedgerGroupVoucher.TCr,
                                                        CDr: $scope.LedgerGroupVoucher.CDr,
                                                        CCr: $scope.LedgerGroupVoucher.CCr
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
                                    Period: $scope.LedgerGroupVoucher.DateFromDet.dateBS + " TO " + $scope.LedgerGroupVoucher.DateToDet.dateBS,
                                    ODr: $scope.LedgerGroupVoucher.ODr,
                                    OCr: $scope.LedgerGroupVoucher.OCr,
                                    TDr: $scope.LedgerGroupVoucher.TDr,
                                    TCr: $scope.LedgerGroupVoucher.TCr,
                                    CDr: $scope.LedgerGroupVoucher.CDr,
                                    CCr: $scope.LedgerGroupVoucher.CCr
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

    $scope.onFilterTextBoxChanged = function () {
        $scope.gridOptions.api.setQuickFilter($scope.search);
    }

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
                down_file(base_url + "//" + res.data.Data.ResponseId, "LedgerGroupVoucher.xlsx");
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
