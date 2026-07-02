"use strict";

agGrid.initialiseAgGridWithAngular1(angular);

app.controller("FixedProductInOutDetails", function ($scope, $http, $filter, $timeout, GlobalServices, $compile) {

  var PrintPreviewAs = 1;
    const contextMenu = GlobalServices.createElementForMenu();
    LoadData();

    $scope.onBtExportCSV = function () {
        var params = {
            fileName: 'FixedProductInOutDetails.csv',
            sheetName: 'FixedProductInOutDetails'
        };

        $scope.gridOptions.api.exportDataAsCsv(params);
    }

    function LoadData() {
        $('.select2').select2()
                
      
        $timeout(function () {
            $http({
                method: "GET",
                url: base_url + "Global/GetCompanyDetail",
                dataType: "json"
            }).then(function (res) {
                var comDet = res.data.Data;
                if (comDet) {
                    $scope.FixedProductInOutDetails.DateFrom_TMP = new Date(comDet.StartDate);
                }
            }, function (errormessage) {
                alert('Unable to Delete data. pls try again.' + errormessage.responseText);
            });
        });
        $scope.FixedProductInOutDetails = {
            DateFrom_TMP: new Date(),
            DateTo_TMP: new Date(),
            VoucherId: 0,
            IsPost: true,
            BranchId: 0
        };
 
        $scope.loadingstatus = "stop";

        $scope.columnDefs = [
            { headerName: "Date", width: 110, field: "VoucherDate", pinned: 'left', dataType: 'DateTime', cellStyle: { 'text-align': 'center' }, valueFormatter: function (params) { return DateFormatAD(params.value); }, },
            { headerName: "Miti", width: 110, field: "VoucherDateBS", pinned: 'left', dataType: 'DateTime', cellStyle: { 'text-align': 'center' } },
            { headerName: "Product Name", width: 220, field: "ProductName", pinned: 'left', dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Product Group", width: 180, field: "ProductGroup", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "EngineNo", width: 150, field: "EngineNo", colId: 'colEngineNo', dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "ChassisNo", width: 150, field: "ChassisNo", colId: 'colChassisNo', dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "InQty", width: 110, field: "InQty", dataType: 'Number', cellStyle: { 'text-align': 'right' }, valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "In Amount", width: 120, field: "InAmount", dataType: 'Number', cellStyle: { 'text-align': 'right' }, valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "OutQty", width: 110, field: "OutQty", dataType: 'Number', cellStyle: { 'text-align': 'right' }, valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "Out Amount", width: 120, field: "OutAmount", dataType: 'Number', cellStyle: { 'text-align': 'right' }, valueFormatter: function (params) { return Numberformat(params.value); } },

            { headerName: "Qty", width: 110, field: "Qty", dataType: 'Number', cellStyle: { 'text-align': 'right' }, valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "Rate", width: 120, field: "Rate", dataType: 'Number', cellStyle: { 'text-align': 'right' }, valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "Amount", width: 120, field: "Amount", dataType: 'Number', cellStyle: { 'text-align': 'right' }, valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "DiscountAmt", width: 180, field: "DiscountAmt", dataType: 'Number', cellStyle: { 'text-align': 'right' }, valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "PartyName", width: 180, field: "PartyName", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Address", width: 180, field: "PartyAddress", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "VoucherNo", width: 140, field: "VoucherNo", dataType: 'Text', cellStyle: { 'text-align': 'center' } },
            { headerName: "VoucherName", width: 180, field: "VoucherName", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Model", width: 150, field: "Model", colId:'colModel', dataType: 'Text', cellStyle: { 'text-align': 'right' } },            
            { headerName: "MFYear", width: 180, field: "Mfyear", colId: 'colMFGYear', dataType: 'Text', cellStyle: { 'text-align': 'right' } },
            { headerName: "CodeNo", width: 180, field: "CodeNo", colId: 'colCodeNo', dataType: 'Text', cellStyle: { 'text-align': 'right' } },
            { headerName: "Color", width: 130, field: "Color", colId: 'colColor', dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Godown", width: 180, field: "Godown", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "RegdNo", width: 150, field: "RegdNo", colId: 'colRegdNo', dataType: 'Text', cellStyle: { 'text-align': 'right' } },
            { headerName: "RefNo", width: 150, field: "RefNo", dataType: 'Text', cellStyle: { 'text-align': 'right' } },
            { headerName: "Vin No", width: 150, field: "VinNo", colId:'colVinNo', dataType: 'Text', cellStyle: { 'text-align': 'right' } },
            { headerName: "Key No", width: 150, field: "KeyNo", colId: 'colKeyNo', dataType: 'Text', cellStyle: { 'text-align': 'right' } },
            { headerName: "Type", width: 150, field: "Type", colId: 'colType', dataType: 'Text', cellStyle: { 'text-align': 'right' } },
            { headerName: "VoucherType", width: 180, field: "VoucherType", dataType: 'Text', cellStyle: { 'text-align': 'left' } },                        
            { headerName: "Narration", width: 180, field: "Narration", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Branch", width: 180, field: "Branch", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
         
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

                var inQty = 0, outQty = 0, inAmt = 0, outAmt = 0, qty = 0, DiscountAmt = 0, Amount = 0;
 
                $scope.gridOptions.api.forEachNodeAfterFilterAndSort(function (node) {
                    var dc = node.data;
                    inQty += isEmptyAmt(dc.InQty);
                    inAmt += isEmptyAmt(dc.InAmount);
                    outQty += isEmptyAmt(dc.OutQty);
                    outAmt += isEmptyAmt(dc.OutAmount);
                    DiscountAmt += isEmptyAmt(dc.DiscountAmt);
                    Amount += isEmptyAmt(dc.Amount);
                    qty += isEmptyAmt(dc.Qty);
                });

                $scope.dataForBottomGrid[0].InQty = inQty;
                $scope.dataForBottomGrid[0].OutQty = outQty;
                $scope.dataForBottomGrid[0].InAmount = inAmt;
                $scope.dataForBottomGrid[0].OutAmount = outAmt;
                $scope.dataForBottomGrid[0].Qty = qty;
                $scope.dataForBottomGrid[0].Amount = Amount;
                $scope.dataForBottomGrid[0].Rate = 0;                 
                $scope.gridOptionsBottom.api.setRowData($scope.dataForBottomGrid);
            }

        };
        $scope.eGridDiv = document.querySelector('#datatable');

        // create the grid passing in the div to use together with the columns & data we want to use
        new agGrid.Grid($scope.eGridDiv, $scope.gridOptions);

        $scope.dataForBottomGrid = [
            {
                AutoNumber: '',
                Godown: 'Total =>',
                Amount: 0,
                Rate: '',
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

        $scope.FixedProductConfig = [];
        $http({
            method: 'GET',
            url: base_url + "Inventory/Creation/GetFixedProductConfig",
            dataType: "json",
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.FixedProductConfig = res.data.Data;

                $timeout(function () {
                    if ($scope.FixedProductConfig.ShowEngineNo == true) {
                        $scope.gridOptions.columnApi.setColumnVisible('colEngineNo', true);
                        $scope.gridOptions.api.getColumnDef('colEngineNo').headerName = $scope.FixedProductConfig.EngineNo;
                        $scope.gridOptions.columnApi.getColumn('colEngineNo').colDef.headerName = $scope.FixedProductConfig.EngineNo;

                        $scope.gridOptions.columnApi.setColumnVisible('colVinNo', true);
                        $scope.gridOptions.api.getColumnDef('colVinNo').headerName = $scope.FixedProductConfig.EngineNo;
                        $scope.gridOptions.columnApi.getColumn('colVinNo').colDef.headerName = $scope.FixedProductConfig.EngineNo;
                    }
                    else {
                        $scope.gridOptions.columnApi.setColumnVisible('colEngineNo', false);
                        $scope.gridOptions.columnApi.setColumnVisible('colVinNo', false);
                    }


                    if ($scope.FixedProductConfig.ShowChassisNo == true) {
                        $scope.gridOptions.columnApi.setColumnVisible('colChassisNo', true);
                        $scope.gridOptions.api.getColumnDef('colChassisNo').headerName = $scope.FixedProductConfig.ChassisNo;
                        $scope.gridOptions.columnApi.getColumn('colChassisNo').colDef.headerName = $scope.FixedProductConfig.ChassisNo;
                    }
                    else
                        $scope.gridOptions.columnApi.setColumnVisible('colChassisNo', false);



                    if ($scope.FixedProductConfig.ShowRegdNo == true) {
                        $scope.gridOptions.columnApi.setColumnVisible('colRegdNo', true);
                        $scope.gridOptions.api.getColumnDef('colRegdNo').headerName = $scope.FixedProductConfig.RegdNo;
                        $scope.gridOptions.columnApi.getColumn('colRegdNo').colDef.headerName = $scope.FixedProductConfig.RegdNo;
                    }
                    else
                        $scope.gridOptions.columnApi.setColumnVisible('colRegdNo', false);



                    if ($scope.FixedProductConfig.ShowModel == true) {
                        $scope.gridOptions.columnApi.setColumnVisible('colModel', true);
                        $scope.gridOptions.api.getColumnDef('colModel').headerName = $scope.FixedProductConfig.Model;
                        $scope.gridOptions.columnApi.getColumn('colModel').colDef.headerName = $scope.FixedProductConfig.Model;
                    }
                    else
                        $scope.gridOptions.columnApi.setColumnVisible('colModel', false);



                    if ($scope.FixedProductConfig.ShowType == true) {
                        $scope.gridOptions.columnApi.setColumnVisible('colType', true);
                        $scope.gridOptions.api.getColumnDef('colType').headerName = $scope.FixedProductConfig.Type;
                        $scope.gridOptions.columnApi.getColumn('colType').colDef.headerName = $scope.FixedProductConfig.Type;
                    }
                    else
                        $scope.gridOptions.columnApi.setColumnVisible('colType', false);



                    if ($scope.FixedProductConfig.ShowColor == true) {
                        $scope.gridOptions.columnApi.setColumnVisible('colColor', true);
                        $scope.gridOptions.api.getColumnDef('colColor').headerName = $scope.FixedProductConfig.Color;
                        $scope.gridOptions.columnApi.getColumn('colColor').colDef.headerName = $scope.FixedProductConfig.Color;
                    }
                    else
                        $scope.gridOptions.columnApi.setColumnVisible('colColor', false);



                    if ($scope.FixedProductConfig.ShowKeyNo == true) {
                        $scope.gridOptions.columnApi.setColumnVisible('colKeyNo', true);
                        $scope.gridOptions.api.getColumnDef('colKeyNo').headerName = $scope.FixedProductConfig.KeyNo;
                        $scope.gridOptions.columnApi.getColumn('colKeyNo').colDef.headerName = $scope.FixedProductConfig.KeyNo;
                    }
                    else
                        $scope.gridOptions.columnApi.setColumnVisible('colKeyNo', false);


                    if ($scope.FixedProductConfig.ShowCodeNo == true) {
                        $scope.gridOptions.columnApi.setColumnVisible('colCodeNo', true);
                        $scope.gridOptions.api.getColumnDef('colCodeNo').headerName = $scope.FixedProductConfig.CodeNo;
                        $scope.gridOptions.columnApi.getColumn('colCodeNo').colDef.headerName = $scope.FixedProductConfig.CodeNo;
                    }
                    else
                        $scope.gridOptions.columnApi.setColumnVisible('colCodeNo', false);


                    if ($scope.FixedProductConfig.ShowMFGYear == true) {
                        $scope.gridOptions.columnApi.setColumnVisible('colMFGYear', true);
                        $scope.gridOptions.api.getColumnDef('colCodeNo').headerName = $scope.FixedProductConfig.MFGYear;
                        $scope.gridOptions.columnApi.getColumn('colCodeNo').colDef.headerName = $scope.FixedProductConfig.MFGYear;
                    }
                    else
                        $scope.gridOptions.columnApi.setColumnVisible('colMFGYear', false);


                });
                 
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        //ProductName
        $scope.AnalysisCollDefs = [];
        $scope.AnalysisCollDefs.push(
            { name: 'ProductName', caption: 'Product' },
            { name: 'ProductGroup', caption: 'PGroup' },
            { name: 'Godown', caption: 'Godown' },
            { name: 'Model', caption: 'Model' },
            { name: 'Color', caption: 'Color' },
            { name: 'EngineNo', caption: 'EngNo' },
            {
                name: 'Qty', caption: 'Qty',
                dataSettings: {
                    aggregateFunc: 'sum',
                    formatFunc: function (value) {
                        return Number(value).toFixed(0);
                    }
                }
            },
            {
                name: 'InQty', caption: 'InQty',
                dataSettings: {
                    aggregateFunc: 'sum',
                    formatFunc: function (value) {
                        return Number(value).toFixed(0);
                    }
                }
            },
            {
                name: 'InAmount', caption: 'InAmount',
                dataSettings: {
                    aggregateFunc: 'sum',
                    formatFunc: function (value) {
                        return Number(value).toFixed(0);
                    }
                }
            },
              {
                name: 'OutQty', caption: 'OutQty',
                dataSettings: {
                    aggregateFunc: 'sum',
                    formatFunc: function (value) {
                        return Number(value).toFixed(0);
                    }
                }
            },
            {
                name: 'OutAmount', caption: 'OutAmount',
                dataSettings: {
                    aggregateFunc: 'sum',
                    formatFunc: function (value) {
                        return Number(value).toFixed(0);
                    }
                }
            }

        );
		
		 $timeout(function () {
            GlobalServices.getListState(EntityId, $scope.gridOptions);
        });
     
    }

    $scope.ShowAnalysis = function () {


        var oldState = {
            rowFields: [],
            columnFields: [],
            rowSettings: {
                subTotal: {
                    visible: true,
                    collapsed: true,
                    collapsible: true
                }
            },
            columnSettings: {
                subTotal: {
                    visible: true,
                    collapsed: true,
                    collapsible: true
                }
            }
        };

        var config = {
            dataSource: $scope.DataColl,
            canMoveFields: true,
            dataHeadersLocation: 'columns',
            width: 1099,
            height: 611,
            theme: 'green',
            toolbar: {
                visible: true
            },
            grandTotal: {
                rowsvisible: true,
                columnsvisible: true
            },
            subTotal: {
                visible: true,
                collapsed: true,
                collapsible: true
            },
            rowFields: oldState.rowFields,
            columnFields: oldState.columnFields,
            rowSettings: oldState.rowSettings,
            columnSettings: oldState.columnSettings,
            fields: $scope.AnalysisCollDefs,
            rows: oldState.rowFields,
            columns: oldState.columnFields,
            data: oldState.dataFields
            //rows: ['Manufacturer'],//, 'Category' ],
            //columns: ['Class', 'Category'],
            //data: ['Quantity', 'Amount']                       
        };

        var elem = document.getElementById('dtAnalysis')

        $scope.pgridwidget = new orb.pgridwidget(config);
        $scope.pgridwidget.render(elem);


        $('#frmRptAnalysis').modal('show');
    }
    $scope.GetFixedProductInOutDetails = function () {

        var dateFrom = new Date(($filter('date')(new Date(), 'yyyy-MM-dd')));
        var dateTo = new Date(($filter('date')(new Date(), 'yyyy-MM-dd')));

        if ($scope.FixedProductInOutDetails.DateFromDet)
            dateFrom = $filter('date')($scope.FixedProductInOutDetails.DateFromDet.dateAD, 'yyyy-MM-dd');

        if ($scope.FixedProductInOutDetails.DateToDet)
            dateTo = $filter('date')($scope.FixedProductInOutDetails.DateToDet.dateAD, 'yyyy-MM-dd');

        $scope.DataColl = []; //declare an empty array
        $scope.gridOptions.api.setRowData($scope.DataColl);

        var beData = {
            dateFrom: dateFrom,
            dateTo: dateTo,
            Search: '',            
        };

        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: "post",
            url: base_url + "Inventory/Reporting/GetFixedProductInOutDetails",
            data: JSON.stringify(beData),
            dataType: "json"
        }).then(function (res) {

            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                $scope.DataColl = res.data.Data;

                var inQty = 0, outQty = 0, inAmt = 0, outAmt = 0, qty = 0, DiscountAmt=0,Amount=0;

                angular.forEach($scope.DataColl, function (dc) {                     
                    inQty +=isEmptyAmt(dc.InQty);
                    inAmt += isEmptyAmt(dc.InAmount);
                    outQty += isEmptyAmt(dc.OutQty);
                    outAmt += isEmptyAmt(dc.OutAmount);
                    DiscountAmt += isEmptyAmt(dc.DiscountAmt);
                    Amount += isEmptyAmt(dc.Amount);
                    qty += isEmptyAmt(dc.Qty);
                });

                $scope.dataForBottomGrid[0].InQty = inQty;
                $scope.dataForBottomGrid[0].OutQty = outQty;
                $scope.dataForBottomGrid[0].InAmount = inAmt;
                $scope.dataForBottomGrid[0].OutAmount = outAmt;
                $scope.dataForBottomGrid[0].Qty = qty;
                $scope.dataForBottomGrid[0].Amount = Amount;
                $scope.dataForBottomGrid[0].Rate = 0;
                $scope.gridOptionsBottom.api.setRowData($scope.dataForBottomGrid);

                $scope.gridOptions.api.setRowData($scope.DataColl);
            } else
                alert(res.data.ResponseMSG);

        }, function (reason) {
            $scope.loadingstatus = "stop";
            alert('Failed' + reason);
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
            url: base_url + "Inventory/Reporting/GetFixedProductInOutDetails",
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
                                                url: base_url + "Account/Reporting/PrintConsumption",
                                                headers: { 'Content-Type': undefined },

                                                transformRequest: function (data) {

                                                    var formData = new FormData();
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
                            url: base_url + "Inventory/Reporting/PrintConsumption",
                            headers: { 'Content-Type': undefined },

                            transformRequest: function (data) {

                                var formData = new FormData();
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
            var beData = node.data;
            filterData.push(beData);
        });

        return filterData;

    };

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

    $scope.DownloadAsXls = function () {

        $scope.loadingstatus = 'running';
        showPleaseWait();

        var dataColl = $scope.GetDataForPrint();

        var paraData = {
            Period: $scope.FixedProductInOutDetails.DateFromDet.dateBS + " TO " + $scope.FixedProductInOutDetails.DateToDet.dateBS,            
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
                down_file(base_url + "//" + res.data.Data.ResponseId, "FixedProductInOutDetails.xlsx");
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
