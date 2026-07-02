"use strict";

agGrid.initialiseAgGridWithAngular1(angular);

app.controller("BGDetails", function ($scope, $http, $filter, $timeout, GlobalServices, $compile) {

 var PrintPreviewAs = 1;
  const contextMenu = GlobalServices.createElementForMenu();
    LoadData();

    $scope.onBtExportCSV = function () {
        var params = {
            fileName: 'BGDetails.csv',
            sheetName: 'BGDetails'
        };

        $scope.gridOptions.api.exportDataAsCsv(params);
    }

    function LoadData() {
        $scope.ReportTypeColl = [{ text: 'PendingOnly', value: 'PendingOnly', dataType: 'text' }, { text: 'ClearOnly', value: 'ClearOnly', dataType: 'text' }, { text: 'Both', value: 'Both', dataType: 'text' },]

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
        $timeout(function () {
            $http({
                method: "GET",
                url: base_url + "Global/GetCompanyDetail",
                dataType: "json"
            }).then(function (res) {
                var comDet = res.data.Data;
                if (comDet) {
                    $scope.BGDetails.DateFrom_TMP = new Date(comDet.StartDate);
                }
            }, function (errormessage) {
                alert('Unable to Delete data. pls try again.' + errormessage.responseText);
            });
        });
        $scope.BGDetails = {
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

            { headerName: "For", width: 100, field: "FromTo", cellStyle: { 'text-align': 'left' }, pinned: 'left' },
            { headerName: "Code", width: 120, field: "Code", cellStyle: { 'text-align': 'left' }, pinned: 'left' },
            { headerName: "Name", width: 180, field: "Name", cellStyle: { 'text-align': 'left' }, pinned: 'left' },
            { headerName: "LedgerGroup", width: 180, field: "LedgerGroup", cellStyle: { 'text-align': 'left' } },
            { headerName: "Opening", width: 180, field: "OpeningAmt", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "DrAmt", width: 180, field: "DrAmt", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "CrAmt", width: 180, field: "CrAmt", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "Closing", width: 180, field: "Closing", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            
            { headerName: "AreaName", width: 180, field: "AreaName", cellStyle: { 'text-align': 'left' } },
            { headerName: "Address", width: 180, field: "Address", cellStyle: { 'text-align': 'left' } },
            { headerName: "EmailId", width: 180, field: "EmailId", cellStyle: { 'text-align': 'left' } },
            { headerName: "MobileNo", width: 180, field: "MobileNo", cellStyle: { 'text-align': 'right' } },
            { headerName: "BankName", width: 180, field: "BankName", cellStyle: { 'text-align': 'left' } },
            { headerName: "BranchName", width: 180, field: "BranchName", cellStyle: { 'text-align': 'left' } },
            { headerName: "BGNo", width: 180, field: "BGNo", cellStyle: { 'text-align': 'right' } },
            { headerName: "Amount", width: 180, field: "Amount", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "Hold Amt.", width: 180, field: "MarginHoldAmt", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "IssuesDate", width: 180, field: "IssuesDate", cellStyle: { 'text-align': 'center' }, valueFormatter: function (params) { return DateFormatAD(params.value); }, },
            { headerName: "IssuesDateBS", width: 180, field: "IssuesDateBS", cellStyle: { 'text-align': 'center' } },
            { headerName: "ExpiredDate", width: 180, field: "ExpiredDate", cellStyle: { 'text-align': 'center' }, valueFormatter: function (params) { return DateFormatAD(params.value); }, },
            { headerName: "ExpiredDateBS", width: 180, field: "ExpiredDateBS", cellStyle: { 'text-align': 'center' } },
            { headerName: "Remarks", width: 180, field: "Remarks", cellStyle: { 'text-align': 'left' } },
            { headerName: "Status", width: 180, field: "Status", cellStyle: { 'text-align': 'left' } },
            { headerName: "ExpiredAfterDays", width: 180, field: "ExpiredAfterDays", cellStyle: { 'text-align': 'right' } },
            { headerName: "CreditLimitAmt", width: 180, field: "CreditLimitAmt", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "CreditLimitDays", width: 180, field: "CreditLimitDays", cellStyle: { 'text-align': 'right' } },
            { headerName: "PanVatNo", width: 180, field: "PanVatNo", cellStyle: { 'text-align': 'right' } },
            { headerName: "HaveDocument", width: 180, field: "HaveDocument", cellStyle: { 'text-align': 'center' } },
            { headerName: "Reason", width: 180, field: "Reason", cellStyle: { 'text-align': 'left' } },
            { headerName: "DeActiveDateAD", width: 180, field: "DeActiveDateAD", cellStyle: { 'text-align': 'center' }, valueFormatter: function (params) { return DateFormatAD(params.value); },},
            { headerName: "DeActiveDateBS", width: 180, field: "DeActiveDateBS", cellStyle: { 'text-align': 'center' } },


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
                        '</ul>' +
                        '</div>';
                },
                pinned: 'right'
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

                var OpeningAmt = 0, DrAmt = 0, CrAmt = 0, Closing = 0, Amount = 0, CreditLimitAmt = 0, MarginHoldAmt=0;
                $scope.gridOptions.api.forEachNodeAfterFilterAndSort(function (node) {
                    var dt = node.data;
                    Amount += dt.Amount;
                    OpeningAmt += dt.OpeningAmt;
                    DrAmt += dt.DrAmt;
                    CrAmt += dt.CrAmt;
                    Closing += dt.Closing;
                    CreditLimitAmt += dt.CreditLimitAmt;
                    MarginHoldAmt += dt.MarginHoldAmt;
                });
             
                $scope.dataForBottomGrid[0].OpeningAmt = OpeningAmt;
                $scope.dataForBottomGrid[0].DrAmt = DrAmt;
                $scope.dataForBottomGrid[0].CrAmt = CrAmt;
                $scope.dataForBottomGrid[0].Closing = Closing;
                $scope.dataForBottomGrid[0].Amount = Amount;
                $scope.dataForBottomGrid[0].CreditLimitAmt = CreditLimitAmt;
                $scope.dataForBottomGrid[0].MarginHoldAmt = MarginHoldAmt;
                $scope.gridOptionsBottom.api.setRowData($scope.dataForBottomGrid);
            }

        };

        // lookup the container we want the Grid to use
        //$scope.eGridDiv = document.querySelector('#datatable');

        // create the grid passing in the div to use together with the columns & data we want to use
        //new agGrid.Grid($scope.eGridDiv, $scope.gridOptions);

        $scope.dataForBottomGrid = [
            {
                AutoNumber: '',
                Name: 'Total =>',
                Amount: 0,
                DrAmt: ''
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

$timeout(function () {
            GlobalServices.getListState(EntityId, $scope.gridOptions);
        });

    }
   
    $scope.GetBGDetails = function () {
        var dateFrom = new Date(($filter('date')(new Date(), 'yyyy-MM-dd')));
        var dateTo = new Date(($filter('date')(new Date(), 'yyyy-MM-dd')));

        if ($scope.BGDetails.DateFromDet)
            dateFrom = new Date(($filter('date')($scope.BGDetails.DateFromDet.dateAD, 'yyyy-MM-dd')));

        if ($scope.BGDetails.DateToDet)
            dateTo = new Date(($filter('date')($scope.BGDetails.DateToDet.dateAD, 'yyyy-MM-dd')));

       

        var beData = {
            DateFrom: dateFrom,
            DateTo: dateTo,
            VoucherType: $scope.BGDetails.VoucherId,
            isPost: $scope.BGDetails.IsPost,
            branchId: $scope.BGDetails.BranchId
        };
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
            method: 'POST',
            url: base_url + "Account/Reporting/GetAllBGDetails",
            data: JSON.stringify(beData),
            dataType: "json"
            //data:JSON.stringify(para)
        }).then(function (res) {

            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                $scope.DataColl = res.data.Data;

                var OpeningAmt = 0, DrAmt = 0, CrAmt = 0, Closing = 0, Amount = 0, CreditLimitAmt = 0, MarginHoldAmt=0;
                $scope.DataColl.forEach(function (dt) {                    
                    Amount += dt.Amount;
                    OpeningAmt += dt.OpeningAmt;
                    DrAmt += dt.DrAmt;
                    CrAmt += dt.CrAmt;
                    Closing += dt.Closing;
                    CreditLimitAmt += dt.CreditLimitAmt;
                    MarginHoldAmt += dt.MarginHoldAmt;
                });

                $scope.dataForBottomGrid[0].OpeningAmt = OpeningAmt;
                $scope.dataForBottomGrid[0].DrAmt = DrAmt;
                $scope.dataForBottomGrid[0].CrAmt = CrAmt;
                $scope.dataForBottomGrid[0].Closing = Closing;
                $scope.dataForBottomGrid[0].Amount = Amount;
                $scope.dataForBottomGrid[0].CreditLimitAmt = CreditLimitAmt;
                $scope.dataForBottomGrid[0].MarginHoldAmt = MarginHoldAmt;
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

    $scope.ShowDocument = function (beData) {

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


                    $('#modal-showDocument').modal('show');

                } else {
                    Swal.fire(res.data.ResponseMSG);
                }

            }, function (reason) {
                Swal.fire('Failed' + reason);
            });
        }

    }

    $scope.SelectedTran = {};
    $scope.ShowDocument = function (beData) {
        $scope.SelectedTran = beData;
        $('#modal-showDocument').modal('show');
    }
    $scope.ShowPersonalImg = function (docDet) {
        $scope.viewImg = {
            ContentPath: '',
            File: null,
            FileData: null
        };
        if (docDet.DocPath || docDet.File) {
            $scope.viewImg.ContentPath = docDet.DocPath;
            $scope.viewImg.File = docDet.File;
            $scope.viewImg.FileData = docDet.DocumentData;
            $('#PersonalImg').modal('show');
        } else
            Swal.fire('No Image Found');

    };

    $scope.GetDataForPrint = function () {

        var filterData = [];

        $scope.gridOptions.api.forEachNodeAfterFilterAndSort(function (node) {
            var dayBook = node.data;
            filterData.push(dayBook);
        });

        return filterData;
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
    $scope.DownloadAsXls = function () {

        $scope.loadingstatus = 'running';
        showPleaseWait();

        var dataColl = $scope.GetDataForPrint();

        var paraData = {
            Period: $scope.BGDetails.DateFromDet.dateBS + " TO " + $scope.BGDetails.DateToDet.dateBS,
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
                down_file(base_url + "//" + res.data.Data.ResponseId, "BGDetails.xlsx");
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
