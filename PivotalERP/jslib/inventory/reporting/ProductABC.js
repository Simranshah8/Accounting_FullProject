"use strict";

agGrid.initialiseAgGridWithAngular1(angular);

app.controller("ProductABC", function ($scope, $http, $filter, $timeout, GlobalServices, $compile) {

  var PrintPreviewAs = 1;
    const contextMenu = GlobalServices.createElementForMenu();
	
    LoadData();

    $scope.onBtExportCSV = function () {
        var params = {
            fileName: 'ProductABC.csv',
            sheetName: 'ProductABC'
        };

        $scope.gridOptions.api.exportDataAsCsv(params);
    }

    function LoadData() {
        $('.select2').select2()
        $scope.ReportTypeColl = [{ text: 'PendingOnly', value: 'PendingOnly', dataType: 'text' }, { text: 'ClearOnly', value: 'ClearOnly', dataType: 'text' }, { text: 'Both', value: 'Both', dataType: 'text' },]

        //agGrid.initialiseAgGridWithAngular1(angular);

        $scope.ProductGroupList = [];
        $http({
            method: 'GET',
            url: base_url + "Inventory/Reporting/GetAllProductGroup",
            dataType: "json",
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.ProductGroupList = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
        $scope.VoucherTypeList = [];
        $http({
            method: 'GET',
            url: base_url + "Account/Reporting/GetAllVoucherList",
            dataType: "json",
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.VoucherTypeList = res.data.Data;
            } else {
                Swal.fire(res.data.ResponseMSG);
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

        $scope.ProductABC = {
            ProductGroupId: 0,
            DateFrom_TMP: new Date(),
            DateTo_TMP: new Date(),
            isPurchase: true,
        };
        $scope.OpeningAmt = 0;
        $scope.CurrentAmt = 0;
        $scope.TotalAmt = 0;
        $scope.ReportName = '';
        $scope.noofdecimal = 2;

        $scope.loadingstatus = "stop";

        $scope.columnDefs = [


            //Edited by bibek start here . Add datatype //
            { headerName: "Name", width: 120, field: "Name", dataType: 'Text', cellStyle: { 'text-align': 'left' } },

            { headerName: "Code", width: 180, field: "Code", dataType: 'Number', cellStyle: { 'text-align': 'left' } },
            { headerName: "Alias", width: 180, field: "Alias", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "PartNo", width: 180, field: "PartNo", dataType: 'Text', cellStyle: { 'text-align': 'right' } },
            { headerName: "Remarks", width: 180, field: "Remarks", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Qty", width: 180, field: "Qty", dataType: 'Number', cellStyle: { 'text-align': 'right' } },
            { headerName: "QtyPer", width: 180, field: "QtyPer", dataType: 'Number', cellStyle: { 'text-align': 'right' } },
            { headerName: "CurQtyPer", width: 180, field: "CurQtyPer", dataType: 'Number', cellStyle: { 'text-align': 'right' } },
            { headerName: "Amount", width: 180, field: "Amount", dataType: 'Number', cellStyle: { 'text-align': 'right' } },
            { headerName: "AmountPer", width: 180, field: "AmountPer", dataType: 'Number', cellStyle: { 'text-align': 'right' } },
            { headerName: "CurAmountPer", width: 180, field: "CurAmountPer", dataType: 'Number', cellStyle: { 'text-align': 'right' } },
            { headerName: "Unit", width: 180, field: "Unit", dataType: 'Text', cellStyle: { 'text-align': 'left' } },

            //Edited by bibek End here . Add datatype //


            {
                headerName: "Action", width: 150, cellRenderer:
                    function (params) {

                        var voucherName = params.data.VoucherName;

                        if (voucherName) {

                            if (params.data.VoucherType < 5) {
                                return '<a class="btn btn-default btn-xs" href="' + base_url + 'Account/Transaction/' + voucherName + '?TranId={{' + params.data.TranId + '}}"><i class="fas fa-edit text-info"></i></a>' +
                                    '<a class="btn btn-default btn-xs" ng-click="PrintVoucher(' + params.data.TranId + ',' + params.data.VoucherType + ',' + params.data.VoucherId + ')"><i class="fas fa-print text-info"></i></a>' +
                                    '<a class="btn btn-default btn-xs" ng-click="deleteVoucher(' + params.data.TranId + ',' + params.data.VoucherType + ',' + params.data.VoucherId + ',\'' + voucherName + '\'' + ', \'' + params.data.AutoManualNo + '\')"><i class="fas fa-trash-alt text-danger"></i></a>';

                            } else {
                                return '<a class="btn btn-default btn-xs" href="' + base_url + 'Inventory/Transaction/' + voucherName + '?TranId={{' + params.data.TranId + '}}"><i class="fas fa-edit text-info"></i></a>' +
                                    '<a class="btn btn-default btn-xs" ng-click="PrintVoucher(' + params.data.TranId + ',' + params.data.VoucherType + ',' + params.data.VoucherId + ')"><i class="fas fa-print text-info"></i></a>' +
                                    '<a class="btn btn-default btn-xs" ng-click="deleteVoucher(' + params.data.TranId + ',' + params.data.VoucherType + ',' + params.data.VoucherId + ',\'' + voucherName + '\'' + ', \'' + params.data.AutoManualNo + '\')"><i class="fas fa-trash-alt text-danger"></i></a>';
                            }

                        } else {
                            return '';
                        }
                    }
            }
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

                var Opening = 0;
                $scope.gridOptions.api.forEachNodeAfterFilterAndSort(function (node) {
                    if (node.data.Amount == 1 || node.data.Amount == 'DR')
                        Opening += node.data.Amount;
                    else
                        Opening -= node.data.Amount;
                });

                var drcr = '';
                if (Opening > 0)
                    drcr = 'DR';
                else if (Opening < 0)
                    drcr = 'CR'

                Opening = Math.abs(Opening);

                $scope.dataForBottomGrid[0].Amount = Opening;
                $scope.dataForBottomGrid[0].Qty = drcr;
                $scope.gridOptionsBottom.api.setRowData($scope.dataForBottomGrid);
            }

        };
        $scope.eGridDiv = document.querySelector('#datatable');

        // create the grid passing in the div to use together with the columns & data we want to use
        new agGrid.Grid($scope.eGridDiv, $scope.gridOptions);

        $scope.dataForBottomGrid = [
            {
                AutoNumber: '',
                Name: 'Total =>',
                Amount: 0,
                Qty: '',
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
    $scope.deleteVoucher = function (tranId, voucherType, voucherId, voucherName, voucherNo) {

        Swal.fire({
            title: 'Do you want to delete the selected voucher(' + voucherName + ') :- ' + voucherNo + ' ? ',
            showCancelButton: true,
            confirmButtonText: 'Delete',
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                $scope.loadingstatus = "running";
                showPleaseWait();

                var para = {
                    voucherType: voucherType,
                    voucherId: voucherId,
                    tranId: tranId
                };

                $http({
                    method: 'POST',
                    url: base_url + "Global/DelAccInvTransaction",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingstatus = "stop";
                    if (res.data.IsSuccess) {
                        $scope.GetGatePassDetails();
                    } else {
                        Swal.fire(res.data.ResponseMSG);
                    }

                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }
        });

    }
    $scope.GetProductABC = function () {

        var dateFrom = new Date(($filter('date')(new Date(), 'yyyy-MM-dd')));
        var dateTo = new Date(($filter('date')(new Date(), 'yyyy-MM-dd')));

        if ($scope.ProductABC.DateFromDet)
            dateFrom = new Date(($filter('date')($scope.ProductABC.DateFromDet.dateAD, 'yyyy-MM-dd')));

        if ($scope.ProductABC.DateToDet)
            dateTo = new Date(($filter('date')($scope.ProductABC.DateToDet.dateAD, 'yyyy-MM-dd')));

        $scope.DataColl = []; //declare an empty array
        $scope.gridOptions.api.setRowData($scope.DataColl);

        var beData = {
            ProductGroupId: $scope.ProductABC.ProductGroupId,
            DateFrom: dateFrom,
            DateTo: dateTo,
            isPurchase: $scope.ProductABC.isPurchase,

        };

        $scope.loadingstatus = 'running';

        $http({
            method: "post",
            url: base_url + "Inventory/Reporting/GetProductABC",
            data: JSON.stringify(beData),
            dataType: "json"
        }).then(function (res) {

            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                $scope.DataColl = res.data.Data;

                var Opening = 0;
                angular.forEach($scope.DataColl, function (dc) {
                    if (dc.Amount == 1 || dc.Amount == 'DR')
                        Opening += dc.Amount;
                    else
                        Opening -= dc.Amount;
                });

                var drcr = '';
                if (Opening > 0)
                    drcr = '';
                else if (Opening < 0)
                    drcr = ''

                Opening = Math.abs(Opening);


                $scope.dataForBottomGrid[0].Amount = Opening;
                $scope.dataForBottomGrid[0].Qty = drcr;
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
            url: base_url + "Inventory/Reporting/GetProductABC",
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

        var RptParamentersColl = [];

        RptParamentersColl.push({
            Name: "Period",
            Value: $('#dtDateFrom').val() + ' To ' + $('#dtDateTo').val()
        });


        var filterData = [];

        $scope.gridOptions.api.forEachNodeAfterFilterAndSort(function (node) {
            var GatePassDetails = node.data;
            var beData = {};

            beData.VoucherName = ProductABC.VoucherName;
            beData.VoucherType = ProductABC.VoucherType;
            beData.AutoManualNo = ProductABC.AutoManualNo;
            beData.AutoVoucherNo = ProductABC.AutoVoucherNo;
            beData.CanUpdateDocument = ProductABC.CanUpdateDocument;
            beData.CostClassName = ProductABC.CostClassName;
            beData.IsInventory = ProductABC.IsInventory;
            beData.IsParent = true;
            beData.Narration = ProductABC.Narration;
            beData.ND = ProductABC.ND;
            beData.NM = ProductABC.NM;
            beData.NY = ProductABC.NY;
            beData.RefNo = ProductABC.RefNo;
            beData.VoucherDate = ProductABC.VoucherDate;
            //beData.VoucherDateStr = GlobalFunction.GetDateStr(beData.VoucherDate, Dynamic.Windows.Forms.Windows.Forms.SDDatePicker.BaseDate.EnglishDate);
            beData.VoucherDateStrNP = DateFormatBS(beData.NY, beData.NM, beData.ND);
            beData.CreatedByName = ProductABC.CreatedByName;

            if (beData.IsInventory == true) {
                beData.Particulars = ProductABC.PartyLedger;
                beData.DrAmount = ProductABC.DrAmount;
                beData.CrAmount = ProductABC.CrAmount;
                filterData.push(beData);

                var ledData = {};
                ledData.Particulars = "  " + ProductABC.Particulars;

                if (GatePassDetails.DrAmount != 0)
                    ledData.CrAmount = ProductABC.DrAmount - mx(ProductABC.AditionalCostColl).Sum(p1 => p1.Amount);
                else
                    ledData.DrAmount = ProductABC.CrAmount - mx(ProductABC.AditionalCostColl).Sum(p1 => p1.Amount);

                filterData.push(ledData);

                angular.forEach(PendingDeliveryNote.AditionalCostColl, function (add) {

                    var addData = {};
                    addData.Particulars = "  " + add.LedgerName;
                    if (ProductABC.DrAmount != 0) {
                        addData.CrAmount = add.Amount;
                    }
                    else {
                        addData.DrAmount = add.Amount;
                    }
                    filterData.push(addData);
                });


                angular.forEach(ProductABC.ItemAllocationColl, function (item) {

                    var itemData = {};
                    itemData.Particulars = "    " + item.ProductName + " ( " + item.BilledQty + item.UnitName + " @ " + item.Rate + " = " + item.Amount + " )";
                    filterData.push(itemData);

                });

            } else {
                var firstTime = true;
                angular.forEach(ProductABC.LedgerAllocationColl, function (ledAll) {
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
                down_file(base_url + "//" + res.data.Data.ResponseId, "ProductABC.xlsx");
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
