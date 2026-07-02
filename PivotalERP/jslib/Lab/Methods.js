app.controller('Methods', function ($scope, $filter, $http, $timeout, GlobalServices) {
    $scope.Title = 'Methods';
    var glSrv = GlobalServices;

    $scope.onBtExportCSV = function () {
        var params = {
            fileName: 'Methods.csv',
            sheetName: 'Methods'
        };
        $scope.gridOptions.api.exportDataAsCsv(params);
    }
    $scope.onFilterTextBoxChanged = function () {
        $scope.gridOptions.api.setQuickFilter($scope.search);
    }
  

   $scope.LoadData= function () {

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

        $scope.beData =
        {
            MethodId: 0,
            Name: '',
            Code: '',
            Category: '',
            Notes: '',
            isActive:true,
            Mode: 'Save'
       }


       $scope.columnDefs = [
           { headerName: "SNo.", width: 70, valueGetter: "node.rowIndex + 1", cellStyle: { textAlign: "center" }, sortable: false, filter: false },
           { field: "Name", headerName: "Name", filter: 'agTextColumnFilter', flex: 2, cellStyle: { 'textAlign': 'left' } },
           { field: "Code", headerName: "Code", filter: 'agTextColumnFilter', flex: 1, cellStyle: { 'textAlign': 'left' } },
           { field: "Category", headerName: "Category", filter: 'agTextColumnFilter', flex: 1.2, cellStyle: { 'textAlign': 'left' } },
           { field: "Notes", headerName: "Notes", filter: 'agTextColumnFilter', flex: 2, cellStyle: { 'textAlign': 'left' } },
           { field: "isActive", headerName: "IsActive", filter: 'agTextColumnFilter', width: 100, cellStyle: { 'textAlign': 'center' } },
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
                       scope.getMethodsById(params.data);
                       scope.$apply();
                   });
                   // DELETE CLICK
                   eDiv.querySelector(".delete-btn").addEventListener("click", function () {
                       scope.deleteMethods(params.data);
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
       $timeout(function () {
           GlobalServices.getListState(EntityId, $scope.gridOptions);
       });
       //end Daily Biometric Attendance

       $scope.GetAllMethods();

    };

    $scope.saveRptListState = function () {
        GlobalServices.saveRptListState(EntityId, $scope.gridOptions);
    };


    $scope.GetAutoCodeNo = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();
        $http({
            method: 'POST',
            url: base_url + "Lab/Creation/GetAutoCode",
            dataType: "json"

        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                var vDet = res.data.Data;
                $scope.beData.Code = vDet.RId;
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    }


    $scope.ClearFields = function () {
        $scope.GetAutoCodeNo();
        $scope.beData =
        {
            MethodId: 0,
            Name: '',
            Code: '',
            Category: '',
            Notes: '',
            isActive: true
        };
    }

    $scope.GetAllMethods = function () {
      /*  $scope.MethodsColl = []; *///declare an empty array
        $scope.loadingstatus = 'running';
        showPleaseWait();
        
        $http({
            method: 'POST',
            url: base_url + "Lab/Creation/GetAlllab_Method",
            dataType: "json"
            //data:JSON.stringify(para)
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

    $scope.SaveUpdateMethods = function () {
        if ($scope.IsValidMethods() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.beData.Mode;
                Swal.fire({
                    title: 'Do you want to' + saveModify + 'the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    if (result.isConfirmed) {
                        $scope.CallSaveUpdateMethods();
                    }

                });
            }
            else
                $scope.CallSaveUpdateMethods();
        }
    };

    $scope.CallSaveUpdateMethods = function () {
        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: 'POST',
            url: base_url + "Lab/Creation/Savelab_Method",
            headers: { 'content-Type': undefined },

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
                $scope.ClearFields();
                $scope.GetAllMethods();
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }

    $scope.getMethodsById = function (beData) {

        $scope.loadingstatus = "running";
        var para = {
            MethodId: beData.MethodId
        };
        $http({
            method: 'POST',
            url: base_url + "Lab/Creation/Getlab_MethodById",
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

    $scope.deleteMethods = function (refData, ind) {

        Swal.fire({
            title: 'Are you sure to delete selected Method:-' + refData.Name,
            showCancelButton: true,
            confirmButtonText: 'Delete',
        }).then((result) => {
            if (result.isConfirmed) {
                $scope.loadingstatus = "running";
                showPleaseWait();

                var para = {
                    MethodId: refData.MethodId
                };

                $http({
                    method: 'POST',
                    url: base_url + "Lab/Creation/Dellab_Method",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingstatus = "stop";
                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess) {
                        $scope.GetAllMethods();
                    }

                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }
        });

    }
});