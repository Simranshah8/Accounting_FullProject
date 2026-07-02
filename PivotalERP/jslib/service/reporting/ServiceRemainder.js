"use strict";

agGrid.initialiseAgGridWithAngular1(angular);

app.controller("JobCardDetailController", function ($scope, $http, $filter, $timeout, GlobalServices, $compile) {
    /* OnClickDefault();*/

    LoadData();

    $scope.onBtExportCSV = function () {
        var params = {
            fileName: 'JobCardDetail.csv',
            sheetName: 'JobCardDetail'
        };
        $scope.gridOptions.api.exportDataAsCsv(params);
    };

    function LoadData() {
        $('.select2').select2({
            allowClear: true,
            openOnEnter: true
        });

        $scope.newComment = {
            Remarks: ''
        };

        $scope.searchData = { Form: '' };
        $scope.currentPages = { Form: 1 };
        $scope.perPage = { Form: 10 };

        
        $scope.BranchList = [];
        $http({
            method: 'POST',
            url: base_url + "Setup/Security/GetAllBranchList",
            dataType: "json"
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.BranchList = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $scope.JobCardDetail = {
            DateFrom_TMP: new Date(),
            DateTo_TMP: new Date(),
            BranchId:null,
        };

        $scope.onFilterTextBoxChanged = function () {
            $scope.gridOptions.api.setQuickFilter($scope.search);
        }

        $scope.loadingstatus = "stop";
        $scope.columnDefs = [
            {
                headerName: "Job No.",
                width: 160,
                field: "AutoManualNo",
                pinned: 'left',
                dataType: 'int',
                cellStyle: { 'text-align': 'left' },
            },
            { headerName: "Party Name", width: 220, field: "Party", pinned: 'left', dataType: 'text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Address", width: 105, field: "Address", pinned: 'left', dataType: 'text', cellStyle: { 'text-align': 'left' } },
            {
                headerName: "Phone No",
                width: 120,
                field: "PhoneNo",
                pinned: "left",
                dataType: 'text',
                cellStyle: { 'text-align': 'left' },
            },
            { headerName: "Vin No.", width: 180, field: "VinNo", dataType: 'int', cellStyle: { 'text-align': 'left' } },
            { headerName: "Regd No.", width: 120, field: "RegdNo", dataType: 'int', cellStyle: { 'text-align': 'left' } },
            { headerName: "Running KM", width: 130, field: "RunningKM", dataType: 'int', cellStyle: { 'text-align': 'left' } },
            { headerName: "Running HR", width: 130, field: "RunningHR", dataType: 'int', cellStyle: { 'text-align': 'left' } },
            {
                headerName: "Next Service Date", width: 170, field: "NextServiceDate", dataType: 'text', cellStyle: { 'text-align': 'center' },
                valueFormatter: function (params) { return DateFormatAD(params.value); },

            },
            { headerName: "Next Service Miti", width: 170, field: "NextServiceMiti", dataType: 'text', cellStyle: { 'text-align': 'center' } },
            //{
            //    headerName: "Next Service Remarks", width: 200, field: "Remarks",
            //    cellRenderer: function (params) {
            //        var div = document.createElement('div');
            //        var formGroup = document.createElement('div');
            //        formGroup.className = 'form-group centered-cell';

            //        var button = document.createElement('button');
            //        button.className = 'btn btn-info btn-sm';
            //        button.innerHTML = (params.data.Remarks ? params.data.Remarks : 'Remarks');
            //        button.addEventListener('click', function () {
            //            $scope.GetJobCardRemarksById(params.data);                        
            //        });
            //        formGroup.appendChild(button);
            //        div.appendChild(formGroup);
            //        return div;
            //    }
            //},
            {
                headerName: "Remarks", width: 220, cellRenderer:
                    function (params) {
                        return '<a href="#" ng-click="GetJobCardRemarksById(this.data)">' + (params.data.Remarks ? params.data.Remarks : 'Remarks')+ '</a>';
                    }
            },
            { headerName: "Days", width: 120, field: "NextServiceAfterDays", dataType: 'int', cellStyle: { 'text-align': 'left' } },
            { headerName: "Branch", width: 150, field: "BranchName", dataType: 'int', cellStyle: { 'text-align': 'left' } },
            { headerName: "Branch Code", width: 100, field: "BranchCode", dataType: 'int', cellStyle: { 'text-align': 'left' } },

        ];

        $scope.gridOptions = {
            angularCompileRows: true,
            defaultColDef: {
                filter: true,
                resizable: true,
                sortable: true,
                width: 100
            },
            enableSorting: true,
            multiSortKey: 'ctrl',
            overlayLoadingTemplate: "Loading..",
            overlayNoRowsTemplate: "No Records found",
            rowSelection: 'multiple',
            columnDefs: $scope.columnDefs,
            rowData: null,
            filter: true,
            alignedGrids: [],
            suppressHorizontalScroll: false,
            enableFilter: true,
            onFilterChanged: function () { }
        };
         
    }

    $scope.GetAllJobCardDetail = function () {
        var dateFrom = new Date(($filter('date')(new Date(), 'yyyy-MM-dd')));
        var dateTo = new Date(($filter('date')(new Date(), 'yyyy-MM-dd')));

        if ($scope.JobCardDetail.DateFromDet)
            dateFrom = new Date(($filter('date')($scope.JobCardDetail.DateFromDet.dateAD, 'yyyy-MM-dd')));

        if ($scope.JobCardDetail.DateToDet)
            dateTo = new Date(($filter('date')($scope.JobCardDetail.DateToDet.dateAD, 'yyyy-MM-dd')));

        $scope.loadingstatus = 'running';
        showPleaseWait();

        var beData = {
            BranchId:$scope.JobCardDetail.BranchId,
            DateFrom: dateFrom,
            DateTo: dateTo,
        };

        $scope.loadingstatus = 'running';
        $http({
            method: "post",
            url: base_url + "Service/Reporting/GetJobCardForRemarks",
            data: JSON.stringify(beData),
            dataType: "json"
        }).then(function (res) {
            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                $scope.JCDList = res.data.Data;
                $scope.gridOptions.api.setRowData(res.data.Data);
            } else
                alert(res.data.ResponseMSG);

        }, function (reason) {
            $scope.loadingstatus = "stop";
            alert('Failed' + reason);
        });

    }

    $scope.ClearComment = function () {
        $scope.newComment = {
            TranId: null,           
            Remarks: '',
            
        };
    }

    $scope.SaveRemarks = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();

        $http({
            method: 'POST',
            url: base_url + "Service/Reporting/SaveJobCardRemarks",
            headers: { 'Content-Type': undefined },
            transformRequest: function (data) {
                var formData = new FormData();
                formData.append("jsonData", angular.toJson(data.jsonData));
                return formData;
            },
            data: { jsonData: $scope.newComment }
        }).then(function (res) {
            $scope.loadingstatus = "stop";
            hidePleaseWait();
            Swal.fire(res.data.ResponseMSG);
            if (res.data.IsSuccess == true) {
                $scope.ClearComment();
                //$scope.GetJobCardRemarksById();

                $('#AddComment').modal('hide');
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }

    $scope.GetJobCardRemarksById  = function (refData) {
        $scope.loadingstatus = "running";
        showPleaseWait();
        $scope.ClearComment();
        $scope.newComment.TranId = refData.TranId;
        $scope.newComment.PartyName = refData.Party;
        var para = {
            TranId: refData.TranId
        };
        $http({
            method: 'POST',
            url: base_url + "Service/Reporting/GetJobCardRemarksById",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";

            if (res.data.IsSuccess && res.data.Data) {
                $scope.CommentList = res.data.Data;

                $('#AddComment').modal('show');

            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    };

    

});