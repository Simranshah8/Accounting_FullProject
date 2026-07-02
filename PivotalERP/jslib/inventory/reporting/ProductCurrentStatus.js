"use strict";

agGrid.initialiseAgGridWithAngular1(angular);

app.controller("pcsController", function ($scope, $http, $filter, $timeout, GlobalServices, $compile) {

  var PrintPreviewAs = 1;
    const contextMenu = GlobalServices.createElementForMenu();

    $scope.RefProductId = RProductId;
    $scope.RefGodownId = RGodownId;

    LoadData();

    $scope.onBtExportCSV = function () {
        var params = {
            fileName: 'ProductVoucher.csv',
            sheetName: 'ProductVoucher'
        };

        $scope.gridOptions.api.exportDataAsCsv(params);
    }

    function LoadData() {
        $('.select2').select2({
            allowClear: true,
            openOnEnter: true
        });

        $scope.ExpressionColl = GlobalServices.getExpression();
        $scope.ConditionColl = GlobalServices.getLogicCondition();
        $scope.FilterColumnColl = [{ text: 'Opening', value: 'Opening', dataType: 'Number' },
        { text: 'Opening Dr', value: 'OpeningDr', dataType: 'Number' },
        { text: 'Opening Cr', value: 'OpeningCr', dataType: 'Number' },
        { text: 'Total Opening Dr', value: 'TotalOpeningDr', dataType: 'Number' },
        { text: 'TotalOpening Cr', value: 'TotalOpeningCr', dataType: 'Number' },
        { text: 'Transaction', value: 'Transaction', dataType: 'Number' },
        { text: 'Transaction Dr', value: 'TransactionDr', dataType: 'Number' },
        { text: 'Transaction Cr', value: 'TransactionCr', dataType: 'Number' },
        { text: 'Closing', value: 'Closing', dataType: 'Number' },
        { text: 'Closing Dr', value: 'ClosingDr', dataType: 'Number' },
        { text: 'Closing Cr', value: 'ClosingCr', dataType: 'Number' },
        { text: 'LedgerName', value: 'LedgerName', dataType: 'text' },];


        $scope.GodownColl = [];        
        $http({
            method: 'GET',
            url: base_url + "Inventory/Creation/GetUserWiseGodown",
            dataType: "json"
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.GodownColl = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $scope.ProductVoucher = {
            DateFrom_TMP: new Date(),
            DateTo_TMP: new Date(),
            ProductId: null,
            GodownId:null
        };

       
        $scope.loadingstatus = "stop";

        $scope.columnDefs = [

            {
                headerName: "Particular's", width: 250, pinned: 'left', dataType: 'Text', field: "Godown", filter: 'agTextColumnFilter',
            },

            {
                headerName: "Balance Qty", width: 140, filter: "agNumberColumnFilter", dataType: 'Number', field: "Qty", pinned: 'left',

                valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' }, footerTemplate: '<div>totaal: #= sum #</div>',
                filter: 'agNumberColumnFilter',
            },

            {
                headerName: "Qty For Days", width: 140, filter: "agNumberColumnFilter", dataType: 'Number', field: "BalForDays",
                 cellStyle: { 'text-align': 'center' }, footerTemplate: '<div>totaal: #= sum #</div>',
                filter: 'agNumberColumnFilter',
            },
            {
                headerName: "Transit In", width: 140, filter: "agNumberColumnFilter", dataType: 'Number', field: "TIQty",
                valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' }, footerTemplate: '<div>totaal: #= sum #</div>',
                filter: 'agNumberColumnFilter',
            },
            {
                headerName: "Transit Out", width: 140, dataType: 'Number', filter: "agNumberColumnFilter", field: "TOQty",

                valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' }, footerTemplate: '<div>totaal: #= sum #</div>',
                filter: 'agNumberColumnFilter',
            },

            //Table HEader fueld add here start by bibek

            {
                headerName: "Total ", width: 140, filter: "agNumberColumnFilter", dataType: 'Number', field: "Total",

                valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' }, footerTemplate: '<div>totaal: #= sum #</div>',
                filter: 'agNumberColumnFilter',
            },

            {
                headerName: "Unit ", width: 140, filter: "agTextColumnFilter", dataType: 'Text', field: "Unit", footerTemplate: '<div>totaal: #= sum #</div>',                
            },

            {
                headerName: "Sales Rate ", width: 140, filter: "agNumberColumnFilter", dataType: 'Number', field: "Rate",

                valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' }, footerTemplate: '<div>totaal: #= sum #</div>',
                filter: 'agNumberColumnFilter',
            },
            {
                headerName: "Last Updated", width: 140, filter: "agNumberColumnFilter", dataType: 'DateTime', field: "LastUpdated",

                valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' }, footerTemplate: '<div>totaal: #= sum #</div>',
                filter: 'agNumberColumnFilter',
            },
            //Table HEader fueld add here End by bibek


            {
                headerName: "Sales Qty", width: 140, filter: "agNumberColumnFilter", dataType: 'Number', field: "TotalSalesQty",
                valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' }, footerTemplate: '<div>totaal: #= sum #</div>',
                filter: 'agNumberColumnFilter',
            },
            {
                headerName: "A.Sales Qty/Day", width: 220, filter: "agNumberColumnFilter", dataType: 'Number', field: "AvgSalesQtyDay",
                valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' }, footerTemplate: '<div>totaal: #= sum #</div>',
                filter: 'agNumberColumnFilter',
            },
            {
                headerName: "A.Sales Qty/Month", width: 220, filter: "agNumberColumnFilter", dataType: 'Number', field: "AvgSalesQtyMonth",
                valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' }, footerTemplate: '<div>totaal: #= sum #</div>',
                filter: 'agNumberColumnFilter',
            },
            {
                headerName: "Pending P.O.", width: 220, filter: "agNumberColumnFilter", dataType: 'Number', field: "PendingPO",

                valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' }, footerTemplate: '<div>totaal: #= sum #</div>',
                filter: 'agNumberColumnFilter',
            },

            {
                headerName: "Pending S.O.", field: "PendingSO", width: 220, dataType: 'Number', filter: "agNumberColumnFilter",
                valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' }, footerTemplate: '<div>totaal: #= sum #</div>',
                filter: 'agNumberColumnFilter',
            },
            { headerName: "Rack", width: 120, field: "Rack" },
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
            enableFilter: true,
            suppressHorizontalScroll: true,
            alignedGrids: [],
        };
        $scope.eGridDiv = document.querySelector('#datatable');

        // create the grid passing in the div to use together with the columns & data we want to use
        new agGrid.Grid($scope.eGridDiv, $scope.gridOptions);

        $scope.dataForBottomGrid = [
            {
                
                Godown: 'Total =>',
                Qty: 0,
                TIQty: 0,
                TOQty: 0,
                Total: 0,
                TotalSalesQty: 0,
                PendingPO: 0,
                PendingSO:0,
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

        $timeout(function () {
            GlobalServices.getCompanyDet().then(function (res) {
                var comDet = res.data.Data;
                if (comDet) {
                    $scope.ProductVoucher.DateFrom_TMP = new Date(comDet.StartDate);

                    if ($scope.RefGodownId > 0 || $scope.RefProductId > 0)
                    {
                        $scope.RefGodownId = 0;
                        $scope.ProductVoucher.GodownId = 0;
                        $scope.GetProductVoucher();
                    }
                }
            }, function (errormessage) {
                alert('Unable to Delete data. pls try again.' + errormessage.responseText);
            });
        });
         

    }

    $scope.ClearData = function () {

        $scope.DataColl = [];
        $scope.gridOptions.api.setRowData($scope.DataColl);
    };

    $scope.ChangeGodown = function () {
        $scope.ProductVoucher.ProductId = null;
        $scope.GetProductVoucher();
    }
    $scope.ChangeProduct = function () {
        $scope.ProductVoucher.GodownId = null;
        $scope.GetProductVoucher();
    }
    $scope.GetProductVoucher = function () {

        $scope.ClearData();
          
        var beData = {};

        if ($scope.RefGodownId > 0 || $scope.RefProductId > 0) {
            beData = {
                ProductId: $scope.RefProductId,
                GodownId: $scope.RefGodownId
            };
        }
        else {

            if ((!$scope.ProductVoucher.ProductId || $scope.ProductVoucher.ProductId == 0) && (!$scope.ProductVoucher.GodownId || $scope.ProductVoucher.GodownId == 0))
                return;

            beData = {
                ProductId: $scope.ProductVoucher.ProductId,
                GodownId: $scope.ProductVoucher.GodownId
            };
        }

        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: "POST",
            url: base_url + "Inventory/Reporting/GetProductCurrentStatus",
            data: JSON.stringify(beData),
            dataType: "json"
        }).then(function (res) {

            if (res.data.IsSuccess == true) {

                var dt =  
                    {

                        Godown: 'Total =>',
                        Qty: 0,
                        TIQty: 0,
                        TOQty: 0,
                        Total: 0,
                        TotalSalesQty: 0,
                        PendingPO: 0,
                        PendingSO: 0,
                };

                res.data.Data.forEach(function (d) {
                    dt.Qty = dt.Qty + d.Qty;
                    dt.TIQty = dt.TIQty + d.TIQty;
                    dt.TOQty = dt.TOQty + d.TOQty;
                    dt.Total = dt.Total + d.Total;
                    dt.TotalSalesQty = dt.TotalSalesQty + d.TotalSalesQty;
                    dt.PendingPO = dt.PendingPO + d.PendingPO;
                    dt.PendingSO = dt.PendingSO + d.PendingSO;

                });

                var filterDataColl = [];
                filterDataColl.push(dt);
                $scope.gridOptionsBottom.api.setRowData(filterDataColl);

                $scope.gridOptions.api.setRowData(res.data.Data);
            }                
            else
                Swal.fire(res.data.ResponseMSG);

            $scope.loadingstatus = 'stop';
            hidePleaseWait();



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
                                                        Period: $scope.ProductVoucher.DateFromDet.dateBS + " TO " + $scope.ProductVoucher.DateToDet.dateBS,
                                                        Product: $scope.ProductVoucher.ProductDetail.Name,
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
                                    Product: $scope.ProductVoucher.ProductDetail.Name,
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
            var fData = node.data;

            fData.VoucherDateStr = DateFormatAD(fData.VoucherDate);
            fData.VoucherDateNP = DateFormatBS(fData.NY, fData.NM, fData.ND);
            filterData.push(fData);

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
            Product: $scope.ProductVoucher.ProductDetail.Name,
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
                down_file(base_url + "//" + res.data.Data.ResponseId, "ProductCurrentStatus.xlsx");
            }

        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            Swal.fire(errormessage);
        });
    }
	
    $scope.saveRptListState = function ()
    {
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
