"use strict";

agGrid.initialiseAgGridWithAngular1(angular);

app.controller("BillListController", function ($scope, $http, $filter, $timeout, GlobalServices, $compile) {
    OnClickDefault();

    $scope.LoadData = function () {
        $('.select2').select2({
            allowClear: true,
            openOnEnter: true
        });



        $scope.searchData = {
            Bill: '',
            BreakItem: '',
            DoctorFraction: '',
        };



        $scope.NewDet = {
            DateFrom_TMP: new Date(),
            DateTo_TMP: new Date(),
            PatientId: null
        };

        $scope.DoctorColl = [];
        $http({
            method: 'GET',
            url: base_url + "Hospital/Transaction/GetDoctorList",
            dataType: "json",
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.DoctorColl = res.data.Data;
            }
            else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed to fetch data: ' + reason);
        });

        $scope.loadingstatus = "stop";

        $scope.columnDefs = [
            { headerName: "Patient Id", width: 120, field: "PatientId", pinned: 'left', cellStyle: { 'text-align': 'left' } },
            { headerName: "IP NO", width: 100, field: "IPNo", pinned: 'left', cellStyle: { 'text-align': 'left' } },
            { headerName: "Name", width: 200, field: "Name", pinned: 'left', cellStyle: { 'text-align': 'left' } },
            {
                headerName: "Bill No", width: 120, field: "BillNo", pinned: "left", cellStyle: { 'text-align': 'left' },
                cellRenderer: function (params) { return `<a href="#" ng-click="GetFractionDetail(this.data)">${params.value}</a>`; }
            }, ,
            { headerName: "Bill Date", width: 120, field: "BillDate", cellStyle: { 'text-align': 'left' } },
            { headerName: "Time", width: 100, field: "Time", cellStyle: { 'text-align': 'left' } },
            { headerName: "Amount", width: 130, field: "Amount", cellStyle: { 'text-align': 'right' } },
            { headerName: "Doctor Name", width: 200, field: "DOCName", cellStyle: { 'text-align': 'left' } },
            { headerName: "Total", width: 100, field: "Total", cellStyle: { 'text-align': 'right' } },
            { headerName: "Discount", width: 120, field: "DiscountAmt", cellStyle: { 'text-align': 'center' } },
            { headerName: "Sub Total", width: 120, field: "SubTotal", cellStyle: { 'text-align': 'right' } },
            { headerName: "Tax", width: 100, field: "Tax", cellStyle: { 'text-align': 'right' } },
            { headerName: "Net Amount", width: 140, field: "NetAmount", cellStyle: { 'text-align': 'right' } },
            { headerName: "User", width: 120, field: "User", cellStyle: { 'text-align': 'left' } }
        ];

        $scope.gridOptions = {
            defaultColDef: {
                filter: true,
                resizable: true,
                sortable: true,
                width: 100
            },
            angularCompileRows: true,
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
            onFilterChanged: function () {
                var dt = {
                    Name: 'TOTAL =>',
                    Amount: 0,
                    NetAmount: 0,

                };
                $scope.gridOptions.api.forEachNodeAfterFilterAndSort(function (node) {
                    var fData = node.data;
                    dt.Amount += fData.Amount;
                    dt.NetAmount += fData.NetAmount;

                });

                var filterDataColl = [];
                filterDataColl.push(dt);
                $scope.gridOptionsBottom.api.setRowData(filterDataColl);
            }
        };




    };

    $scope.GetAllBillList = function () {
        var dateFrom = new Date(($filter('date')(new Date(), 'yyyy-MM-dd')));
        var dateTo = new Date(($filter('date')(new Date(), 'yyyy-MM-dd')));

        if ($scope.NewDet.DateFromDet)
            dateFrom = $filter('date')($scope.NewDet.DateFromDet.dateAD, 'yyyy-MM-dd');

        if ($scope.NewDet.DateToDet)
            dateTo = $filter('date')($scope.NewDet.DateToDet.dateAD, 'yyyy-MM-dd');

        var beData = {
            DateFrom: dateFrom,
            DateTo: dateTo

        };

        $http({
            method: 'POST',
            url: base_url + "Hospital/Transaction/GetAllBilllist",
            dataType: "json",
            data: JSON.stringify(beData),
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.DataColl = res.data.Data;

                $timeout(function () {
                    $scope.gridOptions.api.setRowData($scope.DataColl);
                });

            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed to fetch data: ' + reason);
        });
    };


    function OnClickDefault() {
        document.getElementById('grid-table').style.display = "block";
        document.getElementById('patientDetailDiv').style.display = "none";

        document.getElementById('back-to-table').onclick = function () {
            document.getElementById('grid-table').style.display = "block";
            document.getElementById('patientDetailDiv').style.display = "none";
        }

        document.getElementById('back-to-table').onclick = function () {
            document.getElementById('day-book-section').style.display = "block";
            document.getElementById('patientDetailDiv').style.display = "none";
        };
    }


    window.onBillClick = function (billNo) {
        document.getElementById('day-book-section').style.display = "none";
        document.getElementById('patientDetailDiv').style.display = "block";

    };


    $scope.refBill = null;
    $scope.GetFractionDetail = function (refData) {
        $scope.refBill = refData;

        $scope.loadingstatus = "running";
        showPleaseWait();
        var para = {
            TranId: refData.TranId,
            TranType: refData.TranType,
        };
        $http({
            method: 'POST',
            url: base_url + "Hospital/Transaction/GetBillDetailbyId",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.BilldetailListColl = res.data.Data;

                $scope.CalculateDoctorFraction();
                document.getElementById('day-book-section').style.display = "none";
                document.getElementById('patientDetailDiv').style.display = "block";

            } else {
                Swal.fire(res.data.ResponseMSG);
            }

        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

    };

    $scope.SelectedBDet = null;
    $scope.ChangeBillDetails = function (rowData, ind) {
        $scope.SelectedBDet = rowData;
        var i = 0;
        angular.forEach($scope.BilldetailListColl, function (bdet) {
            if (i != ind) {
                bdet.IsSelected = false;
            }
            i++;
        });

        if (!$scope.SelectedBDet.BreakItemColl || $scope.SelectedBDet.BreakItemColl.length == 0) {
            $scope.SelectedBDet.BreakItemColl = [];

            $scope.SelectedBDet.BreakItemColl.push({
                Amount: $scope.SelectedBDet.GrandTotal,
                BillingId: $scope.SelectedBDet.BillingId,
                TranId: $scope.SelectedBDet.TranId
            });
        }
    }

    $scope.BrackRowValue = function (col,rowData) {
        if (col == 'rateper') {
            var comAmt = rowData.Amount * rowData.RatePer / 100;
            rowData.Rate = 0;
            rowData.Total = Number(comAmt.toFixed(3));
        } else if (col == 'rate') {
            rowData.RatePer = 0;
            rowData.Total = rowData.Rate;
        }
        $scope.CalculateDoctorFraction();
    }
    $scope.DoctorWiseFractionColl = [];
    $scope.CalculateDoctorFraction = function () {
        $scope.DoctorWiseFractionColl = [];

        if ($scope.BilldetailListColl && $scope.BilldetailListColl.length > 0) {
            var fracColl = [];
            $scope.BilldetailListColl.forEach(function (bdet) {
                if (bdet.BreakItemColl && bdet.BreakItemColl.length > 0) {
                    bdet.BreakItemColl.forEach(function (com) {
                        fracColl.push(com);
                    });
                }
            });

            var queryFrac = mx(fracColl).groupBy(p1 => p1.DoctorId);

            angular.forEach(queryFrac, function (q) {

                var eQry = mx(q.elements);
                var newDet = {
                    DoctorId: q.key,
                    Amount: eQry.sum(p1 => p1.Amount),
                    Total: eQry.sum(p1 => p1.Total),
                };
                $scope.DoctorWiseFractionColl.push(newDet);
            });
        }
    }

    $scope.addBreakItem = function () {
        if ($scope.SelectedBDet.BreakItemColl) {
            $scope.SelectedBDet.BreakItemColl.push({
                Amount: $scope.SelectedBDet.Amount,
                BillingId: $scope.SelectedBDet.BillingId,
                TranId: $scope.SelectedBDet.TranId
            });
        }
    };

    $scope.deleteBreakItem = function (ind) {
        $scope.SelectedBDet.BreakItemColl.splice(ind, 1);
    };

    $scope.UpdateCommission = function () {

        if (!$scope.BilldetailListColl || $scope.BilldetailListColl.length == 0 || !$scope.refBill)
            return;

        $scope.loadingstatus = "running";
        showPleaseWait();

        var dataColl = [];
        $scope.BilldetailListColl.forEach(function (bdet) {
            if (bdet.BreakItemColl && bdet.BreakItemColl.length > 0) {
                bdet.BreakItemColl.forEach(function (com) {
                    dataColl.push(com);
                });
            }
        });

        $http({
            method: 'POST',
            url: base_url + "Hospital/Transaction/UpdateCommission",
            headers: { 'Content-Type': undefined },

            transformRequest: function (data) {

                var formData = new FormData();
                formData.append("jsonData", angular.toJson(data.jsonData));
                formData.append("tranId", $scope.refBill.TranId);
                formData.append("tranType", $scope.refBill.TranType);

                return formData;
            },
            data: { jsonData: dataColl }
        }).then(function (res) {

            $scope.loadingstatus = "stop";
            hidePleaseWait();

            Swal.fire(res.data.ResponseMSG);

        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";

        });

    }


    //New code added by suresh
    $scope.onFilterTextBoxChanged = function () {
        $scope.gridOptions.api.setQuickFilter($scope.search);
    }
});
