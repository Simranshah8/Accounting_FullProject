"use strict";

agGrid.initialiseAgGridWithAngular1(angular);

app.controller("LoanDetailsCtrl", function ($scope, $http, $filter, GlobalServices) {

    LoadData();

    $scope.onBtExportCSV = function () {
        var params = {
            fileName: 'LoanDetails.csv',
            sheetName: 'LoanDetails'
        };
        $scope.gridOptions.api.exportDataAsCsv(params);
    }

    $scope.onFilterTextBoxChanged = function () {
        $scope.gridOptions.api.setQuickFilter($scope.search || '');
        $scope.UpdateFilteredTotals();
    }

    function LoadData() {

        $('.select2').select2();

        $scope.newLoanDetails = {
            DateFrom_TMP: new Date(),
            DateTo_TMP: new Date(),
        };

        // Format helper (two decimals)
        function formatNumber(value) {
            if (value == null || value === "") return "";
            return parseFloat(value).toFixed(2);
        }

        $scope.columnDefs = [

            { headerName: "Party", field: "Name", width: 150, cellStyle: { 'text-align': 'left' } },
            { headerName: "GroupName", field: "GroupName", width: 180 },
            { headerName: "Address", field: "Address", width: 150 },
            { headerName: "Mobile No.", field: "MobileNo", width: 120 },
            { headerName: "Phone No.", field: "TelNo", width: 130 },

            {
                headerName: "Loan Amount", field: "LoanAmount", width: 150, cellStyle: { 'text-align': 'right' },
                valueFormatter: params => formatNumber(params.value)
            },
            {
                headerName: "Interest Rate", field: "InterestRate", width: 120, cellStyle: { 'text-align': 'right' },
                valueFormatter: params => formatNumber(params.value)
            },

            { headerName: "Start Date(A.D.)", field: "StartDate", width: 140 },

            {
                headerName: "Start Date(B.S.)",
                field: "DateBS",
                width: 150,
                valueGetter: function (p) {
                    if (!p.data.NY || !p.data.NM || !p.data.ND) return "";
                    return `${p.data.NY}-${p.data.NM.toString().padStart(2, '0')}-${p.data.ND.toString().padStart(2, '0')}`;
                }
            },

            { headerName: "Debit Principal", field: "DebitPrincipal", width: 150, cellStyle: { 'text-align': 'right' }, valueFormatter: p => formatNumber(p.value) },
            { headerName: "Debit Interest", field: "DebitInterest", width: 150, cellStyle: { 'text-align': 'right' }, valueFormatter: p => formatNumber(p.value) },
            { headerName: "Dues Principal", field: "DuesPrincipal", width: 150, cellStyle: { 'text-align': 'right' }, valueFormatter: p => formatNumber(p.value) },
            { headerName: "Dues Interest", field: "DuesInterest", width: 150, cellStyle: { 'text-align': 'right' }, valueFormatter: p => formatNumber(p.value) },

            { headerName: "Rebet", field: "Rebate", width: 120, valueFormatter: p => formatNumber(p.value) },
            { headerName: "Penalty", field: "Penalty", width: 150, valueFormatter: p => formatNumber(p.value) },

            { headerName: "Ledger Closing", field: "LedgerClosing", width: 160, cellStyle: { 'text-align': 'right' }, valueFormatter: p => formatNumber(p.value) },
            { headerName: "Current Closing", field: "CurrentClosingBalance", width: 170, cellStyle: { 'text-align': 'right' }, valueFormatter: p => formatNumber(p.value) },
            { headerName: "Closing Balance", field: "ClosingBalance", width: 160, cellStyle: { 'text-align': 'right' }, valueFormatter: p => formatNumber(p.value) },

            { headerName: "Schedule Payment", field: "SchedulePayment", width: 150 },
            { headerName: "Done EMI", field: "DoneEMI", width: 110 },
            { headerName: "Due EMI", field: "DueEMI", width: 110 },

            { headerName: "Next EMIDate", field: "NextEMIDate", width: 160 },
            { headerName: "Next EMI AfterDays", field: "NextEMIAfterDays", width: 180 }
        ];

        $scope.bottomTotals = [{
            LoanAmount: 0,
            DebitPrincipal: 0,
            DebitInterest: 0,
            DuesPrincipal: 0,
            DuesInterest: 0,
            ClosingBalance: 0
        }];

        $scope.gridOptions = {
            columnDefs: $scope.columnDefs,
            rowData: null,
            defaultColDef: { flex: 1, sortable: true, filter: true, resizable: true, minWidth: 120 },
            enableSorting: true,
            enableFilter: true,
            rowSelection: 'multiple',

            onGridReady: function (params) {
                $scope.gridOptions.api = params.api;
                $scope.gridOptions.columnApi = params.columnApi;
            },

            onFilterChanged: function () {
                $scope.UpdateFilteredTotals();
            }
        };
    }

    // -----------------------------------
    // 🔵 TOTALS FUNCTION
    // -----------------------------------
    $scope.UpdateFilteredTotals = function () {

        if (!$scope.gridOptions.api) return;

        let totalLoan = 0,
            totalDebitP = 0,
            totalDebitI = 0,
            totalDuesP = 0,
            totalDuesI = 0,
            totalClosing = 0;

        $scope.gridOptions.api.forEachNodeAfterFilterAndSort(function (node) {
            totalLoan += parseFloat(node.data.LoanAmount || 0);
            totalDebitP += parseFloat(node.data.DebitPrincipal || 0);
            totalDebitI += parseFloat(node.data.DebitInterest || 0);
            totalDuesP += parseFloat(node.data.DuesPrincipal || 0);
            totalDuesI += parseFloat(node.data.DuesInterest || 0);
            totalClosing += parseFloat(node.data.ClosingBalance || 0);
        });

        $scope.bottomTotals[0].LoanAmount = totalLoan.toFixed(2);
        $scope.bottomTotals[0].DebitPrincipal = totalDebitP.toFixed(2);
        $scope.bottomTotals[0].DebitInterest = totalDebitI.toFixed(2);
        $scope.bottomTotals[0].DuesPrincipal = totalDuesP.toFixed(2);
        $scope.bottomTotals[0].DuesInterest = totalDuesI.toFixed(2);
        $scope.bottomTotals[0].ClosingBalance = totalClosing.toFixed(2);

        $scope.gridOptions.api.setPinnedBottomRowData($scope.bottomTotals);
    };

    $scope.GetLoanDetails = function () {
        var para = {
            DateFrom: $filter('date')($scope.newLoanDetails.DateFromDet.dateAD, 'yyyy-MM-dd'),
            DateTo: $filter('date')($scope.newLoanDetails.DateToDet.dateAD, 'yyyy-MM-dd')
        };

        $scope.loadingstatus = "running";
        showPleaseWait();

        $http({
            method: 'POST',
            url: base_url + "Finance/Report/GetLoanDetails",
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

});
