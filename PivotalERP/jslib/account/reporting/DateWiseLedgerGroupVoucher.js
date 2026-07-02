app.controller("DateWiseLedgerGroupVoucher", function ($scope, $http, $filter, $timeout, GlobalServices, $compile) {
var PrintPreviewAs = 1;
 const contextMenu = GlobalServices.createElementForMenu();
    LoadData();
    $scope.onBtExportCSV = function () {
        var params = {
            fileName: 'DateWiseLedgerGroupVoucher.csv',
            sheetName: 'DateWiseLedgerGroupVoucher'
        };

        $scope.gridOptions.api.exportDataAsCsv(params);
    }
    $scope.onFilterTextBoxChanged = function () {
        $scope.gridOptions.api.setQuickFilter($scope.search);
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


        $scope.DateWiseLedgerGroupVoucher = {
            LedgerGroupId: 0,
            DateFrom_TMP: new Date(),
            DateTo_TMP: new Date(),


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
        $scope.LedgerGroupList = [];
        $http({
            method: 'GET',
            url: base_url + "Account/Creation/GetLedgerGroupList",
            dataType: "json"
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.LedgerGroupList = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $scope.CostCategoriesList = [];
        $http({
            method: 'GET',
            url: base_url + "Account/Creation/GetCostCategories",
            dataType: "json"
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.CostCategoriesList = res.data.Data;
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
                    $scope.DateWiseLedgerGroupVoucher.DateFrom_TMP = new Date(comDet.StartDate);
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
                headerName: "Date(A.D.)", width: 200, field: "VoucherDate",cellStyle:{'text-align':'center'}, cellRenderer: 'agGroupCellRenderer',
                valueFormatter: function (params) { return DateFormatAD(params.value); },
                showRowGroup: true,
                cellRendererParams: {
                    suppressCount: false, // turn off the row count
                }
            },
            {
                headerName: "Date(B.S.)", width: 200, field: "NPVoucherDate", cellStyle:{'text-align':'center'},cellRenderer: 'agGroupCellRenderer',
                valueFormatter: function (params) { return DateFormatBS(params.value); },
                showRowGroup: true,
                cellRendererParams: {
                    suppressCount: false, // turn off the row count
                }
            },
            { headerName: "Particulars", width: 180, field: "Particulars", filter: 'agTextColumnFilter',cellStyle:{'text-align':'right'} },
            { headerName: "VoucherType", width: 180, field: "VoucherName", filter: 'agTextColumnFilter',cellStyle:{'text-align':'left'} },
            { headerName: "Voucher No.", width: 180, field: "VoucherNo", filter: 'agTextColumnFilter',cellStyle:{'text-align':'center'} },
            { headerName: "RefNo", width: 180, field: "RefNo", filter: 'agTextColumnFilter',cellStyle:{'text-align':'center'} },
            { headerName: "OpeningAmt", width: 180, field: "OpeningAmt", filter: 'agTextColumnFilter',cellStyle:{'text-align':'right'} },
            { headerName: "Debit", width: 120, field: "DrAmt", filter: 'agTextColumnFilter',cellStyle:{'text-align':'right'} },

            { headerName: "Credit", width: 120, field: "CrAmt", filter: 'agTextColumnFilter',cellStyle:{'text-align':'right'} },
            { headerName: "ClosingAmt", width: 180, field: "ClosingAmt", filter: 'agTextColumnFilter',cellStyle:{'text-align':'right'} },
            { headerName: "CostClass", width: 120, field: "CostClassName",cellStyle:{'text-align':'left'} },
            { headerName: "User", width: 120, field: "UserName",cellStyle:{'text-align':'left'} },

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
			overlayLoadingTemplate: "Please Click the Load Bottom to display the data",
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

                VoucherName: 'Opening Balance =>',
                VoucherNo: '',
                CheckNo: '',
                ChequeDate: '',
                AccountNo: '',
                Remarks: '',
                DrAmt: 0,
                CrAmt: 0,
            },
            {
                IsParent: true,
                DateAD: '',
                DateBS: '',

                VoucherName: 'Current Total =>',
                VoucherNo: '',
                CheckNo: '',
                ChequeDate: '',
                AccountNo: '',
                Remarks: '',
                DrAmt: 0,
                CrAmt: 0,
            },
            {
                IsParent: true,
                DateAD: '',
                DateBS: '',

                VoucherName: 'Closing Balance =>',
                VoucherNo: '',
                CheckNo: '',
                ChequeDate: '',
                AccountNo: '',
                Remarks: '',
                DrAmt: 0,
                CrAmt: 0,
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
                        $scope.GetLedgerGroupVoucher();
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

        $scope.DateWiseLedgerGroupVoucher.ODr = 0;
        $scope.DateWiseLedgerGroupVoucher.OCr = 0;
        $scope.DateWiseLedgerGroupVoucher.TDr = 0;
        $scope.DateWiseLedgerGroupVoucher.TCr = 0;
        $scope.DateWiseLedgerGroupVoucher.CDr = 0;
        $scope.DateWiseLedgerGroupVoucher.CCr = 0;

        $scope.dataForBottomGrid[0].DrAmt = 0;
        $scope.dataForBottomGrid[0].CrAmt = 0;

        $scope.dataForBottomGrid[1].DrAmt = 0;
        $scope.dataForBottomGrid[1].CrAmt = 0;

        $scope.dataForBottomGrid[2].DrAmt = 0;
        $scope.dataForBottomGrid[2].CrAmt = 0;

        $scope.gridOptionsBottom.api.setRowData($scope.dataForBottomGrid);

        $scope.DataColl = [];
        $scope.gridOptions.api.setRowData($scope.DataColl);
    };
    $scope.GetDateWiseLedgerGroupVoucher = function () {

        $scope.ClearData();

        if (!$scope.DateWiseLedgerGroupVoucher.LedgerGroupId)
            return;

        var dateFrom = new Date(($filter('date')(new Date(), 'yyyy-MM-dd')));
        var dateTo = new Date(($filter('date')(new Date(), 'yyyy-MM-dd')));

        if ($scope.DateWiseLedgerGroupVoucher.DateFromDet)
            dateFrom = new Date(($filter('date')($scope.DateWiseLedgerGroupVoucher.DateFromDet.dateAD, 'yyyy-MM-dd')));

        if ($scope.DateWiseLedgerGroupVoucher.DateToDet)
            dateTo = new Date(($filter('date')($scope.DateWiseLedgerGroupVoucher.DateToDet.dateAD, 'yyyy-MM-dd')));

        $scope.DataColl = []; //declare an empty array

        var beData = {
            DateFrom: dateFrom,
            DateTo: dateTo,
            LedgerGroupId: $scope.DateWiseLedgerGroupVoucher.LedgerGroupId
        };

        $scope.loadingstatus = 'running';

        $http({
            method: "post",
            url: base_url + "Account/Reporting/GetDateWiseLedgerGroupVoucher",
            data: JSON.stringify(beData),
            dataType: "json"
        }).then(function (res) {

            var openingAmt = 0, drAmt = 0, crAmt = 0, closingAmt = 0;
            openingAmt = res.data.Data.OpeningAmt;
            drAmt = res.data.Data.DrAmt;
            crAmt = res.data.Data.CrAmt;
            closingAmt = res.data.Data.ClosingAmt;

            $scope.DateWiseLedgerGroupVoucher.ODr = (openingAmt > 0 ? openingAmt : 0);
            $scope.DateWiseLedgerGroupVoucher.OCr = (openingAmt < 0 ? Math.abs(openingAmt) : 0);
            $scope.DateWiseLedgerGroupVoucher.TDr = drAmt;
            $scope.DateWiseLedgerGroupVoucher.TCr = crAmt;
            $scope.DateWiseLedgerGroupVoucher.CDr = (closingAmt > 0 ? closingAmt : 0);
            $scope.DateWiseLedgerGroupVoucher.CCr = (closingAmt < 0 ? Math.abs(closingAmt) : 0);

            if (openingAmt > 0)
                $scope.dataForBottomGrid[0].DrAmt = openingAmt;
            else
                $scope.dataForBottomGrid[0].CrAmt = Math.abs(openingAmt);

            $scope.dataForBottomGrid[1].DrAmt = drAmt;
            $scope.dataForBottomGrid[1].CrAmt = crAmt;

            if (closingAmt > 0)
                $scope.dataForBottomGrid[2].DrAmt = closingAmt;
            else
                $scope.dataForBottomGrid[2].CrAmt = Math.abs(closingAmt);

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
                                                url: base_url + "Account/Reporting/PrintDateWiseLedgerGroupVoucher",
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
                                                        Period: $scope.DateWiseLedgerGroupVoucher.DateFromDet.dateBS + " TO " + $scope.DateWiseLedgerGroupVoucher.DateToDet.dateBS,
                                                        ODr: $scope.DateWiseLedgerGroupVoucher.ODr,
                                                        OCr: $scope.DateWiseLedgerGroupVoucher.OCr,
                                                        TDr: $scope.DateWiseLedgerGroupVoucher.TDr,
                                                        TCr: $scope.DateWiseLedgerGroupVoucher.TCr,
                                                        CDr: $scope.DateWiseLedgerGroupVoucher.CDr,
                                                        CCr: $scope.DateWiseLedgerGroupVoucher.CCr
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
                            url: base_url + "Account/Reporting/PrintDateWiseLedgerGroupVoucher",
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
                                    Period: $scope.DateWiseLedgerGroupVoucher.DateFromDet.dateBS + " TO " + $scope.DateWiseLedgerGroupVoucher.DateToDet.dateBS,
                                    ODr: $scope.DateWiseLedgerGroupVoucher.ODr,
                                    OCr: $scope.DateWiseLedgerGroupVoucher.OCr,
                                    TDr: $scope.DateWiseLedgerGroupVoucher.TDr,
                                    TCr: $scope.DateWiseLedgerGroupVoucher.TCr,
                                    CDr: $scope.DateWiseLedgerGroupVoucher.CDr,
                                    CCr: $scope.DateWiseLedgerGroupVoucher.CCr
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
                Value: $scope.DateWiseLedgerGroupVoucher.LedgerDetails.Name
            },
            {
                Name: 'Address',
                Value: ($scope.DateWiseLedgerGroupVoucher.LedgerDetails.Address ? $scope.DateWiseLedgerGroupVoucher.LedgerDetails.Address : '')
            },
            {
                Name: 'MobileNo',
                Value: ($scope.LedgerGroupVoucher.LedgerDetails.MobileNo1 ? $scope.LedgerGroupVoucher.LedgerDetails.MobileNo1 : '')
            },
            {
                Name: 'PanVatNo',
                Value: ($scope.LedgerGroupVoucher.LedgerDetails.PanVat ? $scope.LedgerGroupVoucher.LedgerDetails.PanVat : '')
            },
            {
                Name: 'TelNo',
                Value: ($scope.LedgerGroupVoucher.LedgerDetails.MobileNo2 ? $scope.LedgerGroupVoucher.LedgerDetails.MobileNo2 : '')
            },
            {
                Name: 'EmailId',
                Value: ($scope.LedgerGroupVoucher.LedgerDetails.EmailId ? $scope.LedgerGroupVoucher.LedgerDetails.EmailId : '')
            },
            {
                Name: 'ODr',
                Value: $scope.dataForBottomGrid[0].DrAmt
            },
            {
                Name: 'OCr',
                Value: $scope.dataForBottomGrid[0].CrAmt
            },
            {
                Name: 'TDr',
                Value: $scope.dataForBottomGrid[1].DrAmt
            },
            {
                Name: 'TCr',
                Value: $scope.dataForBottomGrid[1].CrAmt
            },
            {
                Name: 'CDr',
                Value: $scope.dataForBottomGrid[2].DrAmt
            },
            {
                Name: 'CCr',
                Value: $scope.dataForBottomGrid[2].CrAmt
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

    $('.select2').select2();
	
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
                down_file(base_url + "//" + res.data.Data.ResponseId, "DateWiseLedgerGroupVoucher.xlsx");
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
