app.controller("CustomerUser", function ($scope, $http, $filter, $timeout, GlobalServices) {

    LoadData();

    function LoadData() {
        $('.select2').select2();
        $scope.UserNameAsList = [{ id: 1, text: 'Customer Code' }, { id: 2, text: 'Pan No' }, { id: 3, text: 'Mobile No' }];
        $scope.loadingstatus = "stop";
        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.perPageColl = GlobalServices.getPerPageList();


        $scope.perPage = {
            CustomerUser: GlobalServices.getPerPageRow(),

        };
        $scope.currentPages = {
            CustomerUser: 1

        };
        $scope.searchData = {
            CustomerUser: ''
        };
        $scope.UserGroupList = [];
        $http({
            method: 'GET',
            url: base_url + "Setup/Security/GetAllUserGroupList",
            dataType: "json"
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.UserGroupList = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });      

    };

    


    
});