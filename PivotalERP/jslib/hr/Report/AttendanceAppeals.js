
app.controller("AttendanceAppealsController", function ($scope, $http, $filter, $timeout, GlobalServices, $compile) {

    LoadData();

    $scope.onBtExportCSV = function () {
        var params = {
            fileName: 'ManualAttendance.csv',
            sheetName: 'ManualAttendance'
        };

        $scope.gridOptions.api.exportDataAsCsv(params);
    }
    $scope.onFilterTextBoxChanged = function () {
        $scope.gridOptions.api.setQuickFilter($scope.search);
    }

    function LoadData() {
        $('.select2').select2();
        $scope.filterAttAppeals = {
            DateForm_TMP: new Date(),
            DateTo_TMP: new Date()
        };


        $scope.LeaveStatusColl = [{ id: 0, text: 'ALL' }, { id: 1, text: 'NOT_APPROVED' }, { id: 2, text: 'APPROVED' }, { id: 3, text: 'CANCEL' }, { id: 4, text: 'REJECTED' },]
        $scope.ApprovedStatusColl = [/*{ id: 0, text: 'ALL', value: '' },*/{ id: 2, text: 'APPROVED', value: 'APPROVED' }, { id: 3, text: 'CANCEL', value: 'CANCEL' }, { id: 4, text: 'REJECTED', value: 'Denied' },]


        $scope.columnDefs = [
            {
                headerName: "Code",
                field: "EmployeeCode",
                width: 120,
                pinned: 'left',
                cellStyle: { 'text-align': 'center' },

                cellRenderer: function (params) {
                    return '<a href="javascript:void(0)" class="text-danger">' + params.value + '</a>';
                },

                onCellClicked: function (params) {
                    var scope = angular.element(document.getElementById('AttendanceAppealsCtrl')).scope();
                    scope.$apply(function () {
                        scope.DelAttendanceById(params.data);
                    });
                }
            },
            {
                headerName: "Name",
                field: "Name",
                width: 200,
                pinned: 'left',
                cellStyle: { 'text-align': 'center' },

                cellRenderer: function (params) {
                    return '<a href="javascript:void(0)" class="text-info">' + params.value + '</a>';
                },

                onCellClicked: function (params) {
                    var scope = angular.element(document.getElementById('AttendanceAppealsCtrl')).scope();
                    scope.$apply(function () {
                        scope.ApproveAtt(params.data);
                    });
                }
            },
            { headerName: "Branch", field: "Branch", dataType: 'Text', filter: "agTextColumnFilter", width: 140, cellStyle: { 'text-align': 'left' } },
            { headerName: "Department", field: "Department", dataType: 'Text', filter: "agTextColumnFilter", width: 140, cellStyle: { 'text-align': 'left' } },
            { headerName: "In-Out Mode", field: "InOutMode", dataType: 'Text', filter: "agTextColumnFilter", width: 140, cellStyle: { 'text-align': 'left' } },
            { headerName: "Punch Date Time", field: "PunchDateTimeBS", dataType: 'Text', filter: "agTextColumnFilter", width: 160, cellStyle: { 'text-align': 'left' } },
            { headerName: "Request Date Time", field: "LogDateTimeBS", dataType: 'Text', filter: "agTextColumnFilter", width: 160, cellStyle: { 'text-align': 'left' } },
            { headerName: "Reason", field: "Reason", dataType: 'Text', filter: "agTextColumnFilter", width: 180, cellStyle: { 'text-align': 'left' } },
            { headerName: "Request location", field: "Location", dataType: 'Text', filter: "agTextColumnFilter", width: 160, cellStyle: { 'text-align': 'left' } },
            { headerName: "Approved Type", field: "ApprovedTypeName", dataType: 'Text', filter: "agTextColumnFilter", width: 160, cellStyle: { 'text-align': 'left' } },
            { headerName: "Approved By User", field: "ApprovedByUser", dataType: 'Text', filter: "agTextColumnFilter", width: 165, cellStyle: { 'text-align': 'left' } },
            { headerName: "Approved Remark", field: "ApprovedRemarks", dataType: 'Text', filter: "agTextColumnFilter", width: 165, cellStyle: { 'text-align': 'left' } },
            { headerName: "Approved Date Time", field: "ApprovedDateTimeBS", dataType: 'Text', filter: "agTextColumnFilter", width: 165, cellStyle: { 'text-align': 'left' } },
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




    $scope.GetAttendanceAppealDetails = function () {
        $scope.DataColl = [];

        var dateFrom = new Date(($filter('date')(new Date(), 'yyyy-MM-dd')));
        var dateTo = new Date(($filter('date')(new Date(), 'yyyy-MM-dd')));

        if ($scope.filterAttAppeals.DateFromDet)
            dateFrom = new Date(($filter('date')($scope.filterAttAppeals.DateFromDet.dateAD, 'yyyy-MM-dd')));

        if ($scope.filterAttAppeals.DateToDet)
              dateTo = new Date(($filter('date')($scope.filterAttAppeals.DateToDet.dateAD, 'yyyy-MM-dd')));
        var para = {
            DateFrom: dateFrom,
            DateTo: dateTo,
            ApprovedType: $scope.filterAttAppeals.ApprovedType?.length > 0 ? $scope.filterAttAppeals.ApprovedType.toString() : null,
            //ApprovedType: $scope.filterAttAppeals.ApprovedType,
            BranchId: $scope.filterAttAppeals.BranchId,
          
            ShowSelfOnly: true
        };
        $scope.loadingstatus = "running";
        showPleaseWait();
        $http({
            method: 'POST',
            url: base_url + "HR/Report/GetAttendanceAppealDetails",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.DataColl = res.data.Data;
                $scope.gridOptions.api.setRowData($scope.DataColl);
            } else {
                alert(res.data.ResponseMSG);
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
            PeriodId: $scope.filterLeaveSummary.PeriodId,
            BranchId: $scope.filterLeaveSummary.BranchId,
            DepartmentId: $scope.filterLeaveSummary.DepartmentId,
            CategoryId: $scope.filterLeaveSummary.CategoryId
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
                down_file(base_url + "//" + res.data.Data.ResponseId, "AttendanceAppeals.xlsx");
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

    $scope.ApproveAtt = function (beData) {
        $scope.beData = {
        };
        $scope.beData = beData;
        if (beData.ApprovedType) {
            $scope.beData.ApprovedTypeId = parseInt(beData.ApprovedType);
        }
        if (!$scope.beData.PhotoPath || !$scope.beData.PhotoPath.trim()) {
            $scope.beData.PhotoPath = '/wwwroot/dynamic-erp/images/ai-avater.jpg';
        }
        if ($scope.beData.ApprovedTypeId == 2 || $scope.beData.ApprovedTypeId == 3 || $scope.beData.ApprovedTypeId == 4) {
            Swal.fire({ icon: 'info', title: 'Action Not Allowed', text: 'This request has already been ' + $scope.beData.ApprovedTypeName + '.' });
        } else {
            $('#AttendanceAppeals').modal('show');
        }
    }


    $scope.SaveAttendanceAppeals = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();
        $http({
            method: 'POST',
            url: base_url + "HR/Report/UpdateAttendanceAppeals",
            headers: { 'Content-Type': undefined },
            transformRequest: function (data) {
                var formData = new FormData();
                formData.append("jsonData", angular.toJson(data.jsonData));

                return formData;
            },
            data: { jsonData: $scope.beData }
        }).then(function (res) {
            $scope.loadingstatus = "stop";
            hidePleaseWait();
            Swal.fire(res.data.ResponseMSG);
            if (res.data.IsSuccess == true) {
                $('#AttendanceAppeals').modal('hide');
                $scope.GetAttendanceAppealDetails();
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }

    $scope.DelAttendanceById = function (refData) {
        Swal.fire({
            title: 'Are you sure you want to delete the Attendance Appeal for ' + refData.EmployeeCode + '?',
            showCancelButton: true,
            confirmButtonText: 'Delete',
        }).then((result) => {
            if (result.isConfirmed) {
                var para = {
                    TranId: refData.TranId
                };
                $http({
                    method: 'POST',
                    url: base_url + "HR/Report/DelAttendanceById",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingStatus = "stop";
                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess == true) {
                        $scope.GetAttendanceAppealDetails();
                    }
                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }

        });
    }

});
