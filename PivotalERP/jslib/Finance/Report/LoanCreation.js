"use strict";

agGrid.initialiseAgGridWithAngular1(angular);

app.controller("LoanCreationCtrl", function ($scope, $http, $filter, GlobalServices) {

    LoadData();

    // EXPORT CSV
    $scope.onBtExportCSV = function () {
        $scope.gridOptions.api.exportDataAsCsv({
            fileName: 'LoanCreation.csv',
            sheetName: 'LoanCreation'
        });
    };

    // QUICK FILTER
    $scope.onFilterTextBoxChanged = function () {
        $scope.gridOptions.api.setQuickFilter($scope.search || '');
        $scope.UpdateFilteredTotals();
    };

    // ========== LOAD INITIAL DATA ==============
    function LoadData() {

        $('.select2').select2();

        $scope.newFilter = {
            DateFrom_TMP: new Date(),
            DateTo_TMP: new Date()
        };

        // ========= FULLY FIXED COLUMN DEFS ============
        $scope.columnDefs = [
            { headerName: "Party", field: "PartyName", filter: 'agTextColumnFilter', width: 120, pinned: 'left', cellStyle: { 'text-align': 'left' } },
            { headerName: "Alias", field: "Alias", filter: 'agTextColumnFilter', width: 160, pinned: 'left', cellStyle: { 'text-align': 'left' } },
            { headerName: "Code", field: "Code", filter: 'agTextColumnFilter', width: 130, pinned: 'left', cellStyle: { 'text-align': 'left' } },
            { headerName: "Address", field: "Address", filter: 'agTextColumnFilter', width: 150, cellStyle: { 'text-align': 'left' } },
            { headerName: "Pan Vat No.", field: "PanVatNo", filter: "agTextColumnFilter", width: 150, cellStyle: { 'text-align': 'left' } },
            {
                headerName: "Loan Amount", field: "LoanAmount", filter: 'agNumberColumnFilter', width: 150, cellStyle: { 'text-align': 'right' }, valueFormatter: function (params) {
                    if (!params.value) return "0.00";
                    return parseFloat(params.value).toFixed(2);
                }, },
            {
                headerName: "Interest Rate", field: "InterestRate", filter: 'agNumberColumnFilter', width: 150, cellStyle: { 'text-align': 'right' }, valueFormatter: function (params) {
                    if (!params.value) return "0.00";
                    return parseFloat(params.value).toFixed(2);
                }, },
            { headerName: "Start Date(A.D.)", field: "StartDate", filter: 'agTextColumnFilter', width: 150, cellStyle: { 'text-align': 'left' } },
            {
                headerName: "Start Date (B.S.)",
                field: "DateBS",
                filter: 'agTextColumnFilter',
                width: 150,
                valueGetter: function (params) {

                    let y = params.data.NY;
                    let m = params.data.NM;
                    let d = params.data.ND;

                    // Prevent failing when DB returns null
                    if (y == null || m == null || d == null) return "";

                    // Format: YYYY-MM-DD
                    m = m.toString().padStart(2, '0');
                    d = d.toString().padStart(2, '0');
                    return `${y}-${m}-${d}`;
                },
                cellStyle: { 'text-align': 'left' }
            },
            { headerName: "Period", field: "Period", filter: 'agTextColumnFilter', width: 140, cellStyle: { 'text-align': 'left' } },
            { headerName: "Loan Type", field: "LoanType", filter: 'agTextColumnFilter', width: 150, cellStyle: { 'text-align': 'left' } },
            { headerName: "RefBy", field: "RefBy", filter: 'agTextColumnFilter', width: 150, cellStyle: { 'text-align': 'left' } },
            {
                headerName: "Total Interest", field: "TotalInterest", filter: 'agNumberColumnFilter', width: 150, cellStyle: { 'text-align': 'right' }, valueFormatter: function (params) {
                    if (!params.value) return "0.00";
                    return parseFloat(params.value).toFixed(2);
                }
            },
            { headerName: "Notes", field: "Notes", filter: 'agTextColumnFilter', width: 200, cellStyle: { 'text-align': 'left' } },
           
        ];

        // =========== GRID OPTIONS =================
        $scope.gridOptions = {
            columnDefs: $scope.columnDefs,
            rowData: null,
            enableSorting: true,
            enableFilter: true,
            rowSelection: 'multiple',

            defaultColDef: {
                flex: 1,
                minWidth: 120,
                resizable: true,
                sortable: true,
                filter: true
            },

            onGridReady: function (params) {
                $scope.gridOptions.api = params.api;
                $scope.gridOptions.columnApi = params.columnApi;
            },

            onFilterChanged: $scope.UpdateFilteredTotals
        };

        // Bottom Totals Row Structure
        $scope.bottomTotals = [{
            LoanAmount: 0,
            InterestRate: 0,
            TotalInterest: 0
        }];
    }

    $scope.GetLoanCreation = function () {
        var para = {
            DateFrom: $filter('date')($scope.newFilter.DateFromDet.dateAD, 'yyyy-MM-dd'),
            DateTo: $filter('date')($scope.newFilter.DateToDet.dateAD, 'yyyy-MM-dd')
        };

        $scope.loadingstatus = "running";
        showPleaseWait();

        $http({
            method: 'POST',
            url: base_url + "Finance/Report/GetLoanCreation",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {

            hidePleaseWait();
            $scope.loadingstatus = "stop";

            if (res.data.IsSuccess && res.data.Data) {
                $scope.DataColl = res.data.Data;
                $scope.gridOptions.api.setRowData($scope.DataColl);
                $scope.UpdateFilteredTotals();
            } else {
                Swal.fire(res.data.ResponseMSG);
            }

        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    }

    // =========== TOTALS CALCULATION ==============
    $scope.UpdateFilteredTotals = function () {

        if (!$scope.gridOptions.api) return;

        let totalLoanAmount = 0;
        let totalInterest = 0;
        let totalRate = 0;
        let count = 0;

        $scope.gridOptions.api.forEachNodeAfterFilterAndSort(function (node) {

            if (node.data.LoanAmount)
                totalLoanAmount += parseFloat(node.data.LoanAmount);

            if (node.data.TotalInterest)
                totalInterest += parseFloat(node.data.TotalInterest);

            if (node.data.InterestRate) {
                totalRate += parseFloat(node.data.InterestRate);
                count++;
            }
        });

        let avgRate = count > 0 ? (totalRate / count).toFixed(2) : 0;

        // SET TOTALS
        $scope.bottomTotals[0].LoanAmount = totalLoanAmount.toFixed(2);
        $scope.bottomTotals[0].TotalInterest = totalInterest.toFixed(2);
        $scope.bottomTotals[0].InterestRate = avgRate;

        // DISPLAY IN GRID BOTTOM
        $scope.gridOptions.api.setPinnedBottomRowData($scope.bottomTotals);
    };

});
