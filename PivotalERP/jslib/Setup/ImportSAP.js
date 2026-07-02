
app.controller("importExportSAPCntrl", function ($scope, $http, $filter, $timeout) {

    $scope.Title = 'Templates';

    LoadData();

    function LoadData() {
        
       
        $scope.beData = {
            Entity: false,
            ForDate1: 1,
            ForDate2: 1,
            ForDate3: 1,
            ForDate4: 1,
            ForDate5: 1,
            ForDate6: 1,
            ForDate7: 1,
        };
    }
     

    $scope.importUpdateSAP = function (entId) {
          
        var para = {
            Entity: entId,
            ForDate: 1
        };

        if (entId==1) {
            para.ForDate = $scope.beData.ForDate1;
        }else if (entId == 2) {
            para.ForDate = $scope.beData.ForDate2;
        } else if (entId == 3) {
            para.ForDate = $scope.beData.ForDate3;
        } else if (entId == 4) {
            para.ForDate = $scope.beData.ForDate4;
        } else if (entId == 5) {
            para.ForDate = $scope.beData.ForDate5;
        } else if (entId == 6) {
            para.ForDate = $scope.beData.ForDate6;
        } else if (entId == 7) {
            para.ForDate = $scope.beData.ForDate7;
        }

        $scope.loadingstatus = "running";
        showPleaseWait();

        $http({
            method: 'POST',
            url: base_url + "Setup/Security/UpdateSAPData",
            data: JSON.stringify(para)
        }).then(function (res) {

            $scope.loadingstatus = "stop";
            hidePleaseWait();

            Swal.fire(res.data.ResponseMSG);
 
        }, function (errormessage) {

            $scope.loadingstatus = "stop";
            Swal.fire('Unable to update data. pls try again.' + errormessage.responseText);

        });


    }
     

});


app.controller("importSAPServiceCntrl", function ($scope, $http, $filter, $timeout) {

    $scope.Title = 'Templates';

    LoadData();

    function LoadData() {


        $scope.beData = {
            Entity: false,
            ForDate1: 1,
            ForDate2: 1,
            ForDate3: 1,
            ForDate4: 1,
            ForDate5: 1,
            ForDate6: 1,
            ForDate7: 1,
        };
    }


    $scope.importUpdateSAP = function (entId) {

        var para = {
            Entity: entId,
            ForDate: 1
        };

        if (entId == 1) {
            para.ForDate = $scope.beData.ForDate1;
        } else if (entId == 2) {
            para.ForDate = $scope.beData.ForDate2;
        } else if (entId == 3) {
            para.ForDate = $scope.beData.ForDate3;
        } else if (entId == 4) {
            para.ForDate = $scope.beData.ForDate4;
        } else if (entId == 5) {
            para.ForDate = $scope.beData.ForDate5;
        } else if (entId == 6) {
            para.ForDate = $scope.beData.ForDate6;
        } else if (entId == 7) {
            para.ForDate = $scope.beData.ForDate7;
        }

        $scope.loadingstatus = "running";
        showPleaseWait();

        $http({
            method: 'POST',
            url: base_url + "Setup/Security/GetDataFromSAP",
            data: JSON.stringify(para)
        }).then(function (res) {

            $scope.loadingstatus = "stop";
            hidePleaseWait();

            Swal.fire(res.data.ResponseMSG);

        }, function (errormessage) {

            $scope.loadingstatus = "stop";
            Swal.fire('Unable to update data. pls try again.' + errormessage.responseText);

        });


    }


});