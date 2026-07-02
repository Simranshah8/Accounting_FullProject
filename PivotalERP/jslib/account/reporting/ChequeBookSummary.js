"use strict";

agGrid.initialiseAgGridWithAngular1(angular);

app.controller("ChequeBookSummaryController", function ($scope, $http, $filter, $timeout, GlobalServices, $compile) {
 var PrintPreviewAs = 1;
  const contextMenu = GlobalServices.createElementForMenu();
    LoadData();

    $scope.onBtExportCSV = function () {
        var params = {
            fileName: 'ChequeBookSummary.csv',


            sheetName: 'ChequeBookSummary'
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
		
        //agGrid.initialiseAgGridWithAngular1(angular);
        $scope.VoucherTypeList = [];
        $http({
            method: 'GET',
            url: base_url + "Account/Reporting/GetAllVoucher",
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
        //$scope.CostCategoriesList = [];
        //$http({
        //    method: 'GET',
        //    url: base_url + "Account/Reporting/GetAllCostCategoriesList",
        //    dataType: "json",
        //}).then(function (res) {
        //    if (res.data.IsSuccess && res.data.Data) {
        //        $scope.CostCategoriesList = res.data.Data;
        //    }
        //}, function (reason) {
        //    Swal.fire('Failed' + reason);
        //});

      ///  Search Drop DownList
        $scope.VoucherSearchOptions = [
            { text: 'Date(A.D)', value: 'VoucherDate', dataType: 'Date' },
            { text: 'Date(B.S)', value: 'VoucherDateBS', dataType: 'Date' },
            { text: 'Ledger', value: 'LedgerName', dataType: 'Text' },
            { text: 'ChequeNo', value: 'ChequeNo', dataType: 'number' },
            { text: 'ChequeDate', value: 'ChequeDate', dataType: 'date' },
            { text: 'Remarks', value: 'Remarks', dataType: 'Text' },
            { text: 'VoucherType', value: 'VoucherType', dataType: 'Text' },
            { text: 'Voucher', value: 'VoucherName', dataType: 'Text' },
            { text: 'VoucherNo', value: 'AutoVoucherNo', dataType: 'Number' },
            { text: 'Debit Amount', value: 'DrAmount', dataType: 'Number' },
            { text: 'Credit Amount', value: 'CrAmount', dataType: 'Number' },
            { text: 'CostCenter Name', value: 'CostCenterName', dataType: 'text' },
            { text: 'UDF1', value: 'UDF1', dataType: 'text' },
        ];


        //Filter Dialog Box Details 
        $scope.BranchTypeColl = [];
        $scope.VoucherTypeColl = [];
        $scope.LedgerGroupTypeColl = [];
        $scope.ExpressionColl = GlobalServices.getExpression();
        $scope.ConditionColl = GlobalServices.getLogicCondition();
        $scope.FilterColumnColl = [{ text: 'DebitAmount', value: 'DrAmount', dataType: 'Number' },
        { text: 'Credit Amount', value: 'CrAmount', dataType: 'Number' },
        { text: 'Voucher No', value: 'AutoVoucherNo', dataType: 'Number' },
        { text: 'CostClass Name', value: 'CostCenterName', dataType: 'Number' },
        { text: 'Narration', value: 'Narration', dataType: 'text' },
        { text: 'NDay', value: 'Day', dataType: 'text' },
        { text: 'NMonth', value: 'Month', dataType: 'text' },
        { text: 'NYear', value: 'Year', dataType: 'Number' },
        { text: 'Particulars', value: 'LedgerName', dataType: 'text' },
        { text: 'RefNo', value: 'RefNo', dataType: 'Number' },
        { text: 'User Name', value: 'UserName', dataType: 'text' },
        { text: 'Voucher Name', value: 'VoucherName', dataType: 'text' },
        ];


        //For user list branchList Ledgerlist in filter
        $scope.LedgerList = [];
        $http({
            method: 'GET',
            url: base_url + "Inventory/Reporting/GetAllLedgerList",
            dataType: "json",
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.LedgerList = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $scope.VoucherList = [];
        $http({
            method: 'GET',
            url: base_url + "Inventory/Reporting/GetAllVoucherList",
            dataType: "json",
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.VoucherList = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
        $scope.BranchList = [];
        $http({
            method: 'GET',
            url: base_url + "Setup/Security/GetAllBranchList",
            dataType: "json",
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.BranchList = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
        $scope.UserList = [];
        $http({
            method: 'GET',
            url: base_url + "Setup/Security/GetAllUserList",
            dataType: "json",
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.UserList = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });



        ///////----------End of Filter----------/////////////


        $scope.ChequeBookSummary = {
            LedgerId:null,
            DateFrom_TMP: new Date(),
            DateTo_TMP: new Date(),
            
            VoucherIdColl:"",
            BranchIdColl:"",
        

        };
        $scope.OpeningAmt = 0;
        $scope.CurrentAmt = 0;
        $scope.TotalAmt = 0;
        $scope.ReportName = '';
        $scope.noofdecimal = 2;

        $scope.loadingstatus = "stop";

        var columnDefs = [
            { headerName: "Date(A.D)", width: 250, field: "VoucherDate",cellStyle:{'text-align':'center'} },
            { headerName: "Date(B.S)", width: 250, field: "VoucherDateBS",cellStyle:{'text-align':'center'} },
            { headerName: "Ledger", width: 250, field: "LedgerName",cellStyle:{'text-align':'left'} },
            { headerName: "ChequeNo", width: 250, field: "ChequeNo",cellStyle:{'text-align':'center'} },
            { headerName: "Cheque Date", width: 250, field: "ChequeDate",cellStyle:{'text-align':'center'} },
            { headerName: "Remarks", width: 250, field: "Remarks",cellStyle:{'text-align':'left'} },
            { headerName: "Voucher Type", width: 250, field: "VoucherType",cellStyle:{'text-align':'left'}, },
            { headerName: "Voucher", width: 250, field: "VoucherName",cellStyle:{'text-align':'left'} },
            { headerName: "VoucherNo", width: 250, field: "AutoVoucherNo",cellStyle:{'text-align':'center'} },
            { headerName: "Debit Amount", width: 250, field: "DrAmount",cellStyle:{'text-align':'center'} },
            { headerName: "Credit Amount", width: 250, field: "CrAmount",cellStyle:{'text-align':'center'} },
            { headerName: "Cost Center", width: 250, field: "CostCenterName",cellStyle:{'text-align':'left'} },
            { headerName: "UDF1", width: 250, field: "UDF1",cellStyle:{'text-align':'left'} },
            {
                headerName: "Action", width: 250, cellRenderer:
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
            columnDefs: columnDefs,
            rowData: null,
            filter: true,
            suppressHorizontalScroll: true,
            alignedGrids: [],
            enableFilter: true,

            onFilterChanged: function () {

                var Opening = 0;
                $scope.gridOptions.api.forEachNodeAfterFilterAndSort(function (node) {
                    if (node.data.DrAmount == 1 || node.data.DrAmount == 'DR')
                        Opening += node.data.DrAmount;
                    else
                        Opening -= node.data.DrAmount;
                });

                var drcr = '';
                if (Opening > 0)
                    drcr = 'DR';
                else if (Opening < 0)
                    drcr = 'CR'

                Opening = Math.abs(Opening);

                $scope.dataForBottomGrid[0].DrAmount = Opening;
                $scope.dataForBottomGrid[0].CrAmount = drcr;
                $scope.gridOptionsBottom.api.setRowData($scope.dataForBottomGrid);
            }

        };
        $scope.eGridDiv = document.querySelector('#datatable');

        // create the grid passing in the div to use together with the columns & data we want to use
        new agGrid.Grid($scope.eGridDiv, $scope.gridOptions);

        $scope.dataForBottomGrid = [
            {
                AutoNumber: '',
                LedgerName: 'Total =>',
                DrAmount: 0,
                CrAmount: '',
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
                        $scope.GetChequeBookSummary();
                    } else {
                        Swal.fire(res.data.ResponseMSG);
                    }

                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }
        });

    }
    $scope.GetChequeBookSummary = function () {

        var dateFrom = new Date(($filter('date')(new Date(), 'yyyy-MM-dd')));
        var dateTo = new Date(($filter('date')(new Date(), 'yyyy-MM-dd')));

        if ($scope.ChequeBookSummary.DateFromDet)
            dateFrom = new Date(($filter('date')($scope.ChequeBookSummary.DateFromDet.dateAD, 'yyyy-MM-dd')));

        if ($scope.ChequeBookSummary.DateToDet)
            dateTo = new Date(($filter('date')($scope.ChequeBookSummary.DateToDet.dateAD, 'yyyy-MM-dd')));

        $scope.DataColl = []; //declare an empty array
        $scope.gridOptions.api.setRowData($scope.DataColl);

        var beData = {
            LedgerId: $scope.ChequeBookSummary.LedgerId,
            DateFrom: dateFrom,
            DateTo: dateTo,
           
            VoucherIdColl: $scope.ChequeBookSummary.VoucherIdColl,
            BranchIdColl: $scope.ChequeBookSummary.BranchIdColl,
            
        };


        $scope.loadingstatus = 'running';

        $http({
            method: "POST",
            url: base_url + "Account/Reporting/GetAllChequeBookSummary",
            data: JSON.stringify(beData),
            dataType: "json"
        }).then(function (res) {

            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                $scope.DataColl = res.data.Data;

                var Opening = 0;
                angular.forEach($scope.DataColl, function (dc) {
                    if (dc.DrAmount == 1 || dc.DrAmount == 'DR')
                        Opening += dc.DrAmount;
                    else
                        Opening -= dc.DrAmount;
                });

                var drcr = '';
                if (Opening > 0)
                    drcr = '';
                else if (Opening < 0)
                    drcr = ''

                Opening = Math.abs(Opening);


                $scope.dataForBottomGrid[0].DrAmount = Opening;
                $scope.dataForBottomGrid[0].CrAmount = drcr;
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
            url: base_url + "Account/Reporting/PostPendingVoucher",
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
                            title: 'Report  For Print',
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
                                                url: base_url + "Account/Reporting/PrintDayBook",
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
                            url: base_url + "Account/Reporting/PrintDayBook",
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
            var dayBook = node.data;
            var beData = {};

            beData.VoucherName = dayBook.VoucherName;
            beData.VoucherType = dayBook.VoucherType;
            beData.AutoManualNo = dayBook.AutoManualNo;
            beData.AutoVoucherNo = dayBook.AutoVoucherNo;
            beData.CanUpdateDocument = dayBook.CanUpdateDocument;
            beData.CostClassName = dayBook.CostClassName;
            beData.IsInventory = dayBook.IsInventory;
            beData.IsParent = true;
            beData.Narration = dayBook.Narration;
            beData.ND = dayBook.ND;
            beData.NM = dayBook.NM;
            beData.NY = dayBook.NY;
            beData.RefNo = dayBook.RefNo;
            beData.VoucherDate = dayBook.VoucherDate;
            //beData.VoucherDateStr = GlobalFunction.GetDateStr(beData.VoucherDate, Dynamic.Windows.Forms.Windows.Forms.SDDatePicker.BaseDate.EnglishDate);
            beData.VoucherDateStrNP = DateFormatBS(beData.NY, beData.NM, beData.ND);
            beData.CreatedByName = dayBook.CreatedByName;

            if (beData.IsInventory == true) {
                beData.Particulars = dayBook.PartyLedger;
                beData.DrAmount = dayBook.DrAmount;
                beData.CrAmount = dayBook.CrAmount;
                filterData.push(beData);

                var ledData = {};
                ledData.Particulars = "  " + dayBook.Particulars;

                if (dayBook.DrAmount != 0)
                    ledData.CrAmount = dayBook.DrAmount - mx(dayBook.AditionalCostColl).Sum(p1 => p1.Amount);
                else
                    ledData.DrAmount = dayBook.CrAmount - mx(dayBook.AditionalCostColl).Sum(p1 => p1.Amount);

                filterData.push(ledData);

                angular.forEach(dayBook.AditionalCostColl, function (add) {

                    var addData = {};
                    addData.Particulars = "  " + add.LedgerName;
                    if (dayBook.DrAmount != 0) {
                        addData.CrAmount = add.Amount;
                    }
                    else {
                        addData.DrAmount = add.Amount;
                    }
                    filterData.push(addData);
                });


                angular.forEach(dayBook.ItemAllocationColl, function (item) {

                    var itemData = {};
                    itemData.Particulars = "    " + item.ProductName + " ( " + item.BilledQty + item.UnitName + " @ " + item.Rate + " = " + item.Amount + " )";
                    filterData.push(itemData);

                });

            } else {
                var firstTime = true;
                angular.forEach(dayBook.LedgerAllocationColl, function (ledAll) {
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
                down_file(base_url + "//" + res.data.Data.ResponseId, "ChequeBookSummary.xlsx");
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
