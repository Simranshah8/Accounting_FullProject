"use strict";

agGrid.initialiseAgGridWithAngular1(angular);

app.controller("pendingssfClaimLstController", function ($scope, $http, $filter, $timeout, GlobalServices, $compile) {

  var PrintPreviewAs = 1;
    const contextMenu = GlobalServices.createElementForMenu();
	
    LoadData();

    $scope.onBtExportCSV = function () {
        var params = {
            fileName: 'PendingClaimList.csv',
            sheetName: 'Pending Claim List'
        };

        $scope.gridOptions.api.exportDataAsCsv(params);
    }

    function LoadData() {
        $('.select2').select2({
            allowClear: true,
            openOnEnter: true
        });

        $scope.DocumentTypeList = [];
        $http({
            method: 'GET',
            url: base_url + "Global/GetDocumentTypes",
            dataType: "json",
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.DocumentTypeList = res.data.Data
            } else {
                alert(res.data.ResponseMSG);
            }
        }, function (reason) {
            alert('Failed' + reason);
        });

        $scope.ProductGroupSummary = {
            DateFrom_TMP: new Date(),
            DateTo_TMP: new Date(),
            VoucherId: 0,
            IsPost: true,
            LedgerGroupId: 0,
            IsClearOnly: true,
            BranchId: 0
        };


        $timeout(function () {
            GlobalServices.getCompanyDet().then(function (res) {
                var comDet = res.data.Data;
                if (comDet) {
                    $scope.ProductGroupSummary.DateFrom_TMP = new Date(comDet.StartDate);
                }
            }, function (errormessage) {
                alert('Unable to Delete data. pls try again.' + errormessage.responseText);
            });
        });

        $scope.OpeningAmt = 0;
        $scope.CurrentAmt = 0;
        $scope.TotalAmt = 0;
        $scope.ReportName = '';
        $scope.noofdecimal = 2;

        $scope.loadingstatus = "stop";

        //{
        //    headerName: ' Opening ',
        //        children: [
        //            { headerName: "Qty.", width: 180, field: "O_Qty", cellStyle: { 'text-align': 'right' } },
        //            { headerName: "Rate", width: 180, field: "O_Rate", cellStyle: { 'text-align': 'right' } },
        //            { headerName: "Amt.", width: 180, field: "O_Amt", cellStyle: { 'text-align': 'right' } },
        //        ]
        //}

        var columnDefs = [

            {
                headerName: "Claim Id", width: 220,
                cellRenderer:
                    function (params) {
                        return '<center><a   href="' + base_url + '/apilog/' + params.data.ClaimId + '.json" download target="_blank" rel="noopener"">' + params.data.ClaimId  + '</a ></center>';
                    }
            },
                        
            { headerName: "SSF Code",   colId: 'det1', width: 120, field: "SSFCode", cellStyle: { 'text-align': 'left' } },
            { headerName: "Patient Id",  colId: 'det2', width: 140, field: "PatientId", cellStyle: { 'text-align': 'left' } },
            { headerName: "Name", width: 180, field: "Name", cellStyle: { 'text-align': 'left' } },
            { headerName: "Address", colId: 'det3', width: 210, field: "Address", cellStyle: { 'text-align': 'left' } },
            { headerName: "Mobile No", colId: 'det4', width: 140, field: "MobileNo", cellStyle: { 'text-align': 'left' } },
            { headerName: "District", width: 140, colId: 'det5', field: "District", cellStyle: { 'text-align': 'left' } },
            { headerName: "Booking Amount", width: 160, field: "BookingAmt", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "Date", width: 120, field: "VoucherMiti", cellStyle: { 'text-align': 'center' }, filter: "agTextColumnFilter", },
            { headerName: "Days", width: 120, field: "PendingDays", cellStyle: { 'text-align': 'center' }, filter: "agTextColumnFilter",},

            { headerName: "SchemeType", width: 140, colId: 'det5', field: "SchemeType", cellStyle: { 'text-align': 'left' } },
            { headerName: "TicketType", width: 140, colId: 'det5', field: "TicketType", cellStyle: { 'text-align': 'left' } },
            { headerName: "ServiceType", width: 140, colId: 'det5', field: "ServiceType", cellStyle: { 'text-align': 'left' } },
            { headerName: "ComName1", width: 140, colId: 'det5', field: "ComName1", cellStyle: { 'text-align': 'left' } },
            { headerName: "ComName2", width: 140, colId: 'det5', field: "ComName2", cellStyle: { 'text-align': 'left' } },
            {
                headerName: "Error JSON", width: 120, cellRenderer:
                    function (params) {
                        return '<center><a   href="' + base_url + '/apilog/' + params.data.ClaimId + '_Error.json" download target="_blank" rel="noopener"">' + params.data.ClaimId + '</a ></center>';
                    }
            },
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
            columnDefs: columnDefs,
            rowData: null,
            filter: true,
            suppressHorizontalScroll: true,
            alignedGrids: [],
            enableFilter: true,

            onFilterChanged: function () {
                var dt = {
                    BookingAmt: 0
                };

                $scope.gridOptions.api.forEachNodeAfterFilterAndSort(function (node) {
                    var fData = node.data;
                    dt.BookingAmt += fData.BookingAmt;
                });

                var filerDataColl = [];
                filerDataColl.push(dt);
                $scope.gridOptionsBottom.api.setRowData(filerDataColl);
            }

        };
       

        $scope.dataForBottomGrid = [
            {
                SNo: '',
                Name: 'Total =>',
                BalanceAmt: 0,
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

     
    $scope.ClearData = function () {

        $scope.dataForBottomGrid[0].BookingAmt = 0;

        $scope.gridOptionsBottom.api.setRowData($scope.dataForBottomGrid);

        $scope.DataColl = [];
        $scope.gridOptions.api.setRowData($scope.DataColl);
    };

    $scope.GetProductGroupSummary = function () {

        $scope.ClearData();
          
        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: "POST",
            url: base_url + "Inventory/Reporting/GetPendingSSFClaimLst",
            //data: JSON.stringify(beData),
            dataType: "json"
        }).then(function (res) {

            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                var DataColl = mx(res.data.Data);

                $scope.dataForBottomGrid[0].BookingAmt = DataColl.sum(p1 => p1.BookingAmt);

                $scope.gridOptionsBottom.api.setRowData($scope.dataForBottomGrid);
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
                                                        Period: $scope.ProductGroupSummary.DateFromDet.dateBS + " TO " + $scope.ProductGroupSummary.DateToDet.dateBS,
                                                        ProductGroup: '',
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
                                    Period: $scope.ProductGroupSummary.DateFromDet.dateBS + " TO " + $scope.ProductGroupSummary.DateToDet.dateBS,
                                    ProductGroup: '',
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

        var filterData = [];

        $scope.gridOptions.api.forEachNodeAfterFilterAndSort(function (node) {
            var dayBook = node.data;
            filterData.push(dayBook);
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
                down_file(base_url + "//" + res.data.Data.ResponseId, "ssfClaimList.xlsx");
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
