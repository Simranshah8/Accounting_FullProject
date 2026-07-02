app.controller("SalesInvoiceController", function ($scope, $http, GlobalServices, $timeout) {
    $scope.Title = 'Sales Invoice';
    $scope.loadingstatus = "stop";
  
    LoadData();
    function LoadData() {
        $scope.isToggled = true;
        $scope.isActive = false;
        // Function to toggle the state
        $scope.toggle = function () {
            $scope.isToggled = !$scope.isToggled;
            $scope.isActive = !$scope.isActive;
        };

        // Watch for changes in isToggled and apply Select2 accordingly.
        $scope.$watch('isToggled', function (newValue, oldValue) {
            if (newValue) {
                $('.select2').select2();
            } else {
                $('.select2').select2('destroy'); 
            }
        });     

      
        $scope.loadingstatus = "stop";
        $scope.confirmMSG = GlobalServices.getConfirmMSG();    
      
        $scope.beData = {
            SalesInvoiceId: 0,
            ProductId: null,
            ProductBarCode: '',
            ActiveBuyerDetails: false,
            BillNo: '',
            RefNo: '',
            OrderNo: 0,
            CustomerId: null,
            CustomerName: '',
            C_Address: '',
            C_PanNo: '',
            C_MobileNo: '',
            Remarks:''
        };     

      
    }
});
