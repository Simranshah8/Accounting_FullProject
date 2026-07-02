
app.controller("DairyPurchaseReportCntrl", function ($scope, $http, $filter, $timeout, GlobalServices, $compile) {

    LoadData();
    $scope.onBtExportCSV = function () {
        var params = {
            fileName: 'LedgerVoucher.csv',
            sheetName: 'LedgerVoucher'
        };

        $scope.gridOptions.api.exportDataAsCsv(params);
    }
    $scope.onFilterTextBoxChanged = function () {
        $scope.gridOptions.api.setQuickFilter($scope.search);
    }

    function LoadData() {
        $('.select2').select2();

        $scope.LedgerVoucher = {
            DateFrom_TMP: new Date(),
            DateTo_TMP: new Date(),
            VoucherId: 0,
            IsPost: true,
            BranchId: 0
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

        $timeout(function () {
            $http({
                method: "GET",
                url: base_url + "Global/GetCompanyDetail",
                dataType: "json"
            }).then(function (res) {
                var comDet = res.data.Data;
                if (comDet) {
                    $scope.LedgerVoucher.DateFrom_TMP = new Date(comDet.StartDate);
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
                headerName: "Date", width: 145, cellRenderer: 'agGroupCellRenderer',
                valueGetter: function (params) {
                    var beData = params.data;
                    if (beData.IsParent) {
                        return beData.VoucherDate;
                    }
                    return null;
                },
                valueFormatter: function (params) { return DateFormatAD(params.value); },
                filter: 'agDateColumnFilter', pinned: 'left'
            },
            {
                headerName: "Miti", width: 110, valueGetter: function (params) {
                    var beData = params.data;
                    if (beData.IsParent) {
                        return beData.NVoucherDate;
                    } else {
                        return "";
                    }
                    //return DateFormatBS(params.data.NY, params.data.NM, params.data.ND);
                },
                filter: 'agTextColumnFilter', pinned: 'left'
            },
           
           
            { headerName: "Invoice No.", width: 150, field: "InvoiceNo", filter: 'agTextColumnFilter', cellStyle: { 'text-align': 'center' }, },
            { headerName: "Shift", width: 150, field: "Shift", filter: 'agTextColumnFilter', cellStyle: { 'text-align': 'center' }, },
            { headerName: "Item", width: 150, field: "Item", filter: 'agTextColumnFilter', cellStyle: { 'text-align': 'center' }, },
            { headerName: "Quantity", width: 150, field: "Quantity", filter: 'agTextColumnFilter', cellStyle: { 'text-align': 'center' }, },
            { headerName: "FAT %", width: 150, field: "FatPer", filter: 'agTextColumnFilter', cellStyle: { 'text-align': 'center' }, },
            { headerName: "SNF %", width: 150, field: "SnfPer", filter: 'agTextColumnFilter', cellStyle: { 'text-align': 'center' }, },
            { headerName: "Water Mix  %", width: 150, field: "WaterMixPer", filter: 'agTextColumnFilter', cellStyle: { 'text-align': 'center' }, },
            { headerName: "TS Amount", width: 150, field: "TSAmount", filter: 'agTextColumnFilter', cellStyle: { 'text-align': 'center' }, },
            { headerName: "Topping", width: 150, field: "Topping", filter: 'agTextColumnFilter', cellStyle: { 'text-align': 'center' }, },
            { headerName: "Rate", width: 150, field: "Rate", filter: 'agTextColumnFilter', cellStyle: { 'text-align': 'center' }, },
            { headerName: "Amount", width: 120, field: "Amount", filter: 'agTextColumnFilter', cellStyle: { 'text-align': 'center' }, },          
            
        ];


        $scope.gridOptions = {
            angularCompileRows: true,
            // a default column definition with properties that get applied to every column
            defaultColDef: {
                filter: true,
                resizable: true,
                sortable: true,

                // set every column width
                width: 90
            },
            columnDefs: $scope.columnDefs,
            enableColResize: true,
            rowData: null,
            filter: true,
            enableFilter: true,
            rowSelection: 'multiple',
            suppressHorizontalScroll: true,
            alignedGrids: [],
            getNodeChildDetails: function (beData) {
                var dataColl = [];
                if (!beData.IsInventory) {
                    var first = true;

                    if (beData.LedgerAllocationColl) {
                        if (beData.LedgerAllocationColl.length > 0) {
                            angular.forEach(beData.LedgerAllocationColl, function (data) {

                                if (first == true) {
                                    first = false;
                                } else
                                    dataColl.push(data);
                            });
                        }
                    }
                    if (beData.Narration && beData.Narration.length > 0)
                        dataColl.push("(" + beData.Narration + ")");
                }
                else if (beData.IsInventory) {
                    if (beData.VoucherType != Dynamic.BusinessEntity.Account.VoucherTypes.StockTransfor) {
                        if (beData.Particulars.Trim().Length > 0)
                            dataColl.Add(beData.Particulars);
                    }

                    if (beData.AditionalCostColl && beData.AditionalCostColl.length > 0) {
                        angular.forEach(beData.AditionalCostColl, function (ad) {
                            dataColl.push(ad);
                        });
                    }

                    if (beData.ItemAllocationColl && beData.ItemAllocationColl.length > 0) {
                        angular.forEach(beData.ItemAllocationColl, function (ias) {
                            dataColl.push(ias);
                        });
                    }

                    if (beData.Narration && beData.Narration.length > 0)
                        dataColl.push("(" + beData.Narration + ")");

                } else
                    return null;

                if (dataColl.length > 0) {
                    return {
                        group: true,
                        children: dataColl,
                        expanded: beData.open
                    };
                } else
                    return null;


            },

        };


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


    }

    $scope.editVoucher = function (tranId, voucherType, voucherId, voucherName, voucherNo) {

        Swal.fire({
            title: 'Do you want to edit the selected voucher(' + voucherName + ') :- ' + voucherNo + ' ? ',
            showCancelButton: true,
            confirmButtonText: 'Edit',
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {

                var tabContent = "";
                if (voucherType < 5) {
                    tabContent = base_url + "Account/Transaction/" + voucherName + "?TranId=" + tranId;
                } else {
                    tabContent = base_url + "Inventory/Transaction/" + voucherName + "?TranId=" + tranId;
                }

                var tabTitle = voucherName;
                var tabs = window.parent.document.getElementById('tabs');
                var ul = tabs.children[0];
                var rand = function () {
                    return Math.random().toString(36).substr(2); // remove `0.`
                };
                var tabId = "Tab-" + rand();

                $("<li class='nav-item ui-tabs-active ui-state-active' role='presentation'><a id='al-" + tabId + "' class='nav-link active' role='tab' aria-controls='pills-second' aria-selected='false' OnClick='TabClick(\"" + tabId + "\")' href='#" + tabId + "'>" + tabTitle + "</a><a href='#' class='fas fa-times-circle'></a></li>").appendTo(ul);
                $("<div id='" + tabId + "'><iframe id='Frm_" + tabId + "' src='" + tabContent + "' width='100%'></iframe></div>").appendTo(tabs);

            }
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
                        $scope.GetLedgerVoucher();
                    } else {
                        Swal.fire(res.data.ResponseMSG);
                    }

                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }
        });

    }

    $scope.ClearData = function () {

        $scope.LedgerVoucher.ODr = 0;
        $scope.LedgerVoucher.OCr = 0;
        $scope.LedgerVoucher.TDr = 0;
        $scope.LedgerVoucher.TCr = 0;
        $scope.LedgerVoucher.CDr = 0;
        $scope.LedgerVoucher.CCr = 0;

        $scope.dataForBottomGrid[0].DebitAmt = 0;
        $scope.dataForBottomGrid[0].CreditAmt = 0;

        $scope.dataForBottomGrid[1].DebitAmt = 0;
        $scope.dataForBottomGrid[1].CreditAmt = 0;

        $scope.dataForBottomGrid[2].DebitAmt = 0;
        $scope.dataForBottomGrid[2].CreditAmt = 0;

        $scope.gridOptionsBottom.api.setRowData($scope.dataForBottomGrid);

        $scope.DataColl = [];
        $scope.gridOptions.api.setRowData($scope.DataColl);
    };
    $scope.GetLedgerVoucher = function () {

        $scope.ClearData();

        if (!$scope.LedgerVoucher.LedgerId)
            return;

        var dateFrom = new Date(($filter('date')(new Date(), 'yyyy-MM-dd')));
        var dateTo = new Date(($filter('date')(new Date(), 'yyyy-MM-dd')));

        if ($scope.LedgerVoucher.DateFromDet)
            dateFrom = new Date(($filter('date')($scope.LedgerVoucher.DateFromDet.dateAD, 'yyyy-MM-dd')));

        if ($scope.LedgerVoucher.DateToDet)
            dateTo = new Date(($filter('date')($scope.LedgerVoucher.DateToDet.dateAD, 'yyyy-MM-dd')));

        $scope.DataColl = []; //declare an empty array

        var beData = {
            DateFrom: dateFrom,
            DateTo: dateTo,
            ledgerId: $scope.LedgerVoucher.LedgerId
        };

        $scope.loadingstatus = 'running';

        $http({
            method: "post",
            url: base_url + "Account/Reporting/GetLedgerVoucher",
            data: JSON.stringify(beData),
            dataType: "json"
        }).then(function (res) {

            var openingAmt = 0, drAmt = 0, crAmt = 0, closingAmt = 0;
            openingAmt = res.data.Data.OpeningAmt;
            drAmt = res.data.Data.DrAmt;
            crAmt = res.data.Data.CrAmt;
            closingAmt = res.data.Data.ClosingAmt;

            $scope.LedgerVoucher.ODr = (openingAmt > 0 ? openingAmt : 0);
            $scope.LedgerVoucher.OCr = (openingAmt < 0 ? Math.abs(openingAmt) : 0);
            $scope.LedgerVoucher.TDr = drAmt;
            $scope.LedgerVoucher.TCr = crAmt;
            $scope.LedgerVoucher.CDr = (closingAmt > 0 ? closingAmt : 0);
            $scope.LedgerVoucher.CCr = (closingAmt < 0 ? Math.abs(closingAmt) : 0);

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
                                                url: base_url + "Account/Reporting/PrintLedgerVoucher",
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

                                                    var rptPara = {
                                                        rpttranid: rptTranId,
                                                        istransaction: false,
                                                        entityid: EntityId,
                                                        voucherid: 0,
                                                        tranid: 0,
                                                        vouchertype: 0,
                                                        sessionid: res.data.Data.ResponseId,
                                                        Period: $scope.LedgerVoucher.DateFromDet.dateBS + " TO " + $scope.LedgerVoucher.DateToDet.dateBS,
                                                        ODr: $scope.LedgerVoucher.ODr,
                                                        OCr: $scope.LedgerVoucher.OCr,
                                                        TDr: $scope.LedgerVoucher.TDr,
                                                        TCr: $scope.LedgerVoucher.TCr,
                                                        CDr: $scope.LedgerVoucher.CDr,
                                                        CCr: $scope.LedgerVoucher.CCr
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
                            url: base_url + "Account/Reporting/PrintLedgerVoucher",
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

                                var rptPara = {
                                    rpttranid: rptTranId,
                                    istransaction: false,
                                    entityid: EntityId,
                                    voucherid: 0,
                                    tranid: 0,
                                    vouchertype: 0,
                                    sessionid: res.data.Data.ResponseId,
                                    Period: $scope.LedgerVoucher.DateFromDet.dateBS + " TO " + $scope.LedgerVoucher.DateToDet.dateBS,
                                    ODr: $scope.LedgerVoucher.ODr,
                                    OCr: $scope.LedgerVoucher.OCr,
                                    TDr: $scope.LedgerVoucher.TDr,
                                    TCr: $scope.LedgerVoucher.TCr,
                                    CDr: $scope.LedgerVoucher.CDr,
                                    CCr: $scope.LedgerVoucher.CCr
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
                Value: $scope.LedgerVoucher.LedgerDetails.Name
            },
            {
                Name: 'Address',
                Value: ($scope.LedgerVoucher.LedgerDetails.Address ? $scope.LedgerVoucher.LedgerDetails.Address : '')
            },
            {
                Name: 'MobileNo',
                Value: ($scope.LedgerVoucher.LedgerDetails.MobileNo1 ? $scope.LedgerVoucher.LedgerDetails.MobileNo1 : '')
            },
            {
                Name: 'PanVatNo',
                Value: ($scope.LedgerVoucher.LedgerDetails.PanVat ? $scope.LedgerVoucher.LedgerDetails.PanVat : '')
            },
            {
                Name: 'TelNo',
                Value: ($scope.LedgerVoucher.LedgerDetails.MobileNo2 ? $scope.LedgerVoucher.LedgerDetails.MobileNo2 : '')
            },
            {
                Name: 'EmailId',
                Value: ($scope.LedgerVoucher.LedgerDetails.EmailId ? $scope.LedgerVoucher.LedgerDetails.EmailId : '')
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


});
