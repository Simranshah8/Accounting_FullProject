"use strict";

agGrid.initialiseAgGridWithAngular1(angular);

app.controller("SalesCreditLimitSummaryBillWise", function ($scope, $http, $filter, $timeout, GlobalServices, $compile) {

  var PrintPreviewAs = 1;
    const contextMenu = GlobalServices.createElementForMenu();
    LoadData();

    $scope.onBtExportCSV = function () {
        var params = {
            fileName: 'SalesCreditLimitSummaryBillWise.csv',
            sheetName: 'SalesCreditLimitSummaryBillWise'
        };

        $scope.gridOptions.api.exportDataAsCsv(params);
    }

    function LoadData() {
        $('.select2').select2({
            allowClear: true,
            openOnEnter: true
        });
       
        //Search Drop DownList
        $scope.VoucherSearchOptions = [{ text: 'Discount', value: 'Discount', dataType: 'Number' },
            { text: 'ScheduleDate', value: 'ScheduleDate', dataType: 'Number' },
            { text: 'VoucherNo', value: 'VoucherNo', dataType: 'Number' },
            { text: 'Voucher', value: 'Voucher', dataType: 'Number' },
            { text: 'PartyCode', value: 'PartyCode', dataType: 'Number' },
            { text: 'PartyName', value: 'PartyName', dataType: 'Number' },
            { text: 'Address', value: 'Address', dataType: 'Number' },
            { text: 'PanvatNo', value: 'PAN', dataType: 'Number' },
            { text: 'InvoiceAmt', value: 'Amt', dataType: 'Number' },
            { text: 'SalesMan', value: 'Agent', dataType: 'Number' },
            { text: 'MobileNo1', value: 'MobileNo1', dataType: 'Number' },
            { text: 'MobileNo2', value: 'MobileNo2', dataType: 'Number' },
            { text: 'PhoneNo', value: 'PhoneNo', dataType: 'Number' },
            { text: 'CreditDays', value: 'CreditDays', dataType: 'text' },
            { text: 'CrossDays', value: 'Crodd', dataType: 'text' },
            { text: 'Days', value: 'Days', dataType: 'text' },
        ];

        //Filter Dialog Box Details 
        $scope.BranchTypeColl = [];
        $scope.VoucherTypeColl = [];
        $scope.LedgerGroupTypeColl = [];
        $scope.ExpressionColl = GlobalServices.getExpression();
        $scope.ConditionColl = GlobalServices.getLogicCondition();
        $scope.FilterColumnColl = [{ text: 'Discount', value: 'Discount', dataType: 'Number' },
        { text: 'ExDuty', value: 'ExDuty', dataType: 'Number' },
        { text: 'Freight', value: 'Freight', dataType: 'Number' },
        { text: 'ImportTax', value: 'ImportTax', dataType: 'Number' },
        { text: 'ImportValue', value: 'ImportValue', dataType: 'Number' },
        { text: 'Vat', value: 'Vat', dataType: 'Number' },
        { text: 'TotalValue', value: 'TotalValue', dataType: 'Number' },
        { text: 'TotalSales', value: 'TotalSales', dataType: 'Number' },
        { text: 'TaxableValue', value: 'TaxableValue', dataType: 'Number' },
        { text: 'Schame', value: 'Schame', dataType: 'Number' },
        { text: 'AdditionalCharge', value: 'AdditionalCharge', dataType: 'Number' },
        { text: 'Address', value: 'Address', dataType: 'Number' },
        { text: 'Buyer', value: 'Buyer', dataType: 'Number' },
        { text: 'InvoiceNo', value: 'InvoiceNo', dataType: 'text' },
        { text: 'PanVatNo', value: 'PAN', dataType: 'text' },
        { text: 'PartyName', value: 'PartyName', dataType: 'text' },
        ];

       
        $scope.SalesCreditLimitSummaryBillWise = {

            CreditLimitExpiredDays: 0,
            AfterDays: 0,
           
        };
       
        $scope.loadingstatus = "stop";

        $scope.columnDefs = [

            { headerName: "VoucherDate", width: 150, field: "VoucherDate", dataType: 'DateTime', pinned:'left', cellStyle: { 'text-align': 'center' }  },
            { headerName: "Schedule Date", width: 150, field: "ScheduleDate", dataType: 'DateTime', pinned: 'left', cellStyle: { 'text-align': 'center' }  },
            { headerName: "Voucher No", width: 150, field: "VoucherNo", pinned: 'left', dataType: 'Number', cellStyle: { 'text-align': 'center' }  },
            { headerName: "VoucherName", width: 250, field: "VoucherName", dataType: 'Text', cellStyle: { 'text-align': 'left' }  },
            { headerName: "Party Code", width: 150, field: "PartyCode", dataType: 'Number', cellStyle: { 'text-align': 'left' }  },
            { headerName: "Party Name", width: 250, field: "PartyName", dataType: 'Text', cellStyle: { 'text-align': 'left' }  },
            { headerName: "Address", width: 250, field: "Address", dataType: 'Text', cellStyle: { 'text-align': 'left' }  },
            { headerName: "PanVatNo", width: 150, field: "PAN", dataType: 'Text', cellStyle: { 'text-align': 'center' }  },
            { headerName: "Invoice Amount", width: 180, dataType: 'Number', field: "InvoiceAmt", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); },    },
            { headerName: "SalesMan", width: 150, field: "Agent", dataType: 'Text', cellStyle: { 'text-align': 'left' }  },
            { headerName: "MobileNo 1", width: 180, field: "MobileNo1", dataType: 'Number', cellStyle: { 'text-align': 'right' }  },
            { headerName: "MobileNo 2", width: 180, field: "MobileNo2", dataType: 'Number', cellStyle: { 'text-align': 'right' }  },
            { headerName: "PhoneNo", width: 180, field: "PhoneNo", dataType: 'Number', cellStyle: { 'text-align': 'right' }  },
            { headerName: "CreditDays", width: 180, field: "CreditDays", dataType: 'Text', cellStyle: { 'text-align': 'right' }  },
            { headerName: "Days", width: 150, field: "TotalDays", dataType: 'Number', cellStyle: { 'text-align': 'right' }  },
            { headerName: "Cross Days", width: 150, field: "CrossDays", dataType: 'Text', cellStyle: { 'text-align': 'right' }  },
            
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
                    VoucherName: 'Total =>',
                    InvoiceAmt: 0


                }
                $scope.gridOptions.api.forEachNodeAfterFilterAndSort(function (node) {
                    var fData = node.data;
                    dt.InvoiceAmt += fData.InvoiceAmt
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
               
                VoucherName: 'Total =>',
                InvoiceAmt: 0,
                
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
    $scope.ClearData = function () {

        var DataColl = [];
        $scope.gridOptionsBottom.api.setRowData(DataColl);

        $scope.gridOptions.api.setRowData(DataColl);
    };
    $scope.GetSalesCreditLimitSummaryBillWise = function () {

        $scope.ClearData();

       

        var beData = {

            CreditLimitExpiredDays: $scope.SalesCreditLimitSummaryBillWise.CreditLimitExpiredDays,
            AfterDays: $scope.SalesCreditLimitSummaryBillWise.AfterDays,
            
           
        };

        $scope.loadingstatus = 'running';

        $http({
            method: "POST",
            url: base_url + "Inventory/Reporting/GetSalesCreditLimitSummaryBillWise",
            data: JSON.stringify(beData),
            dataType: "json"
        }).then(function (res) {

            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                var DataColl = mx(res.data.Data);

                var dt = {
                    VoucherName: 'TOTAL =>',
                    InvoiceAmt: DataColl.sum(p1 => p1.InvoiceAmt)
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
                            title: 'Report  For Print',
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

                                                    document.body.style.cursor = 'wait';
                                                    document.getElementById("frmRpt").src = '';
                                                    document.getElementById("frmRpt").src = base_url + "web/ReportViewer.aspx?rpttranid=" + rptTranId + "&istransaction=false&entityid=" + EntityId + "&voucherid=0&tranid=0&vouchertype=0&sessionid=" + res.data.Data.ResponseId;
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

                                document.body.style.cursor = 'wait';
                                document.getElementById("frmRpt").src = '';
                                document.getElementById("frmRpt").src = base_url + "web/ReportViewer.aspx?rpttranid=" + rptTranId + "&istransaction=false&entityid=" + EntityId + "&voucherid=0&tranid=0&vouchertype=0&sessionid=" + res.data.Data.ResponseId;
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
    }
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
                down_file(base_url + "//" + res.data.Data.ResponseId, "SalesCreditLimitSummaryBillWise.xlsx");
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
