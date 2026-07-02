app.controller("AreaMaster", function ($scope, $http, $timeout,GlobalServices) {
    $scope.Title = 'Area Master';

    LoadData();



    function LoadData() {
        $('.select2').select2();
        $scope.loadingstatus = "stop";
        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.perPageColl = GlobalServices.getPerPageList();

        $scope.ProvinceColl = GetStateList();
        $scope.DistrictColl = GetDistrictList();
        $scope.VDCColl = GetVDCList();

        $scope.ProvinceColl_Qry = mx($scope.ProvinceColl);
        $scope.DistrictColl_Qry = mx($scope.DistrictColl);
        $scope.VDCColl_Qry = mx($scope.VDCColl);

        $scope.perPage = {
            AreaMaster: GlobalServices.getPerPageRow(),

        };
        $scope.searchData = {
            AreaMaster: ''
        };
        $scope.currentPages = {
            AreaMaster: 1

        };
        $scope.beData =
        {

            AreaId: 0,
            Name: '',
            Alias: '',
            Code: '',
            State: '',
            District: '',
            City: '',
            AreaType: 8,
            IsActive: true
        };
        $scope.loadingstatus = "stop";

        $scope.AreaTypeList = [];
        $http({
            method: 'GET',
            url: base_url + "Account/Creation/GetAreaTypes",
            dataType: "json",
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.AreaTypeList = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

    };

    $scope.ClearFields = function () {
        $scope.loadingstatus = "stop";
        $scope.beData =
        {
            AreaId: 0,
            Name: '',
            Alias: '',
            Code: '',
            Province: '',
            District: '',
            City: '',
            AreaType: 0,
            IsActive: '',

        }; 
    } 

    $scope.GetAllAreaMaster = function () {
        
        $scope.AreaColl = []; //declare an empty array

        if ($scope.loadingstatus != 'stop') {
            alert('Already Running Process')
            return;
        }

        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: 'GET',
            url: base_url + "Account/Creation/GetAllAreaType",
            dataType: "json"
            //data:JSON.stringify(para)
        }).then(function (res) {

            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data)
            {
                $timeout(function ()
                {
                    $scope.AreaColl = res.data.Data;
                });
            } else
                alert(res.data.ResponseMSG);

        }, function (reason) {
            alert('Failed' + reason);
        });

    }

    $scope.IsValidAreaMaster = function () {
        if ($scope.beData.Name.isEmpty()) {
            Swal.fire("Please ! Enter Valid AreaMaster Name");
            return false;
        }
        else
            return true;
    }

    $scope.AddAreaMaster = function () {
        if ($scope.IsValidAreaMaster() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.beData.Mode;
                Swal.fire({
                    title: 'Do you want to' + saveModify + 'the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    if (result.isConfirmed) {
                        $scope.CallSaveUpdateAreaMaster();
                    }

                });
            }
            else
                $scope.CallSaveUpdateAreaMaster();
        }
    };

    $scope.CallSaveUpdateAreaMaster = function () {
        $scope.loadingstatus = 'running';
        showPleaseWait();

        var selectData = $('#cboProvince').select2('data');
        if (selectData && selectData.length > 0)
            province = selectData[0].text.trim();

        selectData = $('#cboDistrict').select2('data');
        if (selectData && selectData.length > 0)
            district = selectData[0].text.trim();


        selectData = $('#cboArea').select2('data');
        if (selectData && selectData.length > 0)
            area = selectData[0].text.trim();

        $scope.beData.State = province;
        $scope.beData.District = district;
        $scope.beData.City = area;

        $http({
            method: 'POST',
            url: base_url + "Account/Creation/SaveAreaMaster",
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
                $scope.GetAllAreaMaster();
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }

    $scope.getAreaMasterById = function (beData) {

        $scope.loadingstatus = "running";

        var para = {
            AreaId: beData.AreaId
        };

        $http({
            method: 'POST',
            url: base_url + "Account/Creation/getAreaMasterByIdd",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                var resData = res.data.Data;
                $timeout(function () {
                    $scope.beData = res.data.Data;
                    $scope.beData.Mode = 'Modify';

                    var findProvince = $scope.ProvinceColl_Qry.firstOrDefault(p1 => p1.text == resData.State);

                    if (findProvince)
                        $scope.beData.ProvinceId1 = findProvince.id;
                    else
                        $scope.beData.ProvinceId1 = null;

                    var findDistrict = $scope.DistrictColl_Qry.firstOrDefault(p1 => p1.text == resData.District);
                    if (findDistrict)
                        $scope.beData.DistrictId1 = findDistrict.id;
                    else
                        $scope.beData.DistrictId1 = null;

                    var findArea = $scope.VDCColl_Qry.firstOrDefault(p1 => p1.text == resData.City);
                    if (findArea)
                        $scope.beData.CityId1 = findArea.id;
                    else
                        $scope.beData.CityId1 = null;


                    $('#custom-tabs-four-profile-tab').tab('show');
                });
            } else 
                Swal.fire(res.data.ResponseMSG);
            

        }, function (reason) {
            alert('Failed' + reason);
        });
    };

    $scope.deleteAreaMaster = function (refData, ind) {

        Swal.fire({
            title: 'Are you sure you want to delete selected Area Master ' + refData.Name + '?',
            showCancelButton: true,
            confirmButtonText: 'Delete',
            //message: 'Are you sure to delete selected Branch :-' + beData.Name,
        }).then((result) => {
            if (result.isConfirmed) {
                $scope.loadingstatus = "running";
                showPleaseWait();
                var para = { AreaId: refData.AreaId };
                $http({
                    method: 'POST',
                    url: base_url + "Account/Creation/deleteAreaMasterById",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingstatus = "stop";
                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess == true) {
                        $scope.AreaColl.splice(ind, 1);
                    }
                }, function (reason) {
                    Swal.fire('Failed' + reason);

                });
            }

        });
    }

});