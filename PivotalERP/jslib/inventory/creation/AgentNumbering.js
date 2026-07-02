app.controller("AgentNumberingController", function ($scope, $http, GlobalServices, $timeout) {
    $scope.Title = 'AgentNumbering';
    LoadData();
    function LoadData() {
        $('.select2').select2();
        $scope.loadingstatus = "stop";
        $scope.confirmMSG = GlobalServices.getConfirmMSG();

        $scope.NumMethodList = [{ id: '1', text: 'Auto' }, { id: '2', text: 'Manual' }, { id: '3', text: 'None' }];
        $scope.LevelList = [
            { Level: '1', LevelName: 'Dealer_Incharge' },
            { Level: '2', LevelName: 'Sales_Officer' },
            { Level: '3', LevelName: 'ASM' },
            { Level: '4', LevelName: 'RSM' },
            { Level: '5', LevelName: 'NSM' },
            { Level: '6', LevelName: 'Sales_Director' },
            { Level: '7', LevelName: 'Managing_Director' }
        ];

        $scope.searchData = {
            Level: ''
        };  
    };


    $scope.UpdateAgentNumbering = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();
        var dataToSave = [];
        for (var i = 0; i < $scope.LevelList.length; i++) {
            var S = $scope.LevelList[i];
            var level = S.Level;
            var numberingMethod = S.NumberingMethod;
            var prefix = S.Prefix;
            var suffix = S.Suffix;
            var startNumber = S.StartNumber;
            var numericalPartWidth = S.NumericalPartWidth;
            var dataItem = {
                Level: level,
                NumberingMethod: numberingMethod,
                Prefix: prefix,
                Suffix: suffix,
                StartNumber: startNumber,
                NumericalPartWidth: numericalPartWidth

            };
            dataToSave.push(dataItem);
        }

        $http({
            method: 'POST',
            url: base_url + "Inventory/Creation/SaveAgentNumbering",
            headers: { 'Content-Type': undefined },
            transformRequest: function (data) {
                var formData = new FormData();
                formData.append("jsonData", angular.toJson(data.jsonData));
                return formData;
            },
            data: { jsonData: dataToSave }
        }).then(function (res) {
            $scope.loadingstatus = "stop";
            hidePleaseWait();
            Swal.fire(res.data.ResponseMSG);
            if (res.data.IsSuccess == true) {
                /*    $scope.GetAllAgentNumbering();*/
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }

});