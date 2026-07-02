"use strict";

agGrid.initialiseAgGridWithAngular1(angular);

app.controller("PendingPartsDemand", function ($scope, $http, $filter, $timeout, GlobalServices, $compile) {

  var PrintPreviewAs = 1;
    const contextMenu = GlobalServices.createElementForMenu();
	
    LoadData();

    $scope.onBtExportCSV = function () {
        var params = {
            fileName: 'PendingPartsDemand.csv',
            sheetName: 'PendingPartsDemand'
        };

        $scope.gridOptions.api.exportDataAsCsv(params);
    }

    function LoadData()
    {
        $('.select2').select2({
            allowClear: true,
            openOnEnter: true
        });
        $scope.ReportTypeColl = [{ text: 'PendingOnly', value: 1, dataType: 'text' }, { text: 'ClearOnly', value: 2, dataType: 'text' }, { text: 'Both', value: 3, dataType: 'text' },]

        $scope.GodownColl = [];
        $http({
            method: 'GET',
            url: base_url + "Inventory/Creation/GetUserWiseGodown",
            dataType: "json"
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.GodownColl = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        //agGrid.initialiseAgGridWithAngular1(angular);
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

        $scope.PendingPartsDemand = {
            PendingType: 1,
            DateFrom_TMP: new Date(),
            DateTo_TMP: new Date(),
            ShowDetails: false,
            GodownIdColl:'',
        };


        $scope.loadingstatus = "stop";

        $scope.columnDefs = [
            {
                headerName: "Date(A.D.)", width: 140, field: "VoucherDate", cellRenderer: 'agGroupCellRenderer',
                valueFormatter: function (params) { return DateFormatAD(params.value); },
                showRowGroup: true, cellStyle: { 'text-align': 'center' },
                cellRendererParams: {
                    suppressCount: false, // turn off the row count                   
                }
            },
            {
                headerName: "Miti", width: 140, field: "VoucherDateBS", cellRenderer: 'agGroupCellRenderer',
                valueFormatter: function (params) { return DateFormatBS(params.value); },
                showRowGroup: true, cellStyle: { 'text-align': 'center' },
                cellRendererParams: {
                    suppressCount: false, // turn off the row count                   
                }
            },
            { headerName: "Particulars", width: 160, field: "Name", cellStyle: { 'text-align': 'left' } },


            //FIled Added by bibek start here i.e M.v Dugar
            { headerName: "Order No", width: 130, field: "VoucherNo", dataType: 'Number', cellStyle: { 'text-align': 'left' } },
            { headerName: "Order Qty", width: 130, field: "DemandQty", dataType: 'Number', cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); },   },
            { headerName: "Issues Qty", width: 130, field: "IssuesQty", dataType: 'Number', cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); },   },
            { headerName: "Pending Qty.", width: 150, field: "BalanceQty", dataType: 'Number', cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); },   },
            { headerName: "From Godown", width: 150, field: "FromGodown", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "To Godown", width: 130, field: "ToGodown", dataType: 'Text', cellStyle: { 'text-align': 'left' } },         
            { headerName: "Ref.No", width: 140, field: "RefNo", dataType: 'Number', cellStyle: { 'text-align': 'left' } },
            { headerName: "Brand Name", width: 180, field: "BrandName", dataType: 'Text', cellStyle: { 'text-align': 'left' } },            
            { headerName: "Cancel No", width: 140, field: "CancelNo", dataType: 'Number', cellStyle: { 'text-align': 'left' } },
            { headerName: "Cancel Date", width: 140, field: "CancelDate", dataType: 'DateTime', cellStyle: { 'text-align': 'left' } },
            { headerName: "Cancel Qty", width: 140, field: "CancelQty", dataType: 'Number', cellStyle: { 'text-align': 'left' } },

            //FIled Added by bibek End here i.e M.v Dugar


            { headerName: "In No", width: 140, field: "AutoVoucherNo", dataType: 'Number', cellStyle: { 'text-align': 'right' } },
            { headerName: "In Qty", width: 140, field: "DemandQty", dataType: 'Number', cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "OutQty", width: 140, field: "OutQty", dataType: 'Number', cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            //{ headerName: "PendingQty", width: 150, field: "DemandQty", dataType: 'Number', cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); },  },
            { headerName: "Is BreakDown Parts", width: 200, dataType: 'Text', field: "IsBreakDownParts", cellStyle: { 'text-align': 'left' } },
            { headerName: "Godown", width: 130, field: "FromGodown", dataType: 'Text', cellStyle: { 'text-align': 'left' }, hide: true, colId: 'colBD1', },
            { headerName: "IssuesDetails", width: 150, field: "IssuesDetails", dataType: 'Text', cellStyle: { 'text-align': 'left' }, hide: true, colId: 'colBD2', },
            { headerName: "ServiceEnginer", width: 160, field: "ServiceEnginer", dataType: 'Text', cellStyle: { 'text-align': 'left' }, hide: true, colId: 'colBD3', },
            { headerName: "RegdNo", width: 150, field: "RegdNo", dataType: 'Number', cellStyle: { 'text-align': 'right' }, hide: true, colId: 'colBD4', },
            { headerName: "EngineNo", width: 170, field: "EngineNo", dataType: 'Number', cellStyle: { 'text-align': 'right' }, hide: true, colId: 'colBD5', },
            { headerName: "VinNo", width: 180, field: "VinNo", dataType: 'Number', cellStyle: { 'text-align': 'right' }, hide: true, colId: 'colBD6', },
            { headerName: "Model", width: 150, field: "Model", dataType: 'Text', cellStyle: { 'text-align': 'left' }, hide: true, colId: 'colBD7', },
            { headerName: "Chassis No", width: 130, field: "ChassisNo", dataType: 'Text', cellStyle: { 'text-align': 'left' }, hide: true, colId: 'colBD8', },
            { headerName: "Running Hour", width: 150, field: "RunningHour", dataType: 'DateTime', cellStyle: { 'text-align': 'left' }, hide: true, colId: 'colBD9', },
            { headerName: "Running K.M.", width: 150, field: "RunningKM", dataType: 'Number', cellStyle: { 'text-align': 'left' }, hide: true, colId: 'colBD10', },
            { headerName: "Date of Sales", width: 140, field: "DateofSales", dataType: 'DateTime', cellStyle: { 'text-align': 'left' }, hide: true, colId: 'colBD11', },
            { headerName: "Failure Date", width: 140, field: "FailureDate", cellStyle: { 'text-align': 'left' }, hide: true, colId: 'colBD12', },
            { headerName: "Failure Details", width: 150, field: "FailureDetails", dataType: 'Text', cellStyle: { 'text-align': 'left' }, hide: true, colId: 'colBD13', },
            { headerName: "Job Card No", width: 150, field: "JobCardNo", dataType: 'Text', cellStyle: { 'text-align': 'left' }, hide: true, colId: 'colBD14', },
            { headerName: "Remarks", width: 180, field: "Remarks", dataType: 'Text', cellStyle: { 'text-align': 'left' }, hide: true, colId: 'colBD15', },


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
                    Name: 'Total =>',
                    DemandQty: 0,
                    OutQty: 0,



                }
                $scope.gridOptions.api.forEachNodeAfterFilterAndSort(function (node) {
                    var fData = node.data;
                    dt.DemandQty += fData.DemandQty;
                    dt.OutQty += fData.OutQty;

                });


                var filterDataColl = [];
                filterDataColl.push(dt);

                $scope.gridOptionsBottom.api.setRowData(filterDataColl);
            }

        };
        $scope.eGridDiv = document.querySelector('#datatable');

        // create the grid passing in the div to use together with the columns & data we want to use
        new agGrid.Grid($scope.eGridDiv, $scope.gridOptions);

        $scope.dataForBottomGrid = [
            {
                AutoNumber: '',
                Name: 'Total =>',
                DemandQty: 0,
                OutQty: 0,
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

    $scope.ShowDetails = function (val) {
        for (var i = 1; i < 16; i++) {

            if (i != 2) {

                var colName = 'colBD' + i.toString();
                $scope.gridOptions.columnApi.setColumnVisible(colName, val);
            }
        }
    }
    $scope.ClearData = function () {

        var DataColl = [];
        $scope.gridOptionsBottom.api.setRowData(DataColl);

        $scope.gridOptions.api.setRowData(DataColl);
    };
    $scope.GetPendingPartsDemand = function () {

        $scope.ClearData();
        var dateFrom = $filter('date')(new Date(), 'yyyy-MM-dd');
        var dateTo = $filter('date')(new Date(), 'yyyy-MM-dd');

        if ($scope.PendingPartsDemand.DateFromDet)
            dateFrom = $filter('date')($scope.PendingPartsDemand.DateFromDet.dateAD, 'yyyy-MM-dd');

        if ($scope.PendingPartsDemand.DateToDet)
            dateTo = $filter('date')($scope.PendingPartsDemand.DateToDet.dateAD, 'yyyy-MM-dd');

        $scope.loadingstatus = 'running';
        showPleaseWait();

        var godownId = 0;
        var godownIdColl = '';
        if ($scope.PendingPartsDemand.GodownId && $scope.PendingPartsDemand.GodownId.length > 0) {
            if ($scope.PendingPartsDemand.GodownId.length == 1)
                godownId = $scope.PendingPartsDemand.GodownId[0];
            else
                godownIdColl = $scope.PendingPartsDemand.GodownId.toString();
        }  

        var beData = {
            PendingType: $scope.PendingPartsDemand.PendingType,
            dateFrom: dateFrom,
            dateTo: dateTo,
            GodownIdColl: godownIdColl,
        };

        $scope.loadingstatus = 'running';

        $http({
            method: "post",
            url: base_url + "Inventory/Reporting/GetPendingPartsDemand",
            data: JSON.stringify(beData),
            dataType: "json"
        }).then(function (res) {

            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                var DataColl = mx(res.data.Data);

                var dt = {
                    Name: 'TOTAL =>',
                    DemandQty: DataColl.sum(p1 => p1.DemandQty),


                }

                var filterDataColl = [];
                filterDataColl.push(dt);

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
                down_file(base_url + "//" + res.data.Data.ResponseId, "PendingPartsDemand.xlsx");
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
