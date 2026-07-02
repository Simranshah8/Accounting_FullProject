
app.controller("MultipleLedgerDayBook", function ($scope, $http, $filter, $timeout, GlobalServices, $compile) {
var PrintPreviewAs = 1;
 const contextMenu = GlobalServices.createElementForMenu();
    LoadData();
    $scope.onBtExportCSV = function () {
        var params = {
            fileName: 'MultipleLedgerDayBook.csv',
            sheetName: 'MultipleLedgerDayBook'
        };

        $scope.gridOptions.api.exportDataAsCsv(params);
    }
    $scope.onFilterTextBoxChanged = function () {
        $scope.gridOptions.api.setQuickFilter($scope.search);
    }

    function LoadData() {
        $('.select2').select2({
            allowClear: true,
            openOnEnter: true
        });
		
		 $scope.GenConfig = {};
        GlobalServices.getGenConfig().then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.GenConfig = res.data.Data;
                PrintPreviewAs = $scope.GenConfig.PrintPreviewAs;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });


        $scope.MultipleLedgerDayBook = {
            DateFrom_TMP: new Date(),
            DateTo_TMP: new Date(),
            LedgerId: 0,

        };
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

        $scope.AgentList = [];
        $http({
            method: 'GET',
            url: base_url + "Account/Creation/GetSalesManList",
            dataType: "json"
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.AgentList = res.data.Data;
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
                    $scope.MultipleLedgerDayBook.DateFrom_TMP = new Date(comDet.StartDate);
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
                headerName: "Date(A.D.)", width: 140, field: "VoucherDate", dataType: 'DateTime', pinned: 'left', cellRenderer: 'agGroupCellRenderer', cellStyle: { 'text-align': 'center' },
                valueFormatter: function (params) { return DateFormatAD(params.value); },
                showRowGroup: true,
                cellRendererParams: {
                    suppressCount: false, // turn off the row count
                }
            },
            {
                headerName: "Miti", width: 140, field: "NVoucherDate", pinned: 'left', cellRenderer: 'agGroupCellRenderer', dataType: 'DateTime', cellStyle: { 'text-align': 'center' },
                valueFormatter: function (params) { return DateFormatBS(params.value); },
                showRowGroup: true,
                cellRendererParams: {
                    suppressCount: false, // turn off the row count
                }
            },
            { headerName: "Particulars", width: 180, field: "Particulars", filter: 'agTextColumnFilter', dataType: 'Text', cellStyle: { 'text-align': 'left' }, },
            { headerName: "VoucherType", width: 180, field: "VoucherName", filter: 'agTextColumnFilter', dataType: 'Text', cellStyle: { 'text-align': 'left' }, },
            { headerName: "Voucher No.", width: 180, field: "VoucherNo", filter: 'agTextColumnFilter', dataType: 'Text', cellStyle: { 'text-align': 'center' }, },
            { headerName: "RefNo", width: 180, field: "RefNo", filter: 'agTextColumnFilter', dataType: 'Text', cellStyle: { 'text-align': 'center' }, },

            { headerName: "Debit", width: 150, field: "DebitAmt", filter: 'agTextColumnFilter', dataType: 'Number', cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },

            { headerName: "Credit", width: 150, field: "CreditAmt", filter: 'agTextColumnFilter', dataType: 'Number', cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "CurrentClosing", width: 180, field: "CurrentClosing", filter: 'agTextColumnFilter', dataType: 'Number', cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },

            { headerName: "User", width: 150, field: "UserName", dataType: 'Text', cellStyle: { 'text-align': 'left' } },

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
			overlayLoadingTemplate: "Please Click the Load Bottom to display the data",
            columnDefs: $scope.columnDefs,
            enableColResize: true,
            rowData: null,
            filter: true,
            enableFilter: true,
            rowSelection: 'multiple',
            suppressHorizontalScroll: true,
            alignedGrids: [],

            onFilterChanged: function () {

                var dt = {
                    Particulars: 'TOTAL =>',
                    DebitAmt: 0,
                    CreditAmt: 0,
                    CurrentClosing: 0,
                   
                }
                $scope.gridOptions.api.forEachNodeAfterFilterAndSort(function (node) {
                    var fData = node.data;
                    dt.DebitAmt += fData.DebitAmt;
                    dt.CreditAmt += fData.CreditAmt;
                    dt.CurrentClosing += fData.CurrentClosing;                  

                });


                var filterDataColl = [];
                filterDataColl.push(dt);

                $scope.gridOptionsBottom.api.setRowData(filterDataColl);
            }
        };

        $scope.eGridDiv = document.querySelector('#datatable');
        // lookup the container we want the Grid to use
        //  $scope.eGridDiv = document.querySelector('#datatable');

        // create the grid passing in the div to use together with the columns & data we want to use
        // new agGrid.Grid($scope.eGridDiv, $scope.gridOptions);


        $scope.dataForBottomGrid = [
            {
                IsParent: true,
                DateAD: '',
                DateBS: '',
                Particulars: 'Opening Balance =>',
                VoucherType: '',
                VoucherNo: '',
                RefNo: '',
                DebitAmt: 0,
                CreditAmt: 0,
                CurrentClosing: 0,
                CostClass: '',
                UserName: ''
            },
            {
                IsParent: true,
                DateAD: '',
                DateBS: '',
                Particulars: 'Current Total =>',
                VoucherType: '',
                VoucherNo: '',
                RefNo: '',
                DebitAmt: 0,
                CreditAmt: 0,
                CurrentClosing: 0,
                CostClass: '',
                UserName: ''
            },
            {
                IsParent: true,
                DateAD: '',
                DateBS: '',
                Particulars: 'Closing Balance =>',
                VoucherType: '',
                VoucherNo: '',
                RefNo: '',
                DebitAmt: 0,
                CreditAmt: 0,
                CurrentClosing: 0,
                CostClass: '',
                UserName: ''
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

    $scope.GetMultipleLedgerDayBook = function () {

        $scope.ClearData();

        if (!$scope.MultipleLedgerDayBook.AgentId)
            return;

        var dateFrom = new Date(($filter('date')(new Date(), 'yyyy-MM-dd')));
        var dateTo = new Date(($filter('date')(new Date(), 'yyyy-MM-dd')));

        if ($scope.MultipleLedgerDayBook.DateFromDet)
            dateFrom = new Date(($filter('date')($scope.MultipleLedgerDayBook.DateFromDet.dateAD, 'yyyy-MM-dd')));

        if ($scope.MultipleLedgerDayBook.DateToDet)
            dateTo = new Date(($filter('date')($scope.MultipleLedgerDayBook.DateToDet.dateAD, 'yyyy-MM-dd')));

        $scope.DataColl = []; //declare an empty array

        var beData = {
            DateFrom: dateFrom,
            DateTo: dateTo,
            LedgerId: $scope.MultipleLedgerDayBook.LedgerId
        };

        $scope.loadingstatus = 'running';

        $http({
            method: "post",
            url: base_url + "Account/Reporting/GetMultipleLedgerDayBook",
            data: JSON.stringify(beData),
            dataType: "json"
        }).then(function (res) {

            var openingAmt = 0, drAmt = 0, crAmt = 0, closingAmt = 0;
            openingAmt = res.data.Data.OpeningAmt;
            drAmt = res.data.Data.DrAmt;
            crAmt = res.data.Data.CrAmt;
            closingAmt = res.data.Data.ClosingAmt;

            $scope.MultipleLedgerDayBook.ODr = (openingAmt > 0 ? openingAmt : 0);
            $scope.MultipleLedgerDayBook.OCr = (openingAmt < 0 ? Math.abs(openingAmt) : 0);
            $scope.MultipleLedgerDayBook.TDr = drAmt;
            $scope.MultipleLedgerDayBook.TCr = crAmt;
            $scope.MultipleLedgerDayBook.CDr = (closingAmt > 0 ? closingAmt : 0);
            $scope.MultipleLedgerDayBook.CCr = (closingAmt < 0 ? Math.abs(closingAmt) : 0);

            if (openingAmt > 0)
                $scope.dataForBottomGrid[0].DebitAmt = openingAmt;
            else
                $scope.dataForBottomGrid[0].CreditAmt = Math.abs(openingAmt);

            $scope.dataForBottomGrid[1].DebitAmt = drAmt;
            $scope.dataForBottomGrid[1].CreditAmt = crAmt;

            if (closingAmt > 0)
                $scope.dataForBottomGrid[2].DebitAmt = closingAmt;
            else
                $scope.dataForBottomGrid[2].CreditAmt = Math.abs(closingAmt);

            $scope.gridOptionsBottom.api.setRowData($scope.dataForBottomGrid);

            $scope.DataColl = res.data.Data.DataColl;
            $scope.gridOptions.api.setRowData($scope.DataColl);

            $scope.loadingstatus = 'done';

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
                                                        Period: $scope.MultipleLedgerDayBook.DateFromDet.dateBS + " TO " + $scope.MultipleLedgerDayBook.DateToDet.dateBS,
                                                        ODr: $scope.MultipleLedgerDayBook.ODr,
                                                        OCr: $scope.MultipleLedgerDayBook.OCr,
                                                        TDr: $scope.MultipleLedgerDayBook.TDr,
                                                        TCr: $scope.MultipleLedgerDayBook.TCr,
                                                        CDr: $scope.MultipleLedgerDayBook.CDr,
                                                        CCr: $scope.MultipleLedgerDayBook.CCr
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
                                    Period: $scope.MultipleLedgerDayBook.DateFromDet.dateBS + " TO " + $scope.MultipleLedgerDayBook.DateToDet.dateBS,
                                    ODr: $scope.MultipleLedgerDayBook.ODr,
                                    OCr: $scope.MultipleLedgerDayBook.OCr,
                                    TDr: $scope.MultipleLedgerDayBook.TDr,
                                    TCr: $scope.MultipleLedgerDayBook.TCr,
                                    CDr: $scope.MultipleLedgerDayBook.CDr,
                                    CCr: $scope.MultipleLedgerDayBook.CCr
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

        var RptParamentersColl = [];

        RptParamentersColl.push({
            Name: "Period",
            Value: $('#dtDateFrom').val() + ' To ' + $('#dtDateTo').val()
        },
            {
                Name: 'Ledger',
                Value: $scope.MultipleLedgerDayBook.LedgerDetails.Name
            },
            {
                Name: 'Address',
                Value: ($scope.MultipleLedgerDayBook.LedgerDetails.Address ? $scope.MultipleLedgerDayBook.LedgerDetails.Address : '')
            },
            {
                Name: 'MobileNo',
                Value: ($scope.MultipleLedgerDayBook.LedgerDetails.MobileNo1 ? $scope.MultipleLedgerDayBook.LedgerDetails.MobileNo1 : '')
            },
            {
                Name: 'PanVatNo',
                Value: ($scope.MultipleLedgerDayBook.LedgerDetails.PanVat ? $scope.MultipleLedgerDayBook.LedgerDetails.PanVat : '')
            },
            {
                Name: 'TelNo',
                Value: ($scope.MultipleLedgerDayBook.LedgerDetails.MobileNo2 ? $scope.MultipleLedgerDayBook.LedgerDetails.MobileNo2 : '')
            },
            {
                Name: 'EmailId',
                Value: ($scope.MultipleLedgerDayBook.LedgerDetails.EmailId ? $scope.MultipleLedgerDayBook.LedgerDetails.EmailId : '')
            },
            {
                Name: 'ODr',
                Value: $scope.dataForBottomGrid[0].DebitAmt
            },
            {
                Name: 'OCr',
                Value: $scope.dataForBottomGrid[0].CreditAmt
            },
            {
                Name: 'TDr',
                Value: $scope.dataForBottomGrid[1].DebitAmt
            },
            {
                Name: 'TCr',
                Value: $scope.dataForBottomGrid[1].CreditAmt
            },
            {
                Name: 'CDr',
                Value: $scope.dataForBottomGrid[2].DebitAmt
            },
            {
                Name: 'CCr',
                Value: $scope.dataForBottomGrid[2].CreditAmt
            }
        );

        var filterData = [];

        $scope.gridOptions.api.forEachNodeAfterFilterAndSort(function (node) {
            var ledVoucher = node.data;

            if (ledVoucher.IsParent == true) {
                filterData.push(ledVoucher);

                if (ledVoucher.AccountBillDetailsColl) {
                    angular.forEach(ledVoucher.AccountBillDetailsColl, function (bd) {
                        filterData.push({
                            Particulars: "(" + bd.VoucherDetails + " :- Rs." + GlobalFunction.getNumberStr(bd.Amount) + " / " + bd.Remarks + " ) "
                        });
                    });
                }

                if (ledVoucher.LedgerNarration) {
                    filterData.push({
                        Particulars: "( " + ledVoucher.LedgerNarration + " )"
                    });
                }

                if (ledVoucher.CostCenterColl) {
                    angular.forEach(ledVoucher.CostCenterColl, function (all) {
                        var str = "";

                        if (all.DebitAmt > 0)
                            str = NumberformatAC(all.DebitAmt);
                        else
                            str = NumberformatAC(all.CreditAmt);
                        filterData.push({
                            Particulars: all.LedgerName + " " + str
                        });
                    });
                }

                if (ledVoucher.ChieldColl) {
                    angular.forEach(ledVoucher.ChieldColl, function (all) {

                        var str = "";
                        if (all.DebitAmt > 0)
                            str = NumberformatAC(all.DebitAmt);
                        else
                            str = NumberformatAC(all.CreditAmt);

                        filterData.push({
                            Particulars: all.LedgerName + " " + str
                        });

                        if (all.CostCenterColl) {
                            angular.forEach(all.CostCenterColl, function (all1) {
                                if (all1.DebitAmt > 0)
                                    str = NumberformatAC(all1.DebitAmt);
                                else
                                    str = NumberformatAC(all1.CreditAmt);

                                filterData.push({
                                    Particulars: all1.LedgerName + " " + str
                                });

                            });
                        }

                    });
                }

                if (ledVoucher.InventoryDetailsColl) {
                    angular.forEach(ledVoucher.InventoryDetailsColl, function (invData) {
                        filterData.push({
                            Particulars: invData.ProductName + " ( " + Numberformat(invData.BQty) + " @ " + Numberformat(invData.Rate) + " = " + Numberformat(invData.Amount) + " ) "
                        });
                    });
                }
            }

        });


        return filterData;

    };

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
                down_file(base_url + "//" + res.data.Data.ResponseId, "MultipleLedgerDayBook.xlsx");
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
