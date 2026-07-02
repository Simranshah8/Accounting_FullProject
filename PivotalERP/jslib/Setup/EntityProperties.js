
app.controller('entityPController', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'Allow Entity';

	$scope.LoadData = function () {
		$('.select2').select2({
			allowClear: true,
			openOnEnter: true
		});
		$scope.confirmMSG = GlobalServices.getConfirmMSG();
		$scope.searchData = {
			AllowEntity: '',
		};

		$scope.ShowHideColl = [{ id: 1, text: 'Show' }, { id: 2, text: 'Hide' }, { id: 3, text: 'Disable' }]

		$scope.newEP = {
			ModuleId:0,
			EntityId: 0,
			EntityType:null,
		};
		 
		$scope.ModuleList = [];
		$http({
			method: 'GET',
			url: base_url + "Setup/Security/GetModuleForEP",
			dataType: "json"
		}).then(function (res) {
			if (res.data.IsSuccess && res.data.Data) {
				$scope.ModuleList = res.data.Data;
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

		$scope.EntityTypeList = [];
		$http({
			method: 'GET',
			url: base_url + "V1/StaticValues/GetEntityType",
			dataType: "json"
		}).then(function (res) {
			if (res.data) {
				$scope.EntityTypeList = res.data;
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
		  
	}

	$scope.ChangeModule = function () {

		$scope.EntityColl = [];
		if ($scope.newEP.ModuleId >= 0) {

			var para = {
				ModuleId: $scope.newEP.ModuleId,
				EntityType: $scope.newEP.EntityType,
			};
			$http({
				method: 'POST',
				url: base_url + "Setup/Security/GetEntityForEP",
				dataType: "json",
				data:JSON.stringify(para)
			}).then(function (res) {
				if (res.data.IsSuccess && res.data.Data) {
					$scope.EntityColl = res.data.Data;
				}
			}, function (reason) {
				Swal.fire('Failed' + reason);
			});
        }
		
	}

	$scope.ChangeEntity = function () {
		$scope.PropertiesColl = [];

		if ($scope.newEP.SelectedEntity)
		{
			var para = {				
				EntityId: $scope.newEP.SelectedEntity.EntityId,
				EntityType:$scope.newEP.EntityType,
			};
			$http({
				method: 'POST',
				url: base_url + "Setup/Security/GetEPByEntityId",
				dataType: "json",
				data: JSON.stringify(para)
			}).then(function (res) {
				if (res.data.IsSuccess && res.data.Data)
				{
					$scope.PropertiesColl = res.data.Data;
					$scope.newEP.Code = res.data.Data[0].Code;
				}
			}, function (reason) {
				Swal.fire('Failed' + reason);
			});

        }

    }

	$scope.ClearEP = function () {
		$scope.newEP = {
			ModuleId: 0,
			EntityId: 0,
			EntityType: null,
		};
	}

	$scope.CallSaveUpdateEP = function () {

		if ($scope.PropertiesColl && $scope.PropertiesColl.length > 0) {
			$scope.loadingstatus = 'running';
			showPleaseWait();

			$scope.PropertiesColl[0].Code = $scope.newEP.Code;

			$http({
				method: 'POST',
				url: base_url + "Setup/Security/SaveUpdateEP",
				headers: { 'content-Type': undefined },

				transformRequest: function (data) {
					var formData = new FormData();
					formData.append("EntityType", $scope.newEP.EntityType);
					formData.append("jsonData", angular.toJson(data.jsonData));
					return formData;
				},
				data: { jsonData: $scope.PropertiesColl }
			}).then(function (res) {

				$scope.loadingstatus = "stop";
				hidePleaseWait();

				Swal.fire(res.data.ResponseMSG);
				 
			}, function (errormessage) {
				hidePleaseWait();
				$scope.loadingstatus = "stop";
			});
        }
		
	}

	$scope.DeleteEP = function () {
		Swal.fire({
			title: 'Are you sure you want to reset ' + $scope.newEP.SelectedEntity.Name + '?',
			showCancelButton: true,
			confirmButtonText: 'Reset',
		}).then((result) => {
			if (result.isConfirmed) {
				var para = { EntityId: $scope.newEP.SelectedEntity.EntityId };
				$http({
					method: 'POST',
					url: base_url + "Setup/Security/DelEP",
					dataType: "json",
					data: JSON.stringify(para)
				}).then(function (res) {
					hidePleaseWait();
					$scope.loadingStatus = "stop";

					Swal.fire(res.data.ResponseMSG);
					if (res.data.IsSuccess == true) {
						$scope.ChangeEntity();
					}
				}, function (reason) {
					Swal.fire('Failed' + reason);
				});
			}

		});
	}

	$scope.ViewCodeModal = function () {
		if ($scope.newEP.SelectedEntity) {
			$('#modal-code').modal('show');
        }
    }

	$scope.CurPro = {};
	$scope.CodeFor = 1;
	$scope.ShowEvenModal = function (curRow, col) {
		$scope.CurPro = curRow;
		$scope.CodeFor = col;
		$('#modal-eventcode').modal('show');
    }
});

 