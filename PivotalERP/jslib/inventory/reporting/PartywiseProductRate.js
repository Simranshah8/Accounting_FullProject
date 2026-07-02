

"use strict";

agGrid.initialiseAgGridWithAngular1(angular);

app.controller("partyWiseProductRateCtrl", function ($scope, $http, $filter, $timeout,GlobalServices) {
    $scope.Title = 'Product';
  var PrintPreviewAs = 1;
    const contextMenu = GlobalServices.createElementForMenu();
	
    LoadData();

    function LoadData() {

        $scope.newPrint = {
            minRows: 0
        };

        $('.select2').select2({
            allowClear: true,
            openOnEnter: true
        });
        $scope.loadingstatus = 'running';
        $scope.columnDefs = [
            { headerName: "S.No", field: "SNo", filter: 'agNumberColumnFilter', dataType: 'Number', width: 100, pinned: 'left', cellStyle: { 'text-align': 'center' } },

            { headerName: "PartyName", field: "PartyName", dataType: 'Text', filter: "agTextColumnFilter", pinned: 'left', width: 300,  cellStyle: { 'text-align': 'left' } },
            { headerName: "Address", field: "Address", dataType: 'Text', filter: "agTextColumnFilter", width: 200,  cellStyle: { 'text-align': 'left' } },
            { headerName: "Agent", field: "Agent1", filter: "agTextColumnFilter", dataType: 'Text', width: 180,  cellStyle: { 'text-align': 'left' } },
            { headerName: "ProductName", field: "ProductName", filter: "agTextColumnFilter", dataType: 'Text', width: 200,  cellStyle: { 'text-align': 'left' } },
            { headerName: "Code", field: "Code", filter: "agTextColumnFilter", dataType: 'Number', width: 110,  cellStyle: { 'text-align': 'left' } },
            { headerName: "ProductGroup", field: "ProductGroup", dataType: 'Text', filter: "agTextColumnFilter", width: 200,  cellStyle: { 'text-align': 'left' } },
            { headerName: "Applicable Date", field: "ApplicableFrom", dataType: 'DateTime', filter: "agDateColumnFilter", width: 180,  cellStyle: { 'text-align': 'center' } },
            { headerName: "Applicable Miti", field: "ApplicableFromMiti", dataType: 'DateTime', filter: "agTextColumnFilter", width: 180,  cellStyle: { 'text-align': 'center' } },
            { headerName: "PurchaseRate", field: "PurchaseRate", dataType: 'Number', filter: 'agNumberColumnFilter', width: 180, cellStyle: { 'text-align': 'right' } },
            { headerName: "SalesRate", field: "SalesRate", dataType: 'Number', filter: 'agNumberColumnFilter', width: 150, cellStyle: { 'text-align': 'right' } },
            { headerName: "Unit", field: "Unit", dataType: 'Number', filter: 'agTextColumnFilter', width: 110, cellStyle: { 'text-align': 'left' } },
            { headerName: "LogDateTime", field: "LogDateTime", dataType: 'DateTime', filter: 'agDateColumnFilter', width: 180, cellStyle: { 'text-align': 'left' } },
            { headerName: "LogMiti", field: "LogMiti", dataType: 'DateTime', filter: 'agTextColumnFilter', width: 180, cellStyle: { 'text-align': 'left' } },
            { headerName: "UpdateBy", field: "UpdateBy", dataType: 'Text', filter: 'agTextColumnFilter', width: 180, cellStyle: { 'text-align': 'left' } },

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
            enableFilter: true

        };

        // lookup the container we want the Grid to use
        $scope.eGridDiv = document.querySelector('#datatable');

        // create the grid passing in the div to use together with the columns & data we want to use
        new agGrid.Grid($scope.eGridDiv, $scope.gridOptions);
        $scope.loadingstatus = "stop";
		
		 $timeout(function () {
            GlobalServices.getListState(EntityId, $scope.gridOptions);
        });
    }


    $scope.GetAllProduct = function () {
        if ($scope.loadingstatus != 'stop') {
            alert('Already Running Process')
            return;
        }

        $scope.loadingstatus = 'running';
        showPleaseWait();

        $scope.DataColl = []; //declare an empty array
        $http({
            method: 'GET',
            url: base_url + "Inventory/Reporting/GetAllPartywiseProductRate",
            dataType: "json"
            //data:JSON.stringify(para)
        }).then(function (res) {
            $scope.loadingstatus = 'stop';
            hidePleaseWait();
            if (res.data.IsSuccess && res.data.Data) {
                $scope.DataColl = res.data.Data;

                $scope.gridOptions.api.setRowData($scope.DataColl);
            } else
                alert(res.data.ResponseMSG);

        }, function (reason) {
            $scope.loadingstatus = "stop";
            alert('Failed' + reason);
        });

    }


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

    $scope.Print = function (forBarCode) {

        var minR = '';
        if (forBarCode && $scope.newPrint) {
            $('#FrmMinRowsReport').modal('hide');
            minR = "&minRows=" + $scope.newPrint.minRows;
        }


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
                                            var dataColl = (forBarCode == true ? $scope.BarCodeData : $scope.GetDataForPrint());
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

                                                    //document.body.style.cursor = 'wait';
                                                    //document.getElementById("frmRpt").src = '';
                                                    //document.getElementById("frmRpt").src = base_url + "web/ReportViewer.aspx?rpttranid=" + rptTranId + "&istransaction=false&entityid=" + EntityId + "&voucherid=0&tranid=0&vouchertype=0&sessionid=" + res.data.Data.ResponseId+minR;
                                                    //document.body.style.cursor = 'default';
                                                    //$('#FrmPrintReport').modal('show');


                                                    //$scope.loadingstatus = 'running';
                                                    //showPleaseWait();
                                                    var newURL = base_url + "web/ReportViewer.aspx?rpttranid=" + rptTranId + "&istransaction=false&entityid=" + EntityId + "&voucherid=0&tranid=0&vouchertype=0&sessionid=" + res.data.Data.ResponseId + minR;
                                                    window.open(newURL);

                                                    //  $scope.loadingstatus = "stop";
                                                    //  hidePleaseWait();

                                                    //$http({
                                                    //    url: newURL,
                                                    //    method: "GET",
                                                    //    headers: {
                                                    //        "Content-type": "application/pdf"
                                                    //    },
                                                    //    responseType: "arraybuffer"
                                                    //}).then(function (resPDF) {

                                                    //    var pdfFile = new Blob([resPDF.data], {
                                                    //        type: "application/pdf"
                                                    //    });
                                                    //    var pdfUrl = URL.createObjectURL(pdfFile);

                                                    //    $scope.loadingstatus = "stop";
                                                    //    hidePleaseWait();

                                                    //    printJS(pdfUrl);

                                                    //}, function (errormessage) {
                                                    //    alert('Unable to Delete data. pls try again.' + errormessage.responseText);
                                                    //});

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
                        var dataColl = (forBarCode == true ? $scope.BarCodeData : $scope.GetDataForPrint());
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



                                //document.body.style.cursor = 'wait';
                                //document.getElementById("frmRpt").src = '';
                                //document.getElementById("frmRpt").src = base_url + "web/ReportViewer.aspx?rpttranid=" + rptTranId + "&istransaction=false&entityid=" + EntityId + "&voucherid=0&tranid=0&vouchertype=0&sessionid=" + res.data.Data.ResponseId + minR;
                                //document.body.style.cursor = 'default';
                                //$('#FrmPrintReport').modal('show');

                                //$scope.loadingstatus = 'running';
                                //showPleaseWait();
                                var newURL = base_url + "web/ReportViewer.aspx?rpttranid=" + rptTranId + "&istransaction=false&entityid=" + EntityId + "&voucherid=0&tranid=0&vouchertype=0&sessionid=" + res.data.Data.ResponseId + minR;
                                window.open(newURL);

                                //$scope.loadingstatus = "stop";
                                //hidePleaseWait();

                                //$http({
                                //    url: newURL,
                                //    method: "GET",
                                //    //headers: {
                                //    //    "Content-type": "application/pdf"
                                //    //},
                                //    responseType: "arraybuffer"
                                //}).then(function (resPDF) {

                                //    var pdfFile = new Blob([resPDF.data], {
                                //        type: "application/pdf"
                                //    });
                                //    var pdfUrl = URL.createObjectURL(pdfFile);

                                //    $scope.loadingstatus = "stop";
                                //    hidePleaseWait();

                                //    printJS(pdfUrl);

                                //}, function (errormessage) {
                                //    alert('Unable to Delete data. pls try again.' + errormessage.responseText);
                                //});

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

    $scope.BarCodeData = [];
    $scope.PrintBarCode = function () {

        $scope.BarCodeData = [];
        var selectedRows = $scope.gridOptions.api.getSelectedNodes();
        if (selectedRows && selectedRows.length > 0) {
            $scope.BarCodeData.push(selectedRows[0].data);
            $('#FrmMinRowsReport').modal('show');
        } else {
            Swal.fire("Select Any One Product From List");
        }

        return $scope.BarCodeData;
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
                down_file(base_url + "//" + res.data.Data.ResponseId, "partyWiseProductRate.xlsx");
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