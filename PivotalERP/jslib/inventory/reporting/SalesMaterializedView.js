"use strict";

agGrid.initialiseAgGridWithAngular1(angular);

app.controller("SalesMaterializedView", function ($scope, $http, $filter, $timeout, GlobalServices, $compile) {

  var PrintPreviewAs = 1;
    const contextMenu = GlobalServices.createElementForMenu();
    LoadData();

    $scope.onBtExportCSV = function () {
        var params = {
            fileName: 'SalesMaterializedView.csv',
            sheetName: 'SalesMaterializedView'
        };

        $scope.gridOptions.api.exportDataAsCsv(params);
    }

    function LoadData()
    {
        $('.select2').select2({
            allowClear: true,
            openOnEnter: true
        });
         
        $scope.SalesMaterializedView = {
            DateFrom_TMP: new Date(),
            DateTo_TMP: new Date(),
            IsReturn: false,
        };

        $timeout(function () {
            GlobalServices.getCompanyDet().then(function (res) {
                var comDet = res.data.Data;
                if (comDet) {
                    $scope.SalesMaterializedView.DateFrom_TMP = new Date(comDet.StartDate);
                }
            }, function (errormessage) {
                alert('Unable to get data. pls try again.' + errormessage.responseText);
            });
        });

        $scope.OpeningAmt = 0;
        $scope.CurrentAmt = 0;
        $scope.TotalAmt = 0;
        $scope.ReportName = '';
        $scope.noofdecimal = 2;

        $scope.loadingstatus = "stop";

        var columnDefs = [

            { headerName: "FiscalYear", width: 120, field: "FYear", cellStyle: { 'text-align': 'center' }, pinned: 'left'  },
            { headerName: "BillNo", width: 120, field: "BillNo", cellStyle: { 'text-align': 'center' }, pinned: 'left' },
            { headerName: "Customer Name", width: 200, field: "PartyName", cellStyle: { 'text-align': 'left' }  },
            { headerName: "Customer Pan", width: 140, field: "PanVatNo", cellStyle: { 'text-align': 'left' } },
            { headerName: "Bill Date", width: 120, field: "VoucherDateBS", cellStyle: { 'text-align': 'center' }  },
            { headerName: "Amount", width: 150, field: "TotalAmount", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "Taxable Amount", width: 160, field: "TaxAbleAmount", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "Total Amount", width: 160, field: "TotalAmount", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "Vat", width: 140, field: "Vat", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "SyncWithIRD", width: 140, field: "SyncWithIRD", cellStyle: { 'text-align': 'center' }, valueFormatter: function (params) { return YesNoformat(params.value); } },
            { headerName: "Is Printed", width: 120, field: "IsPrinted", cellStyle: { 'text-align': 'center' }, valueFormatter: function (params) { return YesNoformat(params.value); } },
            { headerName: "Is Active", width: 120, field: "IsActive", cellStyle: { 'text-align': 'center' }, valueFormatter: function (params) { return YesNoformat(params.value); } },
            { headerName: "Print DateTime", width: 150, field: "PrintDateTime", cellStyle: { 'text-align': 'center' } },
            { headerName: "Entered By", width: 130, field: "EnterBy", cellStyle: { 'text-align': 'left' } },
            { headerName: "Print By", width: 130, field: "PrintBy", cellStyle: { 'text-align': 'left' } },
            { headerName: "Is RealTime", width: 120, field: "EnterBy", cellStyle: { 'text-align': 'center' }, valueFormatter: function (params) { return YesNoformat(params.value); } },

            { headerName: "Payment_Method", width: 150, field: "PaymentMethod", cellStyle: { 'text-align': 'left' } },
            { headerName: "Vat Refund Amt.", width: 140, field: "VatRefundAmtIfAny", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "TransactionId", width: 140, field: "TransactionId", cellStyle: { 'text-align': 'left' } },

            { headerName: "Branch", width: 120, field: "Branch", cellStyle: { 'text-align': 'left' } },
             
        ];

        $scope.gridOptions = {
			onCellContextMenu: onCellContextMenu, // Handle right-click event
            defaultColDef: {
                filter: true,
                resizable: true,
                sortable: true,
                width: 100,


            },
            enableSorting: true,
            multiSortKey: 'ctrl',
            enableColResize: true,
            overlayLoadingTemplate: "Please Click the Load Bottom to display the data",
            overlayNoRowsTemplate: "No Records found",
            rowSelection: 'multiple',
            columnDefs: columnDefs,
            rowData: null,
            filter: true,
            suppressHorizontalScroll: true,
            alignedGrids: [],
            enableFilter: true,

            onFilterChanged: function () {

                var dt = {
                    PartyName: 'TOTAL =>',
                    TaxAbleAmount: 0,
                    Vat: 0,
                    Discount: 0,
                    TotalAmount:0,
                }
                $scope.gridOptions.api.forEachNodeAfterFilterAndSort(function (node) {
                    var fData = node.data;
                    dt.TaxAbleAmount += fData.TaxAbleAmount;
                    dt.Vat += fData.Vat;
                    dt.Discount += fData.Discount;
                    dt.TotalAmount += fData.TotalAmount;
                });

                var filterDataColl = [];
                filterDataColl.push(dt); 
                $scope.gridOptionsBottom.api.setRowData(filterDataColl);
            }

        };
        $scope.eGridDiv = document.querySelector('#datatable');

        // create the grid passing in the div to use together with the columns & data we want to use
        new agGrid.Grid($scope.eGridDiv, $scope.gridOptions);

        $scope.dataForBottomGrid = [
            {
                AutoNumber: '',
                PartyName: 'Total =>',
                TotalAmount: 0,
                Vat: '',
            }];

        $scope.gridOptionsBottom = {
            defaultColDef: {
                resizable: true,
                width: 90
            },
            columnDefs: columnDefs,
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

       
        $scope.dataForBottomGrid[0].BalanceRate = 0;
        $scope.dataForBottomGrid[0].BalanceAmt = 0;

        $scope.gridOptionsBottom.api.setRowData($scope.dataForBottomGrid);

        $scope.DataColl = [];
        $scope.gridOptions.api.setRowData($scope.DataColl);
    };


    $scope.GetSalesMaterializedView = function () {

        $scope.ClearData();

        var dateFrom = new Date(($filter('date')(new Date(), 'yyyy-MM-dd')));
        var dateTo = new Date(($filter('date')(new Date(), 'yyyy-MM-dd')));

        if ($scope.SalesMaterializedView.DateFromDet)
            dateFrom = new Date(($filter('date')($scope.SalesMaterializedView.DateFromDet.dateAD, 'yyyy-MM-dd')));

        if ($scope.SalesMaterializedView.DateToDet)
            dateTo = new Date(($filter('date')($scope.SalesMaterializedView.DateToDet.dateAD, 'yyyy-MM-dd')));
         
        var beData = {
            DateFrom: dateFrom,
            DateTo: dateTo,
            IsReturn: $scope.SalesMaterializedView.IsReturn 
        };


        $scope.loadingstatus = 'running';
        showPleaseWait();


        $http({
            method: "post",
            url: base_url + "Inventory/Reporting/GetSalesMaterializedView",
            data: JSON.stringify(beData),
            dataType: "json"
        }).then(function (res) {

            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                var DataColl = mx(res.data.Data);

                var dt = {
                    PartyName:'TOTAL =>',
                    TaxAbleAmount: DataColl.sum(p1=>p1.TaxAbleAmount),
                    Vat: DataColl.sum(p1 => p1.Vat),
                    Discount: DataColl.sum(p1 => p1.Discount),
                    TotalAmount: DataColl.sum(p1 => p1.TotalAmount),
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
                                                        Period: $scope.SalesMaterializedView.DateFromDet.dateBS + " TO " + $scope.SalesMaterializedView.DateToDet.dateBS,
                                                        ProductGroup: '',
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
                                    Period: $scope.SalesMaterializedView.DateFromDet.dateBS + " TO " + $scope.SalesMaterializedView.DateToDet.dateBS,
                                    ProductGroup: '',
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
            Period: $scope.SalesMaterializedView.DateFromDet.dateBS + " TO " + $scope.SalesMaterializedView.DateToDet.dateBS         
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
                down_file(base_url + "//" + res.data.Data.ResponseId, "SalesMaterializedView.xlsx");
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
        if (contextMenu.contains(event.target)) {
            return;
        }
        contextMenu.style.display = 'none';
    });

    $(document).ready(function () {
        $(this).bind("contextmenu", function (e) {
            e.preventDefault();
        });
    });
	
   
});
