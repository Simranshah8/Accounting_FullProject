app.controller("CostClass", function ($scope, $http, $timeout,$filter, GlobalServices) {

    LoadData();

    function LoadData() {
        $scope.loadingstatus = "stop";
        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.perPageColl = GlobalServices.getPerPageList();


        $scope.perPage = {
            CostClass: GlobalServices.getPerPageRow(),

        };
        $scope.searchData = {
            CostClass: ''
        };
        $scope.currentPages = {
            CostClass: 1

        };
        
        $scope.beData =
        {
            CostClassId: 0,
            Name: '',
            Alias: '',
            Code: '',
            IsDefault: false,
            BlockTransaction:false,

        };
      
    };
    $scope.ClearFields = function () {
        $scope.loadingstatus = "stop";
        $scope.beData =
        {
            CostClassId: 0,
            Name: '',
            Alias: '',
            Code: '',
            IsDefault: false,
            BlockTransaction:false,
        };
    }

    $scope.Validate = function () {
        if ($scope.beData.Name.isEmpty()) {
            Swal.fire("Please ! Enter Valid CostClass Name");
            return false;
        }
        else
            return true;
    }
     
    $scope.GetAllCostClass = function () {
        $scope.noofrows = 10;

        $scope.CostClassColl = []; //declare an empty array

        if ($scope.loadingstatus != 'stop') {
            alert('Already Running Process')
            return;
        }

        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: 'GET',
            url: base_url + "Account/Creation/GetAllCostClasss",
            dataType: "json"
            //data:JSON.stringify(para)
        }).then(function (res) {

            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                $timeout(function () {
                    $scope.CostClassColl = res.data.Data;
                });
            } else
                alert(res.data.ResponseMSG);

        }, function (reason) {
            alert('Failed' + reason);
        });

    } 

    $scope.AddCostClass = function () {
        if ($scope.Validate() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.beData.Mode;
                Swal.fire({
                    title: 'Do you want to' + saveModify + 'the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    if (result.isConfirmed) {
                        $scope.CallSaveUpdateCostClass();
                    }

                });
            }
            else
                $scope.CallSaveUpdateCostClass();
        }
    };

    $scope.CallSaveUpdateCostClass = function () {
        $scope.loadingstatus = 'running';
        showPleaseWait();

        if ($scope.beData.StartDateDet) {
            $scope.beData.StartDate = $filter('date')(new Date($scope.beData.StartDateDet.dateAD), 'yyyy-MM-dd');
        }

        if ($scope.beData.EndDateDet) {
            $scope.beData.EndDate = $filter('date')(new Date($scope.beData.EndDateDet.dateAD), 'yyyy-MM-dd');
        }


        $http({
            method: 'POST',
            url: base_url + "Account/Creation/SaveCostClass",
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
                $scope.GetAllCostClass();
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }
   
    $scope.getCostClassById = function (editData) {

        $scope.loadingstatus = "running";
        $scope.beData = editData;

        if ($scope.beData.StartDate)
            $scope.beData.StartDate_TMP = new Date($scope.beData.StartDate);

        if ($scope.beData.EndDate)
            $scope.beData.EndDate_TMP = new Date($scope.beData.EndDate);

        $('#custom-tabs-four-profile-tab').tab('show');     
        $scope.loadingstatus = "stop";
    }

    $scope.deleteCostClass = function (refData, ind) {

        Swal.fire({
            title: 'Are you sure you want to delete ' + refData.Name + '?',
            showCancelButton: true,
            confirmButtonText: 'Delete',
            //message: 'Are you sure to delete selected Branch :-' + beData.Name,
        }).then((result) => {
            if (result.isConfirmed) {
                var para = { CostClassId: refData.CostClassId };
                $http({
                    method: 'POST',
                    url: base_url + "Account/Creation/DeleteCostClass",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingStatus = "stop";

                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess == true) {
                        $scope.CostClassColl.splice(ind, 1);
                    }
                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }

        });
    }
     
});