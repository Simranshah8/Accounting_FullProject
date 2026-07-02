
app.controller('OPDTicketTypeController', function ($scope, $filter, $http, $timeout, GlobalServices) {
    $scope.Title = 'OPDTicketType';

    $scope.onBtExportCSV = function () {
        var params = {
            fileName: 'OPDTicketType.csv',
            sheetName: 'OPDTicketType'
        };
        $scope.gridOptions.api.exportDataAsCsv(params);
    }
    $scope.onFilterTextBoxChanged = function () {
        $scope.gridOptions.api.setQuickFilter($scope.search);
    }


    $scope.LoadData = function () {
        $('.select2').select2();
        $scope.loadingstatus = "stop";

        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.perPageColl = GlobalServices.getPerPageList();

        $scope.currentPages = {
            Methods: 1
        };

        $scope.searchData = {
            Methods: ''
        };

        $scope.perPage = {
            Methods: GlobalServices.getPerPageRow(),
        };

        $scope.ForTransColl = [
            { id: 1, value: "OPD" },
            { id: 2, value: "IPD" },
            { id: 3, value: "OPD/IPD" }
        ];

        $scope.beData = {
            OpDTicketTypeId: 0,
            Name: '',
            Alias: '',
            ForTran: null,
            Description: '',
            Mode: ''
        }


        $scope.columnDefs = [
            { headerName: "SNo.", width: 50, valueGetter: "node.rowIndex + 1", cellStyle: { textAlign: "center" }, sortable: false, filter: false },
            { field: "Name", headerName: "Name", filter: 'agTextColumnFilter', flex: 2, cellStyle: { 'textAlign': 'left' } },
            { field: "Alias", headerName: "Alias", filter: 'agTextColumnFilter', flex: 1, cellStyle: { 'textAlign': 'left' } },
            { field: "Description", headerName: "Description", filter: 'agTextColumnFilter', flex: 2, cellStyle: { 'textAlign': 'left' } },
            {
                headerName: "Action", pinned: 'right',
                width: 100,
                cellRenderer: function (params) {
                    let eDiv = document.createElement('div');
                    eDiv.innerHTML = `
<button class="btn btn-info btn-sm edit-btn" title="Edit">
<i class='fas fa-pencil-alt'></i>
</button>
<button class="btn btn-danger btn-sm delete-btn" title="Delete">
<i class='fas fa-trash'></i>
</button>`;

                    let scope = angular.element(document.getElementById('ActionDiv')).scope();
                    // EDIT CLICK
                    eDiv.querySelector(".edit-btn").addEventListener("click", function () {
                        scope.getOPDTicketTypeById(params.data);
                        scope.$apply();
                    });
                    // DELETE CLICK
                    eDiv.querySelector(".delete-btn").addEventListener("click", function () {
                        scope.DelOPDTicketType(params.data);
                        scope.$apply();
                    });
                    return eDiv;
                }
            }
        ];

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

        $scope.GetAllOPDTicketType();

    };

    //$scope.GetAutoCodeNo = function () {
    //    $scope.loadingstatus = "running";
    //    showPleaseWait();
    //    $http({
    //        method: 'POST',
    //        url: base_url + "Lab/Creation/GetAutoCode",
    //        dataType: "json"

    //    }).then(function (res) {
    //        hidePleaseWait();
    //        $scope.loadingstatus = "stop";
    //        if (res.data.IsSuccess && res.data.Data) {
    //            var vDet = res.data.Data;
    //            $scope.beData.Code = vDet.RId;
    //        } else {
    //            Swal.fire(res.data.ResponseMSG);
    //        }
    //    }, function (reason) {
    //        Swal.fire('Failed' + reason);
    //    });
    //}


    $scope.ClearFields = function () {
        $scope.beData = {
            Name: '',
            Alias: '',
            ForTran: null,
            Description: ''
        }
    }

    $scope.GetAllOPDTicketType = function () {
        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: 'POST',
            url: base_url + "Hospital/Creation/GetAllOPDTicketType",
            dataType: "json"
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

    $scope.IsValidMethods = function () {
        //if ($scope.newMethods.Name.isEmpty()) {
        //    Swal.fire("Please ! Enter Product Name");
        //    return false;
        //}
        //else
        return true;
    }

    $scope.SaveOPDTicketType = function () {
        if ($scope.confirmMSG.Accept == true) {
            var saveModify = $scope.beData.Mode;
            Swal.fire({
                title: 'Do you want to ' + saveModify + ' the current data?',
                showCancelButton: true,
                confirmButtonText: saveModify,
            }).then((result) => {
                if (result.isConfirmed) {
                    $scope.CallSaveUpdateOPDTicketType();
                }
            });
        } else
            $scope.CallSaveUpdateOPDTicketType();
    };


    $scope.CallSaveUpdateOPDTicketType = function () {
        $http({
            method: 'Post',
            url: base_url + "Hospital/Creation/SaveOPDTicketType",
            headers: { 'Content-Type': undefined },

            transformRequest: function (data) {
                var formData = new FormData();
                formData.append("jsonData", angular.toJson(data.jsonData));
                return formData;
            },
            data: { jsonData: $scope.beData }
        }).then(function (res) {
            hidePleaseWait();
            Swal.fire(res.data.ResponseMSG);
            if (res.data.IsSuccess == true) {
                $scope.ClearFields();
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }


    $scope.getOPDTicketTypeById = function (beData) {

        $scope.loadingstatus = "running";
        var para = {
            OpDTicketTypeId: beData.OpDTicketTypeId
        };
        $http({
            method: 'POST',
            url: base_url + "Hospital/Creation/GetOPDTicketTypeById",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $timeout(function () {
                    $scope.beData = res.data.Data;
                    $scope.beData.Mode = 'Modify';
                    $('#custom-tabs-four-profile-tab').tab('show');
                });
            } else
                Swal.fire(res.data.ResponseMSG);

        }, function (reason) {
            alert('Failed' + reason);
        });
    }

    $scope.DelOPDTicketType = function (refData, ind) {

        Swal.fire({
            title: 'Are you sure to delete selected ODPTicketType:-' + refData.Name,
            showCancelButton: true,
            confirmButtonText: 'Delete',
        }).then((result) => {
            if (result.isConfirmed) {
                $scope.loadingstatus = "running";
                showPleaseWait();

                var para = {
                    OpDTicketTypeId: refData.OpDTicketTypeId
                };

                $http({
                    method: 'POST',
                    url: base_url + "Hospital/Creation/DelOPDTicketType",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingstatus = "stop";
                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess) {
                        $scope.GetAllOPDTicketType();
                    }

                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }
        });

    }
});