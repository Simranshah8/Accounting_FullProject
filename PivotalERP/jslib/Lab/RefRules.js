app.controller('RefrenceRule', function ($scope, $filter, $http, $timeout, GlobalServices) {
    $scope.Title = 'Refrence Rule';
    $scope.onBtExportCSV = function () {
        var params = {
            fileName: 'ReferenceRule.csv',
            sheetName: 'ReferenceRule'
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
            RefRule: 1

        };

        $scope.searchData = {
            RefRule: ''
        };

        $scope.perPage = {
            RefRule: GlobalServices.getPerPageRow(),

        };


        $scope.newDet = {
            ModeId: false,
            ComponentGlobalId: null,
            IsCompActive: false,
            IsTestActive: false,
            TestNameId: null,
            TestComponentId: null,
            RefRuleLookUpsColl: [],
        };
        $scope.newDet.RefRuleLookUpsColl.push({});

        $scope.ComponentGlobalColl = []
        $http({
            method: 'POST',
            url: base_url + "Lab/Creation/GetAllLabComponents",
            dataType: "json"
        }).then(function (res) {
            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                    $scope.ComponentGlobalColl = res.data.Data;
            } else {
                alert(res.data.ResponseMSG);
            }
        }, function (reason) {
            hidePleaseWait();
            $scope.loadingstatus = 'stop';
            alert('Failed: ' + reason);
        });

        $scope.TestNameColl = [];
        $http({
            method: 'POST',
            url: base_url + "Lab/Creation/GetAllLabTest",
            dataType: "json"
        }).then(function (res) {

            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                $scope.TestNameColl = res.data.Data;
            } else
                alert(res.data.ResponseMSG);

        }, function (reason) {
            alert('Failed' + reason);
        });

        $scope.ComponentSelectedColl = [
            { id: 1, text: 'Haemoglobin(HB)' },
            { id: 2, text: 'Total Leucocyte Count(WBC)' },
            { id: 3, text: 'Platelet Count(PLT)' }
        ];


        $scope.GenderColl = [
            { id: 1, text: 'Male' },
            { id: 2, text: 'Female' },
            { id: 3, text: 'Others' }
        ];


        $scope.columnDefs = [
            { headerName: "SNo.", width: 70, valueGetter: "node.rowIndex + 1", cellStyle: { textAlign: "center" }, sortable: false, filter: false },
            { field: "TestName", headerName: "TestName", filter: 'agTextColumnFilter', flex: 2, cellStyle: { 'textAlign': 'left' } },
            { field: "ComponentName",headerName: "Component Name", filter: 'agTextColumnFilter', flex: 2,cellStyle: { textAlign: 'left' },
                valueGetter: function (params) {
                    return params.data.ModeId == 0 ? params.data.GlobalComponentName : params.data.ComponentName;
                }
            },
            { field: "GenderName", headerName: "Gender", filter: 'agTextColumnFilter', flex: 2, cellStyle: { 'textAlign': 'left' } },
            {headerName: "Age ",

                field: "MinAge",

                width: 160,

                cellStyle: { textAlign: "left" },

                valueGetter: function (params) {

                    let min = params.data.MinAge == null ? '' : params.data.MinAge;

                    let max = params.data.MaxAge == null ? '' : params.data.MaxAge;

                    return `${min}${(min !== '' && max !== '') ? '-' : ''}${max}`;

                }, filter: 'agNumberColumnFilter', flex: 1.4, minWidth: 140, cellStyle: { 'textAlign': 'left' }

            },

            { field: "NormalHigh", headerName: "NormalHigh", filter: 'agNumberColumnFilter', flex: 1.2, minWidth: 120, cellStyle: { 'textAlign': 'left' } },

            { field: "NormalLow", headerName: "NormalLow", filter: 'agNumberColumnFilter', flex: 1.2, minWidth: 120, cellStyle: { 'textAlign': 'left' } },

            { field: "IsActive", headerName: "IsActive", filter: 'agTextColumnFilter', flex: 0.8, minWidth: 80, cellStyle: { 'textAlign': 'center' } },

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

                        scope.GetReferebceRuleById(params.data);

                        scope.$apply();

                    });

                    // DELETE CLICK

                    eDiv.querySelector(".delete-btn").addEventListener("click", function () {

                        scope.DelReferenceRule(params.data);

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
     
        $scope.GetReferebceRule();

    };

    $scope.saveRptListState = function () {
        GlobalServices.saveRptListState(EntityId, $scope.gridOptions);
    };


    $scope.ClearFields = function () {
        $scope.loadingstatus = "stop";
        $scope.newDet = {
            ModeId: false,
            ComponentGlobalId: null,
            IsCompActive: false,
            IsTestActive: false,
            TestNameId: null,
            TestComponentId: null,
            RefRuleLookUpsColl: [],
        };
        $scope.newDet.RefRuleLookUpsColl.push({});
    }


    $scope.IsValidReferebceRule = function () {
       
        return true;
    }

    $scope.SaveUpdateReferebceRule = function () {
        if ($scope.IsValidReferebceRule() == true) {
        if ($scope.confirmMSG.Accept == true) {
            var saveModify = $scope.newDet.Mode;
            Swal.fire({
                title: 'Do you want to ' + saveModify + ' the current data?',
                showCancelButton: true,
                confirmButtonText: saveModify,
            }).then((result) => {
                if (result.isConfirmed) {
                    $scope.CallSaveUpdateReferebceRule();
                }
            });
        } else
            $scope.CallSaveUpdateReferebceRule();

         }
    };

    $scope.CallSaveUpdateReferebceRule = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();

        $http({
            method: 'Post',
            url: base_url + "Lab/Creation/SavelabReferenceRule",
            headers: { 'Content-Type': undefined },
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
            if (res.data.IsSuccess == true) {
                $scope.ClearFields();
                $scope.GetReferebceRule();
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    };


    $scope.GetReferebceRule = function () {
        //$scope.ReferebceRuleData = [];
        $scope.loadingstatus = "running";
        showPleaseWait();
        $http({
            method: 'POST',
            url: base_url + "Lab/Creation/GetAllLabReferenceRule",
            dataType: "json",
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
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            Swal.fire('Failed: ' + reason);
        });
    }

    $scope.GetReferebceRuleById = function (refData) {
        $scope.loadingstatus = "running";
        showPleaseWait();
        var para = {
            RefRuleId: refData.RefRuleId
        };
        $http({
            method: 'POST',
            url: base_url + "Lab/Creation/GetLabReferenceRuleById",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.newDet = res.data.Data;
                $scope.newDet.Mode = 'Modify';

                //for child table
                if (!$scope.newDet.RefRuleLookUpsColl || $scope.newDet.RefRuleLookUpsColl.length == 0) {

                    $scope.newDet.RefRuleLookUpsColl = [];

                    $scope.newDet.RefRuleLookUpsColl.push({});

                }
                //end
                $('#custom-tabs-four-profile-tab').tab('show');

            } else {
                Swal.fire(res.data.ResponseMSG);
            }

        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    };


    $scope.DelReferenceRule = function (refData, ind) {
        Swal.fire({
            title: 'Are you sure you want to delete ' + refData.RefRuleId + '?',
            showCancelButton: true,
            confirmButtonText: 'Delete',
        }).then((result) => {
            if (result.isConfirmed) {
                var para = { RefRuleId: refData.RefRuleId };
                $http({
                    method: 'POST',
                    url: base_url + "Lab/Creation/DelLabReferenceRule",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingStatus = "stop";

                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess == true) {
                        $scope.GetReferebceRule();
                    }
                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }

        });



    }

    //for child table
    $scope.AddPHDDetails = function (ind) {
        if ($scope.newDet.RefRuleLookUpsColl) {
            if ($scope.newDet.RefRuleLookUpsColl.length > ind + 1) {
                $scope.newDet.RefRuleLookUpsColl.splice(ind + 1, 0, {
                    ClassName: ''
                })
            } else {
                $scope.newDet.RefRuleLookUpsColl.push({
                    ClassName: ''
                })
            }
        }
    };

    //for child table
    $scope.delPHDDetails = function (ind) {
        if ($scope.newDet.RefRuleLookUpsColl) {
            if ($scope.newDet.RefRuleLookUpsColl.length > 1) {
                $scope.newDet.RefRuleLookUpsColl.splice(ind, 1);
            }
        }
    };

    $scope.GetAllLabTestComponent = function (TestNameId) {
        $scope.LabTestComponentColl = [];
        $scope.loadingstatus = 'running';
        showPleaseWait();
        var para = {
            TestId: TestNameId
        };
        $http({
            method: 'Post',
            url: base_url + "Lab/Creation/GetTestComponent",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            $scope.loadingstatus = 'stop';
            hidePleaseWait();
            if (res.data.IsSuccess && res.data.Data) {
                $scope.LabTestComponentColl = res.data.Data;
            } else
                alert(res.data.ResponseMSG);

        }, function (reason) {
            alert('Failed' + reason);
        });
    }

});