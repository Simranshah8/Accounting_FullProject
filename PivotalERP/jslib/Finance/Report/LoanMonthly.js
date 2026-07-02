"use strict";

agGrid.initialiseAgGridWithAngular1(angular);

app.controller("LoanMonthlyCtrl", function ($scope, $http, $filter, GlobalServices) {

    LoadData();

    // ================== EXPORT CSV ==================
    $scope.onBtExportCSV = function () {
        $scope.gridOptions.api.exportDataAsCsv({
            fileName: 'LoanMonthly.csv',
            sheetName: 'LoanMonthly'
        });
    };

    // ================== QUICK FILTER ==================
    $scope.onFilterTextBoxChanged = function () {
        $scope.gridOptions.api.setQuickFilter($scope.search || '');
        $scope.UpdateFilteredTotals();
    };

    // ==================================================
    //                LOAD INITIAL DATA
    // ==================================================
    function LoadData() {

        $('.select2').select2();

        $scope.newFilter = {
            DateFrom_TMP: new Date(),
            DateTo_TMP: new Date()
        };

        // ===================== COLUMNS ======================
        $scope.columnDefs = [
            { headerName: "Party", field: "Name", filter: 'agNumberColumnFilter', width: 90, pinned: 'left', dataType: 'Number', cellStyle: { 'text-align': 'left' } },
            { headerName: "GroupName", field: "GroupName", filter: 'agTextColumnFilter', width: 200, pinned: 'left', dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Address", field: "Address", filter: 'agTextColumnFilter', width: 150, pinned: 'left', dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Mobile No.", field: "MobileNo", filter: 'agTextColumnFilter', width: 140, dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Phone No.", field: "TelNo", filter: "agTextColumnFilter", width: 150, dataType: 'Text', cellStyle: { 'text-align': 'left' } },

            { headerName: "Loan Amount", field: "LoanAmount", filter: 'agTextColumnFilter', width: 150, dataType: 'Number', cellStyle: { 'text-align': 'right' } },
            { headerName: "Interest Rate", field: "InterestRate", filter: 'agNumberColumnFilter', width: 150, dataType: 'Number', cellStyle: { 'text-align': 'center' } },
            { headerName: "Start Date(A.D.)", field: "StartDate", filter: 'agTextColumnFilter', width: 150, dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            {
                headerName: "Start Date (B.S.)", field: "DateBS", filter: 'agTextColumnFilter', width: 150,
                valueGetter: function (params) {
                    if (!params.data.NY || !params.data.NM || !params.data.ND) return "";
                    var y = params.data.NY;
                    var m = params.data.NM.toString().padStart(2, '0');
                    var d = params.data.ND.toString().padStart(2, '0');
                    return y + "-" + m + "-" + d;
                },
                cellStyle: { 'text-align': 'left' }
            },
            { headerName: "LastEMIDate", field: "LastEMIDate", filter: 'agTextColumnFilter', width: 170, dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Ledger Closing", field: "LedgerClosing", filter: 'agNumberColumnFilter', width: 200, dataType: 'Text', cellStyle: { 'text-align': 'right' } },
            { headerName: "Due EMI", field: "DuesEMINo", filter: 'agTextColumnFilter', width: 150, dataType: 'Text', cellStyle: { 'text-align': 'right' } },
            { headerName: "Next EMIDate", field: "NextEMIDate", filter: 'agTextColumnFilter', width: 210, dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Next EMI AfterDays", field: "NextEMIAfterDays", filter: 'agTextColumnFilter', width: 210, dataType: 'Text', cellStyle: { 'text-align': 'left' } },

            // ===== Additional fields =====
            { headerName: "RegdNo", field: "RegdNo", filter: 'agTextColumnFilter', width: 150, dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "EngineNo", field: "EngineNo", filter: 'agTextColumnFilter', width: 150, dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "ChechisNo", field: "ChechisNo", filter: 'agTextColumnFilter', width: 150, dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Model", field: "Model", filter: 'agTextColumnFilter', width: 150, dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Color", field: "Color", filter: 'agTextColumnFilter', width: 150, dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Type", field: "Type", filter: 'agTextColumnFilter', width: 150, dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "KeyNo", field: "KeyNo", filter: 'agTextColumnFilter', width: 150, dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "CodeNo", field: "CodeNo", filter: 'agTextColumnFilter', width: 150, dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "MFGYear", field: "MFGYear", filter: 'agTextColumnFilter', width: 150, dataType: 'Text', cellStyle: { 'text-align': 'left' } },

            // ... add remaining columns as needed, following same pattern
            { headerName: "Notes", field: "Notes", filter: 'agNumberColumnFilter', width: 150, dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            {
                headerName: "Culty", field: "Culty", filter: 'agNumberColumnFilter', width: 150, dataType: 'Text', cellStyle: { 'text-align': 'left' },
                valueFormatter: function (params) { return params.value ? 'Yes' : 'No'; }
            }
        ];

        // ================= GRID OPTIONS =================
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

        // ====== Bottom pinned totals row ======
        $scope.bottomTotals = [{
            LoanAmount: "0.00",
            InterestRate: "0.00",
            LedgerClosing: "0.00"
        }];
    }

    $scope.GetLoanMonthly = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();
        var para = {
            DateFrom: $filter('date')($scope.newFilter.DateFromDet.dateAD, 'yyyy-MM-dd'),
            DateTo: $filter('date')($scope.newFilter.DateToDet.dateAD, 'yyyy-MM-dd')
        };
        $http({
            method: 'POST',
            url: base_url + "Finance/Report/GetLoanMonthly",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.DataColl = res.data.Data;
                $scope.gridOptions.api.setRowData($scope.DataColl);

            } else {
                Swal.fire(res.data.ResponseMSG);
            }

        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    }

    $scope.UpdateFilteredTotals = function () {

        if (!$scope.gridOptions.api) return;

        let totalLoan = 0;
        let totalRate = 0;
        let ledgerTotal = 0;
        let count = 0;

        $scope.gridOptions.api.forEachNodeAfterFilterAndSort(function (n) {
            if (n.data.LoanAmount) totalLoan += parseFloat(n.data.LoanAmount);
            if (n.data.InterestRate) { totalRate += parseFloat(n.data.InterestRate); count++; }
            if (n.data.LedgerClosing) ledgerTotal += parseFloat(n.data.LedgerClosing);
        });

        let avgRate = count > 0 ? (totalRate / count).toFixed(2) : "0.00";

        // SET TOTALS IN BOTTOM ROW
        $scope.bottomTotals[0].LoanAmount = totalLoan.toFixed(2);
        $scope.bottomTotals[0].InterestRate = avgRate;
        $scope.bottomTotals[0].LedgerClosing = ledgerTotal.toFixed(2);

        $scope.gridOptions.api.setPinnedBottomRowData($scope.bottomTotals);
    };



});