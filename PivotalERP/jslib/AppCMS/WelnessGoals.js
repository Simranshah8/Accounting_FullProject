app.controller('WelnessController', function ($scope, $http, $timeout, $filter, GlobalServices) {
    $scope.Title = 'Welness Goals';

    $scope.LoadData = function () {
        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.perPageColl = GlobalServices.getPerPageList();

        $scope.currentPages = {
            WelnessGoals: 1
        };

        $scope.searchData = {
            WelnessGoals: ''
        };

        $scope.perPage = {
            WelnessGoals: GlobalServices.getPerPageRow()
        };

        $scope.newDet = {
            WelnessId: 0,
            Name: '',
            Description: '',
            Badge: '',
            Banner: '',
            BannerPath: '',
            Image: '',
            ImagePath: '',
            Mode: 'Save'
        };

        $scope.HerbsList = [];
        $http({
            method: 'POST',
            url: base_url + "AppCMS/Creation/GetAllHerbs",
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.HerbsList = res.data.Data;

            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $scope.GetAllWelnessGoals();
    };


    $scope.ClearWelnessGoals = function () {
        $scope.newDet = {
            WelnessId: 0,
            Name: '',
            Description: '',
            Badge: '',
            Banner: '',
            BannerPath: '',
            Image: '',
            ImagePath: '',
            Mode: 'Save'
        };
        $scope.ClearBanner();
        $scope.ClearImage();
    };

    $scope.ClearBanner = function () {
        $timeout(function () {
            $scope.$apply(function () {
                $scope.newDet.BannerData = null;
                $scope.newDet.Banner_TMP = [];
            });
        });
        $('#imgBanner1').attr('src', '');
    };

    $scope.ClearImage = function () {
        $timeout(function () {
            $scope.$apply(function () {
                $scope.newDet.ImageData = null;
                $scope.newDet.Image_TMP = [];
            });
        });
        $('#imgPhoto1').attr('src', '');
    };


    $scope.GetAllWelnessGoals = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();
        $scope.WelnessGoalsList = [];
        $http({
            method: 'POST',
            url: base_url + "AppCMS/Creation/GetAllWelnessGoals",
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.WelnessGoalsList = res.data.Data;
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            hidePleaseWait();
            Swal.fire('Failed' + reason);
        });
    };


    $scope.GetWelnessGoalsById = function (refData) {
        $scope.loadingstatus = "running";
        showPleaseWait();
        var para = {
            WelnessId: refData.WelnessId
        };
        $http({
            method: 'POST',
            url: base_url + "AppCMS/Creation/GetWelnessGoalsById",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.ClearWelnessGoals();
                $scope.newDet = res.data.Data;
                $scope.newDet.Mode = 'Update';
                $('#custom-tabs-four-profile-tab').tab('show');
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            hidePleaseWait();
            Swal.fire('Failed' + reason);
        });
    };


    $scope.DelWelnessGoalsById = function (refData) {
        Swal.fire({
            title: 'Do you want to delete ' + refData.Name + '?',
            showCancelButton: true,
            confirmButtonText: 'Delete',
        }).then((result) => {
            if (result.isConfirmed) {
                var para = {
                    WelnessId: refData.WelnessId
                };
                showPleaseWait();
                $http({
                    method: 'POST',
                    url: base_url + "AppCMS/Creation/DelWelnessGoals",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingStatus = "stop";
                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess == true) {
                        $scope.GetAllWelnessGoals();
                    }
                }, function (reason) {
                    hidePleaseWait();
                    Swal.fire('Failed' + reason);
                });
            }
        });
    };


    $scope.IsValidWelnessGoals = function () {
        if (!$scope.newDet.Name) {
            Swal.fire('Name Required');
            return false;
        }
        return true;
    };


    $scope.SaveUpdateWelnessGoals = function () {
        if ($scope.IsValidWelnessGoals() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.newDet.Mode;
                Swal.fire({
                    title: 'Do you want to ' + saveModify + ' the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    if (result.isConfirmed) {
                        $scope.CallSaveUpdateWelnessGoals();
                    }
                });
            } else {
                $scope.CallSaveUpdateWelnessGoals();
            }
        }
    };

    $scope.CallSaveUpdateWelnessGoals = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();

        var Bannerphoto = $scope.newDet.Banner_TMP;
        var image = $scope.newDet.Image_TMP;

        $http({
            method: 'POST',
            url: base_url + "AppCMS/Creation/SaveWelnessGoals",
            headers: { 'Content-Type': undefined },

            transformRequest: function (data) {
                var formData = new FormData();
                formData.append("jsonData", angular.toJson(data.jsonData));

                if (data.BPhoto && data.BPhoto.length > 0)
                    formData.append("Bannerphoto", data.BPhoto[0]);

                if (data.image && data.image.length > 0)
                    formData.append("image", data.image[0]);

                return formData;
            },
            data: { jsonData: $scope.newDet, BPhoto: Bannerphoto, image: image }
        }).then(function (res) {
            $scope.loadingstatus = "stop";
            hidePleaseWait();
            Swal.fire(res.data.ResponseMSG);
            if (res.data.IsSuccess == true) {
                $scope.ClearWelnessGoals();
                $scope.GetAllWelnessGoals();
                $('#custom-tabs-four-home-tab').tab('show');
            }
        }, function (errormessage) {
            $scope.loadingstatus = "stop";
            hidePleaseWait();
            Swal.fire(errormessage);
        });
    };


    $scope.pageChangeHandler = function (newPageNumber) {
        $scope.currentPages.WelnessGoals = newPageNumber;
    };

});