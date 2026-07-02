"use strict";

agGrid.initialiseAgGridWithAngular1(angular);

app.controller("FixedProductList", function ($scope, $http, $filter, $timeout, GlobalServices, $compile) {

  var PrintPreviewAs = 1;
    const contextMenu = GlobalServices.createElementForMenu();
	
    LoadData();

    $scope.onBtExportCSV = function () {
        var params = {
            fileName: 'FixedProductList.csv',
            sheetName: 'FixedProductList'
        };

        $scope.gridOptions.api.exportDataAsCsv(params);
    }

    function LoadData() {
        $('.select2').select2()
        $scope.ReportTypeColl = [{ text: 'PendingOnly', value: 'PendingOnly', dataType: 'text' }, { text: 'ClearOnly', value: 'ClearOnly', dataType: 'text' }, { text: 'Both', value: 'Both', dataType: 'text' },]

    

        $scope.ProductList = [];
        $http({
            method: 'GET',
            url: base_url + "Inventory/Creation/GetFixedProductList",
            dataType: "json",
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.ProductList = res.data.Data;
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
                    $scope.FixedProductList.DateFrom_TMP = new Date(comDet.StartDate);
                }
            }, function (errormessage) {
                alert('Unable to Delete data. pls try again.' + errormessage.responseText);
            });
        });
        $scope.FixedProductList = {
            ProductId: 0,
            DateFrom_TMP: new Date(),
            DateTo_TMP: new Date(),

        };
         
        var columnDefs = [

            { headerName: "Reg. No.", width: 120, field: "RegdNo", colId: 'colRegdNo', cellStyle: { 'text-align': 'left' } },
            { headerName: "Chassis No.", width: 170, field: "ChassisNo", colId: 'colChassisNo', cellStyle: { 'text-align': 'left' } },
            { headerName: "Engine No.", width: 160, field: "EngineNo", colId: 'colEngineNo', cellStyle: { 'text-align': 'left' } },
            { headerName: "Model", width: 120, field: "Model", colId: 'colModel', cellStyle: { 'text-align': 'left' } },
            { headerName: "Color", width: 120, field: "Color", colId: 'colColor', cellStyle: { 'text-align': 'left' } },
            { headerName: "MFGYear", width: 100, field: "MFGYear", colId: 'colMFGYear', cellStyle: { 'text-align': 'center' } },
            { headerName: "Godown", width: 110, field: "GodownName", cellStyle: { 'text-align': 'left' } },
            { headerName: "Status", width: 120, field: "Status", cellStyle: { 'text-align': 'left' } },
            { headerName: "InOutType", width: 120, field: "ProductInOutType", cellStyle: { 'text-align': 'left' } },
            { headerName: "Batch", width: 100, field: "Batch", colId: 'colBatch', cellStyle: { 'text-align': 'left' } },
            { headerName: "MFG.Date", width: 130, field: "MFGDate", colId: 'colMFGDate', cellStyle: { 'text-align': 'left' } },
            { headerName: "EXP.Date", width: 130, field: "EXPDate", colId: 'colEXPDate', cellStyle: { 'text-align': 'left' } },
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
       
        };
        $scope.dataForBottomGrid = [
            {
                DispalyValue: 'Total =>',
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

        $scope.FixedProductConfig = [];
        $http({
            method: 'GET',
            url: base_url + "Inventory/Creation/GetFixedProductConfig",
            dataType: "json",
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.FixedProductConfig = res.data.Data;

                var fixedColumns = GlobalServices.getFixedProductColumns();
                fixedColumns.forEach(function (fcol)
                {
                    var findCol = $scope.gridOptions.columnApi.getColumn(fcol.colName);
                    if (findCol) {
                        var isVisible = $scope.FixedProductConfig[fcol.show];
                        var headerName = $scope.FixedProductConfig[fcol.text];
                        findCol.headerName = headerName;
                        findCol.colDef.headerName = headerName;
                        $scope.gridOptions.columnApi.setColumnVisible(fcol.colName, isVisible);
                    }
                });

                $scope.gridOptions.api.refreshHeader();

            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

		 $timeout(function () {
            GlobalServices.getListState(EntityId, $scope.gridOptions);
        });
    }
  
    $scope.GetFixedProductList = function () {

        var dateFrom = new Date(($filter('date')(new Date(), 'yyyy-MM-dd')));
        var dateTo = new Date(($filter('date')(new Date(), 'yyyy-MM-dd')));

        if ($scope.FixedProductList.DateFromDet)
            dateFrom = $filter('date')($scope.FixedProductList.DateFromDet.dateAD, 'yyyy-MM-dd');

        if ($scope.FixedProductList.DateToDet)
            dateTo = $filter('date')($scope.FixedProductList.DateToDet.dateAD, 'yyyy-MM-dd');

        var DataColl = [];
        $scope.gridOptions.api.setRowData(DataColl);

        var para = {
            ProductId: $scope.FixedProductList.ProductId,
            dateFrom: dateFrom,
            dateTo: dateTo, 
        };

        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: "post",
            url: base_url + "Inventory/Reporting/GetFixedProductList",
            data: JSON.stringify(para),
            dataType: "json"
        }).then(function (res) {

            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                DataColl = res.data.Data;
                  
                //$scope.dataForBottomGrid[0].DrAmount = Opening;
                //$scope.dataForBottomGrid[0].CrAmount = drcr;
                //$scope.gridOptionsBottom.api.setRowData($scope.dataForBottomGrid);

                $scope.gridOptions.api.setRowData(DataColl);
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

        var RptParamentersColl = [];

        RptParamentersColl.push({
            Name: "Period",
            Value: $('#dtDateFrom').val() + ' To ' + $('#dtDateTo').val()
        });


        var filterData = [];

        $scope.gridOptions.api.forEachNodeAfterFilterAndSort(function (node) {
            var GatePassDetails = node.data;
            var beData = {};

            beData.VoucherName = PendingPartsDemand.VoucherName;
            beData.VoucherType = PendingPartsDemand.VoucherType;
            beData.AutoManualNo = PendingPartsDemand.AutoManualNo;
            beData.AutoVoucherNo = PendingPartsDemand.AutoVoucherNo;
            beData.CanUpdateDocument = PendingPartsDemand.CanUpdateDocument;
            beData.CostClassName = PendingPartsDemand.CostClassName;
            beData.IsInventory = PendingPartsDemand.IsInventory;
            beData.IsParent = true;
            beData.Narration = PendingPartsDemand.Narration;
            beData.ND = PendingPartsDemand.ND;
            beData.NM = PendingPartsDemand.NM;
            beData.NY = PendingPartsDemand.NY;
            beData.RefNo = PendingPartsDemand.RefNo;
            beData.VoucherDate = PendingPartsDemand.VoucherDate;
            //beData.VoucherDateStr = GlobalFunction.GetDateStr(beData.VoucherDate, Dynamic.Windows.Forms.Windows.Forms.SDDatePicker.BaseDate.EnglishDate);
            beData.VoucherDateStrNP = DateFormatBS(beData.NY, beData.NM, beData.ND);
            beData.CreatedByName = PendingPartsDemand.CreatedByName;

            if (beData.IsInventory == true) {
                beData.Particulars = PendingPartsDemand.PartyLedger;
                beData.DrAmount = PendingPartsDemand.DrAmount;
                beData.CrAmount = PendingPartsDemand.CrAmount;
                filterData.push(beData);

                var ledData = {};
                ledData.Particulars = "  " + PendingPartsDemand.Particulars;

                if (GatePassDetails.DrAmount != 0)
                    ledData.CrAmount = PendingPartsDemand.DrAmount - mx(PendingPartsDemand.AditionalCostColl).Sum(p1 => p1.Amount);
                else
                    ledData.DrAmount = PendingPartsDemand.CrAmount - mx(PendingPartsDemand.AditionalCostColl).Sum(p1 => p1.Amount);

                filterData.push(ledData);

                angular.forEach(PendingPartsDemand.AditionalCostColl, function (add) {

                    var addData = {};
                    addData.Particulars = "  " + add.LedgerName;
                    if (PendingPartsDemand.DrAmount != 0) {
                        addData.CrAmount = add.Amount;
                    }
                    else {
                        addData.DrAmount = add.Amount;
                    }
                    filterData.push(addData);
                });


                angular.forEach(PendingPartsDemand.ItemAllocationColl, function (item) {

                    var itemData = {};
                    itemData.Particulars = "    " + item.ProductName + " ( " + item.BilledQty + item.UnitName + " @ " + item.Rate + " = " + item.Amount + " )";
                    filterData.push(itemData);

                });

            } else {
                var firstTime = true;
                angular.forEach(PendingPartsDemand.LedgerAllocationColl, function (ledAll) {
                    if (firstTime) {
                        beData.Particulars = ledAll.LedgerName;
                        beData.DrAmount = ledAll.DrAmount;
                        beData.CrAmount = ledAll.CrAmount;
                        firstTime = false;

                        filterData.push(beData);
                    }
                    else {
                        var chieldData = {};
                        chieldData.Particulars = "  " + ledAll.LedgerName;
                        chieldData.Narration = ledAll.Narration;
                        chieldData.DrAmount = ledAll.DrAmount;
                        chieldData.CrAmount = ledAll.CrAmount;
                        filterData.push(chieldData);
                    }
                });
            }


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
                down_file(base_url + "//" + res.data.Data.ResponseId, "FixedProductList.xlsx");
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
