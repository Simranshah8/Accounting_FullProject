"use strict";

agGrid.initialiseAgGridWithAngular1(angular);

app.controller("PendingSalesAllotment", function ($scope, $http, $filter, $timeout, GlobalServices, $compile) {

  var PrintPreviewAs = 1;
    const contextMenu = GlobalServices.createElementForMenu();
	
    LoadData();

    $scope.onBtExportCSV = function () {
        var params = {
            fileName: 'PendingSalesAllotment.csv',
            sheetName: 'PendingSalesAllotment'
        };

        $scope.gridOptions.api.exportDataAsCsv(params);
    }

    function LoadData() {
        $('.select2').select2()
       
      
        //Search Drop DownList
        $scope.VoucherSearchOptions = [{ text: 'Date(A.D)', value: 'VoucherDate', dataType: 'date' },
        { text: 'Date(B.S)', value: 'VoucherDateBS', dataType: 'date' },
        { text: 'Particulars', value: 'Name', dataType: 'text' },
        { text: 'Allotment No', value: 'VoucherNo', dataType: 'number' },
        { text: 'Allotment Qty', value: 'AllotmentQty', dataType: 'number' },
        { text: 'InvoiceNo', value: 'AutoVoucherNo', dataType: 'Number' },
        { text: 'Sales Date', value: 'SalesDate', dataType: 'date' },
        { text: 'Sales Qty', value: 'SalesQty', dataType: 'Number' },
        { text: 'Cancel Qty', value: 'OrderCancelQty', dataType: 'Number' },
        { text: 'Cancel No', value: 'OrderCancelNo', dataType: 'Number' },
        { text: 'Cancel Date', value: 'OrderCancelDate', dataType: 'date' },
        { text: 'Pending Qty', value: 'PendingQty', dataType: 'Number' },
        { text: 'VoucherName', value: 'VoucherName', dataType: 'text' },
        { text: 'CostClass', value: 'CostClass', dataType: 'text' },
        { text: 'Branch', value: 'Branch', dataType: 'text' },
        { text: 'PArty', value: 'Party', dataType: 'text' },
        { text: 'Address', value: 'Address', dataType: 'text' },
        { text: 'SalesMan', value: 'Agent', dataType: 'text' },
        { text: 'Group', value: 'ProductGroup', dataType: 'text' },
        { text: 'Brand', value: 'Brand', dataType: 'text' },
        { text: 'Color', value: 'Color', dataType: 'text' },
        { text: 'Shape', value: 'Shape', dataType: 'text' },

        { text: 'Unit', value: 'Unit', dataType: 'text' },
        { text: 'Alias', value: 'Alias', dataType: 'text' },
        { text: 'Code', value: 'Code', dataType: 'number' },
        { text: 'ProductType', value: 'ProductType', dataType: 'Number' },
        { text: 'Sales Details', value: 'SalesInvoiceDetails', dataType: 'text' },
        { text: 'DispatchOrderDetials', value: 'Dispatchdetails', dataType: 'text' },
        { text: 'Flavour', value: 'Flavour', dataType: 'text' },
        { text: 'ProductCategory', value: 'ProductCategory', dataType: 'text' },
        { text: 'SalesMan1', value: 'Agent1', dataType: 'text' },
        { text: 'SalesMan2', value: 'Agent2', dataType: 'text' },
        { text: 'SalesMAn3', value: 'Agent3', dataType: 'text' },
        { text: 'ColumnHeader', value: 'ColumnHeader', dataType: 'text' },
        { text: 'Division', value: 'Division', dataType: 'text' },
        { text: 'Regd.No', value: 'RegdNo', dataType: 'number' },
        { text: 'Engine.No', value: 'EngineNo', dataType: 'number' },
        { text: 'Chassis.No', value: 'ChassisNo', dataType: 'number' },
        { text: 'Model', value: 'Model', dataType: 'number' },
        { text: 'Cancel Details', value: 'OrderCancelDetails', dataType: 'text' },

        ];



        //Filter Dialog Box Details
        $scope.BranchTypeColl = [];
        $scope.VoucherTypeColl = [];
        $scope.LedgerGroupTypeColl = [];
        $scope.ExpressionColl = GlobalServices.getExpression();
        $scope.ConditionColl = GlobalServices.getLogicCondition();
        $scope.FilterColumnColl = [{ text: 'VoucherDate', value: 'VoucherDate', dataType: 'date' },
        { text: 'VoucherName', value: 'VoucherName', dataType: 'text' },
        { text: 'VoucherNo', value: 'VoucherNo', dataType: 'Number' },
        { text: 'AutoVoucherNo', value: 'AutoVoucherNo', dataType: 'Number' },
        { text: 'CostClassName', value: 'CostClass', dataType: 'text' },
        { text: 'Narration', value: 'Narration', dataType: 'text' },
        { text: 'NDay', value: 'NDay', dataType: 'Number' },
        { text: 'NMonth', value: 'NMonth', dataType: 'Number' },
        { text: 'NYear', value: 'NYear', dataType: 'Number' },
        { text: 'Particulars', value: 'Name', dataType: 'text' },
        { text: 'RefNo', value: 'RegdNo', dataType: 'Number' },
        { text: 'UserName', value: 'Name', dataType: 'text' },
        { text: 'VoucherName', value: 'VoucherName', dataType: 'text' },
        { text: 'DrAmount', value: 'DrAmt', dataType: 'number' },
        { text: 'CrAmount', value: 'CrAmt', dataType: 'number' },];

        

        $scope.PendingSalesAllotment = {
            DateFrom_TMP: new Date(),
            DateTo_TMP: new Date(),
            VoucherId: 0,
            IsPost: true,
            IsPendingOnly: true,
            IsClearOnly: true,
            BranchId: 0,
            ReportType: 1,
        };
       

        $scope.loadingstatus = "stop";

        $scope.columnDefs = [

            { headerName: "Date(A.D)", width: 130, field: "VoucherDate", dataType: 'DateTIme', pinned: 'left', cellStyle: { 'text-align': 'center' }  },
            { headerName: "Miti", width: 130, field: "VoucherDateBS", dataType: 'DateTIme', pinned: 'left', cellStyle: { 'text-align': 'center' }  },
            { headerName: "Particulars", width: 200, field: "Name", dataType: 'Text', pinned: 'left', cellStyle: { 'text-align': 'left' }  },
            { headerName: "Allotment No", width: 130, field: "VoucherNo", dataType: 'Number', cellStyle: { 'text-align': 'right' }  },
            { headerName: "AllotmentQty", width: 120, field: "OrderQty", dataType: 'Number', cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); },   },
            //Added
            //{ headerName: "Rate", width: 100, field: "Rate", dataType: 'Number', cellStyle: { 'text-align': 'right' } },
            //{ headerName: "Amount", width: 120, field: "Amount", dataType: 'Number', cellStyle: { 'text-align': 'right' } },
            { headerName: "Party", width: 180, field: "Party", dataType: 'Text', cellStyle: { 'text-align': 'left' } },

            { headerName: "Invoice No.", width: 110, field: "SalesNo", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Sales Date", width: 130, field: "SalesDate", dataType: 'DateTIme', cellStyle: { 'text-align': 'center' }  },
            { headerName: "Sales Qty", width: 110, field: "SalesQty", dataType: 'Number', cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); },  },
            { headerName: "Pending Qty", width: 110, field: "OrderQty", dataType: 'Number', cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "Engine No", width: 200, field: "EngineNo", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Chassis No", width: 200, field: "ChassisNo", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Model", width: 180, field: "Model", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Regd No", width: 130, field: "RegdNo", dataType: 'Text', cellStyle: { 'text-align': 'left' } },

            //Added
            { headerName: "Color", width: 150, field: "Color", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Unit", width: 100, field: "Unit", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Code", width: 130, field: "Code", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Sales Detail", width: 200, field: "SalesDetail", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
                       
            { headerName: "Cancel Qty", width: 120, field: "OrderCancelQty", dataType: 'Number', cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "Cancel No", width: 120, field: "OrderCancelNo", dataType: 'Number', cellStyle: { 'text-align': 'right' }  },
            { headerName: "Cancel Date", width: 130, field: "OrderCancelDate", dataType: 'DateTIme', cellStyle: { 'text-align': 'center' }  },

            //Added
            { headerName: "Allotment Return Qty", width: 170, field: "AllotmentReturnQty", dataType: 'Number', cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "Allotmrnt Return No", width: 170, field: "AllotmrntReturnNo", dataType: 'Number', cellStyle: { 'text-align': 'right' } },
            { headerName: "Allotment Return Date", width: 170, field: "AllotmentReturnDate", dataType: 'DateTime', cellStyle: { 'text-align': 'center' } },
            { headerName: "Voucher Name", width: 170, field: "VoucherName", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "CostClass", width: 170, field: "CostClass", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Branch", width: 170, field: "Branch", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Address", width: 170, field: "Address", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Salesman", width: 170, field: "Salesman", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Group", width: 170, field: "Group", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Brand", width: 170, field: "Brand", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Product Type", width: 170, field: "ProductType", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Alias", width: 140, field: "Alias", dataType: 'Text', cellStyle: { 'text-align': 'left' } },

            { headerName: "Cancel Details", width: 170, field: "OrderCancelDetails", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "PostBy", width: 120, field: "PostBy", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Post DateTime", width: 120, field: "PostDateTime", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Verify Remarks", width: 150, field: "VerifyRemarks", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Reject Remarks", width: 120, field: "RejectRemarks", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            {
                headerName: "Action",
                width: 50,
                cellRenderer: function (params) {
                    return '<div class="btn-group" style="position: fixed; ">' +
                        '<button type="button" class="btn btn-default px-1 dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
                        '<span class="caret"></span>' +
                        '</button>' +
                        '<ul class="dropdown-menu dropdown-menu-right p-2" style="position: absolute; left: 0;">' +
                        '<li><a data-toggle="tooltip" data-placement="top" title="Show Document" ng-click="ShowDocument(this.data)"><i class="fas fa-file text-info"></i> Show Document</a>  </li>' +
                        '<li><a data-toggle="tooltip" data-placement="top" title="Print" ng-click="PrintVoucher(' + params.data.TranId + ',' + params.data.VoucherId + ')"><i class="fas fa-print text-info"></i> Print</a></li>' +
                        '<li><a data-toggle="tooltip" data-placement="top" title="Post" ng-click="PostModal(this)"><i class="fas fa-sticky-note"></i> Post</a> </li>' +
                        '<li><a data-toggle="tooltip" data-placement="top" title="Cancel" ng-click="CancelModal(this)"><i class="fa fa-times text-danger"></i> Cancel</a> </li>' +
                        '<li><a data-toggle="tooltip" data-placement="top" title="Verify Voucher" ng-click="VerifyModal(this)"><i class="fa fa-times text-info"></i> Verify</a> </li>' +
                        '<li><a data-toggle="tooltip" data-placement="top" title="Reject Voucher" ng-click="RejectModal(this)"><i class="fa fa-times text-danger"></i> Reject</a> </li>' +

                        '<li><a data-toggle="tooltip" data-placement="top" title="Delete Voucher" ng-click="deleteVoucher(this)"><i class="fas fa-trash-alt text-danger"></i> Delete</a></li>' +

                        '</ul>' +
                        '</div>';
                },
                pinned: 'right'
            },
            //{ headerName: "Unit", width: 250, field: "Unit", dataType: 'Number', cellStyle: { 'text-align': 'left' }  },
            //{ headerName: "Product Category", width: 250, field: "ProductCategory", dataType: 'Number', cellStyle: { 'text-align': 'left' }  },
            //{ headerName: "SalesMan 1", width: 250, field: "Agent1", dataType: 'Number', cellStyle: { 'text-align': 'left' }  },
            //{ headerName: "SalesMan 2", width: 250, field: "Agent2", dataType: 'Number', cellStyle: { 'text-align': 'left' }  },
            //{ headerName: "SalesMan 3", width: 250, field: "Agent3", dataType: 'Number',cellStyle: { 'text-align': 'left' }  },
            //{ headerName: "ColumnHeader", width: 250, field: "ColumnHeader", dataType: 'Number', cellStyle: { 'text-align': 'left' }  },
            //{ headerName: "ColumnHeader", width: 250, field: "ColumnHeader", dataType: 'Number', cellStyle: { 'text-align': 'left' }  },
            //{ headerName: "ColumnHeader", width: 250, field: "ColumnHeader", dataType: 'Number', cellStyle: { 'text-align': 'left' }  },
            //{ headerName: "Division", width: 250, field: "Division", dataType: 'Number', cellStyle: { 'text-align': 'left' }  },
            
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
                    Name: 'Total =>',
                    AllotmentQty: 0,
                    SalesQty: 0,
                    OrderCancelQty: 0,
                    OrderQty: 0,
                }
                $scope.gridOptions.api.forEachNodeAfterFilterAndSort(function (node) {
                    var fData = node.data;
                    dt.AllotmentQty += fData.AllotmentQty;
                    dt.SalesQty += fData.SalesQty;
                    dt.OrderCancelQty += fData.OrderCancelQty;
                    dt.OrderQty += fData.OrderQty
                });


                var filterDataColl = [];
                filterDataColl.push(dt);

                $scope.gridOptionsBottom.api.setRowData(filterDataColl);
            }

        };
      //  $scope.eGridDiv = document.querySelector('#datatable');

        // create the grid passing in the div to use together with the columns & data we want to use
       // new agGrid.Grid($scope.eGridDiv, $scope.gridOptions);

        $scope.dataForBottomGrid = [
            {
                Name: 'Total =>',
                AllotmentQty: 0,
                SalesQty: 0,
                OrderCancelQty: 0,
                OrderQty: 0,
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
    $scope.ClearData = function () {

        var DataColl = [];
        $scope.gridOptionsBottom.api.setRowData(DataColl);

        $scope.gridOptions.api.setRowData(DataColl);
    };
    $scope.GetPendingSalesAllotment = function () {

        $scope.ClearData();
        var dateFrom = new Date(($filter('date')(new Date(), 'yyyy-MM-dd')));
        var dateTo = new Date(($filter('date')(new Date(), 'yyyy-MM-dd')));

        if ($scope.PendingSalesAllotment.DateFromDet)
            dateFrom = new Date(($filter('date')($scope.PendingSalesAllotment.DateFromDet.dateAD, 'yyyy-MM-dd')));

        if ($scope.PendingSalesAllotment.DateToDet)
            dateTo = new Date(($filter('date')($scope.PendingSalesAllotment.DateToDet.dateAD, 'yyyy-MM-dd')));

        if ($scope.PendingSalesAllotment.ReportType == 1) {
            $scope.PendingSalesAllotment.isPendingOnly = true;
            $scope.PendingSalesAllotment.isClearOnly = false;

        } else if ($scope.PendingSalesAllotment.ReportType == 2) {

            $scope.PendingSalesAllotment.isPendingOnly = false;
            $scope.PendingSalesAllotment.isClearOnly = true;
        }
        else if ($scope.PendingSalesAllotment.ReportType == 3) {

            $scope.PendingSalesAllotment.isPendingOnly = true;
            $scope.PendingSalesAllotment.isClearOnly = true;
        } else {
            $scope.PendingSalesAllotment.isPendingOnly = true;
            $scope.PendingSalesAllotment.isClearOnly = false;
        }

        $scope.loadingstatus = 'running';
        showPleaseWait();
        var beData = {
            DateFrom: dateFrom,
            DateTo: dateTo,
            isPost: true,
            isPendingOnly: $scope.PendingSalesAllotment.isPendingOnly,
            isClearOnly: $scope.PendingSalesAllotment.isClearOnly,
            branchId: $scope.PendingSalesAllotment.BranchId,
            ReportType: $scope.PendingSalesAllotment.ReportType,
        };

        $scope.loadingstatus = 'running';

        $http({
            method: "POST",
            url: base_url + "Inventory/Reporting/GetPendingSalesAllotment",
            data: JSON.stringify(beData),
            dataType: "json"
        }).then(function (res) {


            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                var DataColl = mx(res.data.Data);

                //var dt = {
                //    Name: 'TOTAL =>',
                //    AllotmentQty: DataColl.sum(p1 => p1.AllotmentQty),
                //    OrderCancelQty: DataColl.sum(p1 => p1.OrderCancelQty),
                //    SalesQty: DataColl.sum(p1 => p1.SalesQty),
                //    OrderQty: DataColl.sum(p1 => p1.OrderQty)
                //}

                var filterDataColl = [];
               // filterDataColl.push(dt);

                $scope.gridOptionsBottom.api.setRowData(filterDataColl);

                $scope.gridOptions.api.setRowData(res.data.Data);
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

        var filterData = [];

        $scope.gridOptions.api.forEachNodeAfterFilterAndSort(function (node) {
            var dayBook = node.data;
            filterData.push(dayBook);
        });

        return filterData;
    }
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
                down_file(base_url + "//" + res.data.Data.ResponseId, "PendingSalesAllotment.xlsx");
            }

        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            Swal.fire(errormessage);
        });
    }

    $scope.SelectedTran = {};
    $scope.ShowDocument = function (beData) {

        beData.VoucherType = 41;
        if (beData.TranId && beData.VoucherType) {
            $scope.SelectedTran = beData;

            var para = {
                TranId: beData.TranId,
                VoucherType: beData.VoucherType
            };

            $http({
                method: 'POST',
                url: base_url + "Global/GetTranDocAttachment",
                dataType: "json",
                data: JSON.stringify(para)
            }).then(function (res) {
                hidePleaseWait();
                $scope.loadingstatus = "stop";
                if (res.data.IsSuccess) {
                    $scope.SelectedTran.DocumentColl = res.data.Data;

                    if ($scope.SelectedTran.DocumentColl) {
                        $scope.SelectedTran.DocumentColl.forEach(function (dc) {
                            dc.DocPath = base_url + dc.DocPath;
                        });
                    }

                    $('#modal-showDocument').modal('show');

                } else {
                    Swal.fire(res.data.ResponseMSG);
                }

            }, function (reason) {
                Swal.fire('Failed' + reason);
            });
        }

    }
  

    $scope.ShowPersonalImg = function (item) {
        $scope.viewImg = {
            ContentPath: '',
            FileType: null
        };

        if (item.DocPath && item.DocPath.length > 0) {
            $scope.viewImg.ContentPath = item.DocPath;
            $scope.viewImg.FileType = 'pdf';  // Assuming DocPath is for PDFs
            document.getElementById('pdfViewer').src = item.DocPath;
            $('#PersonalImg').modal('show');
        } else if (item.PhotoPath && item.PhotoPath.length > 0) {
            $scope.viewImg.ContentPath = item.PhotoPath;
            $scope.viewImg.FileType = 'image';  // Assuming PhotoPath is for images
            $('#PersonalImg').modal('show');
        } else if (item.File) {
            var blob = new Blob([item.File], { type: item.File?.type });
            $scope.viewImg.ContentPath = URL.createObjectURL(blob);
            $scope.viewImg.FileType = item.File.type.startsWith('image/') ? 'image' : 'pdf';

            if ($scope.viewImg.FileType === 'pdf') {
                document.getElementById('pdfViewer').src = $scope.viewImg.ContentPath;
            }

            $('#PersonalImg').modal('show');
        } else {
            Swal.fire('No Image Found');
        }
    };

    $scope.SelectedVoucherP = null;
    $scope.PostModal = function (e) {

    
        var obj = e.data;

        if (!obj)
            return;

        obj.VoucherType = 41;
        $scope.SelectedVoucherP = obj;


        var para = {
            voucherId: obj.VoucherId
        };

        $http({
            method: 'POST',
            url: base_url + "Account/Creation/GetVMForDayBook",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                var vm = res.data.Data;

                if (vm.NeedPostRemarks == true) {
                    $scope.SelectedVoucherP.NeedPostRemarks = vm.NeedPostRemarks;
                    $('#modal-post').modal('show');

                } else {
                    $scope.SelectedVoucherP.NeedPostRemarks = false;
                    $scope.PostVoucher();
                }

            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });



    }
    $scope.PostVoucher = function () {

        
        var obj = $scope.SelectedVoucherP;

        Swal.fire({
            title: 'Do you want to post the selected voucher(' + obj.VoucherName + ') :- ' + obj.AutoManualNo + ' ? ',
            showCancelButton: true,
            confirmButtonText: 'Post',
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                $scope.loadingstatus = "running";
                showPleaseWait();

                var tranColl = [];
                //tranColl.push(obj);

                if ($scope.SelectedVoucherP.NeedPostRemarks == true && isEmptyObj($scope.SelectedVoucherP.VerifyRemarks) == true) {
                    Swal.fire('Remarks missing');
                    return;
                }

                tranColl.push({
                    TranId: obj.TranId,
                    VoucherType: 41,
                    VoucherId: obj.VoucherId,
                    VoucherDate: obj.VoucherDate,
                    VerifyRemarks: obj.VerifyRemarks
                });


                $http({
                    method: 'POST',
                    url: base_url + "Global/PostAccInvTransaction",
                    dataType: "json",
                    data: JSON.stringify(tranColl)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingstatus = "stop";
                    if (res.data.IsSuccess) {

                        $('#modal-post').modal('hide');
                        $scope.GetPendingSalesAllotment();
                    } else {
                        Swal.fire(res.data.ResponseMSG);
                    }

                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }
        });

    }

    $scope.SelectedVoucher = null;
    $scope.CancelModal = function (e) {

        var obj = e.data;

        if (!obj)
            return;

        $scope.SelectedVoucher = obj;

        $('#modal-cancel').modal('show');

    }
    $scope.CancelVoucher = function () {
        $('#modal-cancel').modal('hide');

        var obj = $scope.SelectedVoucher;

        Swal.fire({
            title: 'Do you want to cancel the selected voucher(' + obj.VoucherName + ') :- ' + obj.AutoManualNo + ' ? ',
            showCancelButton: true,
            confirmButtonText: 'Yes',
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                $scope.loadingstatus = "running";
                showPleaseWait();

                var tranColl1 = [];
                tranColl1.push({
                    TranId: obj.TranId,
                    VoucherId: obj.VoucherId,
                    VoucherType: 41,
                    CostClassId: obj.CostClassId,
                    IsCancel: obj.IsCancel,                    
                    CancelRemarks: obj.CancelRemarks,
                    EntryDate: obj.EntryDate,
                    VoucherDate: obj.VoucherDate,
                    IsPost: obj.IsPost,
                    AutoVoucherNo: obj.AutoVoucherNo,
                    ManualVoucherNO: obj.ManualVoucherNO,
                    AutoManualNo: obj.AutoManualNo,
                    RefNo: obj.RefNo,
                    TranType: obj.TranType,
                    CreatedBy: obj.CreatedBy,
                    CreatedByName: obj.CreatedByName,
                    BranchId: obj.BranchId,
                    IsLocked: obj.IsLocked,
                    IsOpening: obj.IsOpening,
                    IsVerify: obj.IsVerify,
                    VerifyRemarks: obj.VerifyRemarks,
                    IsReject: obj.IsReject,
                    RejectRemarks: obj.RejectRemarks,
                    VoucherDateTime: obj.VoucherDateTime,
                    ReferanceTranId: obj.ReferanceTranId,
                    IsInventory: obj.IsInventory,
                    CancelDateTime: obj.CancelDateTime,
                });

                var para = {
                    tranColl: tranColl1,
                    reason: obj.CancelRemarks
                }

                $http({
                    method: 'POST',
                    url: base_url + "Global/CancelAccInvTransaction",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingstatus = "stop";
                    if (res.data.IsSuccess) {
                        $scope.GetPendingSalesAllotment();
                    } else {
                        Swal.fire(res.data.ResponseMSG);
                    }

                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }
        });

    };

    $scope.VerifyModal = function (e) {


        var obj = e.data;

        if (!obj)
            return;

        $scope.SelectedVoucher = obj;

        $('#modal-verifyv').modal('show');

    }
    $scope.VerifyVoucher = function () {
        $('#modal-verifyv').modal('hide');

        var obj = $scope.SelectedVoucher;

        Swal.fire({
            title: 'Do you want to verify the selected voucher(' + obj.VoucherName + ') :- ' + obj.AutoManualNo + ' ? ',
            showCancelButton: true,
            confirmButtonText: 'Yes',
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                $scope.loadingstatus = "running";
                showPleaseWait();

                var tr = {
                    TranId: obj.TranId,
                    VoucherId: obj.VoucherId,
                    VoucherType: 41,
                    CostClassId: obj.CostClassId,
                    IsCancel: obj.IsCancel,                    
                    CancelRemarks: obj.CancelRemarks,
                    EntryDate: obj.EntryDate,
                    VoucherDate: obj.VoucherDate,
                    IsPost: obj.IsPost,
                    AutoVoucherNo: obj.AutoVoucherNo,
                    ManualVoucherNO: obj.ManualVoucherNO,
                    AutoManualNo: obj.AutoManualNo,
                    RefNo: obj.RefNo,
                    TranType: obj.TranType,
                    CreatedBy: obj.CreatedBy,
                    CreatedByName: obj.CreatedByName,
                    BranchId: obj.BranchId,
                    IsLocked: obj.IsLocked,
                    IsOpening: obj.IsOpening,
                    IsVerify: obj.IsVerify,
                    VerifyRemarks: obj.VerifyRemarks,
                    IsReject: obj.IsReject,
                    RejectRemarks: obj.RejectRemarks,
                    VoucherDateTime: obj.VoucherDateTime,
                    ReferanceTranId: obj.ReferanceTranId,
                    IsInventory: obj.IsInventory,
                    CancelDateTime: obj.CancelDateTime,
                };



                $http({
                    method: 'POST',
                    url: base_url + "Global/VerifyAccInvTransaction",
                    dataType: "json",
                    data: JSON.stringify(tr)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingstatus = "stop";
                    if (res.data.IsSuccess) {
                        $scope.GetPendingSalesAllotment();
                    } else {
                        Swal.fire(res.data.ResponseMSG);
                    }

                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }
        });

    };

    $scope.RejectModal = function (e) {


        var obj = e.data;

        if (!obj)
            return;

        $scope.SelectedVoucher = obj;

        $('#modal-rejectv').modal('show');

    }
    $scope.RejectVoucher = function () {
        $('#modal-rejectv').modal('hide');

        var obj = $scope.SelectedVoucher;

        Swal.fire({
            title: 'Do you want to reject the selected voucher(' + obj.VoucherName + ') :- ' + obj.AutoManualNo + ' ? ',
            showCancelButton: true,
            confirmButtonText: 'Yes',
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                $scope.loadingstatus = "running";
                showPleaseWait();

                var tr = {
                    TranId: obj.TranId,
                    VoucherId: obj.VoucherId,
                    VoucherType: 41,
                    CostClassId: obj.CostClassId,
                    IsCancel: obj.IsCancel,                    
                    CancelRemarks: obj.CancelRemarks,
                    EntryDate: obj.EntryDate,
                    VoucherDate: obj.VoucherDate,
                    IsPost: obj.IsPost,
                    AutoVoucherNo: obj.AutoVoucherNo,
                    ManualVoucherNO: obj.ManualVoucherNO,
                    AutoManualNo: obj.AutoManualNo,
                    RefNo: obj.RefNo,
                    TranType: obj.TranType,
                    CreatedBy: obj.CreatedBy,
                    CreatedByName: obj.CreatedByName,
                    BranchId: obj.BranchId,
                    IsLocked: obj.IsLocked,
                    IsOpening: obj.IsOpening,
                    IsVerify: obj.IsVerify,
                    VerifyRemarks: obj.VerifyRemarks,
                    IsReject: obj.IsReject,
                    RejectRemarks: obj.RejectRemarks,
                    VoucherDateTime: obj.VoucherDateTime,
                    ReferanceTranId: obj.ReferanceTranId,
                    IsInventory: obj.IsInventory,
                    CancelDateTime: obj.CancelDateTime,
                };

                $http({
                    method: 'POST',
                    url: base_url + "Global/RejectAccInvTransaction",
                    dataType: "json",
                    data: JSON.stringify(tr)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingstatus = "stop";
                    if (res.data.IsSuccess) {
                        $scope.GetPendingSalesAllotment();
                    } else {
                        Swal.fire(res.data.ResponseMSG);
                    }

                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }
        });

    };

    $scope.PrintVoucher = function (tranId,  voucherId) {
        var voucherType = 41;
        

        var para = {
            VoucherType: 41
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
    $scope.deleteVoucher = function (e) {

        var obj = e.data;
        obj.VoucherType = 41;
        var tranId = obj.TranId, voucherType = obj.VoucherType, voucherId = obj.VoucherId, voucherName = obj.VoucherName, voucherNo = obj.AutoManualNo;

        if (obj.VoucherType == 14 || obj.VoucherType == 16) {
            if ($scope.ButtonED.IRD == true) {
                Swal.fire('Access denied');
                return;
            }
        }

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
                        $scope.GetPendingSalesAllotment();
                    } else {
                        Swal.fire(res.data.ResponseMSG);
                    }

                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }
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
