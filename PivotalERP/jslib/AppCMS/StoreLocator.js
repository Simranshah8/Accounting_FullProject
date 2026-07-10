app.controller("StoreLocatorController", function ($scope, $http, $filter, GlobalServices, $timeout) {
    $scope.Title = 'Store Locator';

    $scope.LoadData = function () {
        $scope.loadingstatus = "stop";

        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.perPageColl = GlobalServices.getPerPageList();

        $scope.currentPages = {
            StoreLocator: 1

        };

        $scope.searchData = {
            StoreLocator: ''

        };

        $scope.perPage = {
            StoreLocator: GlobalServices.getPerPageRow(),

        };

        $scope.beData = {
            StoreId: 0,
            StoreName: '',
            CountryName: '',
            CityName: '',
            Location: '',
            Address: '',
            PhoneNo: '',
            Photo: '',
            OpeningTime: '',
            ClosingTime: '',
            Mode: 'Save',
        };
        $scope.GetAllStoreLocator();

    };

    $scope.ClearPhoto = function () {
        $timeout(function () {
            $scope.$apply(function () {
                $scope.beData.PhotoData = null;
                $scope.beData.Photo_TMP = [];
            });

        });
        $('#imgEmp').attr('src', '');
        $('#imgPhoto1').attr('src', '');
    };

    $scope.ClearFields = function () {
        $scope.ClearPhoto();
        $scope.beData = {
            StoreId: 0,
            StoreName: '',
            CountryName: '',
            CityName: '',
            Location: '',
            Address: '',
            PhoneNo: '',
            Photo: '',
            OpeningTime: '',
            ClosingTime: '',
            Mode: 'Save',
        };
    }

    $scope.IsValidStoreLocator = function () {
        if ($scope.beData.StoreName.isEmpty()) {
            Swal.fire('Please ! Enter Store Name');
            return false;
        }
        if ($scope.beData.CountryName.isEmpty()) {
            Swal.fire('Please ! Enter Country Name');
            return false;
        }
        if ($scope.beData.CityName.isEmpty()) {
            Swal.fire('Please ! Enter City Name');
            return false;
        }
        if ($scope.beData.Location.isEmpty()) {
            Swal.fire('Please ! Enter Location');
            return false;
        }
        if ($scope.beData.PhoneNo.isEmpty()) {
            Swal.fire('Please ! Enter Phone Number');
            return false;
        }
        if (!$scope.beData.PhotoData && !$scope.beData.Photo) {
            Swal.fire('Please! Choose a Photo');
            return false;
        }
        return true;
    }

    $scope.SaveUpdateStoreLocator = function () {
        if ($scope.IsValidStoreLocator() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.beData.Mode;
                Swal.fire({
                    title: 'Do you want to ' + saveModify + ' the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    if (result.isConfirmed) {
                        $scope.CallSaveUpdateStoreLocator();
                    }
                });
            } else
                $scope.CallSaveUpdateStoreLocator();

        }
    };

    $scope.CallSaveUpdateStoreLocator = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();
        var photo = $scope.beData.Photo_TMP;

        if ($scope.beData.OpeningTime_TMP) {
            $scope.beData.OpeningTime = $filter('date')(new Date($scope.beData.OpeningTime_TMP), 'yyyy-MM-dd HH:mm:ss');
        }
        else
            $scope.beData.OpeningTime = null;

        if ($scope.beData.ClosingTime_TMP) {
            $scope.beData.ClosingTime = $filter('date')(new Date($scope.beData.ClosingTime_TMP), 'yyyy-MM-dd HH:mm:ss');
        }
        else
            $scope.beData.ClosingTime = null;

        $http({
            method: 'Post',
            url: base_url + "AppCMS/Creation/SaveStoreLocator",
            headers: { 'Content-Type': undefined },

            transformRequest: function (data) {
                var formData = new FormData();
                formData.append("jsonData", angular.toJson(data.jsonData));

                if (data.SPhoto && data.SPhoto.length > 0)
                    formData.append("photo", data.SPhoto[0]);

                return formData;
            },
            data: { jsonData: $scope.beData, SPhoto: photo }
        }).then(function (res) {
            $scope.loadingstatus = "stop";
            hidePleaseWait();
            Swal.fire(res.data.ResponseMSG);
            if (res.data.IsSuccess == true) {
                $scope.ClearFields();
                $scope.GetAllStoreLocator();
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";

        });
    }

    $scope.GetAllStoreLocator = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();
        $scope.StoreLocatorList = [];
        $http({
            method: 'POST',
            url: base_url + "AppCMS/Creation/GetAllStoreLocator",
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.StoreLocatorList = res.data.Data;

            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    }

    $scope.GetStoreLocatorById = function (refData) {
        $scope.loadingstatus = "running";
        showPleaseWait();
        var para = {
            StoreId: refData.StoreId
        };
        $http({
            method: 'POST',
            url: base_url + "AppCMS/Creation/GetStoreLocatorById",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.beData = res.data.Data;
                $scope.beData.Mode = 'Modify';

                if ($scope.beData.OpeningTime)
                    $scope.beData.OpeningTime_TMP = new Date($scope.beData.OpeningTime);

                if ($scope.beData.ClosingTime)
                    $scope.beData.ClosingTime_TMP = new Date($scope.beData.ClosingTime);

                $('#custom-tabs-four-profile-tab').tab('show');

            } else {
                Swal.fire(res.data.ResponseMSG);
            }

        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    };


    $scope.DeleteStoreLocator = function (refData, ind) {
        Swal.fire({
            title: 'Are you sure you want to delete ' + refData.StoreName + '?',
            showCancelButton: true,
            confirmButtonText: 'Delete',
        }).then((result) => {
            if (result.isConfirmed) {
                var para = { StoreId: refData.StoreId };
                $http({
                    method: 'POST',
                    url: base_url + "AppCMS/Creation/DelStoreLocator",
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