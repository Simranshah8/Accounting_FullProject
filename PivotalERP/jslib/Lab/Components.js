app.controller('Components', function ($scope, $filter, $http, $timeout, GlobalServices) {
    $scope.Title = 'Components';
    $scope.onBtExportCSV = function () {
        var params = {
            fileName: 'Component.csv',
            sheetName: 'Component'
        };
        $scope.gridOptions.api.exportDataAsCsv(params);
    }
    $scope.onFilterTextBoxChanged = function () {
        $scope.gridOptions.api.setQuickFilter($scope.search);
    }
    $scope.LoadData = function () {
        $scope.loadingstatus = "stop";

        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.perPageColl = GlobalServices.getPerPageList();

        $scope.currentPages = {
            Components: 1
        };

        $scope.searchData = {
            Components: ''
        };

        $scope.perPage = {
            Components: GlobalServices.getPerPageRow()
        };

        $scope.TestColl = [];
        $http({
            method: 'POST',
            url: base_url + "Lab/Creation/GetAllLabTest",
            dataType: "json"
        }).then(function (res) {

            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                $scope.TestColl = res.data.Data;
            } else
                alert(res.data.ResponseMSG);

        }, function (reason) {
            alert('Failed' + reason);
        });

        $scope.TypeList = [
            { id: 1, text: 'Numeric' },
            { id: 2, text: 'Text' },
            { id: 3, text: 'Categorical' },
            { id: 4, text: 'Boolean' },
            { id: 5, text: 'image' }
        ];
       
        $scope.UnitColl = [];
       
        $http({
            method: 'POST',
            url: base_url + "Lab/Creation/GetAlllab_Unit",
            dataType: "json"
        }).then(function (res) {

            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                $scope.UnitColl = res.data.Data;

            } else
                Swal.fire(res.data.ResponseMSG);

        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $scope.AnswerSetColl = [];       
        $http({
            method: 'POST',
            url: base_url + "Lab/Creation/GetAllLabAnswerSetValue",
            dataType: "json"
        }).then(function (res) {
            $scope.loadingstatus = 'stop';
            hidePleaseWait();
            if (res.data.IsSuccess && res.data.Data) {
                $scope.AnswerSetColl = res.data.Data;
            } else
                Swal.fire(res.data.ResponseMSG);
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        //$scope.AnswerSetColl = [
        //    { id: 1, text: 'Positive/Negative' },
        //    { id: 2, text: 'ABO Group' },
        //    { id: 3, text: 'Urine Keton Strip' }
        //];

        $scope.newDet = {
            TestId: '',
            Name: '',
            Code: '',
            TypeId: '',
            UnitId: null,
            Decimal: null,
            IsCalculated: false,
            Formula: '',
            AnswerSetId: null,
            ComponentGroup: null,
            IsActive: false,
            Mode: 'Save'
        };

        $scope.columnDefs = [
            { headerName: "SNo.", width: 70, valueGetter: "node.rowIndex + 1", cellStyle: { textAlign: "center" }, sortable: false, filter: false },
            {
                field: "LabTestId", headerName: "Test", valueGetter: function (params) {
                    try {
                        let scope = angular.element(document.getElementById('ActionDiv')).scope();
                        let coll = scope.TestColl || [];
                        let id = params.data.LabTestId;
                        let item = coll.filter(x => x.id === id)[0];
                        return item ? item.TestName : '';
                    } catch (e) {
                        return '';
                    }
                }, filter: 'agTextColumnFilter', width: 220, cellStyle: { 'textAlign': 'left' } },
            { field: "Code", headerName: "Code", filter: 'agTextColumnFilter', width: 220, cellStyle: { 'textAlign': 'left' } },
            { field: "Name", headerName: "Name", filter: 'agTextColumnFilter', width: 150, cellStyle: { 'textAlign': 'left' } },
            {
                field: "TypeId", headerName: "Type", valueGetter: function (params) {
                    try {
                        let scope = angular.element(document.getElementById('ActionDiv')).scope();
                        let coll = scope.TypeList || [];
                        let id = params.data.TypeId;
                        let item = coll.filter(x => x.id === id)[0];
                        return item ? item.text : '';
                    } catch (e) {
                        return '';
                    }
                }, filter: 'agTextColumnFilter', width: 220, cellStyle: { 'textAlign': 'left' } },
            {
                field: "UnitId", headerName: "Unit", valueGetter: function (params) {
                    try {
                        let scope = angular.element(document.getElementById('ActionDiv')).scope();
                        let coll = scope.UnitColl || [];
                        let id = params.data.UnitId;
                        let item = coll.filter(x => x.UnitId == id)[0]; // UnitId & Symbol
                        return item ? item.Symbol : '';
                    } catch (e) {
                        return '';
                    }
                }, filter: 'agTextColumnFilter', width: 220, cellStyle: { 'textAlign': 'left' }
            },
               
            { field: "ComponentGroup", headerName: "ComponentGroup", filter: 'agTextColumnFilter', width: 220, cellStyle: { 'textAlign': 'left' } },
            { field: "IsCalculated", headerName: "IsCalculated", filter: 'agTextColumnFilter', width: 220, cellStyle: { 'textAlign': 'left' } },


            { field: "IsActive", headerName: "IsActive", filter: 'agTextColumnFilter', width: 100, cellStyle: { 'textAlign': 'center' } },
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
                        scope.GetComponentsById(params.data);
                        scope.$apply();
                    });
                    // DELETE CLICK
                    eDiv.querySelector(".delete-btn").addEventListener("click", function () {
                        scope.DeleteComponents(params.data);
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
            //pagination: true,
            //paginationPageSize: 2,//$scope.perPage,
            //paginationPageSizeSelector: $scope.perPageColl
        };

        // Initialize grid after DOM is ready
        $timeout(function () {
            var eGridDiv = document.querySelector('#datatable');
            new agGrid.Grid(eGridDiv, $scope.gridOptions);
        });
        //end Daily Biometric Attendance

        $timeout(function () {
            GlobalServices.getListState(EntityId, $scope.gridOptions);
        });

        $scope.GetAllComponents();
        $scope.GetAutoComponentCode();
    }

    $scope.saveRptListState = function () {
        GlobalServices.saveRptListState(EntityId, $scope.gridOptions);
    };

    $scope.ClearFields = function () {
        $scope.newDet = {
            TestId: null,
            Name: '',
            Code: '',
            TypeId: '',
            UnitId: null,
            Decimal: null,
            IsCalculated: false,
            Formula: '',
            AnswerSetId: null,
            ComponentGroup: null,
            IsActive: false,
            Mode: 'Save'
        };
        $scope.GetAutoComponentCode();

    };


    $scope.IsValidComponents = function () {
       
        return true;
    };

    $scope.SaveUpdateComponents = function () {
        if ($scope.IsValidComponents() === true) {
        if ($scope.confirmMSG && $scope.confirmMSG.Accept === true) {
            var saveModify = $scope.beData.Mode;
            Swal.fire({
                title: 'Do you want to ' + saveModify + ' the current data?',
                showCancelButton: true,
                confirmButtonText: saveModify,
            }).then((result) => {
                if (result.isConfirmed) {
                    $scope.CallSaveUpdateComponents();
                }
            });
        } else {
            $scope.CallSaveUpdateComponents();
        }
        }
    };

    $scope.CallSaveUpdateComponents = function () {
        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: 'Post',
            url: base_url + "Lab/Creation/SaveLabComponents",
            headers: { 'content-Type': undefined },
            transformRequest: function (data) {
                var formData = new FormData();
                formData.append("jsonData", angular.toJson(data.jsonData));
                return formData;
            },
            data: { jsonData: $scope.newDet }
        }).then(function (res) {
            $scope.loadingstatus = "stop";
            hidePleaseWait();

            Swal.fire(res.data.ResponseMSG);
            if (res.data.IsSuccess === true) {
                $scope.ClearFields();
                $scope.GetAllComponents();
                $scope.GetAutoComponentCode();
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            Swal.fire('Save failed');
        });
    };

    $scope.GetAllComponents = function () {
        //$scope.ComponentsList = [];

        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: 'POST',
            url: base_url + "Lab/Creation/GetAllLabComponents",
            dataType: "json"
        }).then(function (res) {
            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                $scope.DataColl = res.data.Data;
                $scope.gridOptions.api.setRowData($scope.DataColl);
            } else {
                alert(res.data.ResponseMSG);
            }
        }, function (reason) {
            hidePleaseWait();
            $scope.loadingstatus = 'stop';
            alert('Failed: ' + reason);
        });
    };


    $scope.GetComponentsById = function (refData) {
        $scope.loadingstatus = "running";
        showPleaseWait();
        var para = {
            ComponentId: refData.ComponentId
        };
        $http({
            method: 'Post',
            url: base_url + "Lab/Creation/GetLabComponentsById",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.newDet = res.data.Data;
                $scope.newDet.Mode = 'Modify';
                $('#custom-tabs-four-profile-tab').tab('show');
            } else {
                Swal.fire(res.data.ResponseMSG);
            }

        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    };

    $scope.DeleteComponents = function (refData, ind) {
        if (!refData || !refData.ComponentId) {
            Swal.fire('Invalid selection');
            return;
        }

        Swal.fire({
            title: 'Are you sure to delete selected Component: ' + (refData.Name || refData.Code || '') + ' ?',
            showCancelButton: true,
            confirmButtonText: 'Delete',
        }).then((result) => {
            if (result.isConfirmed) {
                $scope.loadingstatus = "running";
                showPleaseWait();

                var para = { ComponentId: refData.ComponentId };

                $http({
                    method: 'POST',
                    url: base_url + "Lab/Creation/DelLabComponents",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingstatus = "stop";
                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess) {
                        $scope.GetAllComponents();
                    } else {
                    }
                }, function (reason) {
                    hidePleaseWait();
                    $scope.loadingstatus = "stop";
                    Swal.fire('Failed: ' + reason);
                });
            }
        });
    };


    $scope.GetAutoComponentCode = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();
        $http({
            method: 'POST',
            url: base_url + "Lab/Creation/GetAutoComponentCode",
            //url: base_url + "Lab/Creation/GetAutoTestCode",
            dataType: "json"

        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                var vDet = res.data.Data;
                $scope.newDet.Code = vDet.RId;
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    }
});
