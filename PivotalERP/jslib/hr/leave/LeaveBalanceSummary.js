
app.controller("LeaveBalanceSummaryController", function ($scope, $http, $filter, $timeout, GlobalServices, $compile) {

    LoadData();
    $scope.onBtExportCSV = function () {
        var params = {
            fileName: 'LeaveBalanceSummary.csv',
            sheetName: 'LeaveBalanceSummary'
        };

        $scope.gridOptions.api.exportDataAsCsv(params);
    }
    $scope.onFilterTextBoxChanged = function () {
        $scope.gridOptions.api.setQuickFilter($scope.search);
    }

    function LoadData() {
        $('.select2').select2();

        $scope.filterLeaveSummary = {
            PeriodId:null,
            BranchId:null,
            DepartmentId:null,
            CategoryId:null,
            EmployeeOrSalesman:1
        };

        $scope.TypeColl = [{ id: 1, text: 'Employee' }, { id: 2, text: 'Salesman' }]

        $scope.CostClassList = [];
        $http({
            method: 'GET',
            url: base_url + "Account/Creation/GetAllCostClasss",
            dataType: "json"
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.CostClassList = res.data.Data;
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

        //for department
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

        $scope.columnDefs = [
            {
                headerName: "Code",
                field: "EmployeeCode",
                dataType: 'text',
                filter: 'agNumberColumnFilter',
                width: 90,
                pinned: 'left',
                cellStyle: { 'text-align': 'center' },
                cellRenderer: function (params) {
                    return '<a href="#" class="text-info" onclick="angular.element(this).scope().onCodeClick(' + params.data.EmployeeId + ')">' + params.value + '</a>';
                }

            },
            { headerName: "Name", field: "Name", dataType: 'Text', filter: "agTextColumnFilter", width: 200, pinned: 'left', cellStyle: { 'text-align': 'left' } },
            { headerName: "Branch", field: "BranchName", dataType: 'Text', filter: "agTextColumnFilter", width: 140, cellStyle: { 'text-align': 'left' } },
            { headerName: "Department", field: "Department", dataType: 'Text', filter: "agTextColumnFilter", width: 140, cellStyle: { 'text-align': 'left' } },
            { headerName: "Category", field: "Category", dataType: 'Text', filter: "agTextColumnFilter", width: 140, cellStyle: { 'text-align': 'left' } },
            { headerName: "Office Contact", field: "ContactNo", dataType: 'Text', filter: "agTextColumnFilter", width: 140, cellStyle: { 'text-align': 'left' } },
            { headerName: "Opening", field: "OpeningQty", dataType: 'Text', filter: "agTextColumnFilter", width: 120, cellStyle: { 'text-align': 'left' } },
            { headerName: "Quota", field: "QuotaQty", dataType: 'Text', filter: "agTextColumnFilter", width: 120, cellStyle: { 'text-align': 'left' } },
            { headerName: "Leave", field: "leaveQty", dataType: 'Text', filter: "agTextColumnFilter", width: 120, cellStyle: { 'text-align': 'left' } },
            {
                headerName: "Balance", field: "BalanceLeave", dataType: 'number', filter: "agTextColumnFilter", width: 100, pinned: 'right', cellStyle: { 'text-align': 'right' },
                cellRenderer: function (params) {
                    return '<a href="#" class="text-info" onclick="angular.element(this).scope().onCodeClick(' + params.data.EmployeeId + ')">' + params.value + '</a>';
                }
            },
        ];

       

        $scope.gridOptions = {
            defaultColDef: {
                filter: true,
                resizable: true,
                sortable: true
            },
            enableSorting: true,
            multiSortKey: 'ctrl',
            enableColResize: true,
            overlayLoadingTemplate: "Loading..",
            overlayNoRowsTemplate: "No Records found",
            rowSelection: 'multiple',
            columnDefs: $scope.columnDefs,
            rowData: null,
            filter: true,
            enableFilter: true,
        };

        // Initialize grid after DOM is ready
        $timeout(function () {
            var eGridDiv = document.querySelector('#datatable');
            new agGrid.Grid(eGridDiv, $scope.gridOptions);
        });
    }


    $scope.onCodeClick = function (EmployeeId) {
        $scope.GetLeaveSummary1(EmployeeId);
        $('#modal-cancel').modal('show');
    };

    $scope.GetLeaveSummary = function (beData) {    
        $scope.EmployeeListForLeaveOpening = []; //declare an empty array
        var para = {
            branchIdColl: ($scope.filterLeaveSummary.BranchId == 0 ? '' : $scope.filterLeaveSummary.BranchId),
            DepartmentIdColl: ($scope.filterLeaveSummary.DepartmentId == 0 ? '' : $scope.filterLeaveSummary.DepartmentId),
            CategoryIdColl: ($scope.filterLeaveSummary.CategoryId == 0 ? '' : $scope.filterLeaveSummary.CategoryId),
            EmployeeId: $scope.filterLeaveSummary.EmployeeId,
            EmployeeOrSalesman: $scope.filterLeaveSummary.EmployeeOrSalesman,
            PeriodId: $scope.filterLeaveSummary.PeriodId
        };
        $scope.loadingstatus = 'running';
        $http({
            method: "post",
            url: base_url + "HR/Leave/GetLeaveBalanaceSummary",
            data: JSON.stringify(para),
            dataType: "json"
        }).then(function (res) {
            $scope.loadingstatus = 'Stop';
            if (res.data.IsSuccess) {
                $scope.DataColl = mx(res.data.Data);
                var query = $scope.DataColl.groupBy(t => ({ EmployeeId: t.EmployeeId }));
                angular.forEach(query, function (q) {
                    var fst = q.elements[0];
                    var beData = {
                        EmployeeId: fst.EmployeeId,
                        UserId: fst.UserId,
                        EmployeeCode: fst.EmployeeCode,
                        Name: fst.Name,
                        BranchName: fst.BranchName,
                        Department: fst.Department,
                        Category: fst.Category,
                        ContactNo: fst.ContactNo,
                        OpeningQty: fst.OpeningQty,
                        QuotaQty: fst.QuotaQty,
                        leaveQty: fst.leaveQty,
                        BalanceLeave: fst.BalanceLeave
                    };

                    $scope.EmployeeListForLeaveOpening.push(beData);

                    $scope.gridOptions.api.setRowData($scope.EmployeeListForLeaveOpening);
                });

            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    }

    $scope.GetLeaveSummary1 = function (EmployeeId) {
        $scope.DataColl1 = []; //declare an empty array
        $scope.EmployeeLeaveBalanceSummary = []; //declare an empty array
        var para = {
            branchIdColl: ($scope.filterLeaveSummary.BranchId == 0 ? '' : $scope.filterLeaveSummary.BranchId),
            DepartmentIdColl: ($scope.filterLeaveSummary.DepartmentId == 0 ? '' : $scope.filterLeaveSummary.DepartmentId),
            CategoryIdColl: ($scope.filterLeaveSummary.CategoryId == 0 ? '' : $scope.filterLeaveSummary.CategoryId),
            EmployeeOrSalesman: $scope.filterLeaveSummary.EmployeeOrSalesman,
            PeriodId: $scope.filterLeaveSummary.PeriodId,
            EmployeeId: EmployeeId //Its a UserId
        };
        $scope.loadingstatus = 'running';
        $http({
            method: "post",
            url: base_url + "HR/Leave/GetLeaveBalanaceSummary",
            data: JSON.stringify(para),
            dataType: "json"
        }).then(function (res) {
            $scope.loadingstatus = 'Stop';
            if (res.data.IsSuccess) {
                $scope.DataColl1 = res.data.Data;
                //for Employee Name and Employee Code
                var employeeDetails = $scope.DataColl1.find(item => item.EmployeeId === EmployeeId);
                if (employeeDetails) {
                    $scope.EmployeeName = employeeDetails.Name;
                    $scope.EmployeeCode = employeeDetails.EmployeeCode;
                } else {
                    $scope.EmployeeName = null;
                    $scope.EmployeeCode = null;
                }

                $scope.GetLeaveSummary();
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    }


    $scope.DownloadAsXls = function () {
        $scope.loadingstatus = 'running';
        showPleaseWait();
        var dataColl = $scope.GetDataForPrint();

        var paraData = {
            branchIdColl: ($scope.filterLeaveSummary.BranchId == 0 ? '' : $scope.filterLeaveSummary.BranchId),
            DepartmentIdColl: ($scope.filterLeaveSummary.DepartmentId == 0 ? '' : $scope.filterLeaveSummary.DepartmentId),
            CategoryIdColl: ($scope.filterLeaveSummary.CategoryId == 0 ? '' : $scope.filterLeaveSummary.CategoryId),
            EmployeeId: $scope.filterLeaveSummary.EmployeeId,
            PeriodId: $scope.filterLeaveSummary.PeriodId
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
                down_file(base_url + "//" + res.data.Data.ResponseId, "LeaveBalanceSummary.xlsx");
            }

        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            Swal.fire(errormessage);
        });
    }

    $scope.GetDataForPrint = function () {
        var filterData = [];
        $scope.gridOptions.api.forEachNodeAfterFilterAndSort(function (node) {
            var dayBook = node.data;
            filterData.push(dayBook);
        });
        return filterData;
    }


    $scope.onFilterTextBoxChanged = function () {
        $scope.gridOptions.api.setQuickFilter($scope.search);
    }


});
