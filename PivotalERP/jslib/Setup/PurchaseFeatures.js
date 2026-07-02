app.controller("PurchaseFeatures", function ($scope, $http, GlobalServices, $timeout) {
    $scope.Title = 'PurchaseFeatures';

    LoadData();


    function LoadData() {
        $scope.loadingstatus = "stop";
        $scope.confirmMSG = GlobalServices.getConfirmMSG();




        $scope.beData =
        {
            AllowAutoTDS: true,
            AllowIG: true,
            AllowIndent: true,
            AllowLedAllocationReceiptNote: true,
            AllowOrder: true,
            AllowQuotation: true,
            AllowReceiptNote: true,
            AllowSalesRateInPurchaseInvoice: true,
            ProductWiseAditinalCost: true,
            ProductWiseAID: true,
            ProductWiseCSC: true,
            ProductWiseESC: true,
            ProductWiseExciseDuty: true,
            ProductWiseFreight: true,
            ProductWisePurchaseLedger: true,
            ProductWiseVat: true,
            ShowProductLedger: true,
        };

    };

    $scope.ClearFields = function () {
        $scope.loadingstatus = "stop";
        $scope.beData =
        {
            AllowAutoTDS: null,
            AllowIG: null,
            AllowIndent: null,
            AllowLedAllocationReceiptNote: null,
            AllowOrder: null,
            AllowQuotation: null,
            AllowReceiptNote: null,
            AllowSalesRateInPurchaseInvoice: null,
            ProductWiseAditinalCost: null,
            ProductWiseAID: null,
            ProductWiseCSC: null,
            ProductWiseESC: null,
            ProductWiseExciseDuty: null,
            ProductWiseFreight: null,
            ProductWisePurchaseLedger: null,
            ProductWiseVat: null,
            ShowProductLedger: null,
        };
        
    }





    $scope.AddNewPurchaseFeatures = function () {
        if ($scope.confirmMSG.Accept == true) {
            var saveModify = $scope.beData.Mode;
            Swal.fire({
                title: 'Do you want to' + saveModify + 'the current data?',
                showCancelButton: true,
                confirmButtonText: saveModify,
            }).then((result) => {
                if (result.isConfirmed) {
                    $scope.CallSavePurchaseFeatures();
                }

            });
        }
        else
            $scope.CallSavePurchaseFeatures();
    };

    $scope.CallSavePurchaseFeatures = function () {
        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: 'POST',
            url: base_url + "Setup/Security/SavePurchaseFeatures",
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

            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }






});