"use strict";

agGrid.initialiseAgGridWithAngular1(angular);

app.controller("TDSSummaryContrl", function ($scope, $http, $filter, $timeout, GlobalServices, $compile) {
var PrintPreviewAs = 1;
 const contextMenu = GlobalServices.createElementForMenu();
    LoadData();

    $scope.onBtExportCSV = function () {
        var params = {
            fileName: 'TDSSummary.csv',
            sheetName: 'TDSSummary'
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


        $scope.ReportFormatColl = [{ id: 1, text: 'ProductWise' }, { id: 2, text: 'InvoiceWise' }];

        $scope.SalesVatRegister = {
            DateFrom_TMP: new Date(),
            DateTo_TMP: new Date(),
            VoucherId: null,
            BranchId: null,
            ReportType:2
        };


        $scope.loadingstatus = "stop";

        $scope.columnDefs = [
            {
                headerName: "Miti", width: 130, field: "VoucherMiti", dataType: 'Text', cellStyle: { 'text-align': 'center' }, pinned: 'left'
            },
            { headerName: "InvoiceNo", width: 140, field: "VoucherNo", dataType: 'Text', cellStyle: { 'text-align': 'center' }, pinned: 'left' },
            { headerName: "Vendor Name", width: 220, field: "PartyName", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Vendor PAN", width: 160, field: "PanNo", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Address", width: 180, field: "Address", dataType: 'Text', cellStyle: { 'text-align': 'left' }, colId: 'colItem1', },
            { headerName: "Invoice Amt.", width: 140, field: "InvoiceAmt", dataType: 'Number', cellStyle: { 'text-align': 'right' }, colId: 'colItem3', filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },            
            { headerName: "Assessable Amt", width: 160, field: "AccessableAmt", dataType: 'Number', cellStyle: { 'text-align': 'right' }, colId: 'colItem4', filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "TDS", width: 170, field: "TDSAmount", dataType: 'Number', cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "Paid", width: 160, field: "TDSPaid", dataType: 'Number', cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "Dues", width: 140, field: "TDSDues", dataType: 'Number', cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },            
            { headerName: "TDS Ledger", width: 160, field: "TDSLedger", dataType: 'Text', cellStyle: { 'text-align': 'right' }, filter: "agTextColumnFilter",   },
            { headerName: "TDS Code", width: 160, field: "TDSCode", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "TDS Alias", width: 160, field: "TDSAlias", dataType: 'Number', cellStyle: { 'text-align': 'right' }, filter: "agTextColumnFilter",  },
            { headerName: "Voucher", width: 150, field: "VoucherName", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Branch", width: 170, field: "Branch", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Year", width: 120, field: "CostClass", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Heading", width: 200, field: "ExpHeading", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Payment Details", width: 200, field: "PaymentDetails", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
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
            columnDefs: $scope.columnDefs,
            rowData: null,
            filter: true,
            suppressHorizontalScroll: true,
            alignedGrids: [],
            enableFilter: true,

            onFilterChanged: function () {

                var dt = {
                    PartyName: 'TOTAL =>',
                    InvoiceAmt: 0,
                    AccessableAmt: 0,
                    TDSAmount: 0,
                    TDSPaid: 0,
                    TDSDues: 0,
                   
                }
                $scope.gridOptions.api.forEachNodeAfterFilterAndSort(function (node) {
                    var fData = node.data;
                    dt.InvoiceAmt += fData.InvoiceAmt;
                    dt.AccessableAmt += fData.AccessableAmt;
                    dt.TDSAmount += fData.TDSAmount;
                    dt.TDSPaid += fData.TDSPaid;
                    dt.TDSDues += fData.TDSDues;
                     
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
                VoucherType: 'Total =>',
                PanVat: '',
                InvoiceAmount: 0
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
        $scope.loadingstatus = "stop";

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

$timeout(function () {
            GlobalServices.getListState(EntityId, $scope.gridOptions);
        });
    }

    $scope.ClearData = function () {

        var DataColl = [];
        $scope.gridOptionsBottom.api.setRowData(DataColl);

        $scope.gridOptions.api.setRowData(DataColl);
    };

    $scope.GetSalesVatRegister = function () {

        $scope.ClearData();
          

        var dateFrom = new Date(($filter('date')(new Date(), 'yyyy-MM-dd')));
        var dateTo = new Date(($filter('date')(new Date(), 'yyyy-MM-dd')));

        if ($scope.SalesVatRegister.DateFromDet)
            dateFrom = new Date(($filter('date')($scope.SalesVatRegister.DateFromDet.dateAD, 'yyyy-MM-dd')));

        if ($scope.SalesVatRegister.DateToDet)
            dateTo = new Date(($filter('date')($scope.SalesVatRegister.DateToDet.dateAD, 'yyyy-MM-dd')));

        var beData =
        {
            dateFrom: dateFrom,
            dateTo: dateTo,
            BranchId: ($scope.SalesVatRegister.BranchId ? $scope.SalesVatRegister.BranchId : 0),      
        };

        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: "post",
            url: base_url + "Account/Reporting/GetTDSSummary",
            data: JSON.stringify(beData),
            dataType: "json"
        }).then(function (res) {

            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                var DataColl = mx(res.data.Data);

                var dt = {                    
                    PartyName: 'TOTAL =>',
                    InvoiceAmt: DataColl.sum(p1 => p1.InvoiceAmt),
                    AccessableAmt: DataColl.sum(p1 => p1.AccessableAmt),
                    TDSAmount: DataColl.sum(p1 => p1.TDSAmount),
                    TDSPaid: DataColl.sum(p1 => p1.TDSPaid),
                    TDSDues: DataColl.sum(p1 => p1.TDSDues),
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

        document.getElementById("frmRpt").src = '';
        reload_message_frame('frmRpt');

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
                                            var dataColl = $scope.GetDataForPrint();
                                            print = true;
                                            if (selectedRpt.Rpt_Type == 3)
                                            {
                                                var paraData = {
                                                    Period: $scope.SalesVatRegister.DateFromDet.dateBS + " TO " + $scope.SalesVatRegister.DateToDet.dateBS,
                                                    FYear: (dataColl && dataColl.length > 0 ? dataColl[0].ForYear : ''),
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
                                                        formData.append("RptPath", selectedRpt.Path);
                                                        return formData;
                                                    },
                                                    data: { jsonData: dataColl }
                                                }).then(function (res) {

                                                    $scope.loadingstatus = "stop";
                                                    hidePleaseWait();
                                                    if (res.data.IsSuccess && res.data.Data) {
                                                        down_file(base_url+"//"+res.data.Data.ResponseId, "TDSSummary.xlsx");
                                                    }  

                                                }, function (errormessage) {
                                                    hidePleaseWait();
                                                    $scope.loadingstatus = "stop";
                                                    Swal.fire(errormessage);
                                                });

                                            }
                                            else {
                                                
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

                                                        document.body.style.cursor = 'wait';
                                                        document.getElementById("frmRpt").src = '';

                                                        var rptPara = {
                                                            rpttranid: rptTranId,
                                                            istransaction: false,
                                                            entityid: EntityId,
                                                            voucherid: 0,
                                                            tranid: 0,
                                                            vouchertype: 0,
                                                            sessionid: res.data.Data.ResponseId,
                                                            Period: $scope.SalesVatRegister.DateFromDet.dateBS + " TO " + $scope.SalesVatRegister.DateToDet.dateBS,
                                                            FYear: (dataColl && dataColl.length > 0 ? dataColl[0].ForYear : ''),
                                                        };
                                                        var paraQuery = param(rptPara);
                                                        document.body.style.cursor = 'wait';

                                                        if (selectedRpt.Rpt_Type == 3)
                                                            document.getElementById("frmRpt").src = base_url + "web/ShowExcelReport.aspx?" + paraQuery;
                                                        else if (selectedRpt.Rpt_Type == 2)
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

                        if (selectedRpt.Rpt_Type == 3) {

                            var paraData = {
                                Period: $scope.SalesVatRegister.DateFromDet.dateBS + " TO " + $scope.SalesVatRegister.DateToDet.dateBS,
                                FYear: (dataColl && dataColl.length > 0 ? dataColl[0].ForYear : ''),
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
                                    formData.append("RptPath", selectedRpt.Path);
                                    return formData;
                                },
                                data: { jsonData: dataColl }
                            }).then(function (res) {

                                $scope.loadingstatus = "stop";
                                hidePleaseWait();
                                if (res.data.IsSuccess && res.data.Data) {
                                    down_file(base_url + "//" + res.data.Data.ResponseId, "TDSSummary.xlsx");
                                }

                            }, function (errormessage) {
                                hidePleaseWait();
                                $scope.loadingstatus = "stop";
                                Swal.fire(errormessage);
                            });

                        }
                        else {
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
                                        Period: $scope.SalesVatRegister.DateFromDet.dateBS + " TO " + $scope.SalesVatRegister.DateToDet.dateBS,
                                        FYear: (dataColl && dataColl.length > 0 ? dataColl[0].ForYear : ''),
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

    $scope.DownloadAsXls = function ()
    {

        $scope.loadingstatus = 'running';
        showPleaseWait();

        var dataColl = $scope.GetDataForPrint();

        var paraData = {
            Period: $scope.SalesVatRegister.DateFromDet.dateBS + " TO " + $scope.SalesVatRegister.DateToDet.dateBS,
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
                down_file(base_url + "//" + res.data.Data.ResponseId, "TDSSummary.xlsx");
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
