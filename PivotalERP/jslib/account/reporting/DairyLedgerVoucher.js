agGrid.initialiseAgGridWithAngular1(angular);
app.controller("DairyLedgerVoucherCntrl", function ($scope, $http, $filter, $timeout, GlobalServices, $compile) {

    LoadData();
    $scope.onBtExportCSV = function () {
        var params = {
            fileName: 'DairyLedgerVoucher.csv',
            sheetName: 'DairyLedgerVoucher'
        };

        $scope.gridOptions.api.exportDataAsCsv(params);
    }
    $scope.onFilterTextBoxChanged = function () {
        $scope.gridOptions.api.setQuickFilter($scope.search);
    }
    $scope.toggleExpandCollapse = function () {
        if ($scope.DairyLedgerVoucher.ExpandCollapse == true) {
            $scope.gridOptions.api.expandAll();
        } else {
            $scope.gridOptions.api.collapseAll();
        }
    };
    function LoadData() {
        $('.select2').select2({
            allowClear: true,
            openOnEnter: true
        });

        $scope.InterestCalculationOnColl = [{ id: 1, text: 'Debit Balance' }, { id: 2, text: 'Credit Balance' }];

        $scope.DairyLedgerVoucher = {
            DateFrom_TMP: new Date(),
            DateTo_TMP: new Date(),
            VoucherId: 0,
            IsPost: true,
            BranchId: 0,
            IsSummary: true,
            LedgerDetails: {}
        };

        $scope.ButtonED = {};
        GlobalServices.getButtonDisabled(EntityId).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.ButtonED = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });


        $scope.comDet = {};
        $timeout(function () {
            $http({
                method: "GET",
                url: base_url + "Global/GetCompanyDetail",
                dataType: "json"
            }).then(function (res) {
                $scope.comDet = res.data.Data;
                if ($scope.comDet) {
                    $scope.DairyLedgerVoucher.DateFrom_TMP = new Date($scope.comDet.StartDate);
                }
            }, function (errormessage) {
                alert('Unable to Delete data. pls try again.' + errormessage.responseText);
            });
        });

        $scope.LedgerTypeList = [];
        $http({
            method: 'GET',
            url: base_url + "Global/GetLedgerType",
            dataType: "json"
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.LedgerTypeList = res.data.Data;
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

        $scope.ReportName = '';

        $scope.noofdecimal = 2;

        $scope.loadingstatus = "stop";

        // common value formatter for numeric columns using $scope.noofdecimal
        var numberValueFormatter = function (params) {
            var value = params.value;
            if (value === null || value === undefined || value === '') return '';
            var num = parseFloat(value);
            if (isNaN(num)) return value;
            var dec = ($scope.noofdecimal !== undefined && $scope.noofdecimal !== null) ? $scope.noofdecimal : 2;
            return num.toFixed(dec);
        };


        $scope.columnDefs = [
            { headerName: "Date", width: 130, field: "VoucherMiti", dataType: 'DateTime', filter: 'agNumberColumnFilter', },
            { headerName: "Qty", width: 130, field: "Qty", dataType: 'Number', filter: 'agNumberColumnFilter', valueFormatter: numberValueFormatter },
            { headerName: "Fat", width: 130, field: "Fat", dataType: 'Number', filter: 'agNumberColumnFilter', valueFormatter: numberValueFormatter },
            { headerName: "Fat Kg", width: 120, field: "FatKG", dataType: 'Number', filter: 'agNumberColumnFilter', valueFormatter: numberValueFormatter },
            { headerName: "Lacto", width: 120, field: "Lacto", dataType: 'Number', filter: 'agNumberColumnFilter', valueFormatter: numberValueFormatter },
            { headerName: "SNF", width: 120, field: "SNF", dataType: 'Number', filter: 'agNumberColumnFilter', valueFormatter: numberValueFormatter },
            { headerName: "SNF Kg", width: 120, field: "SNFKG", dataType: 'Number', filter: 'agNumberColumnFilter', valueFormatter: numberValueFormatter },
            { headerName: "Amount", width: 120, field: "Amount", dataType: 'Number', filter: 'agNumberColumnFilter', valueFormatter: numberValueFormatter },
            { headerName: "Pay. Amount", width: 120, field: "PayAmount", dataType: 'Number', filter: 'agNumberColumnFilter', valueFormatter: numberValueFormatter },
            { headerName: "Balance", width: 120, field: "Balance", dataType: 'Number', filter: 'agNumberColumnFilter', valueFormatter: numberValueFormatter }
        ];


        $scope.gridOptions = {
            angularCompileRows: true,
            // a default column definition with properties that get applied to every column
            defaultColDef: {
                filter: true,
                resizable: true,
                sortable: true,
                rowSelection: true,
                // set every column width
                width: 90
            },
            columnDefs: $scope.columnDefs,
            enableColResize: true,
            rowData: null,
            filter: true,
            enableFilter: true,
            rowSelection: true,
            //rowSelection: 'multiple',
            suppressHorizontalScroll: false,
            alignedGrids: [],
            onGridReady: (params) => {
                document.addEventListener('keydown', keyDownListener);
            },
            onFilterChanged: function (e) {
            },
            getNodeChildDetails: function (beData) {
                var dataColl = [];
                if (beData.IsParent == true) {

                    if (beData.LedgerNarration && beData.LedgerNarration.length > 0)
                        dataColl.push("(" + beData.LedgerNarration + ")");

                    if (beData.CostCenterColl && beData.CostCenterColl.length > 0) {
                        angular.forEach(beData.CostCenterColl, function (data) {
                            data.RowType = 'LedgerAllocation';
                            dataColl.push(data);
                        });
                    }

                    if (beData.ChieldColl && beData.ChieldColl.length > 0) {
                        angular.forEach(beData.ChieldColl, function (data) {
                            data.RowType = 'LedgerAllocation';
                            dataColl.push(data);
                        });
                    }

                    if (beData.InventoryDetailsColl && beData.InventoryDetailsColl.length > 0) {
                        angular.forEach(beData.InventoryDetailsColl, function (data) {
                            data.RowType = 'ItemAllocation';
                            dataColl.push(data);
                        });
                    }

                    if (beData.AccountBillDetailsColl && beData.AccountBillDetailsColl.length > 0) {
                        angular.forEach(beData.AccountBillDetailsColl, function (data) {
                            data.RowType = 'BillDetails';
                            dataColl.push(data);
                        });
                    }

                    if (beData.Narration && beData.Narration.length > 0)
                        dataColl.push("(" + beData.Narration + ")");
                }

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


        function keyDownListener(e) {
            // delete the rows 
            // keyCode 8 is Backspace
            // keyCode 46 is Delete
            if (e.keyCode === 46) {
                var cell = $scope.gridOptions.api.getFocusedCell();
                if (cell) {
                    var rowInd = cell.rowIndex;
                    if (rowInd >= 0) {
                        const sel = $scope.gridOptions.api.getRowNode(rowInd);
                        var selColl = [];
                        selColl.push(sel);
                        $scope.gridOptions.api.updateRowData({ remove: selColl });

                    }
                }

            }
        }
        


    }

    $scope.GetDairyLedgerVoucher = function () {
        var dateFrom = new Date(($filter('date')(new Date(), 'yyyy-MM-dd')));
        var dateTo = new Date(($filter('date')(new Date(), 'yyyy-MM-dd')));

        if ($scope.DairyLedgerVoucher.DateFromDet)
            dateFrom = new Date(($filter('date')($scope.DairyLedgerVoucher.DateFromDet.dateAD, 'yyyy-MM-dd')));

        if ($scope.DairyLedgerVoucher.DateToDet)
            dateTo = new Date(($filter('date')($scope.DairyLedgerVoucher.DateToDet.dateAD, 'yyyy-MM-dd')));

        $scope.DataColl = []; //declare an empty array

        var beData = {
            DateFrom: dateFrom,
            DateTo: dateTo,
            ledgerId: ($scope.DairyLedgerVoucher.LedgerId ? $scope.DairyLedgerVoucher.LedgerId : 0),
            PatientId: $scope.DairyLedgerVoucher.PatientId,
            branchIdColl: $scope.DairyLedgerVoucher.BranchId
        };

        $scope.loadingstatus = 'running';

        $http({
            method: "post",
            url: base_url + "Account/Reporting/GetDairyLedgerVoucher",
            data: JSON.stringify(beData),
            dataType: "json"
        }).then(function (res) {

            if (res && res.data && res.data.IsSuccess) {
                var payload = res.data.Data;
                var rows = Array.isArray(payload) ? payload : (payload && Array.isArray(payload.DataColl) ? payload.DataColl : []);
                $scope.DataColl = rows;
                $scope.gridOptions.api.setRowData($scope.DataColl);
            } else {
                $scope.DataColl = [];
                $scope.gridOptions.api.setRowData($scope.DataColl);
            }

            $scope.loadingstatus = 'stop';
            try { hidePleaseWait(); } catch (e) { }
            try { $scope.gridOptions.api.hideOverlay(); } catch (e) { }

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
                                                        Period: $scope.DairyLedgerVoucher.DateFromDet.dateBS + " TO " + $scope.DairyLedgerVoucher.DateToDet.dateBS,
                                                        ODr: $scope.DairyLedgerVoucher.ODr,
                                                        OCr: $scope.DairyLedgerVoucher.OCr,
                                                        TDr: $scope.DairyLedgerVoucher.TDr,
                                                        TCr: $scope.DairyLedgerVoucher.TCr,
                                                        CDr: $scope.DairyLedgerVoucher.CDr,
                                                        CCr: $scope.DairyLedgerVoucher.CCr,
                                                        Ledger: $scope.DairyLedgerVoucher.LedgerDetails.Name,
                                                        Address: $scope.DairyLedgerVoucher.LedgerDetails.Address
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
                                    Period: $scope.DairyLedgerVoucher.DateFromDet.dateBS + " TO " + $scope.DairyLedgerVoucher.DateToDet.dateBS,
                                    ODr: $scope.DairyLedgerVoucher.ODr,
                                    OCr: $scope.DairyLedgerVoucher.OCr,
                                    TDr: $scope.DairyLedgerVoucher.TDr,
                                    TCr: $scope.DairyLedgerVoucher.TCr,
                                    CDr: $scope.DairyLedgerVoucher.CDr,
                                    CCr: $scope.DairyLedgerVoucher.CCr,
                                    Ledger: $scope.DairyLedgerVoucher.LedgerDetails.Name,
                                    Address: $scope.DairyLedgerVoucher.LedgerDetails.Address
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

     

});