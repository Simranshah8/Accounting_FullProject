"use strict";

agGrid.initialiseAgGridWithAngular1(angular);
 
app.controller("costcenterAgeingController", function ($scope, $http, $filter, $timeout, GlobalServices, $compile) {

  var PrintPreviewAs = 1;
    const contextMenu = GlobalServices.createElementForMenu();
	
    getterAndSetter();
    LoadData();

    $scope.onBtExportCSV = function () {
        var params = {
            fileName: 'partyAgeing.csv',
            sheetName: 'partyAgeing'
        };

        $scope.gridOptions.api.exportDataAsCsv(params);
    }

    function getterAndSetter() {

        $scope.columnDefs = [
            { headerName: "Party", field: "LedgerName", width: 250, filter: "agTextColumnFilter", pinned: 'left', },
            { headerName: "Alias", field: "Alias", width: 130, filter: "agTextColumnFilter", },
            { headerName: "Code", field: "LedgerCode", width: 130, filter: "agTextColumnFilter", },
            { headerName: "Address", field: "Address",  width: 230, filter: "agTextColumnFilter", },
            { headerName: "Category", field: "GroupName",  width: 180, filter: "agTextColumnFilter",  },
            { headerName: "Mobile No.", field: "MobileNo",  width: 130, filter: "agTextColumnFilter",  },
            { headerName: "PanVat", field: "PanVatNo",  width: 130, filter: "agTextColumnFilter", },
            {
                headerName: "Opening", field: "Opening", width: 150, filter: "agNumberColumnFilter", valueFormatter: function (params) { return NumberformatAC(params.value); }, cellStyle: { 'text-align': 'right' },
            },
            { headerName: "Transaction Dr", field: "DrAmount", width: 150, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' }, },
            { headerName: "Transaction Cr", field: "CrAmount", width: 150, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' }, },
            { headerName: "Closing", field: "Closing", width: 150, filter: "agNumberColumnFilter", valueFormatter: function (params) { return NumberformatAC(params.value); }, cellStyle: { 'text-align': 'right' }, },
            { headerName: "R1", field: "R1", colId:'colR1', hide:true, width: 150, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' }, },
            { headerName: "R2", field: "R2", colId: 'colR2', hide: true, width: 150, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' }, },
            { headerName: "R3", field: "R3", colId: 'colR3', hide: true, width: 150, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' }, },
            { headerName: "R4", field: "R4", colId: 'colR4', hide: true, width: 150, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' }, },
            { headerName: "R5", field: "R5", colId: 'colR5', hide: true, width: 150, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' }, },
            { headerName: "R6", field: "R6", colId: 'colR6', hide: true, width: 150, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' }, },
            { headerName: "R7", field: "R7", colId: 'colR7', hide: true, width: 150, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' }, },
            { headerName: "R8", field: "R8", colId: 'colR8', hide: true, width: 150, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' }, },
            { headerName: "R9", field: "R9", colId: 'colR9', hide: true, width: 150, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' }, },
            { headerName: "R10", field: "R10", colId: 'colR10', hide: true, width: 150, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' }, },
            { headerName: "R", field: "R", colId: 'colR', hide: true, width: 150, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' }, },
 
        ];

        // let the grid know which columns and what data to use
        $scope.gridOptions = {
			onCellContextMenu: onCellContextMenu, // Handle right-click event			
            columnDefs: $scope.columnDefs,

            defaultColDef: {
                resizable: true,
                sortable: true,
                filter: true,
                resizable: true,
                cellStyle: { 'line-height': '31px' },
                rowSelection: 'multiple'
            },
			overlayLoadingTemplate: "Please Click the Load Bottom to display the data",
            enableColResize: true,
            rowData: null,
            filter: true,
            enableFilter: true,
            multiSortKey: 'ctrl',
            suppressHorizontalScroll: true,
            alignedGrids: [],
            rowSelection: 'multiple',
            onFilterChanged: function () {

                var Opening = 0, DrAmount = 0, CrAmount = 0, Closing = 0, R = 0, R1 = 0, R2 = 0, R3 = 0, R4 = 0, R5 = 0, R6 = 0, R7 = 0, R8 = 0, R9 = 0, R10 = 0;
                $scope.gridOptions.api.forEachNodeAfterFilterAndSort(function (node) {
                    var d = node.data;
                    Opening += d.Opening;
                    DrAmount += d.DrAmount;
                    CrAmount += d.CrAmount;
                    Closing += d.Closing;
                    R += d.R;
                    R1 += d.R1;
                    R2 += d.R2;
                    R3 += d.R3;
                    R4 += d.R4;
                    R5 += d.R5;
                    R6 += d.R6;
                    R7 += d.R7;
                    R8 += d.R8;
                    R9 += d.R9;
                    R10 += d.R10;
                });

                var filerDataColl = [];
                filerDataColl.push({
                    Party:'Total =>',
                    Opening :Opening,
                    DrAmount :DrAmount,
                    CrAmount :CrAmount,
                    Closing :Closing,
                    R:R,
                    R1:R1,
                    R2:R2,
                    R3:R3,
                    R4:R4,
                    R5:R5,
                    R6:R6,
                    R7:R7,
                    R8:R8,
                    R9:R9,
                    R10:R10
                });
                $scope.gridOptionsBottom.api.setRowData(filerDataColl);
            }
            
        };


        $scope.dataForBottomGrid = [
            { 
                Party: 'Total =>',              
            }];

        $scope.gridOptionsBottom = {
            defaultColDef: {
                resizable: true,
                width: 90
            },
            columnDefs: $scope.columnDefs,
            rowData: $scope.dataForBottomGrid,
            debug: true,
            rowClass: 'bold-row', 
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

    function LoadData() {

        $('.select2').select2({
            allowClear: true,
            openOnEnter: true
        });

        $scope.AgeList = [];
        $scope.AgeList.push({
            Age: 15
        });
        $scope.AgeList.push({
            Age: 30
        });
        $scope.AgeList.push({
            Age: 60
        });
        $scope.AgeList.push({
            Age: 90
        });
         

        $scope.PartyAgeing = {
            DateFrom_TMP: new Date(),
            DateTo_TMP: new Date(),
            GroupId: 12,
            BranchId: 0,
            ShowZeroBalance: false
        };

        $timeout(function () {
            $http({
                method: "GET",
                url: base_url + "Global/GetCompanyDetail",
                dataType: "json"
            }).then(function (res) {
                var comDet = res.data.Data;
                if (comDet) {
                    $scope.PartyAgeing.DateFrom_TMP = new Date(comDet.StartDate); 
                }
            }, function (errormessage) {
                alert('Unable to Delete data. pls try again.' + errormessage.responseText);
            });
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

        $scope.loadingstatus = "stop";



    }

    $scope.showAgeDialog = function () {

        var data = [];
        $scope.gridOptions.api.setRowData(data);

        $('#modal-agerange').modal('show');
    };
    $scope.getPartyAgeing = function () {

        $('#modal-agerange').modal('hide');
         
        $scope.gridOptions.columnApi.setColumnVisible('colR1', false);
        $scope.gridOptions.columnApi.setColumnVisible('colR2', false);
        $scope.gridOptions.columnApi.setColumnVisible('colR3', false);
        $scope.gridOptions.columnApi.setColumnVisible('colR4', false);
        $scope.gridOptions.columnApi.setColumnVisible('colR5', false);
        $scope.gridOptions.columnApi.setColumnVisible('colR6', false);
        $scope.gridOptions.columnApi.setColumnVisible('colR7', false);
        $scope.gridOptions.columnApi.setColumnVisible('colR8', false);
        $scope.gridOptions.columnApi.setColumnVisible('colR9', false);
        $scope.gridOptions.columnApi.setColumnVisible('colR10', false);
        $scope.gridOptions.columnApi.setColumnVisible('colR', false);
         
        var agePara = [];
        var ind = 0;
        var lastCol = false;
        angular.forEach($scope.AgeList, function (al)
        {
            if (al.Age != 0) {
                agePara.push(al.Age);
                $scope.gridOptions.columnApi.setColumnVisible('colR' + (ind + 1), true);
                //$scope.gridOptions.columnApi.getColumn('colR' + (ind + 1)).colDef.hide = false;

                var colName = 'colR' + (ind + 1);
                if (ind == 0) {
                    $scope.gridOptions.api.getColumnDef(colName).headerName = '<=' + al.Age.toString();
                    $scope.gridOptions.columnApi.getColumn(colName).colDef.headerName = '<=' + al.Age.toString();
                }                    
                else {
                    var na = $scope.AgeList[(ind - 1)].Age;
                    if (na > 0) {
                        $scope.gridOptions.api.getColumnDef(colName).headerName = (na+1).toString() + ' and ' + al.Age.toString();
                        $scope.gridOptions.columnApi.getColumn(colName).colDef.headerName = (na +1).toString() + ' and ' + al.Age.toString();
                    } else {
                        lastCol = true;
                        $scope.gridOptions.api.getColumnDef(colName).headerName = '>' + al.Age.toString();
                        $scope.gridOptions.columnApi.getColumn(colName).colDef.headerName = '>' + al.Age.toString();
                    }
                }

                ind++;
            }   
        });

        if (lastCol == false) {
            var na = $scope.AgeList[(ind - 1)].Age;
            ind++;
            var colName = 'colR' + ind ;
            $scope.gridOptions.columnApi.setColumnVisible(colName, true);
            $scope.gridOptions.columnApi.getColumn(colName).colDef.headerName = '>' + na.toString();
        }
        
        var para = {
            dateFrom: $filter('date')($scope.PartyAgeing.DateFromDet.dateAD , 'yyyy-MM-dd') ,
            dateTo: $filter('date')($scope.PartyAgeing.DateToDet.dateAD, 'yyyy-MM-dd'),
            LedgerIdColl: ($scope.PartyAgeing.LedgerId ? $scope.PartyAgeing.LedgerId.toString() : ''),
            IsDebtor: true,
            MonthWise: false,
            AgeList: agePara.toString(),
            BranchIdColl: ($scope.PartyAgeing.BranchId ? $scope.PartyAgeing.BranchId.toString() : ''),            
        }; 

        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: 'POST',
            url: base_url + "Inventory/Reporting/GetCostCenterAgeing",
            headers: { 'Content-Type': undefined },

            transformRequest: function (data) {

                var formData = new FormData();
                formData.append("jsonData", angular.toJson(data.jsonData));

                return formData;
            },
            data: { jsonData: para }
        }).then(function (res) {

            $scope.loadingstatus = "stop";
            hidePleaseWait();
            if (res.data.IsSuccess && res.data.Data)
            {

                var Opening = 0, DrAmount = 0, CrAmount = 0,Closing = 0,R = 0,R1 = 0,R2 = 0,R3 = 0,R4 = 0,R5 = 0,R6 = 0,R7 = 0,R8 = 0,R9 = 0,R10 = 0;

                angular.forEach(res.data.Data, function (d) {
                    Opening += d.Opening;
                    DrAmount += d.DrAmount;
                    CrAmount += d.CrAmount;
                    Closing += d.Closing;
                    R += d.R;
                    R1 += d.R1;
                    R2 += d.R2;
                    R3 += d.R3;
                    R4 += d.R4;
                    R5 += d.R5;
                    R6 += d.R6;
                    R7 += d.R7;
                    R8 += d.R8;
                    R9 += d.R9;
                    R10 += d.R10;
                });


                var filerDataColl = [];
                filerDataColl.push({
                    Party: 'Total =>',
                    Opening: Opening,
                    DrAmount: DrAmount,
                    CrAmount: CrAmount,
                    Closing: Closing,
                    R: R,
                    R1: R1,
                    R2: R2,
                    R3: R3,
                    R4: R4,
                    R5: R5,
                    R6: R6,
                    R7: R7,
                    R8: R8,
                    R9: R9,
                    R10: R10
                });
                $scope.gridOptionsBottom.api.setRowData(filerDataColl);

                $scope.gridOptions.api.setRowData(res.data.Data);
            } else {
                Swal.fire(res.data.ResponseMSG);
            }

        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";

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
                                                        Period: $scope.PartyAgeing.DateFromDet.dateBS + " TO " + $scope.PartyAgeing.DateToDet.dateBS,
                                                        R1: ($scope.AgeList.length > 0 ? $scope.gridOptions.api.getColumnDef('colR1').headerName : 0),
                                                        R2: ($scope.AgeList.length > 1 ? $scope.gridOptions.api.getColumnDef('colR2').headerName : 0),
                                                        R3: ($scope.AgeList.length > 2 ? $scope.gridOptions.api.getColumnDef('colR3').headerName : 0),
                                                        R4: ($scope.AgeList.length > 3 ? $scope.gridOptions.api.getColumnDef('colR4').headerName : 0),
                                                        R5: ($scope.AgeList.length > 4 ? $scope.gridOptions.api.getColumnDef('colR5').headerName : 0),
                                                        R6: ($scope.AgeList.length > 5 ? $scope.gridOptions.api.getColumnDef('colR6').headerName : 0),
                                                        R7: ($scope.AgeList.length > 6 ? $scope.gridOptions.api.getColumnDef('colR7').headerName : 0),
                                                        R8: ($scope.AgeList.length > 7 ? $scope.gridOptions.api.getColumnDef('colR8').headerName : 0),
                                                        R9: ($scope.AgeList.length > 8 ? $scope.gridOptions.api.getColumnDef('colR9').headerName : 0),
                                                        R10: ($scope.AgeList.length > 9 ? $scope.gridOptions.api.getColumnDef('colR10').headerName : 0),
                                                        R11: ($scope.AgeList.length > 10 ? $scope.gridOptions.api.getColumnDef('colR11').headerName : 0),
                                                        R12: ($scope.AgeList.length > 11 ? $scope.gridOptions.api.getColumnDef('colR12').headerName : 0),
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
                                    Period: $scope.PartyAgeing.DateFromDet.dateBS + " TO " + $scope.PartyAgeing.DateToDet.dateBS,
                                    R1: ($scope.AgeList.length > 0 ? $scope.gridOptions.api.getColumnDef('colR1').headerName : 0),
                                    R2: ($scope.AgeList.length > 1 ? $scope.gridOptions.api.getColumnDef('colR2').headerName : 0),
                                    R3: ($scope.AgeList.length > 2 ? $scope.gridOptions.api.getColumnDef('colR3').headerName : 0),
                                    R4: ($scope.AgeList.length > 3 ? $scope.gridOptions.api.getColumnDef('colR4').headerName : 0),
                                    R5: ($scope.AgeList.length > 4 ? $scope.gridOptions.api.getColumnDef('colR5').headerName : 0),
                                    R6: ($scope.AgeList.length > 5 ? $scope.gridOptions.api.getColumnDef('colR6').headerName : 0),
                                    R7: ($scope.AgeList.length > 6 ? $scope.gridOptions.api.getColumnDef('colR7').headerName : 0),
                                    R8: ($scope.AgeList.length > 7 ? $scope.gridOptions.api.getColumnDef('colR8').headerName : 0),
                                    R9: ($scope.AgeList.length > 8 ? $scope.gridOptions.api.getColumnDef('colR9').headerName : 0),
                                    R10: ($scope.AgeList.length > 9 ? $scope.gridOptions.api.getColumnDef('colR10').headerName : 0),
                                    R11: ($scope.AgeList.length > 10 ? $scope.gridOptions.api.getColumnDef('colR11').headerName : 0),
                                    R12: ($scope.AgeList.length > 11 ? $scope.gridOptions.api.getColumnDef('colR12').headerName : 0),
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
            var fData = node.data;
            filterData.push(fData);

        });

        return filterData;

    };

    $scope.onFilterTextBoxChanged = function () {
        $scope.gridOptions.api.setQuickFilter($scope.search);
    }

    $scope.AddAgeList = function (ind) {
        if ($scope.AgeList) {
            if ($scope.AgeList.length > ind + 1) {
                $scope.AgeList.splice(ind + 1, 0, {
                    Age: 0
                })
            } else {
                $scope.AgeList.push({
                    Age: 0
                })
            }
        }

    };
    $scope.DelAgeList = function (ind) {
        if ($scope.AgeList) {
            if ($scope.AgeList.length > 1) {
                $scope.AgeList.splice(ind, 1);
            }
        }
    };

    $scope.DownloadAsXls = function () {

        $scope.loadingstatus = 'running';
        showPleaseWait();

        var dataColl = $scope.GetDataForPrint();

        var paraData = {
            Period: $scope.PartyAgeing.DateFromDet.dateBS + " TO " + $scope.PartyAgeing.DateToDet.dateBS,
            R1: ($scope.AgeList.length > 0 ? $scope.gridOptions.api.getColumnDef('colR1').headerName : 0),
            R2: ($scope.AgeList.length > 1 ? $scope.gridOptions.api.getColumnDef('colR2').headerName : 0),
            R3: ($scope.AgeList.length > 2 ? $scope.gridOptions.api.getColumnDef('colR3').headerName : 0),
            R4: ($scope.AgeList.length > 3 ? $scope.gridOptions.api.getColumnDef('colR4').headerName : 0),
            R5: ($scope.AgeList.length > 4 ? $scope.gridOptions.api.getColumnDef('colR5').headerName : 0),
            R6: ($scope.AgeList.length > 5 ? $scope.gridOptions.api.getColumnDef('colR6').headerName : 0),
            R7: ($scope.AgeList.length > 6 ? $scope.gridOptions.api.getColumnDef('colR7').headerName : 0),
            R8: ($scope.AgeList.length > 7 ? $scope.gridOptions.api.getColumnDef('colR8').headerName : 0),
            R9: ($scope.AgeList.length > 8 ? $scope.gridOptions.api.getColumnDef('colR9').headerName : 0),
            R10: ($scope.AgeList.length > 9 ? $scope.gridOptions.api.getColumnDef('colR10').headerName : 0),
            R11: ($scope.AgeList.length > 10 ? $scope.gridOptions.api.getColumnDef('colR11').headerName : 0),
            R12: ($scope.AgeList.length > 11 ? $scope.gridOptions.api.getColumnDef('colR12').headerName : 0),
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
                down_file(base_url + "//" + res.data.Data.ResponseId, "Ageing.xlsx");
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