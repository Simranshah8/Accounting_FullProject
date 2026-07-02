 
app.controller('VehicleHistoryController', function ($scope, $http, $timeout, $filter, GlobalServices) {
    $scope.Title = 'VehicleHistory';
     

    $scope.LoadData = function () {

        $scope.VehicleSearchOptions = [{ text: 'Vin No.', value: 'V.VinNo' }, { text: 'Engine No.', value: 'V.EngineNo' }, { text: 'Regd . No.', value: 'V.RegdNo' }, { text: 'Chassis/Serial No.', value: 'V.ChSrlNo' }];

        $scope.beData = {
            SearchOption:'V.RegdNo',
            VehicleEntryId:null
        };

        $scope.loadingstatus = "stop";
        $scope.TemplatesColl = [];
        $http({
            method: 'GET',
            url: base_url + "ReportEngine/GetReportTemplates?entityId=" + EntityId + "&voucherId=0&isTran=false",
            dataType: "json"
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data)
                $scope.TemplatesColl = res.data.Data;
            if ($scope.TemplatesColl && $scope.TemplatesColl.length > 0) {
                $scope.beData.RptTranId = $scope.TemplatesColl[0].RptTranId;

                if (VTranId && VTranId > 0) {
                    $scope.VTranId = VTranId;
                    $scope.beData.VehicleEntryId = VTranId;
                    $scope.PrintVH();
                }
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

    }

    $scope.VehicleSelectionChange = function (data) {

        if (data.vehicleDetail) {
            var det = data.vehicleDetail;
            data.VehicleTypeName = det.VehicleTypeName;
            data.VehicleModelName = det.VehicleModelName;
            data.VinNo = det.VinNo;
            data.EngineNo = det.EngineNo;
            data.ChSrlNo = det.ChSrlNo;
            data.Party = det.Party;
            data.RegdNo = det.RegdNo;
            data.PartyId = det.PartyId;
            data.Address = det.PartyAddress;
            data.PartyMobileNo = det.ContactNo;
            data.CustomerType = det.CustomerType;
            data.CustomerSerialNo = det.CustomerSerialNo;
            $scope.PrintVH();
          
        } else {
          
            data.DateOfSale_TMP = null;
        }
    }

    $scope.PrintVH = function () {
        if ($scope.beData.VehicleEntryId  && $scope.beData.RptTranId ) {

            var rptPara = {
                VehicleEntryId: $scope.beData.VehicleEntryId,
                rptTranId: $scope.beData.RptTranId,
            };
            var paraQuery = param(rptPara);

            $scope.loadingstatus = 'running';
            document.getElementById("frmRptVH").src = '';
            document.getElementById("frmRptVH").style.width = '100%';
            document.getElementById("frmRptVH").style.height = '1300px';
            document.getElementById("frmRptVH").style.visibility = 'visible';
            document.getElementById("frmRptVH").src = base_url + "Service/Reporting/RDLVH?" + paraQuery;

        }

    };
    

});