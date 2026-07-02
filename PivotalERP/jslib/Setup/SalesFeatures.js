app.controller("SalesFeatures", function ($scope, $http, GlobalServices, $timeout) {
    $scope.Title = 'SalesFeatures';

    LoadData();


    function LoadData() {
        $scope.loadingstatus = "stop";
        $scope.confirmMSG = GlobalServices.getConfirmMSG();

      

       
        $scope.beData =
        {
            ActiveSMS: true,
            AllowBarCodeSalesInvoice: true,
            AllowCounterSales:true,
            AllowDeliveryNote: true,
            AllowFreightChallan: true,
            AllowLedAllocationDeliveryNote: true,
            AllowOrder: true,
            AllowPointOfSales: true,
            AllowQuotation: true,
            AllowSalesInvoice: true,
            AllowSalesInvoiceIncludeVat: true,
            AllowSalesInvoiceShortEntry: true,
            ProductWiseAditinalCost: true,
            ProductWiseExciseDuty: true,
            ProductWiseSalesLedger: true,
            ProductWiseVat: true,
            ShowDispatchOrderSection: true,
            ShowProductLedger: true,
            ShowProductRateDetailsInInvoice: true
        };

    };

    $scope.ClearFields = function () {
        $scope.loadingstatus = "stop";
        $scope.beData =
        {
            ActiveSMS: null,
            AllowBarCodeSalesInvoice: null,
            AllowCounterSales: null,
            AllowDeliveryNote: null,
            AllowFreightChallan: null,
            AllowLedAllocationDeliveryNote: null,
            AllowOrder: null,
            AllowPointOfSales: null,
            AllowQuotation: null,
            AllowSalesInvoice: null,
            AllowSalesInvoiceIncludeVat: null,
            AllowSalesInvoiceShortEntry: null,
            ProductWiseAditinalCost: null,
            ProductWiseExciseDuty: null,
            ProductWiseSalesLedger: null,
            ProductWiseVat: null,
            ShowDispatchOrderSection: null,
            ShowProductLedger: null,
            ShowProductRateDetailsInInvoice: null,
        };
        $('#txtName').focus();
    }



   

    $scope.AddNewSalesFeatures = function () {
        if ($scope.confirmMSG.Accept == true) {
            var saveModify = $scope.beData.Mode;
            Swal.fire({
                title: 'Do you want to' + saveModify + 'the current data?',
                showCancelButton: true,
                confirmButtonText: saveModify,
            }).then((result) => {
                if (result.isConfirmed) {
                    $scope.CallSaveSalesFeatures();
                }

            });
        }
        else
            $scope.CallSaveSalesFeatures();
    };

    $scope.CallSaveSalesFeatures = function () {
        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: 'POST',
            url: base_url + "Setup/Security/SaveSalesFeatures",
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