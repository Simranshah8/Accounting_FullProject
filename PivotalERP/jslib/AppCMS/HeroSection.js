app.controller("HeroSectionController", function ($scope, $http, GlobalServices, $timeout) {
    $scope.Title = 'Hero Section';

    $scope.LoadData = function () {
        $scope.loadingstatus = "stop";

        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.perPageColl = GlobalServices.getPerPageList();

        $scope.currentPages = {
            HeroSection: 1

        };

        $scope.searchData = {
            HeroSection: ''

        };

        $scope.perPage = {
            HeroSection: GlobalServices.getPerPageRow(),

        };

        $scope.beData = {
            TranId: 0,
            Badge: '',
            Title: '',
            Description: '',
            Photo: '',
            Mode: 'Save',
        };
        $scope.GetAllHeroSection();

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

    $scope.ClearFields = function () {
        $scope.ClearPhoto();
        $scope.beData = {
            TranId: 0,
            Badge: '',
            Title: '',
            Description: '',
            Photo: '',
            Mode: 'Save',
        };
    }

    $scope.IsValidHeroSection= function () {
        if ($scope.beData.Badge.isEmpty()) {
            Swal.fire('Please ! Enter Badge Text');
            return false;
        }
        if ($scope.beData.Title.isEmpty()) {
            Swal.fire('Please ! Enter Title');
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
        return true;
    }

    $scope.SaveUpdateHeroSection = function () {
        if ($scope.IsValidHeroSection() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.beData.Mode;
                Swal.fire({
                    title: 'Do you want to ' + saveModify + ' the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    if (result.isConfirmed) {
                        $scope.CallSaveUpdateHeroSection();
                    }
                });
            } else
                $scope.CallSaveUpdateHeroSection();

        }
    };

    $scope.CallSaveUpdateHeroSection = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();

        var photo = $scope.beData.Photo_TMP;

        $http({
            method: 'Post',
            url: base_url + "AppCMS/Creation/SaveHeroSection",
            headers: { 'Content-Type': undefined },

            transformRequest: function (data) {
                var formData = new FormData();
                formData.append("jsonData", angular.toJson(data.jsonData));

                if (data.HPhoto && data.HPhoto.length > 0)
                    formData.append("photo", data.HPhoto[0]);

                return formData;
            },
            data: { jsonData: $scope.beData, HPhoto: photo }
        }).then(function (res) {
            $scope.loadingstatus = "stop";
            hidePleaseWait();
            Swal.fire(res.data.ResponseMSG);
            if (res.data.IsSuccess == true) {
                $scope.ClearFields();
                $scope.GetAllHeroSection();
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";

        });
    }

    $scope.GetAllHeroSection = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();
        $scope.HeroSectionList = [];
        $http({
            method: 'POST',
            url: base_url + "AppCMS/Creation/GetAllHeroSection",
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.HeroSectionList = res.data.Data;

            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    }

    $scope.GetHeroSectionById = function (refData) {
        $scope.loadingstatus = "running";
        showPleaseWait();
        var para = {
            TranId: refData.TranId
        };
        $http({
            method: 'POST',
            url: base_url + "AppCMS/Creation/GetHeroSectionById",
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


    $scope.DeleteHeroSection = function (refData, ind) {
        Swal.fire({
            title: 'Are you sure you want to delete ' + refData.Badge + '?',
            showCancelButton: true,
            confirmButtonText: 'Delete',
        }).then((result) => {
            if (result.isConfirmed) {
                var para = { TranId: refData.TranId };
                $http({
                    method: 'POST',
                    url: base_url + "AppCMS/Creation/DelHeroSection",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingStatus = "stop";
                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess == true) {
                        $scope.GetAllHeroSection();
                    }
                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }

        });



    }
});