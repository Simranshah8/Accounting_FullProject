app.controller("SMSEmailCtrl", function ($scope, $http, $timeout) {
    $scope.Title = 'SMS/Email';

    LoadData();

    function LoadData() {
        $scope.loadingstatus = "running";
        $scope.noofrows = 10;
        $scope.beData =
        {
            Id: 0,
            Name: '',
            Alias: '',
            Description: ''
        };
        $scope.loadingstatus = "stop";

    };

    $scope.Validate = function () {
        var isValid = true;
       
        return isValid;
    }

    $scope.ClearFields = function () {
        $scope.loadingstatus = "stop";
        $scope.beData =
        {
            Id: 0,
            Name: '',
            Alias: '',
            Description: ''
        };

    }

    $scope.GetAllContactGroup = function () {
        $scope.noofrows = 10;

        $scope.ContactGroupColl = []; //declare an empty array

        if ($scope.loadingstatus != 'stop') {
            alert('Already Running Process')
            return;
        }

        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: 'GET',
            url: base_url + "SMSEmail/Transaction/GetAllContactGroup",
            dataType: "json"
            //data:JSON.stringify(para)
        }).then(function (res) {

            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                $timeout(function () {
                    $scope.ContactGroupColl = res.data.Data;
                });
            } else
                alert(res.data.ResponseMSG);

        }, function (reason) {
            alert('Failed' + reason);
        });

    }


    $scope.AddNewContactGroup = function () {

        var isValid = $scope.Validate();

        if (!isValid)
            return;

        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: 'POST',
            url: base_url + "SMSEmail/Transaction/SaveContactGroup",
            dataType: "json",
            data:JSON.stringify($scope.beData)
        }).then(function (res) {
            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            alert(res.data.ResponseMSG);

            if (res.data.IsSuccess)
            {
                $scope.ClearFields();
                $scope.GetAllContactGroup();                
            }                 

        }, function (reason) {
            alert('Failed' + reason);
        });

    }
    $scope.UpdateAreaMaster = function () {



        var isValid = $scope.Validate();

        if (!isValid)
            return;

        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: 'GET',
            url: "/Creation/UpdateAreaMaster",
            dataType: "json"
        }).then(function (res) {

            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                scope.ledgerDetail = res.data.Data;
                scope.currentLedDet = res.data.Data;
                //$scope.ShowLedgerDetails(res.data.Data);
                $timeout(function () {
                    scope.confirmAction();
                });

            } else
                alert(res.data.ResponseMSG);

        }, function (reason) {
            alert('Failed' + reason);
        });
    }

    $scope.getAreaMasterById = function (beData) {

        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: 'GET',
            url: "/Creation/getAreaMasterById",
            dataType: "json"
        }).then(function (res) {
            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                scope.ledgerDetail = res.data.Data;
                scope.currentLedDet = res.data.Data;
                //$scope.ShowLedgerDetails(res.data.Data);
                $timeout(function () {
                    scope.confirmAction();
                });

            } else
                alert(res.data.ResponseMSG);

        }, function (reason) {
            alert('Failed' + reason);
        });
    }

    $scope.deleteContactGroup = function (beData) {

        Swal.fire({
            title: 'Are you sure to delete ('+beData.Name+') ?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) =>
        {
            if (result.isConfirmed)
            {
                $scope.loadingstatus = 'running';
                showPleaseWait();

                $http({
                    method: 'POST',
                    url: base_url + "SMSEmail/Transaction/DelContactGroup",
                    dataType: "json",
                    data: JSON.stringify(beData)
                }).then(function (res) {
                    $scope.loadingstatus = 'stop';
                    hidePleaseWait();

                    Swal.fire(
                        'Deleted!',
                        res.data.ResponseMSG,
                        'success'
                    )
                    
                    if (res.data.IsSuccess) {

                        $timeout(function () {
                            $scope.GetAllContactGroup();
                        });
                    }

                }, function (reason) {
                    alert('Failed' + reason);
                });

                
            }
        })
    }



});