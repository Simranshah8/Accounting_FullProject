"use strict";

agGrid.initialiseAgGridWithAngular1(angular);

app.controller('crlimitExpiredPartyListCtrl', function ($scope, $http, $filter, $timeout,GlobalServices, companyDet) {
	
	  var PrintPreviewAs = 1;
    const contextMenu = GlobalServices.createElementForMenu();
	
    LoadData();


    function Numberformat(val) {
        return $filter('number')(val, 2);
    }

    $scope.DataColl = [];
    $scope.DateFrom = null;
    $scope.DateTo = null;

    function LoadData() {
        $('.select2').select2()

       

        var columnDefs = [
            { headerName: "S.No.", field: "SNo", filter: 'agNumberColumnFilter', width: 250, cellStyle: { 'text-align': 'center' } },
            { headerName: "Name", field: "Name", filter: "agTextColumnFilter", width: 250, cellStyle: { 'text-align': 'left' }  },
            { headerName: "Group", field: "LedgerGroup", filter: 'agTextColumnFilter', width: 250, cellStyle: { 'text-align': 'left' }  },
            { headerName: "Salesman", field: "Agent", filter: 'agTextColumnFilter', width: 250, cellStyle: { 'text-align': 'left' }  },
            { headerName: "Area", field: "Area", filter: 'agTextColumnFilter', width: 250, cellStyle: { 'text-align': 'left' }  },
            { headerName: "Closing Balance", field: "ClosingBalance", filter: 'agNumberColumnFilter', width: 250, cellStyle: { 'text-align': 'right' }, valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "DuesFromDays", field: "DuesFromDays", filter: 'agNumberColumnFilter', width: 250, cellStyle: { 'text-align': 'center' } },
            { headerName: "Limit Amt.", field: "CreditLimitAmt", filter: 'agNumberColumnFilter', width: 250, cellStyle: { 'text-align': 'right' }, valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "LimitDays", field: "CreditLimitDays", filter: 'agNumberColumnFilter', width: 250, cellStyle: { 'text-align': 'right' } },
            { headerName: "CrossDays", field: "CrossDays", filter: 'agNumberColumnFilter', width: 250, cellStyle: { 'text-align': 'right' } }
        ];

        $scope.gridOptions = {
			onCellContextMenu: onCellContextMenu, // Handle right-click event			
            //angularCompileRows: true,
            // a default column definition with properties that get applied to every column
            defaultColDef: {
                filter: true,
                resizable: true,
                sortable: true,
                // set every column width
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
            //suppressHorizontalScroll: true,
            alignedGrids: [],
            enableFilter: true

        };

        // lookup the container we want the Grid to use
        $scope.eGridDiv = document.querySelector('#datatable');

        // create the grid passing in the div to use together with the columns & data we want to use
        new agGrid.Grid($scope.eGridDiv, $scope.gridOptions);
		
		 $timeout(function () {
            GlobalServices.getListState(EntityId, $scope.gridOptions);
        });

        
    }

    $scope.GetData = function() {

        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: 'POST',
            url: base_url + "Inventory/Reporting/GetCRLimitExpiredParty?DateFrom=" + $scope.DateFrom + "&DateTo=" + $scope.DateTo ,
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
});


app.controller("partyAgeingController", function ($scope, $http, $filter, $timeout, GlobalServices, $compile) {

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
            { headerName: "Code", field: "Code", width: 130, filter: "agTextColumnFilter", },
            { headerName: "Address", field: "Address",  width: 230, filter: "agTextColumnFilter", },
            { headerName: "Group", field: "GroupName",  width: 180, filter: "agTextColumnFilter",  },
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


            { headerName: "Limit Amt.", field: "CreditLimitAmount", width: 150, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' }, },
            { headerName: "Limit Days", field: "CreditDays", width: 150, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' }, },
            { headerName: "BG Amt.", field: "BGAmount", width: 150, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' }, },
            { headerName: "CDRate", field: "CDRate", width: 150, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' }, },
            { headerName: "PDC Amt.", field: "PDCAmt", width: 150, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' }, },
            { headerName: "ODC Amt.", field: "ODCAmt", width: 150, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' }, },

            { headerName: "Route Name", field: "RouteName", width: 130, filter: "agTextColumnFilter", },
            { headerName: "Salesman", field: "DI_Name", width: 160, filter: "agTextColumnFilter", },
            { headerName: "SO", field: "SO_Name", width: 130, filter: "agTextColumnFilter", },
            { headerName: "ASM", field: "ASM_Name", width: 130, filter: "agTextColumnFilter", },
            { headerName: "RSM", field: "RSM_Name", width: 130, filter: "agTextColumnFilter", },
            { headerName: "NSM", field: "NSM_Name", width: 130, filter: "agTextColumnFilter", },
            { headerName: "SD", field: "SD_Name", width: 130, filter: "agTextColumnFilter", },
            { headerName: "MD", field: "MD_Name", width: 130, filter: "agTextColumnFilter", },
            { headerName: "PaymentType", field: "PaymentType", width: 130, filter: "agTextColumnFilter", },
            { headerName: "DebtorType", field: "DebtorType", width: 130, filter: "agTextColumnFilter", },
            { headerName: "Branch", field: "BranchName", width: 170, filter: "agTextColumnFilter", },
            { headerName: "Area", field: "PartyArea", width: 170, filter: "agTextColumnFilter", },
            {
                headerName: "Action",
                width: 50,
                cellRenderer: function (params) {
                    return '<div class="btn-group" style="position: fixed; ">' +
                        '<button type="button" class="btn btn-default px-1 dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
                        '<span class="caret"></span>' +
                        '</button>' +
                        '<ul class="dropdown-menu dropdown-menu-right p-2" style="position: absolute; left: 0;">' +
                        '<li><a data-toggle="tooltip" data-placement="top" title="Show Bill Details" ng-click="ShowBillDetails(this.data)"><i class="fas fa-file text-info"></i> Show Bills</a>  </li>' +
                        '</ul>' +
                        '</div>';
                },
                pinned: 'right'
            },
          
        ];

        // let the grid know which columns and what data to use
        $scope.gridOptions = {
            columnDefs: $scope.columnDefs,
            angularCompileRows: true,
            defaultColDef: {
                resizable: true,
                sortable: true,
                filter: true,
                resizable: true,
                cellStyle: { 'line-height': '31px' },
                rowSelection: 'multiple'
            },
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
                var PDCAmt = 0, ODCAmt = 0, BGAmount = 0;
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
                    PDCAmt + d.PDCAmt;
                    ODCAmt += d.ODCAmt;
                    BGAmount += d.BGAmount;
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
                    R10: R10,
                    ODCAmt: ODCAmt,
                    PDCAmt: PDCAmt,
                    BGAmount:BGAmount,
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

    }

    $scope.SelectedRow = null;
    $scope.ShowBillDetails = function (curRow) {
        $scope.SelectedRow = curRow;
        $('#mdlPendingBills').modal('show');
    }
    function LoadData() {

        $scope.ReportTypeColl = [{ id: 1, text: 'Debtor' }, { id: 2, text: 'Creditor' }, { id: 3, text: 'Depo' }, { id: 4, text: 'Branch Wise Summary' }, { id: 5, text: 'Branch Wise Details' },];

        $scope.AgeOnColl = [{ id: 1, text: 'Bill Date' }, { id: 2, text: 'Due Date' }];

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

        $scope.LedgerGroupList = [];
        $scope.LedgerGroupList_Qry = [];
        $http({
            method: 'GET',
            url: base_url + "Account/Creation/GetDebtorCreditGroup",
            dataType: "json"
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.LedgerGroupList = res.data.Data;
                $scope.LedgerGroupList_Qry = mx(res.data.Data);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $scope.PartyAgeing = {
            DateFrom_TMP: new Date(),
            DateTo_TMP: new Date(),
            LedgerGroupId: 12,
            BranchId: 0,
            ShowZeroBalance: false,
            ReportType: 1,
            ShowNegative: false,
            AgeOn:1,
        };

        $scope.EPDet = {};
        $scope.EPColl = [];
        GlobalServices.getRptEntityProperties(EntityId).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.EPColl = res.data.Data;
                angular.forEach($scope.EPColl, function (ep) {
                    $scope.EPDet[ep.Name] = ep;

                    if (ep.Name == 'AgeList') {
                        if (ep.DefaultValue && ep.DefaultValue.length > 0) {
                            $scope.AgeList = [];
                            var ageList = ep.DefaultValue.split(',');
                            ageList.forEach(function (age) {
                                var val = isEmptyAmt(age);
                                if (val > 0) {
                                    $scope.AgeList.push({
                                        Age: val
                                    });
                                }                                
                            });
                        }
                    } else {
                        if (ep.DataType == 'DateTime') {
                            if (ep.DefaultValue && ep.DefaultValue.length>0) {
                                $scope.PartyAgeing[ep.Name] = new Date(ep.DefaultValue);
                            } 
                        } else {
                            $scope.PartyAgeing[ep.Name] = ep.DefaultValue;
                        }
                        
                    }
                    
                });
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

        var findGroup = $scope.LedgerGroupList_Qry.firstOrDefault(p1 => p1.LedgerGroupId == $scope.PartyAgeing.LedgerGroupId);
        var para = {
            dateFrom: ($scope.PartyAgeing.DateFromDet ? $filter('date')($scope.PartyAgeing.DateFromDet.dateAD , 'yyyy-MM-dd') : null) ,
            dateTo: ($scope.PartyAgeing.DateToDet ?  $filter('date')($scope.PartyAgeing.DateToDet.dateAD, 'yyyy-MM-dd') : null),
            LedgerGroupId: $scope.PartyAgeing.LedgerGroupId,
            IsDebtor: (findGroup ? findGroup.IsDebtor : true),
            MonthWise: false,
            AgeList: agePara.toString(),
            BranchId: ($scope.PartyAgeing.BranchId ? $scope.PartyAgeing.BranchId : 0),
            DepoAgeing: $scope.PartyAgeing.DepoAgeing,
            ReportType: $scope.PartyAgeing.ReportType,
            ShowNegative: $scope.PartyAgeing.ShowNegative,
            AgeOn:$scope.PartyAgeing.AgeOn
        }; 

        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: 'POST',
            url: base_url + "Inventory/Reporting/GetPartyAgeing",
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
                var PDCAmt = 0, ODCAmt = 0, BGAmount = 0;
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
                    PDCAmt + d.PDCAmt;
                    ODCAmt += d.ODCAmt;
                    BGAmount += d.BGAmount;

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
                    R10: R10,
                    PDCAmt :PDCAmt,
                    ODCAmt:ODCAmt,
                    BGAmount:BGAmount,
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