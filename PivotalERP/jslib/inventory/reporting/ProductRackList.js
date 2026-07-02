

"use strict";

agGrid.initialiseAgGridWithAngular1(angular);
 
app.controller("ProductRackList", function ($scope, $http, $filter, $timeout,GlobalServices) {
    $scope.Title = 'ProductRackList';
  var PrintPreviewAs = 1;
    const contextMenu = GlobalServices.createElementForMenu();
	
    LoadData();

    function Numberformat(val) {
        return $filter('number')(val, 2);
    }

    function LoadData() {

        $scope.RackColl = [];
        $http({
            method: 'GET',
            url: base_url + "Inventory/Creation/GetAllRack",
            dataType: "json"
            //data:JSON.stringify(para)
        }).then(function (res) {
            $scope.RackColl = res.data.Data;
        }, function (reason) {
            alert('Failed' + reason);
        });

        $('.select2').select2({
            allowClear: true,
            openOnEnter: true
        });
        $scope.loadingstatus = 'running';
        $scope.columnDefs = [
            { headerName: "ProductId", field: "ProductId", dataType: 'Number', filter: 'agNumberColumnFilter', width: 120, pinned: 'left', cellStyle: { 'text-align': 'center' } },
            { headerName: "Name", field: "Name", filter: "agTextColumnFilter", dataType: 'Text', width: 300, pinned: 'left', cellStyle: { 'text-align': 'left' }  },
            { headerName: "Alias", field: "Alias", filter: "agTextColumnFilter", dataType: 'Text', width: 120, cellStyle: { 'text-align': 'left' } },
            { headerName: "Code", field: "Code", filter: "agTextColumnFilter", dataType: 'Number', width: 120, cellStyle: { 'text-align': 'left' } },
            { headerName: "ProductGroup", field: "ProductGroup", filter: "agTextColumnFilter", dataType: 'Text', width: 200, cellStyle: { 'text-align': 'left' } },
            { headerName: "Part No", field: "PartNo", filter: "agTextColumnFilter", width: 180, dataType: 'Number', cellStyle: { 'text-align': 'right' }},
            { headerName: "Unit", field: "Unit", filter: "agTextColumnFilter", width: 110, dataType: 'Number', cellStyle: { 'text-align': 'left' } },
            { headerName: "Brand", field: "Brand", filter: "agTextColumnFilter", width: 140, dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "RackCode", field: "RackCode", filter: "agTextColumnFilter", dataType: 'Number', width: 160, cellStyle: { 'text-align': 'left' } },
            { headerName: "RackDescription", field: "RackDescription", filter: "agTextColumnFilter", dataType: 'Text', width: 200, cellStyle: { 'text-align': 'left' } },
            { headerName: "Notes", field: "Notes", filter: "agTextColumnFilter", width: 180, dataType: 'Text', cellStyle: { 'text-align': 'left' }},
            { headerName: "SalesLedger", field: "SalesLedger", filter: "agTextColumnFilter", dataType: 'Text', width: 200, cellStyle: { 'text-align': 'left' } },

            {
                headerName: "Action",
                width: 50,
                cellRenderer: function (params) {
                    return '<div class="btn-group" style="position: fixed; ">' +
                        '<button type="button" class="btn btn-default px-1 dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
                        '<span class="caret"></span>' +
                        '</button>' +
                        '<ul class="dropdown-menu dropdown-menu-right p-2" style="position: absolute; left: 0;">' +
                        '<li><a data-toggle="tooltip" data-placement="top" title="Update Rack" ng-click="ShowRackModal(this)"><i class="fas fa-sticky-note"></i> Update Rack</a> </li>' +
                        '</ul>' +
                        '</div>';
                },
                pinned: 'right'
            },
        ];

        $scope.beData = {
            GodownId: 0
        };


        $scope.GodownList = [];
        $http({
            method: 'GET',
            url: base_url + "Inventory/Reporting/GetAllGodownList",
            dataType: "json",
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.GodownList = res.data.Data;

                if ($scope.GodownList && $scope.GodownList.length > 0)
                    $scope.beData.GodownId = $scope.GodownList[0].GodownId;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $('.select2').select2();

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
            enableFilter: true

        };


 $timeout(function () {
            GlobalServices.getListState(EntityId, $scope.gridOptions);
        });
      
    }


    $scope.SelectedProduct = null;
    $scope.ShowRackModal = function (e) {
         
        var obj = e.data;

        if (!obj)
            return;

        $scope.SelectedProduct = obj;

        $('#modal-post').modal('show');

    }

    $scope.UpdateProductRack = function () {

        $scope.loadingstatus = 'running';
        showPleaseWait();

        if ($scope.SelectedProduct.GodownId > 0) {

        } else {
            $scope.SelectedProduct.GodownId = $scope.beData.GodownId;
        }
        

        $http({
            method: 'POST',
            url: base_url + "Inventory/Reporting/UpdateProductRack",
            headers: { 'content-Type': undefined },

            transformRequest: function (data) {
                var formData = new FormData();
                formData.append("jsonData", angular.toJson(data.jsonData));
                return formData;
            },
            data: { jsonData: $scope.SelectedProduct }
        }).then(function (res) {

            $scope.loadingstatus = "stop";
            hidePleaseWait();
            Swal.fire(res.data.ResponseMSG);

            if (res.data.IsSuccess == true) {
                $('#modal-post').modal('hide');
            }

        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }


    $scope.GetAllProductRackList = function () {

        if ($scope.beData.GodownId > 0) {

        } else {
            return;
        }

        //if ($scope.loadingstatus != 'stop') {
        //    alert('Already Running Process')
        //    return;
        //}

        $scope.loadingstatus = 'running';
        showPleaseWait();

        var gid = 0;
        if ($scope.beData.GodownId > 0)
            gid = $scope.beData.GodownId;

        $scope.DataColl = []; //declare an empty array
        $http({
            method: 'GET',
            url: base_url + "Inventory/Reporting/GetAllProductRackList?GodownId="+gid,
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


    $scope.onFilterTextBoxChanged = function () {
        $scope.gridOptions.api.setQuickFilter($scope.search);
    }

    $scope.onBtExportCSV = function () {
        var params = {
            fileName: 'Racklist.csv',
            sheetName: 'Racklist'
        };

        $scope.gridOptions.api.exportDataAsCsv(params);
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
                down_file(base_url + "//" + res.data.Data.ResponseId, "ProductRackList.xlsx");
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