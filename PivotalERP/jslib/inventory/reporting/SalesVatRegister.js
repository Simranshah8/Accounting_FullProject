"use strict";

agGrid.initialiseAgGridWithAngular1(angular);

app.controller("SalesVatRegister", function ($scope, $http, $filter, $timeout, GlobalServices, $compile) {

  var PrintPreviewAs = 1;
    const contextMenu = GlobalServices.createElementForMenu();
    LoadData();

    $scope.onBtExportCSV = function () {
        var params = {
            fileName: 'SalesVatRegister.csv',
            sheetName: 'SalesVatRegister'
        };

        $scope.gridOptions.api.exportDataAsCsv(params);
    }

    function LoadData() {
        $('.select2').select2()
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

        //Search Drop DownList
        $scope.VoucherSearchOptions = [{ text: 'VoucherDate', value: 'VoucherDate', dataType: 'date' },
            { text: 'Date(B.S)', value: 'VoucherDateStr', dataType: 'date' },
            { text: 'Voucher No', value: 'Voucher No', dataType: 'Number' },
            { text: 'Voucher', value: 'Voucher', dataType: 'Text' },
            { text: 'Party Name', value: 'PartyName', dataType: 'text' },
            { text: 'Party Group', value: 'PartyGroup', dataType: 'text' },
            { text: 'Party Cost Center', value: 'PartyCostCenter', dataType: 'text' },
            { text: 'Ref.No.', value: 'RefNo', dataType: 'Number' },
            { text: 'Ref.V.No.', value: 'OtherReferences', dataType: 'Number' },
            { text: 'Address', value: 'Address', dataType: 'text' },
            { text: 'PanVatNo', value: 'PanVatNo', dataType: 'Number' },
            { text: 'Sales Ledger', value: 'SalesLedger', dataType: 'text' },
            { text: 'Sales Cost Center', value: 'SalesLedgerGroup', dataType: 'text' },
            { text: 'Total Sales', value: 'TotalSales', dataType: 'Number' },
            { text: 'Discount Amt', value: 'InAmt', dataType: 'Number' },
            { text: 'Net Sales Qty', value: 'Discount', dataType: 'Number' },
            { text: 'TaxableValue', value: 'TaxableValue', dataType: 'number' },
            { text: 'Vat', value: 'Vat', dataType: 'Number' },
            { text: 'Additional Amt', value: 'AdditionalCharge', dataType: 'Number' },
            { text: 'TotalValue', value: 'TotalValue', dataType: 'Number' },
            { text: 'Entry Date', value: 'EntryDateStr', dataType: 'date' },
            { text: 'Current Total', value: 'CurrentClosing', dataType: 'number' },
            { text: 'SalesMan', value: 'SalesMan', dataType: 'text' },
        { text: 'Qty.', value: 'Qty', dataType: 'number' },
        { text: 'LineValue', value: 'LineValue', dataType: 'number' },
        { text: 'No. of Line', value: 'NoOfline', dataType: 'number' },
        { text: 'FReight', value: 'Freight', dataType: 'number' },
        { text: 'Excise Duty', value: 'ExDuty', dataType: 'number' },
        { text: 'Insurance', value: 'Insurance', dataType: 'number' },
        { text: 'Scheme', value: 'Schame', dataType: 'number' },
        { text: 'Contact No.', value: 'ContactNo', dataType: 'text' },
        ];

        //Filter Dialog Box Details 
        $scope.BranchTypeColl = [];
        $scope.VoucherTypeColl = [];
        $scope.LedgerGroupTypeColl = [];
        $scope.ExpressionColl = GlobalServices.getExpression();
        $scope.ConditionColl = GlobalServices.getLogicCondition();
        $scope.FilterColumnColl = [{ text: 'Discount', value: 'Discount', dataType: 'Number' },
        { text: 'ExDuty', value: 'ExDuty', dataType: 'Number' },
        { text: 'Frieght', value: 'Freight', dataType: 'Number' },
        { text: 'Import Tax', value: 'ImportTax', dataType: 'Number' },
        { text: 'Import Value', value: 'ImportValue', dataType: 'Number' },
        { text: 'Vat', value: 'Vat', dataType: 'Number' },
        { text: 'TotalValue', value: 'TotalValue', dataType: 'Number' },
        { text: 'TotalSales', value: 'TotalSales', dataType: 'Number' },
        { text: 'TaxableValue', value: 'TaxableValue', dataType: 'Number' },
        { text: 'Schame', value: 'Schame', dataType: 'Number' },
        { text: 'AdditionalCharge', value: 'AdditionalCharge', dataType: 'Number' },
        { text: 'Address', value: 'Address', dataType: 'text' },
        { text: 'Buyer', value: 'Buyer', dataType: 'text' },
        { text: 'InvoiceNo', value: 'InvoiceNo', dataType: 'number' },
        { text: 'PanVAtNo', value: 'PanVatNo', dataType: 'number' },
        { text: 'PartyName', value: 'PartyName', dataType: 'text' },
        { text: 'VoucherName', value: 'VoucherName', dataType: 'text' },
            { text: 'Branch', value: 'Branch', dataType: 'text' }, 
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


        $scope.SalesVatRegister = {
            DateFrom_TMP: new Date(),
            DateTo_TMP: new Date(),
            VoucherId: 0,
            IsPost: true,
            BranchId: 0
        };
        $scope.OpeningAmt = 0;
        $scope.CurrentAmt = 0;
        $scope.TotalAmt = 0;
        $scope.ReportName = '';
        $scope.noofdecimal = 2;

        $scope.loadingstatus = "stop";

        var columnDefs = [

            { headerName: "Voucher Date", width: 250, field: "VoucherDate", cellStyle: { 'text-align': 'center' } },
            { headerName: "Date(B.S)", width: 250, field: "NPVoucherDate", cellStyle: { 'text-align': 'center' } },
            { headerName: "VoucherNo", width: 250, field: "VoucherNo", cellStyle: { 'text-align': 'right' } },
            { headerName: "Voucher", width: 250, field: "VoucherType", cellStyle: { 'text-align': 'left' } },
            { headerName: "PartyName", width: 250, field: "PartyName", cellStyle: { 'text-align': 'left' } },
            { headerName: "PartyGroup", width: 250, field: "PartyGroup", cellStyle: { 'text-align': 'left' } },
            { headerName: "Party CostCenter", width: 250, field: "PartyCostCenter", cellStyle: { 'text-align': 'center' } },
            { headerName: "Ref No.", width: 250, field: "RefNo", cellStyle: { 'text-align': 'center' } },
            { headerName: "Ref.V.No.", width: 250, field: "OtherReferences", cellStyle: { 'text-align': 'center' } },
            { headerName: "Address", width: 250, field: "Address", cellStyle: { 'text-align': 'left' } },
            { headerName: "PanVatNo", width: 250, field: "PanVatNo", cellStyle: { 'text-align': 'right' } },
            { headerName: "Sales Ledger", width: 250, field: "SalesLedger", cellStyle: { 'text-align': 'left' } },
            { headerName: "Sales CostCenter", width: 250, field: "SalesLedgerGroup", cellStyle: { 'text-align': 'left' } },
            { headerName: "Total Sales", width: 250, field: "TotalSales", cellStyle: { 'text-align': 'right' } },
            { headerName: "Discount AMount", width: 250, field: "Discount", cellStyle: { 'text-align': 'right' } },
            { headerName: "Taxable Value", width: 250, field: "TaxableValue", cellStyle: { 'text-align': 'right' } },
            { headerName: "Vat", width: 250, field: "Vat", cellStyle: { 'text-align': 'right' } },
            { headerName: "Additional Amt", width: 250, field: "AdditionalCharge", cellStyle: { 'text-align': 'right' } },
            { headerName: "Total Value", width: 250, field: "TotalValue", cellStyle: { 'text-align': 'right' } },
            { headerName: "Entry Date", width: 250, field: "EntryDateStr", cellStyle: { 'text-align': 'center' } },
            { headerName: "Current Total", width: 250, field: "CurrentClosing", cellStyle: { 'text-align': 'right' } },

            { headerName: "SalesMan", width: 250, field: "SalesMan", cellStyle: { 'text-align': 'left' } },
            { headerName: "No.Of.Line", width: 250, field: "NoOfline", cellStyle: { 'text-align': 'center' } },
            { headerName: "Branch", width: 250, field: "Branch", cellStyle: { 'text-align': 'left' } },
            { headerName: "Voucher Type", width: 150, field: "VoucherType", cellStyle: { 'text-align': 'left' } },
            { headerName: "Voucher Name", width: 150, field: "VoucherName", cellStyle: { 'text-align': 'left' } },

            { headerName: "Ref.No.", width: 150, field: "RefNo", cellStyle: { 'text-align': 'left' } },
            { headerName: "Narration", width: 150, field: "Narration", cellStyle: { 'text-align': 'left' } },            
            { headerName: "VehicleNo", width: 150, field: "VehicleNo", cellStyle: { 'text-align': 'left' } },
            { headerName: "UDF", width: 150, field: "UDFKeyVal", cellStyle: { 'text-align': 'left' } },



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
                    if (node.data.TotalValue == 1 || node.data.TotalValue == 'DR')
                        Opening += node.data.TotalValue;
                    else
                        Opening -= node.data.TotalValue;
                });

                var drcr = '';
                if (Opening > 0)
                    drcr = 'DR';
                else if (Opening < 0)
                    drcr = 'CR'

                Opening = Math.abs(Opening);

                $scope.dataForBottomGrid[0].TotalValue = Opening;
                $scope.dataForBottomGrid[0].Rate = drcr;
                $scope.gridOptionsBottom.api.setRowData($scope.dataForBottomGrid);
            }

        };
        $scope.eGridDiv = document.querySelector('#datatable');

        // create the grid passing in the div to use together with the columns & data we want to use
        new agGrid.Grid($scope.eGridDiv, $scope.gridOptions);

        $scope.dataForBottomGrid = [
            {
                AutoNumber: '',
                VoucherType: 'Total =>',
                TotalValue: 0,
                Rate: '',
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
                        $scope.SalesVatRegister();
                    } else {
                        Swal.fire(res.data.ResponseMSG);
                    }

                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }
        });

    }
    $scope.GetSalesVatRegister = function () {

        var dateFrom = new Date(($filter('date')(new Date(), 'yyyy-MM-dd')));
        var dateTo = new Date(($filter('date')(new Date(), 'yyyy-MM-dd')));

        if ($scope.SalesVatRegister.DateFromDet)
            dateFrom = new Date(($filter('date')($scope.SalesVatRegister.DateFromDet.dateAD, 'yyyy-MM-dd')));

        if ($scope.SalesVatRegister.DateToDet)
            dateTo = new Date(($filter('date')($scope.SalesVatRegister.DateToDet.dateAD, 'yyyy-MM-dd')));

        $scope.DataColl = []; //declare an empty array
        $scope.gridOptions.api.setRowData($scope.DataColl);

        var beData = {
            DateFrom: dateFrom,
            DateTo: dateTo,
            VoucherType: $scope.SalesVatRegister.VoucherId,
            isPost: $scope.SalesVatRegister.IsPost,
            branchId: $scope.SalesVatRegister.BranchId
        };


        $scope.loadingstatus = 'running';
        showPleaseWait();


        $http({
            method: "POST",
            url: base_url + "Inventory/Reporting/GetSalesVatRegister",
            data: JSON.stringify(beData),
            dataType: "json"
        }).then(function (res) {


            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                $scope.DataColl = res.data.Data;

                var Opening = 0;
                angular.forEach($scope.DataColl, function (dc) {
                    if (dc.TotalValue == 1 || dc.TotalValue == 'DR')
                        Opening += dc.TotalValue;
                    else
                        Opening -= dc.TotalValue;
                });

                var drcr = '';
                if (Opening > 0)
                    drcr = '';
                else if (Opening < 0)
                    drcr = ''

                Opening = Math.abs(Opening);


                $scope.dataForBottomGrid[0].TotalValue = Opening;
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
                down_file(base_url + "//" + res.data.Data.ResponseId, "SalesVatRegister.xlsx");
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
