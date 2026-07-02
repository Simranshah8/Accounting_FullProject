"use strict";

agGrid.initialiseAgGridWithAngular1(angular);

app.controller("Ledgerwise", function ($scope, $http, $filter, $timeout, GlobalServices, $compile) {
var PrintPreviewAs = 1;
 const contextMenu = GlobalServices.createElementForMenu();
    LoadData();

    $scope.onBtExportCSV = function () {
        var params = {
            fileName: 'Ledgerwise.csv',
            sheetName: 'Ledgerwise'
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
            $http({
                method: "GET",
                url: base_url + "Global/GetCompanyDetail",
                dataType: "json"
            }).then(function (res) {
                var comDet = res.data.Data;
                if (comDet) {
                    $scope.Ledgerwise.DateFrom_TMP = new Date(comDet.StartDate);
                }
            }, function (errormessage) {
                alert('Unable to Delete data. pls try again.' + errormessage.responseText);
            });
        });
        $scope.Ledgerwise = {

            DateFrom_TMP: new Date(),
            DateTo_TMP: new Date(),
            isDebtor: true,
        };
        $scope.OpeningAmt = 0;
        $scope.CurrentAmt = 0;
        $scope.TotalAmt = 0;
        $scope.ReportName = '';
        $scope.noofdecimal = 2;

        $scope.loadingstatus = "stop";

        $scope.columnDefs = [
            { headerName: "Ledger Name", width: 220, field: "LedgerName", pinned: 'left', dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Code", width: 150, field: "Code", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Group", width: 150, field: "LedgerGroupName", dataType: 'Text',cellStyle: { 'text-align': 'left' } },
            {
                headerName: "Opening", field: "Opening", width: 150, dataType: 'Number', filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' },
            },
            { headerName: "Transaction Dr", field: "TransactionDr", width: 150, dataType: 'Number', filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' }, },
            { headerName: "Transaction Cr", field: "TransactionCr", width: 150, dataType: 'Number', filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' }, },
            { headerName: "Closing", field: "Closing", width: 150, dataType: 'Number', filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' }, },
            { headerName: "Alias", field: "Alias", width: 140, dataType: 'Text', filter: "agTextColumnFilter" },
            { headerName: "Code", field: "Code", width: 140, dataType: 'Text', filter: "agTextColumnFilter" },
            { headerName: "Opening Dr", field: "TotalOpeningDr", dataType: 'Number', width: 150, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' }, },
            { headerName: "Opening Cr", field: "TotalOpeningCr", dataType: 'Number', width: 150, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' }, },
            { headerName: "Closing Dr", field: "ClosingDr", width: 150, dataType: 'Number', filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' }, },
            { headerName: "Closing Cr", field: "ClosingCr", width: 150, dataType: 'Number', filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' }, },
            { headerName: "Area", width: 110, field: "AreaName", dataType: 'Text',cellStyle: { 'text-align': 'left' } },
            { headerName: "Mobile 1", width: 120, field: "MobileNo1", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Mobile 2", width: 120, field: "MobileNo2", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Address", width: 120, field: "Address", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Email", width: 120, field: "EmailId", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Tel 1", width: 120, field: "TelNo1", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            
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
                    LedgerName:'TOTAL =>',
                    Opening: 0,
                    TransactionDr: 0,
                    TransactionCr: 0,
                    Closing: 0,
                    ClosingDr: 0,
                    ClosingCr: 0,
                    TotalOpeningDr: 0,
                    TotalOpeningCr: 0
                }

                $scope.gridOptions.api.forEachNodeAfterFilterAndSort(function (node) {
                    var fData = node.data;
                    dt.Opening += fData.Opening;
                    dt.TransactionDr += fData.TransactionDr;
                    dt.TransactionCr += fData.TransactionCr;
                    dt.Closing += fData.Closing;
                    dt.ClosingDr += fData.ClosingDr;
                    dt.ClosingCr += fData.ClosingCr;
                    dt.TotalOpeningDr += fData.TotalOpeningDr;
                    dt.TotalOpeningDr += fData.TotalOpeningDr;
                });

                var totalColl = [];
                totalColl.push(dt);
                $scope.gridOptionsBottom.api.setRowData(totalColl);
            }

        };
        $scope.eGridDiv = document.querySelector('#datatable');

        // create the grid passing in the div to use together with the columns & data we want to use
        new agGrid.Grid($scope.eGridDiv, $scope.gridOptions);

        $scope.dataForBottomGrid = [
            {
                AutoNumber: '',
                PartyName: 'Total =>',
                Opening: 0,
                Closing: ''
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
   
    $scope.GetLedgerwise = function () {

        $scope.gridOptions.data = [];

        var para = {
            dateFrom: $scope.Ledgerwise.DateFromDet ? $scope.Ledgerwise.DateFromDet.dateAD : null,
            dateTo: $scope.Ledgerwise.DateToDet ? $scope.Ledgerwise.DateToDet.dateAD : null,
            branchId: $scope.Ledgerwise.branchId,
            branchIdColl: $scope.Ledgerwise.branchIdColl,
            groupId: $scope.Ledgerwise.LedgerGroupId,
            showZeroBalance: true
        };

        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: 'POST',
            url: base_url + "Account/Reporting/GetTBLedgerWise",
            headers: { 'Content-Type': undefined },

            transformRequest: function (data) {

                var formData = new FormData();
                formData.append("jsonData", angular.toJson(data.jsonData));

                return formData;
            },
            data: { jsonData: para }
        }).then(function (res) {

            $scope.loadingstatus = "stop";
            hidePleaseWait();
            if (res.data.IsSuccess && res.data.Data) {

                var dt = {
                    LedgerName: 'TOTAL =>',
                    Opening: 0,
                    TransactionDr: 0,
                    TransactionCr: 0,
                    Closing: 0,
                    ClosingDr: 0,
                    ClosingCr: 0,
                    TotalOpeningDr: 0,
                    TotalOpeningCr: 0
                }

                angular.forEach(res.data.Data, function (fData) {
                    dt.Opening += fData.Opening;
                    dt.TransactionDr += fData.TransactionDr;
                    dt.TransactionCr += fData.TransactionCr;
                    dt.Closing += fData.Closing;
                    dt.ClosingDr += fData.ClosingDr;
                    dt.ClosingCr += fData.ClosingCr;
                    dt.TotalOpeningDr += fData.TotalOpeningDr;
                    dt.TotalOpeningDr += fData.TotalOpeningDr;
                })
             
                var totalColl = [];
                totalColl.push(dt);
                $scope.gridOptionsBottom.api.setRowData(totalColl);

                $scope.gridOptions.api.setRowData(res.data.Data);
            } else {
                Swal.fire(res.data.ResponseMSG);
            }

        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";

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
            url: base_url + "Account/Reporting/GetLedgerTypeWiseSummary",
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
                down_file(base_url + "//" + res.data.Data.ResponseId, "Ledgerwise.xlsx");
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
