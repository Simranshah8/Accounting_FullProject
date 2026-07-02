app.controller('PeriodSalarySheetController', function ($scope, $http, $timeout, $filter, GlobalServices) {
    $scope.Title = 'PeriodSalarySheet';

    getterAndSetter();

    // CSV Export
    $scope.onBtExportCSV = function () {
        var params = {
            filefield: 'profitloss.csv',
            sheetfield: 'profitloss'
        };
        $scope.gridOptions.api.exportDataAsCsv(params);
    };

    // Quick Filter
    $scope.onFilterTextBoxChanged = function () {
        if ($scope.gridOptions && $scope.gridOptions.api) {
            $scope.gridOptions.api.setQuickFilter($scope.search || '');
            updateFilteredTotals(); // update total dynamically
        }
    };

    function getterAndSetter() {
        $scope.gridOptions = {
            columnDefs: [],
            rowData: [],
            animateRows: true,
            defaultColDef: {
                sortable: true,
                resizable: true,
                filter: true,
            },
            onGridReady: function (params) {
                $scope.gridOptions.api = params.api;
                $scope.gridOptions.columnApi = params.columnApi;
            },
            onFilterChanged: updateFilteredTotals, // recalc total when filters applied
        };
    }

    $scope.LoadData = function () {
        $scope.filterValue = '';
        $('.select2').select2();
        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.perPageColl = GlobalServices.getPerPageList();
        $scope.MonthList = GlobalServices.getMonthList();
        $scope.EmployeeSearchOptions = GlobalServices.getEmployeeSearchOptions();

        //CompanyRelationshipList
        $scope.CompanyRelationshipList = [];
        $http({
            method: 'POST',
            url: base_url + "HR/Master/GetAllCompanyRelationship",
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.CompanyRelationshipList = res.data.Data;
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $scope.ForEmployeeColl = [{ id: 1, text: 'Continue' }, { id: 2, text: 'Left' }];
        $scope.YearList = GlobalServices.getYearList();

        $scope.BranchList = [];
        $http({
            method: 'GET',
            url: base_url + "Setup/Security/GetAllBranchList",
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.BranchList = res.data.Data;

            } else {
                Swal.fire(res.data.ResponseMSG);
            }

        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $scope.DepartmentList = [];
        $http({
            method: 'GET',
            url: base_url + "HR/Master/GetAllDepartment",
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.DepartmentList = res.data.Data;
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });


        //CategoryList
        $scope.CategoryList = [];
        $http({
            method: 'GET',
            url: base_url + "HR/Master/GetAllCategory",
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.CategoryList = res.data.Data;
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $scope.newPeriodSalary = {
            SalaryDetailId: null,
            BranchId: null,
            DepartmentId: null,
            Mode: 'Save'
        };
    };

    $scope.GetPeriodSalarySheet = function () {
        if (!$scope.newPeriodSalary.FromYearId) return Swal.fire('Please select "From Year".');
        if (!$scope.newPeriodSalary.FromMonthId) return Swal.fire('Please select "From Month".');
        if (!$scope.newPeriodSalary.ToYearId) return Swal.fire('Please select "To Year".');
        if (!$scope.newPeriodSalary.ToMonthId) return Swal.fire('Please select "To Month".');

        $scope.loadingstatus = "running";
        showPleaseWait();

        const para = {
            FromYearId: $scope.newPeriodSalary.FromYearId,
            FromMonthId: $scope.newPeriodSalary.FromMonthId,
            ToYearId: $scope.newPeriodSalary.ToYearId,
            ToMonthId: $scope.newPeriodSalary.ToMonthId,
            ForEmployee: $scope.newPeriodSalary.ForEmployeeId,
            BranchId: $scope.newPeriodSalary.BranchId,
            DepartmentId: $scope.newPeriodSalary.DepartmentId,
            CategoryId: $scope.newPeriodSalary.CategoryId,
            CompanyRelationshipId: $scope.newPeriodSalary.CompanyRelationshipId,
        };

        $http.post(base_url + "HR/Report/GetAllPeriodSalarySheet", JSON.stringify(para))
            .then(function (res) {
                hidePleaseWait();
                $scope.loadingstatus = "stop";

                if (res.data.IsSuccess && res.data.Data) {
                    $scope.DataColl = res.data.Data;

                    // Step 1: Unique pay headings
                    const payHeadingsMap = {};
                    $scope.DataColl.forEach(function (item) {
                        if (!payHeadingsMap[item.PayHeadingId]) {
                            payHeadingsMap[item.PayHeadingId] = {
                                name: item.PayHeading,
                                sno: item.PayHeadingSNo
                            };
                        }
                    });

                    const payHeadings = Object.entries(payHeadingsMap)
                        .map(([id, value]) => ({ id, name: value.name, sno: value.sno }))
                        .sort((a, b) => a.sno - b.sno);

                    // Step 2: Dynamic columns
                    const dynamicColumnDefs = [
                        { headerName: "Emp Code", field: "EmployeeCode", width: 120, pinned: 'left' },
                        { headerName: "Employee Name", field: "EmployeeName", width: 200, pinned: 'left' },
                        { headerName: "Department", field: "Department", width: 140 },
                        { headerName: "Category", field: "Category", width: 140 },
                        { headerName: "Designation", field: "Designation", width: 140 },
                        { headerName: "Branch Name", field: "BranchName", width: 140 }
                    ];

                    payHeadings.forEach(payHeading => {
                        dynamicColumnDefs.push({
                            headerName: payHeading.name,
                            field: payHeading.id,
                            width: 160,
                            valueFormatter: p => Numberformat(p.value),
                            cellStyle: { 'text-align': 'right' }
                        });
                    });

                    dynamicColumnDefs.push(
                        { headerName: "Earning", field: "Earning", width: 160, valueFormatter: p => Numberformat(p.value), cellStyle: { 'text-align': 'right' } },
                        { headerName: "Deduction", field: "Deducation", width: 160, valueFormatter: p => Numberformat(p.value), cellStyle: { 'text-align': 'right' } },
                        { headerName: "Tax", field: "Tax", width: 160, valueFormatter: p => Numberformat(p.value), cellStyle: { 'text-align': 'right' } },
                        { headerName: "Net Payable", field: "Netpayable", width: 160, valueFormatter: p => Numberformat(p.value), cellStyle: { 'text-align': 'right' } }
                    );

                    $scope.gridOptions.api.setColumnDefs(dynamicColumnDefs);

                    // Step 3: Build rows + total
                    const { orderedData, summaryRow } = processSalaryData($scope.DataColl, payHeadings);
                    $scope.gridOptions.api.setRowData(orderedData);
                    $scope.gridOptions.api.setPinnedBottomRowData([summaryRow]);
                } else {
                    Swal.fire(res.data.ResponseMSG);
                }
            })
            .catch(function (reason) {
                hidePleaseWait();
                Swal.fire('Failed: ' + (reason.message || reason));
            });
    };

    function processSalaryData(data, payHeadings) {
        let totals = {};
        payHeadings.forEach(p => totals[p.id] = 0);
        totals.Earning = 0;
        totals.Deducation = 0;
        totals.Tax = 0;
        totals.Netpayable = 0;

        const orderedData = data.reduce((acc, item) => {
            let row = acc.find(r => r.EmployeeCode === item.EmployeeCode);
            if (!row) {
                row = {
                    EmployeeCode: item.EmployeeCode,
                    EmployeeName: item.EmployeeName,
                    Department: item.Department,
                    Designation: item.Designation,
                    BranchName: item.BranchName,
                    Category: item.Category
                };
                acc.push(row);
            }

            row[item.PayHeadingId] = item.Amount;
            if ('Earning' in item) { row.Earning = (row.Earning || 0) + item.Earning; totals.Earning += item.Earning; }
            if ('Deducation' in item) { row.Deducation = (row.Deducation || 0) + item.Deducation; totals.Deducation += item.Deducation; }
            if ('Tax' in item) { row.Tax = (row.Tax || 0) + item.Tax; totals.Tax += item.Tax; }
            if ('Netpayable' in item) { row.Netpayable = (row.Netpayable || 0) + item.Netpayable; totals.Netpayable += item.Netpayable; }
            if (item.PayHeadingId) totals[item.PayHeadingId] += item.Amount || 0;
            return acc;
        }, []);

        const summaryRow = {
            EmployeeCode: "",
            EmployeeName: "Total",
            Department: "",
            Category: "",
            Designation: "",
            BranchName: "",
            Earning: totals.Earning,
            Deducation: totals.Deducation,
            Tax: totals.Tax,
            Netpayable: totals.Netpayable
        };
        payHeadings.forEach(p => summaryRow[p.id] = totals[p.id]);
        return { orderedData, summaryRow };
    }

    // Function to recalculate total based on filtered rows
    function updateFilteredTotals() {
        if (!$scope.gridOptions.api || !$scope.gridOptions.api.getDisplayedRowCount()) return;

        let totals = {};
        const columns = $scope.gridOptions.columnApi.getAllGridColumns().map(col => col.colId);

        columns.forEach(c => totals[c] = 0);
        $scope.gridOptions.api.forEachNodeAfterFilterAndSort(node => {
            columns.forEach(c => {
                const val = parseFloat(node.data[c]) || 0;
                totals[c] += val;
            });
        });

        const summaryRow = { EmployeeName: 'Total' };
        columns.forEach(c => summaryRow[c] = totals[c]);
        $scope.gridOptions.api.setPinnedBottomRowData([summaryRow]);
    }

    $scope.DownloadAsXls = function () {
        $scope.loadingstatus = 'running';
        showPleaseWait();
        var dataColl = $scope.GetDataForPrint();

        var paraData = {
            FromYearId: $scope.newPeriodSalary.FromYearId,
            FromMonthId: $scope.newPeriodSalary.FromMonthId,
            ToYearId: $scope.newPeriodSalary.ToYearId,
            ToMonthId: $scope.newPeriodSalary.ToMonthId,
            ForEmployee: $scope.newPeriodSalary.ForEmployeeId,
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
            hidePleaseWait();
            if (res.data.IsSuccess && res.data.Data) {
                down_file(base_url + "//" + res.data.Data.ResponseId, "PeriodSalarySheet.xlsx");
            }
        }, function (errormessage) {
            hidePleaseWait();
            Swal.fire(errormessage);
        });
    };

    $scope.GetDataForPrint = function () {
        var filterData = [];
        $scope.gridOptions.api.forEachNodeAfterFilterAndSort(node => filterData.push(node.data));
        return filterData;
    };

});
