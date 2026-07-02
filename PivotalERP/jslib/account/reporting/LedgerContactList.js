

"use strict";

agGrid.initialiseAgGridWithAngular1(angular);



app.controller("LedgerContactListCtrl", function ($scope, $http, $filter, $timeout, GlobalServices) {
    $scope.Title = 'LedgerContactList';
var PrintPreviewAs = 1;
 const contextMenu = GlobalServices.createElementForMenu();
    LoadData();


    function LoadData() {
        $scope.loadingstatus = 'running';

 $scope.GenConfig = {};
        GlobalServices.getGenConfig().then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.GenConfig = res.data.Data;
                PrintPreviewAs = $scope.GenConfig.PrintPreviewAs;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });


        $scope.columnDefs = [
            { headerName: "S.No", field: "SNo", filter: 'agNumberColumnFilter', width: 90, pinned: 'left', dataType: 'Number', cellStyle: { 'text-align': 'center' } },
            { headerName: "Code", field: "Code", filter: "agTextColumnFilter", width: 110, dataType: 'Text', pinned: 'left', cellStyle: { 'text-align': 'left' } },
            { headerName: "Name", field: "Name", filter: "agTextColumnFilter", width: 190, dataType: 'Text', pinned: 'left', cellStyle: { 'text-align': 'left' } },
            { headerName: "Group Name", field: "GroupName", filter: 'agTextColumnFilter', width: 140, dataType: 'Text', pinned: 'left',cellStyle:{'text-align':'left'}},
            { headerName: "Address", field: "Address", filter: 'agTextColumnFilter', width: 140, dataType: 'Text',cellStyle:{'text-align':'left'} },
            { headerName: "PanVat", field: "PanVat", filter: 'agTextColumnFilter', width: 110, dataType: 'Text',cellStyle:{'text-align':'right'}},
            { headerName: "Contact Person", field: "ContactPerson", filter: 'agTextColumnFilter', width: 150, dataType: 'Text',cellStyle:{'text-align':'left'} },
           
            { headerName: "Mobile", field: "MobileNo", filter: 'agTextColumnFilter', width: 110, dataType: 'Text',cellStyle:{'text-align':'center'} },
            { headerName: "TelNo", field: "TelNo", filter: 'agTextColumnFilter', width: 110, dataType: 'Text',cellStyle:{'text-align':'center'} },
            { headerName: "Remarks", field: "Remarks", filter: 'agTextColumnFilter', width: 110, dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Agent Code", field: "AgentCode", filter: 'agTextColumnFilter', width: 170, dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Agent Name", field: "AgentName", filter: 'agTextColumnFilter', width: 170, dataType: 'Text',cellStyle:{'text-align':'left'} },
            { headerName: "Agent ContactNo", field: "AgentContactNo", filter: 'agTextColumnFilter', width: 180, dataType: 'Text',cellStyle:{'text-align':'center'}},
            { headerName: "Agent PhoneNo", field: "AgentPhoneNo", filter: 'agTextColumnFilter', width: 180, dataType: 'Text',cellStyle:{'text-align':'center'}},
            { headerName: "Agent Email", field: "AgentEmail", filter: 'agTextColumnFilter', width: 150, dataType: 'Text', cellStyle: { 'text-align': 'left' } },

            { headerName: "Parent Name", field: "ParentName", filter: 'agTextColumnFilter', width: 250, dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Parent Code", field: "ParentCode", filter: 'agTextColumnFilter', width: 120, dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Lat", field: "Lat", filter: 'agNumberColumnFilter', width: 150, dataType: 'Number', cellStyle: { 'text-align': 'left' } },
            { headerName: "Lng", field: "Lng", filter: 'agNumberColumnFilter', width: 150, dataType: 'Number', cellStyle: { 'text-align': 'left' } },
            { headerName: "Route Name", field: "RouteName", filter: 'agTextColumnFilter', width: 250, dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Route Code", field: "RouteCode", filter: 'agTextColumnFilter', width: 120, dataType: 'Text', cellStyle: { 'text-align': 'left' } },
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

    $scope.GetAllLedgerContactList = function () {


        if ($scope.loadingstatus != "stop") {
            alert('Already Running Process')
            return;
        }

        $scope.loadingstatus = 'running';
        showPleaseWait();

        $scope.DataColl = []; //declare an empty array
        
        $scope.gridOptions.api.setRowData(null); //declare an empty array
        $http({
            method: 'GET',
            url: base_url + "Account/Reporting/GetAllLedgerContactList",
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
                                            GlobalServices.PrintReportData(EntityId, dataColl).then(function (res) {

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

                        GlobalServices.PrintReportData(EntityId, dataColl).then(function (res) {
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
                down_file(base_url + "//" + res.data.Data.ResponseId, "LedgerContactList.xlsx");
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