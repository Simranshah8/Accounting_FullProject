

"use strict";

agGrid.initialiseAgGridWithAngular1(angular);



app.controller("BillWise", function ($scope, $http, $filter, $timeout,GlobalServices) {
    $scope.Title = 'BillWise';
 var PrintPreviewAs = 1;
  const contextMenu = GlobalServices.createElementForMenu();
    LoadData();

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
		
        $('.select2').select2({
            allowClear: true,
            openOnEnter: true
        });

        var columnDefs = [
            { headerName: "Date", field: "VoucherDate", filter: 'agDateColumnFilter', width: 190, pinned: 'left', cellStyle: { 'text-align': 'center' }, valueFormatter: function (params) { return DateFormatAD(params.value); }, },
            { headerName: "Miti", field: "VoucherDateBS", filter: "agTextColumnFilter", width: 190,cellStyle:{'text-align':'center'} },
            { headerName: "BranchName", field: "Branch", filter: "agTextColumnFilter", width: 190, cellStyle:{'text-align':'left'} },
            { headerName: "Name", field: "LedgerName", filter: "agTextColumnFilter", width: 190, cellStyle:{'text-align':'left'} },
            { headerName: "Alias", field: "LedgerAlias", filter: "agTextColumnFilter", width: 120, cellStyle:{'text-align':'left'} },
            { headerName: "Code", field: "LedgerCode", filter: "agTextColumnFilter", width: 120, cellStyle:{'text-align':'left'} },
            { headerName: "Group", field: "LedgerGroup", filter: "agTextColumnFilter", width: 190, cellStyle:{'text-align':'left'} },
            { headerName: "Voucher", field: "VoucherName", filter: "agTextColumnFilter", width: 190, cellStyle:{'text-align':'left'} },
            { headerName: "For Year", field: "CostClass", filter: "agTextColumnFilter", width: 140, cellStyle:{'text-align':'left'} },
            { headerName: "Bill No", field: "BillNo", filter: "agTextColumnFilter", width: 140, cellStyle:{'text-align':'left'} },
            { headerName: "Amount", field: "TotalAmount", filter: "agNumberColumnFilter", width: 150,  cellStyle: { 'text-align': 'right' }, valueFormatter: function (params) { return $filter('formatNumber')(params.value); } },
            { headerName: "User", field: "UserName", filter: "agTextColumnFilter", width: 120,  cellStyle: { 'text-align': 'right' } },
            { headerName: "LogDateTime", field: "LogDateTime", filter: "agDateColumnFilter", width: 150, cellStyle: { 'text-align': 'center' } },
            {
                headerName: "Action", width: 165, cellRenderer:
                    function (params) {
                        return     '<a class="btn btn-default btn-xs"data-toggle="tooltip" data-placement="top" title="Delete" ng-click="deleteVoucher(this)"><i class="fas fa-trash-alt text-danger"></i></a>';
                    }
            },
        ];

        $scope.beData = {
           
            BranchId: 0,
            VoucherId: 0,
            VoucherName: '',
            Ledger: '',
            LedgerGroup: '',
            LedgerGroupId: 0,
            LedgerId: 0,
            SalesLedgerId: 0, 
            ledgerIdColl: ''
        };

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
                        Opening += node.data.TotalAmount;
                    else
                        Opening -= node.data.TotalAmount;
                });

                var drcr = '';
                if (Opening > 0)
                    drcr = 'DR';
                else if (Opening < 0)
                    drcr = 'CR'

                Opening = Math.abs(Opening);

                $scope.dataForBottomGrid[0].TotalAmount = Opening;
                $scope.dataForBottomGrid[0].DrAmount = drcr;
                $scope.gridOptionsBottom.api.setRowData($scope.dataForBottomGrid);
            }

        };

    

        $scope.dataForBottomGrid = [
            {
                AutoNumber: '',
                LedgerName: 'Total =>',
                Opening: 0,
                DrAmount: ''
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
        $scope.loadingstatus = "stop";

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

$timeout(function () {
            GlobalServices.getListState(EntityId, $scope.gridOptions);
        });
		
    }

     
    $scope.deleteVoucher = function (e) {
         
        var obj = e.data;

        if (!obj)
            return;
         
        Swal.fire({
            title: 'Do you want to delete the selected Bill (' + obj.BillNo + ') :- ' + obj.LedgerName + ' ? ',
            showCancelButton: true,
            confirmButtonText: 'Delete',
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                $scope.loadingstatus = "running";
                showPleaseWait();

                var para = { 
                    tranId: obj.TranId
                };

                $http({
                    method: 'POST',
                    url: base_url + "Account/Creation/DelBillWise",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingstatus = "stop";
                    if (res.data.IsSuccess) {
                        $scope.GetAllBillWise();
                    } else {
                        Swal.fire(res.data.ResponseMSG);
                    }

                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }
        });



    }

    $scope.GetAllBillWise = function () {

        if ($scope.loadingstatus != 'stop') {
            alert('Already Running Process')
            return;
        }

        $scope.loadingstatus = 'running';
        showPleaseWait();

        $scope.DataColl = []; //declare an empty array
        $scope.gridOptionsBottom.api.setRowData(null);
        $scope.gridOptions.api.setRowData(null); //declare an empty array

        var bdid = (!$scope.beData.BranchId ? 0 : $scope.beData.BranchId);

        $http({
            method: 'GET',
            url: base_url + "Account/Reporting/GetAllBillWiseOpening?BranchId="+bdid,
            dataType: "json"
            //data:JSON.stringify(para)
        }).then(function (res) {

            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                $scope.DataColl = res.data.Data;

                var Opening = 0;
                angular.forEach($scope.DataColl, function (dc) {
                    if (dc.DrAmount == 1 || dc.DrAmount == 'DR')
                        Opening += dc.TotalAmount;
                    else
                        Opening -= dc.TotalAmount;
                });

                var drcr = '';
                if (Opening > 0)
                    drcr = '';
                else if (Opening < 0)
                    drcr = ''

                Opening = Math.abs(Opening);


                $scope.dataForBottomGrid[0].TotalAmount = Opening;
                $scope.dataForBottomGrid[0].DrAmount = drcr;
                $scope.gridOptionsBottom.api.setRowData($scope.dataForBottomGrid);

                $scope.gridOptions.api.setRowData($scope.DataColl);
            } else
                alert(res.data.ResponseMSG);

        }, function (reason) {
            $scope.loadingstatus = "stop";
            alert('Failed' + reason);
        });

    }

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
    $scope.onFilterTextBoxChanged = function () {
        $scope.gridOptions.api.setQuickFilter($scope.search);
    }

    $scope.onBtExport = function () {
        var params = {
            fileName: 'data.csv',
            sheetName: 'data'
        };

        $scope.gridOptions.api.exportDataAsCsv(params);
    }
    $scope.GetDataForPrint = function () {

        var filterData = [];

        $scope.gridOptions.api.forEachNodeAfterFilterAndSort(function (node) {
            var dayBook = node.data;
            filterData.push(dayBook);
        });

        return filterData;
    }

    $scope.DownloadAsXls = function () {

        $scope.loadingstatus = 'running';
        showPleaseWait();

        var dataColl = $scope.GetDataForPrint();

        var paraData = {
            //Period: $scope.dayBook.DateFromDet.dateBS + " TO " + $scope.dayBook.DateToDet.dateBS,
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
                down_file(base_url + "//" + res.data.Data.ResponseId, "BillWise.xlsx");
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