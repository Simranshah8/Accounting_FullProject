app.controller('GatePassController', function ($scope, $http, $timeout, $filter, GlobalServices) {
    $scope.Title = 'GatePass';


    $scope.LoadData = function () {
        $('.select2').select2();
        $scope.confirmMSG = GlobalServices.getConfirmMSG();


        $scope.DeliveryThroughList = [];
        $http({
            method: 'GET',
            url: base_url + "Inventory/Creation/GetAllDeliveryThrough",
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.DeliveryThroughList = res.data.Data;
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });


        $scope.VoucherTypeColls = [
            { id: 1, text: 'Delivery Note' },
            { id: 2, text: 'Sales Invoice' },
            { id: 3, text: 'Stock Transfor' },
            { id: 4, text: 'OTHERS' }
        ];

        $scope.SelectedVoucher = null;
        $scope.VoucherTypeColl = [];
        $scope.mandetoryFields = {};
        $scope.PaymentTermList = [];
        $scope.PaymentTermList.push('CASH');
        $scope.PaymentTermList.push('BANK');
        $scope.PaymentTermList.push('CREDIT');
        $scope.CostClassColl = [];
        $scope.NarrationList = [];
        $scope.SelectedCostClass = null;
        $scope.SalesFeatures = {};
        $scope.Config = {};
        $scope.RefItemAllocationColl = [];
        $scope.GodownColl = [];

        $scope.HideShow = {
            AutoVoucherNo: true,
        }

        $scope.beData =
        {
            VoucherId: null,
            CostClassId: null,
            TranId: 0,
            AutoManualNo: '',
            AutoVoucherNo: 0,
            PartyLedgerId: null,
            PartyLedger: null,
            partySideBarData: null,
            SalesMan: null,
            salesmanSideBarData: null,
            CurRate: 1,
            ItemDetailsColl: [],
            AditionalCostColl: [],
            AttechFiles: [],
            SubTotal: 0,
            Total: 0,
            Narration: '',
            VoucherDate: new Date(),
            VoucherDate_TMP: new Date(),
            EntryDate_TMP: new Date(),
            SalesOrderDetail: {},
            SaveClear: false
        };
        $scope.beData.ItemDetailsColl.push(
            {
                ProductId: 0,
                Description: '',
                QtyPoint: 0,
                UnitId: null,
            });
        $('.hideSideBar').on('focus', function (e) {
            $('#sidebarzz').removeClass();
            $('#sidebarzz').addClass('order-last float-right active');
        })
    };


    $scope.ClearData = function () {
        $scope.beData =
        {
            VoucherId: null,
            CostClassId: null,
            TranId: 0,
            AutoManualNo: '',
            AutoVoucherNo: 0,
            PartyLedgerId: null,
            PartyLedger: null,
            partySideBarData: null,
            SalesMan: null,
            salesmanSideBarData: null,
            CurRate: 1,
            ItemDetailsColl: [],
            AditionalCostColl: [],
            AttechFiles: [],
            SubTotal: 0,
            Total: 0,
            Narration: '',
            VoucherDate: new Date(),
            VoucherDate_TMP: new Date(),
            EntryDate_TMP: new Date(),
            SalesOrderDetail: {},
            SaveClear: false
        };
        $scope.beData.ItemDetailsColl.push({});
    };

    $scope.AddRowInItemDetails = function (ind) {
        if ($scope.beData.ItemDetailsColl) {
            if ($scope.beData.ItemDetailsColl.length > ind + 1) {
                $scope.beData.ItemDetailsColl.splice(ind + 1, 0, {
                    VoucherNo: ''
                })
            } else {
                $scope.beData.ItemDetailsColl.push({
                    VoucherNo: ''
                })
            }
        }
    };

    $scope.delRowFromItemDetails = function (ind) {
        if ($scope.beData.ItemDetailsColl) {
            if ($scope.beData.ItemDetailsColl.length > 1) {
                $scope.beData.ItemDetailsColl.splice(ind, 1);
            }
        }
    };

    $scope.SearchModal = function () {
        $('#searVoucherRightBtn').modal('show');
    };



});