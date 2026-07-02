app.controller("ServiceMembers", function ($scope, $http, GlobalServices, $timeout) {
    $scope.Title = 'Service Members';

    LoadData();
    function LoadData() {
        $('.select2').select2();
        $scope.loadingstatus = "stop";
        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.perPageColl = GlobalServices.getPerPageList();

        $scope.perPage = {
            ServiceMembers: GlobalServices.getPerPageRow(),
        };

        $scope.currentPages = {
            ServiceMembers: 1
        };


        $scope.searchData = {
            ServiceMembers: ''
        };

        $scope.beData =
        {
            TranId: 0,
            Name: '',
            Address: '',
            Mobile: '',
            Email: '',
            JobTitle: '',
            BranchId: null,
            UserId: null,
        };
    };
    $scope.ClearFields = function () {
        $scope.loadingstatus = "stop";
        $scope.beData =
        {
            TranId: 0,
            Name: '',
            Address: '',
            Mobile: '',
            Email: '',
            JobTitle: '',
            BranchId: null,
            UserId: null,
            
        };

    }



    $scope.IsValidServiceMembers = function () {
        if ($scope.beData.Name.isEmpty()) {
            Swal.fire("Please ! Enter From Customer Name");
            return false;
        }
        else
            return true;
    }

    $scope.SaveUpdateServiceMembers = function () {
        if ($scope.IsValidServiceMembers() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.beData.Mode;
                Swal.fire({
                    title: 'Do you want to ' + saveModify + ' the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    /* Read more about isConfirmed, isDenied below */
                    if (result.isConfirmed) {
                        $scope.CallSaveUpdateServiceMembers();
                    }
                });
            } else
                $scope.CallSaveUpdateServiceMembers();
        }
    };

    $scope.CallSaveUpdateServiceMembers = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();
        $http({
            method: 'POST',
            url: base_url + "Setup/JobCard/SaveServiceTechnician",
            headers: { 'Content-Type': undefined },
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
                $scope.ClearServiceMembers();
                /* $scope.GetAllServiceMembers();*/
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }
});