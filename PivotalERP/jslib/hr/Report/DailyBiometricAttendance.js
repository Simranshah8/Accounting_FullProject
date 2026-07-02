
app.controller("DailyBiometricAttendanceController", function ($scope, $http, $filter, $timeout, GlobalServices, $compile) {
    LoadData();
    $scope.onBtExportCSV = function () {
        var params = {
            fileName: 'DailyBiometricAttendance.csv',
            sheetName: 'DailyBiometricAttendance'
        };
        $scope.gridOptions.api.exportDataAsCsv(params);
    }
    $scope.onFilterTextBoxChanged = function () {
        $scope.gridOptions.api.setQuickFilter($scope.search);
    }

    function LoadData() {
        $('.select2').select2();

        $scope.newDaily = {
            ForDate: null,
            ForDate_TMP: new Date(),
        };

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
        //for group
        $scope.GroupList = [];
        $http({
            method: 'Get',
            url: base_url + "HR/Master/GetAllEmployeeGroup",
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.GroupList = res.data.Data;
            } else {
                Swal.fire(res.data.ResponseMSG);
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
        //for color
        $scope.AttendanceColors = {};
        $http({
            method: 'POST',
            url: base_url + "HR/Transaction/GetAllAttendanceColorConfig",
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.AttendanceColors = res.data.Data;

            } else {
                Swal.fire(res.data.ResponseMSG);
            }

        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $scope.columnDefs = [
            { field: "EmpCode", headerName: "Emp.Code", pinned: 'left', filter: 'agNumberColumnFilter', width: 115, cellStyle: { 'textAlign': 'left' } },
            { field: "Name", headerName: "Name", pinned: 'left', filter: 'agTextColumnFilter', width: 200, cellStyle: { 'textAlign': 'left' } },
            { field: "WorkingShift", headerName: "Shift", pinned: 'left', filter: 'agTextColumnFilter', width: 120, cellStyle: { 'textAlign': 'left' } },
            {
                field: "Attendance", headerName: "Attendance", pinned: 'left', filter: 'agTextColumnFilter', width: 125, cellStyle: function (params) {
                    const value = params.value || '';
                    const colors = $scope.AttendanceColors || {};
                    let cellStyle = {
                        color: '#000000',
                        backgroundColor: '#ffffff'
                    };
                    if (colors) {
                        if (value === 'P') { // Present
                            cellStyle.color = colors.PColor || '#000000';
                            cellStyle.backgroundColor = colors.PCellColor || '#ffffff';
                        } else if (value === 'A') { // Absent
                            cellStyle.color = colors.AColor || '#000000';
                            cellStyle.backgroundColor = colors.ACellColor || '#ffffff';
                        } else if (value === 'L') { // Leave
                            cellStyle.color = colors.LColor || '#000000';
                            cellStyle.backgroundColor = colors.LCellColor || '#ffffff';
                        } else if (value === 'W') { // Weekend
                            cellStyle.color = colors.WColor || '#000000';
                            cellStyle.backgroundColor = colors.WCellColor || '#ffffff';
                        } else if (value === 'H') { // Holiday
                            cellStyle.color = colors.HColor || '#000000';
                            cellStyle.backgroundColor = colors.HCellColor || '#ffffff';
                        }
                    }

                    return cellStyle;
                }
            },
            { field: "EnrollNo", headerName: "Enroll No", filter: 'agNumberColumnFilter', width: 115, cellStyle: { 'textAlign': 'left' } },
            { field: "BranchName", headerName: "Branch", filter: 'agTextColumnFilter', width: 130, cellStyle: { 'textAlign': 'left' } },
            { field: "Department", headerName: "Department", filter: 'agTextColumnFilter', width: 130, cellStyle: { 'textAlign': 'left' } },
            { field: "Designation", headerName: "Designation", filter: 'agTextColumnFilter', width: 130, cellStyle: { 'textAlign': 'left' } },
            { field: "Category", headerName: "Category", filter: 'agTextColumnFilter', width: 130, cellStyle: { 'textAlign': 'left' } },
            { field: "GroupName", headerName: "Emp Group", filter: 'agTextColumnFilter', width: 130, cellStyle: { 'textAlign': 'left' } },
            { field: "LevelName", headerName: "Level", filter: 'agTextColumnFilter', width: 130, cellStyle: { 'textAlign': 'left' } },
            { field: "ServiceType", headerName: "Service Type", filter: 'agTextColumnFilter', width: 130, cellStyle: { 'textAlign': 'left' } },
            { field: "InTime", headerName: "In Time", filter: 'agTextColumnFilter', width: 100, cellStyle: { 'textAlign': 'left' } },
            { field: "OutTime", headerName: "Out Time", filter: 'agTextColumnFilter', width: 110, cellStyle: { 'textAlign': 'left' } },
            { field: "In1", headerName: "In Time1", filter: 'agTextColumnFilter', width: 110, cellStyle: { 'textAlign': 'left' } },
            { field: "Out1", headerName: "Out Time1", filter: 'agTextColumnFilter', width: 120, cellStyle: { 'textAlign': 'left' } },
            { field: "In2", headerName: "In Time2", filter: 'agTextColumnFilter', width: 110, cellStyle: { 'textAlign': 'left' } },
            { field: "Out2", headerName: "Out Time2", filter: 'agTextColumnFilter', width: 120, cellStyle: { 'textAlign': 'left' } },
            { field: "In3", headerName: "In Time3", filter: 'agTextColumnFilter', width: 110, cellStyle: { 'textAlign': 'left' } },
            { field: "Out3", headerName: "Out Time3", filter: 'agTextColumnFilter', width: 120, cellStyle: { 'textAlign': 'left' } },
            { field: "In4", headerName: "In Time4", filter: 'agTextColumnFilter', width: 110, cellStyle: { 'textAlign': 'left' } },
            { field: "Out4", headerName: "Out Time4", filter: 'agTextColumnFilter', width: 120, cellStyle: { 'textAlign': 'left' } },
            { field: "In5", headerName: "In Time5", filter: 'agTextColumnFilter', width: 110, cellStyle: { 'textAlign': 'left' } },
            { field: "Out5", headerName: "Out Time5", filter: 'agTextColumnFilter', width: 120, cellStyle: { 'textAlign': 'left' } },
            { field: "LateInStr", headerName: "Late In", filter: 'agTextColumnFilter', width: 100, cellStyle: { 'textAlign': 'left' } },
            { field: "BeforeOutStr", headerName: "Early Out", filter: 'agTextColumnFilter', width: 110, cellStyle: { 'textAlign': 'left' } },
            { field: "OTHour", headerName: "OT Hour", filter: 'agTextColumnFilter', width: 105, cellStyle: { 'textAlign': 'left' } },
            {
                field: "WorkingHR", headerName: "Total Working Hours", pinned: 'right', filter: 'agNumberColumnFilter', width: 180, cellStyle: { 'textAlign': 'left' },
                cellRenderer: function (params) {
                    return formatWorkingHR(params.value);
                }
            },
            { field: "Company", headerName: "Company", filter: 'agTextColumnFilter', width: 130, cellStyle: { 'textAlign': 'left' } },
        ];
        function formatWorkingHR(workingHR) {
            if (!workingHR) return ''; // Handle empty or null values

            const parts = workingHR.split(':'); // Split the value into hours and minutes
            const hours = parseInt(parts[0], 10); // Convert hours to integer
            const minutes = parseInt(parts[1], 10); // Convert minutes to integer

            // Construct the formatted string
            let formatted = '';
            if (hours > 0) {
                formatted += `${hours}H `;
            }
            if (minutes > 0) {
                formatted += `${minutes}M`;
            }
            return formatted.trim(); // Return the formatted string
        }

        // ag-Grid options
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
        //end Daily Biometric Attendance
    }



    $scope.ClearData = function () {

        var DataColl = [];
        $scope.gridOptionsBottom.api.setRowData(DataColl);

        $scope.gridOptions.api.setRowData(DataColl);
    };


    $scope.GetDailyAttendance = function () {
        if ($scope.loadingstatus != 'stop') {
            alert('Already Running Process')
            return;
        }
        $scope.DataColl = []; //declare an empty array

        $scope.newDaily.TotalEmployees = 0;
        $scope.newDaily.TotalPresent = 0;
        $scope.newDaily.TotalAbsent = 0;
        $scope.newDaily.TotalWeekEnd = 0;
        $scope.newDaily.TotalLeave = 0;

        var para = {
            forDate: $filter('date')($scope.newDaily.ForDateDet.dateAD, 'yyyy-MM-dd'),
            branchIdColl: $scope.newDaily.BranchId,
            departmentIdColl: $scope.newDaily.DepartmentId,
            groupIdColl: $scope.newDaily.GroupId,
            companyId:$scope.newDaily.CompanyId
        };
        $scope.loadingstatus = "running";
        showPleaseWait();
        $http({
            method: 'POST',
            url: base_url + "HR/Report/GetEmpDailyAttendance",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess) {
                $scope.DataColl = res.data.Data;

                $scope.gridOptions.api.setRowData($scope.DataColl);


                var query = mx($scope.DataColl);

                $scope.newDaily.TotalEmployees = $scope.DataColl.length;

                $scope.newDaily.TotalPresent = query.count(p1 => p1.Attendance == "P");
                $scope.newDaily.TotalAbsent = query.count(p1 => p1.Attendance == "A");
                $scope.newDaily.TotalLeave = query.count(p1 => p1.Attendance == "L");
                $scope.newDaily.TotalWeekEnd = query.count(p1 => p1.Attendance == "W");

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
            forDate: $filter('date')($scope.newDaily.ForDateDet.dateAD, 'yyyy-MM-dd'),
            branchIdColl: $scope.newDaily.BranchId
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
                down_file(base_url + "//" + res.data.Data.ResponseId, "DailyBiometricAttendance.xlsx");
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
