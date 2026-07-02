
"use strict";

agGrid.initialiseAgGridWithAngular1(angular); 

app.controller("LedgerRptCtrl", function ($scope, $http, $filter, $timeout, GlobalServices) {
var PrintPreviewAs = 1;
 const contextMenu = GlobalServices.createElementForMenu();
    LoadData();
     
     
    function LoadData() {
        $scope.loadingstatus = 'running';

        $scope.columnDefs = [
            { headerName: "S.No", field: "AutoNumber", filter: 'agNumberColumnFilter', width: 90, pinned: 'left', dataType: 'Number', cellStyle: { 'text-align': 'center' } },
            { headerName: "Name", field: "Name", filter: 'agTextColumnFilter', width: 250, pinned: 'left', dataType: 'Text',cellStyle: { 'text-align': 'left' } },
            { headerName: "Alias", field: "Alias", filter: 'agTextColumnFilter', width: 140, dataType: 'Text',cellStyle:{'text-align':'text'}},
            { headerName: "Code", field: "Code", filter: "agTextColumnFilter", width: 150, dataType: 'Text',cellStyle:{'text-align':'text'} },
         
            { headerName: "Address", field: "Address", filter: 'agTextColumnFilter', width: 150, dataType: 'Text',cellStyle:{'text-align':'text'}},
            { headerName: "Group", field: "LedgerGroupName", filter: 'agTextColumnFilter', width: 150, dataType: 'Text',cellStyle:{'text-align':'text'}},
            { headerName: "Pan/Vat", field: "PanVatNo", filter: 'agNumberColumnFilter', width: 150, dataType: 'Text',cellStyle:{'text-align':'center'}},
            { headerName: "Salesman", field: "AgentName", filter: 'agTextColumnFilter', width: 200, dataType: 'Text',cellStyle:{'text-align':'text'}},
            { headerName: "Area", field: "AreaName", filter: 'agTextColumnFilter', width: 150, dataType: 'Text',cellStyle:{'text-align':'text'}},
            { headerName: "CreditLimit Days", field: "CreditLimitDays", filter: 'agNumberColumnFilter', width: 170, dataType: 'Number', cellStyle: { 'text-align': 'Center' }},
            { headerName: "CreditLimit Amt", field: "CreditLimitAmount", filter: 'agNumberColumnFilter', width: 200, dataType: 'Number', cellStyle: { 'text-align': 'right' }, valueFormatter: function (params) { return $filter('formatNumber')(params.value); } },
            { headerName: "Currency", field: "CurrencyName", filter: 'agTextColumnFilter', width: 140, dataType: 'Text', cellStyle: { 'text-align': 'center' }},
            { headerName: "Opening Amount", field: "OpeningAmount", filter: 'agNumberColumnFilter', width: 160, dataType: 'Number', cellStyle: { 'text-align': 'right' }, valueFormatter: function (params) { return $filter('formatNumber')(params.value); } },
            { headerName: "DRCR", field: "DrCr", filter: 'agTextColumnFilter', width: 90, dataType: 'Number', cellStyle: { 'text-align': 'right' }},
            { headerName: "Debtor/Creditor Type", field: "DebtorTypeId", filter: 'agTextColumnFilter', width: 200, dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Debtor/Creditor Route", field: "DebtorRouteId", filter: 'agTextColumnFilter', width: 200, dataType: 'Text', cellStyle: { 'text-align': 'left' }},
            { headerName: "Costleft Applied", field: "CostleftsAreApplied", filter: 'agTextColumnFilter', width: 200, dataType: 'Text', cellStyle: { 'text-align': 'left' }},
            { headerName: "Billwise Adjustment", field: "BillWiseAdjustment", filter: 'agTextColumnFilter', width: 200, dataType: 'Text', cellStyle: { 'text-align': 'left' }},
            { headerName: "InventoryValueAffected", field: "InventoryValuesAreAffected", filter: 'agTextColumnFilter', dataType: 'Text', width: 200, cellStyle: { 'text-align': 'left' }},
            { headerName: "ActiveInterestCalculation", field: "ActiveInterestCalculation", filter: 'agTextColumnFilter', dataType: 'Text', width: 250, cellStyle: { 'text-align': 'right' }},
            { headerName: "Status", field: "Status", filter: 'agTextColumnFilter', width: 120, dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "MobileNo", field: "MobileNo", filter: 'agTextColumnFilter', width: 150, dataType: 'Text', cellStyle: { 'text-align': 'text' } },
            { headerName: "TelNo", field: "TelNo", filter: 'agTextColumnFilter', width: 150, dataType: 'Text', cellStyle: { 'text-align': 'text' } },
            { headerName: "Email", field: "EmailId", filter: 'agTextColumnFilter', width: 210, dataType: 'Text', cellStyle: { 'text-align': 'text' } },

            { headerName: "Province", field: "Province", filter: 'agTextColumnFilter', width: 160, dataType: 'Text', cellStyle: { 'text-align': 'text' } },
            { headerName: "District", field: "District", filter: 'agTextColumnFilter', width: 160, dataType: 'Text', cellStyle: { 'text-align': 'text' } },
            { headerName: "Palika", field: "Palika", filter: 'agTextColumnFilter', width: 210, dataType: 'Text', cellStyle: { 'text-align': 'text' } },
            { headerName: "Tole", field: "Tole", filter: 'agTextColumnFilter', width: 210, dataType: 'Text', cellStyle: { 'text-align': 'text' } },
            { headerName: "WardNo", field: "WardNo", filter: 'agTextColumnFilter', width: 110, dataType: 'Text', cellStyle: { 'text-align': 'text' } },

        ];


 $scope.GenConfig = {};
        GlobalServices.getGenConfig().then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.GenConfig = res.data.Data;
                PrintPreviewAs = $scope.GenConfig.PrintPreviewAs;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });


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
               
                var Opening = 0;
                var sno = 1;
                $scope.gridOptions.api.forEachNodeAfterFilterAndSort(function (node)
                {
                    node.data.AutoNumber = sno;
                    if (node.data.DrCr == 1 || node.data.DrCr=='DR')
                        Opening += node.data.OpeningAmount;
                    else
                        Opening -= node.data.OpeningAmount;

                    sno++;
               });

                var drcr = '';
                if (Opening > 0)
                    drcr = 'DR';
                else if(Opening<0)
                    drcr = 'CR'

                Opening = Math.abs(Opening);

                $scope.dataForBottomGrid[0].OpeningAmount = Opening;
                $scope.dataForBottomGrid[0].DrCr = drcr;
                $scope.gridOptionsBottom.api.setRowData($scope.dataForBottomGrid);
            }

        };

        // lookup the container we want the Grid to use
        $scope.eGridDiv = document.querySelector('#datatable');

        // create the grid passing in the div to use together with the columns & data we want to use
        new agGrid.Grid($scope.eGridDiv, $scope.gridOptions);

        $scope.dataForBottomGrid = [
            {
                AutoNumber: '',
                Name: 'Total =>',
                OpeningAmount: 0,
                DrCr:''
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
        $scope.loadingstatus = "stop";
		
		$timeout(function () {
            GlobalServices.getListState(EntityId, $scope.gridOptions);
        });

    }

    $scope.GetAllLedger = function () {

        if ($scope.loadingstatus != 'stop') {
            alert('Already Running Process')
            return;
        }

        $scope.loadingstatus = 'running';
        showPleaseWait();

        $scope.DataColl = []; //declare an empty array
        $scope.gridOptionsBottom.api.setRowData(null);
        $scope.gridOptions.api.setRowData(null); //declare an empty array
        $http({
            method: 'GET',
            url: base_url + "Account/Reporting/GetAllLedger",
            dataType: "json"
            //data:JSON.stringify(para)
        }).then(function (res) {

            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                $scope.DataColl = res.data.Data;

                var Opening = 0;
                angular.forEach($scope.DataColl, function (dc) {
                    if (dc.DrCr == 1 || dc.DrCr == 'DR')
                        Opening += dc.OpeningAmount;
                    else
                        Opening -= dc.OpeningAmount;
                });

                var drcr = '';
                if (Opening > 0)
                    drcr = 'DR';
                else if (Opening < 0)
                    drcr = 'CR'

                Opening = Math.abs(Opening);


                $scope.dataForBottomGrid[0].OpeningAmount = Opening;
                $scope.dataForBottomGrid[0].DrCr = drcr;
                $scope.gridOptionsBottom.api.setRowData($scope.dataForBottomGrid);

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

    $scope.onBtExportCSV = function () {
        var params = {
            fileName: 'Ledger.csv',
            sheetName: 'Ledger'
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
                                            var dataColl =  $scope.GetDataForPrint();
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

                        GlobalServices.PrintReportData(EntityId, dataColl).then(function (res)
                        {
                            $scope.loadingstatus = "stop";
                            hidePleaseWait();
                            if (res.data.IsSuccess && res.data.Data) {
                                 
                                document.body.style.cursor = 'wait';
                                document.getElementById("frmRpt").src = '';
                                document.getElementById("frmRpt").src = base_url + "web/ReportViewer.aspx?rpttranid=" + rptTranId + "&istransaction=false&entityid=" + EntityId + "&voucherid=0&tranid=0&vouchertype=0&sessionid=" + res.data.Data.ResponseId ;
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
         
        var paraData = {};
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
                down_file(base_url + "//" + res.data.Data.ResponseId, "Ledger.xlsx");
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