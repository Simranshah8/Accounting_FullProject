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

        $scope.searchData = { Form: '' };
        $scope.currentPages = { Form: 1 };
        $scope.perPage = { Form: 10 };

        // Dummy data for the grid
        $scope.rowData = [
            {
                JobNo: 'J001',
                PartyName: 'Ram Kumar',
                Address: 'Kathmandu',
                PhoneNo: '9800000001',
                VinNo: '1HGBH41JXMN109186',
                RegdNo: 'XYZ123',
                RunningKm: '15000',
                NextServiceDate: '2024-09-01',
                Remarks: 'No issues'
            },
            {
                JobNo: 'J002',
                PartyName: 'Shyam Bahadur',
                Address: 'Bhaktapur',
                PhoneNo: '9800000002',
                VinNo: '1HGBH41JXMN109187',
                RegdNo: 'XYZ124',
                RunningKm: '30000',
                NextServiceDate: '2024-09-15',
                Remarks: 'Minor scratches'
            },
            {
                JobNo: 'J003',
                PartyName: 'Hari Prasad',
                Address: 'Lalitpur',
                PhoneNo: '9800000003',
                VinNo: '1HGBH41JXMN109188',
                RegdNo: 'XYZ125',
                RunningKm: '45000',
                NextServiceDate: '2024-10-01',
                Remarks: 'Oil change needed'
            }
        ];

        $scope.JobCardDetail = {
            DateFrom_TMP: new Date(),
            DateTo_TMP: new Date(),
            JobId: null
        };

        $scope.loadingstatus = "stop";
        $scope.columnDefs = [
            {
                headerName: "Job No.",
                width: 100,
                field: "JobNo",
                pinned: 'left',
                dataType: 'int',
                cellStyle: { 'text-align': 'left' },
            },
            { headerName: "Party Name", width: 130, field: "PartyName", pinned: 'left', dataType: 'text', cellStyle: { 'text-align': 'left' } },
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
            { headerName: "Running KM", width: 130, field: "RunningKm", dataType: 'int', cellStyle: { 'text-align': 'left' } },
            { headerName: "Next Service Date", width: 170, field: "NextServiceDate", dataType: 'text', cellStyle: { 'text-align': 'left' } },
            {
                headerName: "Next Service Remarks", width: 200, field: "Remarks",
                cellRenderer: function (params) {
                    var div = document.createElement('div');
                    var formGroup = document.createElement('div');
                    formGroup.className = 'form-group centered-cell';

                    var button = document.createElement('button');
                    button.className = 'btn btn-info btn-sm';
                    button.innerHTML = 'Remarks';
                    button.addEventListener('click', function () {
                        $('#remarksModal').modal('show');
                        $('#remarksTextArea').val(params.data.Remarks || '');
                        $('#saveRemarksBtn').off('click').on('click', function () {
                            var newRemarks = $('#remarksTextArea').val();
                            params.data.Remarks = newRemarks; // Update the data
                            $scope.gridOptions.api.refreshCells({ rowNodes: [params.node] });
                            $('#remarksModal').modal('hide');
                        });
                    });

                    formGroup.appendChild(button);
                    div.appendChild(formGroup);

                    return div;
                }
            }
        ];

        $scope.gridOptions = {
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
            rowData: $scope.rowData,
            filter: true,
            alignedGrids: [],
            suppressHorizontalScroll: false,
            enableFilter: true,
            onFilterChanged: function () { }
        };

        $scope.eGridDiv = document.querySelector('#datatable');
        new agGrid.Grid($scope.eGridDiv, $scope.gridOptions);
    }

    function OnClickDefault() {
        document.getElementById('grid-table').style.display = "block";
        document.getElementById('modalDiv').style.display = "none";
    }

});