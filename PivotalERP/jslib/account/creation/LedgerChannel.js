app.controller('LedgerChannel', function ($scope, $filter, $http, $timeout, GlobalServices) {
    $scope.Title = 'LedgerChannel';
    var glSrv = GlobalServices;


    LoadData();

    function LoadData() {

        $scope.loadingstatus = "stop";

        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.perPageColl = GlobalServices.getPerPageList();


        $scope.currentPages = {
            LedgerChannel: 1

        };

      

        $scope.searchData = {
            LedgerChannel: ''

        };

        $scope.perPage = {
            LedgerChannel: GlobalServices.getPerPageRow(),

        };

        $scope.beData =
        {
            Code: '',
            Name: '',
            Panel: '',
            Mode: 'Save',
           
        }
     
    };

    $scope.ClearFields = function () {
        $scope.beData =
        {
            Code: '',
            Name: '',
         
            Mode: 'Save',
           


        };
      
    }

    $scope.GetAllLedgerChannel = function () {


        $scope.ChannelList = []; //declare an empty array

        if ($scope.loadingstatus != 'stop') {
            alert('Already Running Process')
            return;
        }
       
        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: 'POST',
            url: base_url + "Account/Creation/GetAllLedgerChannel",
            dataType: "json"
        }).then(function (res) {

            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                $timeout(function () {
                    $scope.ChannelList = res.data.Data;
                });
            } else
                alert(res.data.ResponseMSG);

        }, function (reason) {
            alert('Failed' + reason);
        });

    }

    $scope.IsValidLedgerChannel = function () {
        //if ($scope.newProductBrand.Name.isEmpty()) {
        //    Swal.fire("Please ! Enter Product Name");
        //    return false;
        //}
        //else
        return true;
    }

    $scope.SaveLedgerChannel = function () {
        if ($scope.IsValidLedgerChannel() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.beData.Mode;
                Swal.fire({
                    title: 'Do you want to' + saveModify + 'the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    if (result.isConfirmed) {
                        $scope.CallSaveLedgerChannel();
                    }

                });
            }
            else
                $scope.CallSaveLedgerChannel();
        }
    };

    $scope.CallSaveLedgerChannel = function () {
        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: 'POST',
            url: base_url + "Account/Creation/SaveLedgerChannel",
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
                $scope.GetAllLedgerChannel();
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }

    $scope.getLedgerChannelById= function (beData) {

        $scope.loadingstatus = "running";
        var para = {
            ChannelId: beData.ChannelId
        };



        $http({
            method: 'POST',
            url: base_url + "Account/Creation/GetLedgerChannelById",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $timeout(function () {
                    $scope.beData = res.data.Data;
                    $scope.beData.Mode = 'Modify';
                    $('#custom-tabs-four-profile-tab').tab('show');
                });
            } else
                Swal.fire(res.data.ResponseMSG);

        }, function (reason) {
            alert('Failed' + reason);
        });
    }

    $scope.DelLedgerChannel = function (refData, ind) {
        Swal.fire({
            title: 'Are you sure to delete' + refData.Name,
            showCancelButton: true,
            confirmButtonText: 'Delete',
        }).then((result) => {
            if (result.isConfirmed) {
                $scope.loadingstatus = "running";
                showPleaseWait();

                var para = {
                    ChannelId: refData.ChannelId
                };

                $http({
                    method: 'POST',
                    url: base_url + "Account/Creation/DelLedgerChannel",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingstatus = "stop";
                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess) {
                        $scope.ChannelList.splice(ind, 1);
                    }

                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }
        });

    }



});