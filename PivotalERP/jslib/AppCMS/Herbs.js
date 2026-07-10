app.controller("HerbsController", function ($scope, $http, GlobalServices, $timeout) {
    $scope.Title = 'Herbs';

    $scope.LoadData = function () {
        $scope.loadingstatus = "stop";

        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.perPageColl = GlobalServices.getPerPageList();

        $scope.currentPages = {
            Herbs: 1

        };

        $scope.searchData = {
            Herbs: ''

        };

        $scope.perPage = {
            Herbs: GlobalServices.getPerPageRow(),

        };


        $scope.beData =
        {
            HerbsId: 0,
            Name: '',
            ScientificName: '',
            Badge: '',
            HsubTitle: '',
            SEOTitle: '',
            SEODescription: '',
            Description: '',
            AboutPara: '',
            Photo: '',
            Banner: '',
            Tag: '',
            Mode: 'Save',
        };
        $scope.GetAllHerbs();

    };

    $scope.ClearPhoto = function () {
        $timeout(function () {
            $scope.$apply(function () {
                $scope.beData.PhotoData = null;
                $scope.beData.Photo_TMP = [];
            });

        });
        $('#imgPhoto1').attr('src', '');
    };

    $scope.ClearBanner = function () {
        $timeout(function () {
            $scope.$apply(function () {
                $scope.beData.BannerData = null;
                $scope.beData.Banner_TMP = [];
            });

        });
        $('#BannerPhoto').attr('src', '');
    };

    $scope.ClearFields = function () {
        $scope.ClearPhoto();
        $scope.ClearBanner();
        $scope.beData =
        {
            HerbsId: 0,
            Name: '',
            ScientificName: '',
            Badge: '',
            HsubTitle: '',
            SEOTitle: '',
            SEODescription: '',
            Description: '',
            AboutPara: '',
            Photo: '',
            Banner: '',
            Tag: '',
            Mode: 'Save',
        };
    }

    $scope.IsValidHerbs = function () {
        if ($scope.beData.Name.isEmpty()) {
            Swal.fire('Please ! Enter Name');
            return false;
        }
        if ($scope.beData.Description.isEmpty()) {
            Swal.fire('Please ! Enter Description');
            return false;
        }
        if (!$scope.beData.PhotoData && !$scope.beData.Photo) {
            Swal.fire('Please! Choose a Photo');
            return false;
        }
        if (!$scope.beData.BannerData && !$scope.beData.Banner) {
            Swal.fire('Please! Choose a Banner');
            return false;
        }
        return true;
    }

    $scope.SaveUpdateHerbs = function () {
        if ($scope.IsValidHerbs() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.beData.Mode;
                Swal.fire({
                    title: 'Do you want to ' + saveModify + ' the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    if (result.isConfirmed) {
                        $scope.CallSaveUpdateHerbs();
                    }
                });
            } else
                $scope.CallSaveUpdateHerbs();

        }
    };

    $scope.CallSaveUpdateHerbs = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();

        var photo = $scope.beData.Photo_TMP;
        var Bannerphoto = $scope.beData.Banner_TMP;

        $http({
            method: 'Post',
            url: base_url + "AppCMS/Creation/SaveHerbs",
            headers: { 'Content-Type': undefined },

            transformRequest: function (data) {
                var formData = new FormData();
                formData.append("jsonData", angular.toJson(data.jsonData));

                if (data.HPhoto && data.HPhoto.length > 0)
                    formData.append("photo", data.HPhoto[0]);

                if (data.BPhoto && data.BPhoto.length > 0)
                    formData.append("Bannerphoto", data.BPhoto[0]);

                return formData;
            },
            data: { jsonData: $scope.beData, HPhoto: photo, BPhoto: Bannerphoto  }
        }).then(function (res) {
            $scope.loadingstatus = "stop";
            hidePleaseWait();
            Swal.fire(res.data.ResponseMSG);
            if (res.data.IsSuccess == true) {
                $scope.ClearFields();
                $scope.GetAllHerbs();
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";

        });
    }

    $scope.GetAllHerbs = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();
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
    }

    $scope.GetHerbsById = function (refData) {
        $scope.loadingstatus = "running";
        showPleaseWait();
        var para = {
            HerbsId: refData.HerbsId
        };
        $http({
            method: 'POST',
            url: base_url + "AppCMS/Creation/GetHerbsById",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.beData = res.data.Data;
                $scope.beData.Mode = 'Modify';
                $('#custom-tabs-four-profile-tab').tab('show');

            } else {
                Swal.fire(res.data.ResponseMSG);
            }

        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    };


    $scope.DeleteHerbs = function (refData, ind) {
        Swal.fire({
            title: 'Are you sure you want to delete ' + refData.Name + '?',
            showCancelButton: true,
            confirmButtonText: 'Delete',
        }).then((result) => {
            if (result.isConfirmed) {
                var para = { HerbsId: refData.HerbsId };
                $http({
                    method: 'POST',
                    url: base_url + "AppCMS/Creation/DelHerbs",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingStatus = "stop";
                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess == true) {
                        $scope.GetAllHerbs();
                    }
                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }

        });
    }
});