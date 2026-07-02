"use strict";

agGrid.initialiseAgGridWithAngular1(angular);

app.controller("PartyWiseDuesBillListCTRL", function ($scope, $http, $filter, $timeout, GlobalServices, $compile) {
    var PrintPreviewAs = 1;
    const contextMenu = GlobalServices.createElementForMenu();
    LoadData();

    $scope.onBtExportCSV = function () {
        var params = {
            fileName: 'PartyWiseDuesBillList.csv',
            sheetName: 'PartyWiseDuesBillList'
        };

        $scope.gridOptions.api.exportDataAsCsv(params);
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

        $scope.DebtorTypeList = [];
        $http({
            method: 'GET',
            url: base_url + "Account/Creation/GetAllDebtorTypeList",
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.DebtorTypeList = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $scope.RouteList = [];
        $http({
            method: 'GET',
            url: base_url + "Account/Creation/GetAllDebtorRouteList",
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.RouteList = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });


        $scope.LedgerGroupList = [];
        $scope.LedgerGroupList_Qry = [];
        $http({
            method: 'GET',
            url: base_url + "Account/Creation/GetDebtorCreditGroup",
            dataType: "json"
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.LedgerGroupList = res.data.Data;
                $scope.LedgerGroupList_Qry = mx(res.data.Data);
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
                    $scope.PartyWiseDuesBillList.DateFrom_TMP = new Date(comDet.StartDate);
                }
            }, function (errormessage) {
                alert('Unable to Delete data. pls try again.' + errormessage.responseText);
            });
        });

        $scope.PartyWiseDuesBillList = {

            DateFrom_TMP: new Date(),
            DateTo_TMP: new Date(),
            LedgerGroupId: null,
            SalesLedgerId: null,
            ledgerIdColl: ''
        };


        $scope.loadingstatus = "stop";

        var columnDefs = [

            { headerName: "Party", width: 260, field: "Name", cellStyle: { 'text-align': 'left' }, pinned: 'left', cellRenderer: 'agGroupCellRenderer', },
            { headerName: "Code", width: 120, field: "Code", },
            { headerName: "MobileNo", width: 120, field: "MobileNo", cellStyle: { 'text-align': 'right' } },
            { headerName: "SalesMan", width: 120, field: "SalesMan", cellStyle: { 'text-align': 'right' } },
            { headerName: "EmailId", width: 120, field: "EmailId", cellStyle: { 'text-align': 'left' } },
            { headerName: "PanVat", width: 120, field: "PAN", cellStyle: { 'text-align': 'right' } },
            { headerName: "InvoiceNo", width: 120, field: "InvoiceNo", cellStyle: { 'text-align': 'center' } },
            { headerName: "Ref. No.", width: 120, field: "RefNo", cellStyle: { 'text-align': 'center' } },
            { headerName: "Invoice Miti", width: 150, field: "VoucherDateBS", cellStyle: { 'text-align': 'center' } },
            { headerName: "Entry Miti", width: 150, field: "EntryMiti", cellStyle: { 'text-align': 'center' } },
            { headerName: "Amount", width: 150, field: "Amount", cellStyle: { 'text-align': 'right' }, valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "TotalDays", width: 130, field: "Days", cellStyle: { 'text-align': 'center' } },
            { headerName: "Opening", width: 180, field: "Opening", cellStyle: { 'text-align': 'right' }, valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "DrAmount", width: 180, field: "DrAmount", cellStyle: { 'text-align': 'right' }, valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "CrAmount", width: 180, field: "CrAmount", cellStyle: { 'text-align': 'right' }, valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "Closing", width: 180, field: "Closing", cellStyle: { 'text-align': 'right' }, valueFormatter: function (params) { return Numberformat(params.value); }, },

            { headerName: "CR Days", width: 125, field: "CrDays", cellStyle: { 'text-align': 'right' } },
            { headerName: "BG Amt.", width: 125, field: "BGAmt", cellStyle: { 'text-align': 'right' }, valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "CD Rate", width: 125, field: "CDRate", cellStyle: { 'text-align': 'right' }, valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "PDC Amt.", width: 125, field: "PDCAmt", cellStyle: { 'text-align': 'right' }, valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "ODC Amt.", width: 125, field: "ODCAmt", cellStyle: { 'text-align': 'right' }, valueFormatter: function (params) { return Numberformat(params.value); }, },

            { headerName: "Branch", width: 180, field: "Branch", cellStyle: { 'text-align': 'left' } },
            { headerName: "Post", width: 180, field: "Post", cellStyle: { 'text-align': 'left' } },
            { headerName: "Address", width: 120, field: "Address", cellStyle: { 'text-align': 'left' } },
            { headerName: "Group", width: 120, field: "GroupName", cellStyle: { 'text-align': 'left' } },
            { headerName: "Route", width: 120, field: "DebtorRoute", cellStyle: { 'text-align': 'left' } },
            { headerName: "Type", width: 120, field: "DebtorType", cellStyle: { 'text-align': 'left' } },
        ];


        $scope.gridOptions = {
            onCellContextMenu: onCellContextMenu, // Handle right-click event			
            angularCompileRows: true,
            defaultColDef: {
                filter: true,
                resizable: true,
                sortable: true,
                width: 100,


            },
            suppressHorizontalScroll: true,
            alignedGrids: [],
            enableSorting: true,
            multiSortKey: 'ctrl',
            enableColResize: true,
            overlayLoadingTemplate: "Please Click the Load Bottom to display the data",
            overlayNoRowsTemplate: "No Records found",
            rowSelection: 'multiple',
            columnDefs: columnDefs,
            rowData: null,
            filter: true,
            enableFilter: true,
            onFilterChanged: function (e) {
                //console.log('onFilterChanged', e);

                var dt = {
                    Name: "TOTAL =>",
                    Opening: 0,
                    DrAmount: 0,
                    CrAmount: 0,
                    Closing: 0,
                    Amount: 0,

                };

                $scope.gridOptions.api.forEachNodeAfterFilterAndSort(function (node) {
                    var dc = node.data;
                    if (dc.DrAmount != 0 || dc.CrAmount != 0) {
                        dt.DrAmount += isEmptyAmt(dc.DrAmount);
                        dt.CrAmount += isEmptyAmt(dc.CrAmount);
                        dt.Amount += isEmptyAmt(dc.Amount);
                        dt.Opening += isEmptyAmt(dc.Opening);
                        dt.Closing += isEmptyAmt(dc.Closing);
                    }

                });
                var filterDataColl = [];
                filterDataColl.push(dt);

                $scope.gridOptionsBottom.api.setRowData(filterDataColl);

            },
            getNodeChildDetails: function (beData) {
                var dataColl = [];
                if (beData.ChieldColl && beData.ChieldColl.length > 0) {
                    angular.forEach(beData.ChieldColl, function (cc) {
                        dataColl.push(cc);
                    });
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

        $scope.dataForBottomGrid = [
            {
                Name: 'Total =>',
                Opening: 0,
                DrAmount: 0,
                CrAmount: 0,
                Closing: 0,
                Amount: 0,
            }];

        $scope.gridOptionsBottom = {
            defaultColDef: {
                resizable: true,
                width: 90
            },
            columnDefs: columnDefs,
            // we are hard coding the data here, it's just for demo purposes
            rowData: $scope.dataForBottomGrid,
            // debug: true,
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

    $scope.GetGroupWiseDuesBillList = function () {
        var data = [];
        $scope.gridOptions.api.setRowData(data);

        var dateFrom = new Date(($filter('date')(new Date(), 'yyyy-MM-dd')));
        var dateTo = new Date(($filter('date')(new Date(), 'yyyy-MM-dd')));

        if ($scope.PartyWiseDuesBillList.DateFromDet)
            dateFrom = new Date(($filter('date')($scope.PartyWiseDuesBillList.DateFromDet.dateAD, 'yyyy-MM-dd')));

        if ($scope.PartyWiseDuesBillList.DateToDet)
            dateTo = new Date(($filter('date')($scope.PartyWiseDuesBillList.DateToDet.dateAD, 'yyyy-MM-dd')));


        var para = {
            dateFrom: dateFrom,
            dateTo: dateTo,
            LedgerGroupId: ($scope.PartyWiseDuesBillList.LedgerGroup ? $scope.PartyWiseDuesBillList.LedgerGroup.LedgerGroupId : 12),
            ledgerIdColl: ($scope.PartyWiseDuesBillList.LedgerId ? $scope.PartyWiseDuesBillList.LedgerId : ''),
            isCreditor: ($scope.PartyWiseDuesBillList.LedgerGroup ? !$scope.PartyWiseDuesBillList.LedgerGroup.IsDebtor : false),
            branchIdColl: $scope.PartyWiseDuesBillList.BranchId ? $scope.PartyWiseDuesBillList.BranchId.toString() : '',
            DebtorTypeId: $scope.PartyWiseDuesBillList.DebtorTypeId,
            DebtorRouteId: $scope.PartyWiseDuesBillList.DebtorRouteId
        };


        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: "POST",
            url: base_url + "Account/Reporting/GetPartyWiseDuesBillList",
            data: JSON.stringify(para),
            dataType: "json"
        }).then(function (res) {

            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                var DataColl = res.data.Data;

                var dt = {
                    Name: "TOTAL =>",
                    DrAmount: 0,
                    CrAmount: 0,
                    Amount: 0,
                    Opening: 0,
                    Closing: 0,
                };
                angular.forEach(DataColl, function (dc) {
                    dt.DrAmount += dc.DrAmount;
                    dt.CrAmount += dc.CrAmount;
                    dt.Amount += dc.Amount;
                    dt.Opening += isEmptyAmt(dc.Opening);
                    dt.Closing += isEmptyAmt(dc.Closing);
                });
                var filterDataColl = [];
                filterDataColl.push(dt);

                $scope.gridOptionsBottom.api.setRowData(filterDataColl);

                $scope.gridOptions.api.setRowData(DataColl);
            } else
                alert(res.data.ResponseMSG);

        }, function (reason) {
            $scope.loadingstatus = "stop";
            alert('Failed' + reason);
        });
    }

    $scope.GetPartyWiseDuesBillList = function () {

        var data = [];
        $scope.gridOptions.api.setRowData(data);

        if (!$scope.PartyWiseDuesBillList.LedgerId)
            return;

        var dateFrom = new Date(($filter('date')(new Date(), 'yyyy-MM-dd')));
        var dateTo = new Date(($filter('date')(new Date(), 'yyyy-MM-dd')));

        if ($scope.PartyWiseDuesBillList.DateFromDet)
            dateFrom = $filter('date')($scope.PartyWiseDuesBillList.DateFromDet.dateAD, 'yyyy-MM-dd');

        if ($scope.PartyWiseDuesBillList.DateToDet)
            dateTo = $filter('date')($scope.PartyWiseDuesBillList.DateToDet.dateAD, 'yyyy-MM-dd');

        var findGroup = mx($scope.LedgerGroupList_Qry).firstOrDefault(p1 => p1.LedgerGroupId == $scope.PartyWiseDuesBillList.LedgerDetails.GroupId);

        var para = {
            dateFrom: dateFrom,
            dateTo: dateTo,
            LedgerGroupId: $scope.PartyWiseDuesBillList.LedgerDetails.GroupId,
            ledgerIdColl: ($scope.PartyWiseDuesBillList.LedgerId ? $scope.PartyWiseDuesBillList.LedgerId : ''),
            isCreditor: (findGroup ? !findGroup.IsDebtor : false),
            branchIdColl: ($scope.PartyWiseDuesBillList.BranchId > 0 ? $scope.PartyWiseDuesBillList.BranchId : '')
        };


        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: "post",
            url: base_url + "Account/Reporting/GetPartyWiseDuesBillList",
            data: JSON.stringify(para),
            dataType: "json"
        }).then(function (res) {

            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                var DataColl = res.data.Data;

                var dt = {
                    Name: "TOTAL =>",
                    DrAmount: 0,
                    CrAmount: 0,
                    Amount: 0,
                    Opening: 0,
                    Closing: 0,
                };
                angular.forEach(DataColl, function (dc) {
                    dt.DrAmount += dc.DrAmount;
                    dt.CrAmount += dc.CrAmount;
                    dt.Amount += dc.Amount;
                    dt.Opening += isEmptyAmt(dc.Opening);
                    dt.Closing += isEmptyAmt(dc.Closing);
                });
                var filterDataColl = [];
                filterDataColl.push(dt);

                $scope.gridOptionsBottom.api.setRowData(filterDataColl);

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
                                                        Period: $scope.PartyWiseDuesBillList.DateFromDet.dateBS + " TO " + $scope.PartyWiseDuesBillList.DateToDet.dateBS,
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
                                    Period: $scope.PartyWiseDuesBillList.DateFromDet.dateBS + " TO " + $scope.PartyWiseDuesBillList.DateToDet.dateBS,
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
        });


        var ledgerIdColl = [];
        var filterData = [];

        $scope.gridOptions.api.forEachNodeAfterFilterAndSort(function (node) {
            var beData = node.data;
            if (!beData.VoucherData) {
                if (beData.ChieldColl) {
                    beData.ChieldColl.forEach(function (v) {

                        var nBeData = {
                            LedgerId: beData.LedgerId,
                            Name: beData.Name,
                            Address: beData.Address,
                            Alias: beData.Alias,
                            Area: beData.Area,
                            Code: beData.Code,
                            GroupName: beData.GroupName,
                            SalesMan: beData.SalesMan,
                            InvoiceNo: v.InvoiceNo,
                            VoucherDate: v.VoucherDate,
                            VoucherDateBS: v.VoucherDateBS,
                            Days: v.Days,
                            Amount: v.Amount,
                            ParentGroupName: beData.ParentGroupName,
                            MobileNo: beData.MobileNo,
                            EmailId: beData.EmailId,
                            Branch: v.Branch,
                            Opening: beData.Opening,
                            DrAmount: beData.DrAmount,
                            CrAmount: beData.CrAmount,
                            InvoiceAmount: v.InvoiceAmount,
                            PAN: beData.PAN,
                            POST: beData.POST,
                            Closing: 0,
                            Branch: beData.Branch,
                            VoucherName: beData.VoucherName,
                            CrLimitAmt: beData.CrLimitAmt,
                            CrDays: beData.CrDays,
                            BGAmt: beData.BGAmt,
                            CDRate: beData.CDRate,
                            PDCAmt: beData.PDCAmt,
                            ODCAmt: beData.ODCAmt,
                            AutoVoucherNo: beData.AutoVoucherNo,
                            VoucherType: beData.VoucherType,
                            DueDate: v.DueDate,
                            DueMiti:v.DueMiti
                        };

                        if (mx(ledgerIdColl).contains(beData.LedgerId) == false) {
                            ledgerIdColl.push(beData.LedgerId);
                            nBeData.Closing = beData.Closing;
                        }

                        filterData.push(nBeData);
                    });
                }
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
            Period: $('#dtDateFrom').val() + ' To ' + $('#dtDateTo').val()
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
                down_file(base_url + "//" + res.data.Data.ResponseId, "DuesBill.xlsx");
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

    //Added by suresh on 29 shrawan

    $scope.ExpandData = function () {
        $scope.gridOptions.api.expandAll();
    }
    $scope.CollapseData = function () {
        $scope.gridOptions.api.collapseAll();
    }

    $scope.toggleExpandCollapse = function () {
        if ($scope.PartyWiseDuesBillList.ExpandCollapse == true) {
            $scope.gridOptions.api.expandAll();
        } else {
            $scope.gridOptions.api.collapseAll();
        }
    };

});
