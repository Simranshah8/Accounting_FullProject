app.controller('SubBranchController', function ($scope, $http, $timeout, $filter, GlobalServices) {
    $scope.Title = 'SubBranch';

    LoadData();

    function LoadData() {
        $('.select2').select2();
        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.perPageColl = GlobalServices.getPerPageList();
        $scope.currentPages = {
            SubBranch: 1,
        };

        $scope.searchData = {
            SubBranch: '',

        };

        $scope.perPage = {
            SubBranch: GlobalServices.getPerPageRow()
        };

        $scope.BranchList = [];
        $http({
            method: 'GET',
            url: base_url + "Setup/Security/GetAllBranchList",
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.BranchList = res.data.Data;

            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $scope.newDet = {
            SubBranchId: null,
            BranchId: null,
            Name: '',
            DisplayName: '',
            Code: '',
            Address: '',
            State: '',
            PhoneNo: '',
            FaxNo: '',
            EmailId: '',
            WebSite: '',
            BranchManager: '',
            MobileNo: '',
            Mode: 'Save'
        };

        //$scope.GetAllSubBranch();

    };

    $scope.ClearSubBranch = function () {
        $scope.newDet = {
            SubBranchId: null,
            BranchId: null,
            Name: '',
            DisplayName: '',
            Code: '',
            Address: '',
            State: '',
            PhoneNo: '',
            FaxNo: '',
            EmailId: '',
            WebSite: '',
            BranchManager: '',
            MobileNo: '',
            Mode: 'Save'
        };
    }


    //Show hide jf for Employee Profile

    //function OnClickDefault() {
    //    /*  show or hide Employee Profile*/

    //    document.getElementById('SubBranch-form').style.display = "none";

    //    document.getElementById('add-SubBranch-details').onclick = function () {
    //        document.getElementById('SubBranch-section').style.display = "none";
    //        document.getElementById('SubBranch-form').style.display = "block";
    //    }
    //    document.getElementById('back-to-SubBranch-list').onclick = function () {
    //        document.getElementById('SubBranch-form').style.display = "none";
    //        document.getElementById('SubBranch-section').style.display = "block";
    //    }


    //};



    //************************* BaliType *********************************
    $scope.IsValidSubBranch = function () {
        /*if ($scope.newBaliType.GenderName.isEmpty()) {
            Swal.fire('Please ! Enter GenderName Name');
            return false;
        }*/
        return true;
    }

    $scope.SaveSubBranch = function () {
        if ($scope.IsValidSubBranch() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.newDet.Mode;
                Swal.fire({
                    title: 'Do you want to ' + saveModify + ' the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    /* Read more about isConfirmed, isDenied below */
                    if (result.isConfirmed) {
                        $scope.CallSaveUpdateSubBranch();
                    }
                });
            } else
                $scope.CallSaveUpdateSubBranch();
        }
    };

    $scope.CallSaveUpdateSubBranch = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();
        $http({
            method: 'POST',
            url: base_url + "Setup/Security/SaveSubBranch",
            headers: { 'Content-Type': undefined },
            transformRequest: function (data) {
                var formData = new FormData();
                formData.append("jsonData", angular.toJson(data.jsonData));
                return formData;
            },
            data: { jsonData: $scope.newDet }
        }).then(function (res) {
            $scope.loadingstatus = "stop";
            hidePleaseWait();
            Swal.fire(res.data.ResponseMSG);
            if (res.data.IsSuccess == true) {
                $scope.ClearSubBranch();
                $scope.GetAllSubBranch();
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }



    $scope.GetAllSubBranch = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();
        $scope.SubBranchList = [];
        $http({
            method: 'GET',
            url: base_url + "Setup/Security/GetAllSubBranch",
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.SubBranchList = res.data.Data;
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    }

    $scope.getSubBranchById = function (refData) {
        $scope.loadingstatus = "running";
        showPleaseWait();
        var para = {
            SubBranchId: refData.SubBranchId
        };
        $http({
            method: 'POST',
            url: base_url + "Setup/Security/getSubBranchById",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.newDet = res.data.Data;
                $scope.newDet.Mode = 'Modify';
                $('#custom-tabs-four-profile-tab').tab('show');

            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    };



    $scope.DelSubBranchById = function (refData, ind) {
        Swal.fire({
            title: 'Do you want to delete ' + refData.Name + '?',
            showCancelButton: true,
            confirmButtonText: 'Delete',
            //message: 'Are you sure to delete selected BaliType :-' + beData.Name,
        }).then((result) => {
            if (result.isConfirmed) {
                var para = {
                    SubBranchId: refData.SubBranchId
                };
                $http({
                    method: 'POST',
                    url: base_url + "Setup/Security/DeleteSubBranch",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingStatus = "stop";

                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess == true) {
                        $scope.GetAllSubBranch();
                    }
                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }

        });
    }





});