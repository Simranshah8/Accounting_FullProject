"use strict";

agGrid.initialiseAgGridWithAngular1(angular);

app.controller("ProductionOrderController", function ($scope, $http, $filter, $timeout, GlobalServices, $compile) {

  var PrintPreviewAs = 1;
    const contextMenu = GlobalServices.createElementForMenu();
	
    LoadData();

    $scope.onBtExportCSV = function () {
        var params = {
            fileName: 'ProductionOrder.csv',
            sheetName: 'ProductionOrder'
        };

        $scope.gridOptions.api.exportDataAsCsv(params);
    }

    function LoadData() {
        $('.select2').select2({
            allowClear: true,
            openOnEnter: true
        });
      
        //$scope.ReportTypeColl = [{ text: 'PendingOnly', value: 'PendingOnly', dataType: 'text' }, { text: 'ClearOnly', value: 'ClearOnly', dataType: 'text' }, { text: 'Both', value: 'Both', dataType: 'text' },]

     
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

       

        $scope.ProductionOrder = {

            DateFrom_TMP: new Date(),
            DateTo_TMP: new Date(),
           
        };

             
        $scope.Quantity = 0;
        $scope.FQty = 0;
        $scope.PQty = 0;
        $scope.Amount = 0;
        $scope.BalQty = 0;
        $scope.noofdecimal = 2;

        $scope.loadingstatus = "stop";

        $scope.columnDefs = [



            { headerName: "Voucher No", width: 140, field: "VoucherNo", cellStyle: { 'text-align': 'left' } },

            {
                headerName: "Date", width: 140, field: "VoucherDate", dataType: 'DateTime', cellRenderer: 'agGroupCellRenderer',
                valueFormatter: function (params) { return DateFormatAD(params.value); },
                showRowGroup: true,
                cellRendererParams: {
                    suppressCount: false, // turn off the row count                   
                }, 
            },
            
           
            { headerName: "Miti", width: 135, field: "VoucherMiti", cellStyle: { 'text-align': 'left' } },
          
            { headerName: "Product Name", width: 160, field: "ProductName", cellStyle: { 'text-align': 'left' } },
            { headerName: "Product Alias", width: 135, field: "ProductAlias", cellStyle: { 'text-align': 'left' } },
            { headerName: "Product Code", width: 135, field: "ProductCode", cellStyle: { 'text-align': 'left' } },
           


            { headerName: "Quantity", width: 110, field: "Quantity", cellStyle: { 'text-align': 'center' }, valueFormatter: function (params) { return $filter('formatNumber')(params.value); } },
            { headerName: "FQty", width: 100, field: "FQty", cellStyle: { 'text-align': 'center' }, valueFormatter: function (params) { return $filter('formatNumber')(params.value); } },
            { headerName: "PQty", width: 100, field: "PQty", cellStyle: { 'text-align': 'center' }, valueFormatter: function (params) { return $filter('formatNumber')(params.value); } },


            { headerName: "Unit", width: 90, field: "Unit", cellStyle: { 'text-align': 'left' } },
            { headerName: "Godown Name", width: 180, field: "GodownName", cellStyle: { 'text-align': 'left' } },
            { headerName: "Godown Code", width: 140, field: "GodownCode", cellStyle: { 'text-align': 'left' } },
            { headerName: "Narration", width: 210, field: "Narration", cellStyle: { 'text-align': 'left' } },
            { headerName: "Ref No", width: 100, field: "RefNo", cellStyle: { 'text-align': 'left' } },

            {
                headerName: "Start Date", width: 120, field: "StartDate", dataType: 'DateTime', cellRenderer: 'agGroupCellRenderer',
                valueFormatter: function (params) { return DateFormatAD(params.value); },
                showRowGroup: true,
                cellRendererParams: {
                    suppressCount: false, // turn off the row count                   
                },
            },

            {
                headerName: "Post DateTime", width: 150, field: "PostDateTime", dataType: 'DateTime', cellRenderer: 'agGroupCellRenderer',
                valueFormatter: function (params) { return DateFormatAD(params.value); },
                showRowGroup: true,
                cellRendererParams: {
                    suppressCount: false, // turn off the row count                   
                },
            },

            
            { headerName: "Voucher", width: 180, field: "VoucherName", cellStyle: { 'text-align': 'left' } },
            { headerName: "Branch", width: 180, field: "BranchName", cellStyle: { 'text-align': 'left' } },
            { headerName: "Branch Code", width: 130, field: "BranchCode", cellStyle: { 'text-align': 'left' } },
            { headerName: "CostClass", width: 150, field: "CostClass", cellStyle: { 'text-align': 'left' } },
            { headerName: "User", width: 130, field: "UserName", cellStyle: { 'text-align': 'left' } },
            //{ headerName: "Attributes", width: 150, field: "Attributes", cellStyle: { 'text-align': 'left' } },

            //{ headerName: "UDF Key Val", width: 150, field: "UDFKeyVal", cellStyle: { 'text-align': 'left' } },
            { headerName: "Due Date", width: 130, field: "DueDate", cellStyle: { 'text-align': 'left' } },

            { headerName: "Row Type", width: 130, field: "RowType", cellStyle: { 'text-align': 'left' } },
            { headerName: "Raw Product", width: 180, field: "ProductName1", cellStyle: { 'text-align': 'left' } },
            { headerName: "Raw Product Code", width: 160, field: "ProductCode1", cellStyle: { 'text-align': 'left' } },
            { headerName: "Base Ratio", width: 120, field: "BaseRatio", cellStyle: { 'text-align': 'right' }, valueFormatter: function (params) { return Numberformat(params.value); },  },
            { headerName: "Plan Qty", width: 110, field: "PlanQty", cellStyle: { 'text-align': 'right' }, valueFormatter: function (params) { return Numberformat(params.value); },  },
            { headerName: "Available Qty", width: 140, field: "BalQty", cellStyle: { 'text-align': 'right' }, valueFormatter: function (params) { return Numberformat(params.value); },  },
            { headerName: "Required Qty", width: 140, field: "RequiredQty", cellStyle: { 'text-align': 'right' }, valueFormatter: function (params) { return Numberformat(params.value); },  },
            { headerName: "Actual Qty", width: 120, field: "ActualQty", cellStyle: { 'text-align': 'right' }, valueFormatter: function (params) { return Numberformat(params.value); },  },

            { headerName: "Rate", width: 100, field: "Rate", cellStyle: { 'text-align': 'right' }, valueFormatter: function (params) { return $filter('formatNumber')(params.value); }, valueFormatter: function (params) { return Numberformat(params.value); },  },
            { headerName: "Amount", width: 120, field: "Amount", cellStyle: { 'text-align': 'right' }, valueFormatter: function (params) { return $filter('formatNumber')(params.value); }, valueFormatter: function (params) { return Numberformat(params.value); },  },
         /*   { headerName: "BalQty", width: 110, field: "BalQty", cellStyle: { 'text-align': 'right' }, valueFormatter: function (params) { return $filter('formatNumber')(params.value); }, valueFormatter: function (params) { return Numberformat(params.value); },  },*/

            { headerName: "Unit", width: 100, field: "Unit", cellStyle: { 'text-align': 'left' } },
          

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
                    TranId: 'Total =>',
                    Quantity: 0,
                    FQty: 0,
                    PQty: 0,
                    Amount: 0,
                    BalQty: 0       
                }
                $scope.gridOptions.api.forEachNodeAfterFilterAndSort(function (node) {
                    var fData = node.data;
                    dt.Quantity += fData.Quantity;
                    dt.FQty += fData.FQty;
                    dt.PQty += fData.PQty;
                    dt.Amount += fData.Amount;
                    dt.BalQty += fData.BalQty;
                   
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
                TranId: 'Total =>',
                Quantity: 0,
                FQty: 0,
                PQty: 0,
                Amount: 0,
                BalQty: 0
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
		
		 $timeout(function () {
            GlobalServices.getListState(EntityId, $scope.gridOptions);
        });


    }
    $scope.ClearData = function () {

        var DataColl = [];
        $scope.gridOptionsBottom.api.setRowData(DataColl);

        $scope.gridOptions.api.setRowData(DataColl);
    };
    $scope.GetProductionOrder = function () {
        $scope.ClearData();
        var dateFrom = new Date(($filter('date')(new Date(), 'yyyy-MM-dd')));
        var dateTo = new Date(($filter('date')(new Date(), 'yyyy-MM-dd')));

        if ($scope.ProductionOrder.DateFromDet)
            dateFrom = new Date(($filter('date')($scope.ProductionOrder.DateFromDet.dateAD, 'yyyy-MM-dd')));

        if ($scope.ProductionOrder.DateToDet)
            dateTo = new Date(($filter('date')($scope.ProductionOrder.DateToDet.dateAD, 'yyyy-MM-dd')));

        $scope.loadingstatus = 'running';
        showPleaseWait();

        var beData = {
            DateFrom: dateFrom,
            DateTo: dateTo,
            BranchId: $scope.ProductionOrder.BranchId,
            BranchIdColl: $scope.ProductionOrder.BranchIdColl
        };

        $scope.loadingstatus = 'running';

        $http({
            method: "post",
            url: base_url + "Inventory/Reporting/GetProductionOrder",
            data: JSON.stringify(beData),
            dataType: "json"
        }).then(function (res) {


            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                var DataColl = mx(res.data.Data);

                var dt = {
                    TranId: 'TOTAL =>',
                    Quantity: DataColl.sum(p1 => p1.Quantity),
                    FQty: DataColl.sum(p1 => p1.FQty),
                    PQty: DataColl.sum(p1 => p1.PQty),
                    Amount: DataColl.sum(p1 => p1.Amount),
                    BalQty: DataColl.sum(p1 => p1.BalQty),
                 
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