
app.controller('creditRulesController', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'Credit Rules';

	$scope.LoadData = function () {
		$('.select2').select2({
			allowClear: true,
			openOnEnter: true
		});

		$scope.confirmMSG = GlobalServices.getConfirmMSG();
		$scope.searchData = {
			AllowEntity: '',
		};

		$scope.newRules = {
			UserId: null,
			IsAllow: false
		};

		$scope.CreditRuleTypeList = [];		
		$http({
			method: 'GET',
			url: base_url + "Global/GetCreditRules",
			dataType: "json"
		}).then(function (res) {
			if (res.data.IsSuccess && res.data.Data) {
				$scope.CreditRuleTypeList = res.data.Data;
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
		 
		$scope.UserList = [];
		$http({
			method: 'POST',
			url: base_url + "Setup/Security/GetAllUserList",
			dataType: "json"
		}).then(function (res) {
			if (res.data.IsSuccess && res.data.Data) {
				$scope.UserList = res.data.Data;

			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});



	}
	  

	$scope.IsValidAllowEntity = function () {

		if ($scope.newRules.UserId && $scope.newRules.UserId > 0) {
			
		} else {
			Swal.fire('Please ! Choose User ');
			return false;
        }

		return true;
	}

	$scope.GetCRRule = function () {

		$scope.loadingstatus = "running";
		showPleaseWait();

		var para = {
			UserId: $scope.newRules.UserId
		};

		$http({
			method: 'POST',
			url: base_url + "Setup/Security/GetCRRulesFor",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.newRules.SalesOrder = res.data.Data.SalesOrder;
				$scope.newRules.DispatchOrder = res.data.Data.DispatchOrder;
				$scope.newRules.DispatchSection = res.data.Data.DispatchSection;
				$scope.newRules.DeliveryNote = res.data.Data.DeliveryNote;
				$scope.newRules.SalesInvoice = res.data.Data.SalesInvoice;
				$scope.newRules.SalesAllotment = res.data.Data.SalesAllotment;
			 
			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	};

	$scope.SaveUpdateCRRule = function () {
		if ($scope.newRules.UserId && $scope.newRules.UserId > 0) {
			$scope.loadingstatus = "running";
			showPleaseWait();
			 

			$http({
				method: 'POST',
				url: base_url + "Setup/Security/SaveCRRulesFor",
				headers: { 'Content-Type': undefined },

				transformRequest: function (data) {

					var formData = new FormData();					
					formData.append("jsonData", angular.toJson(data.jsonData));

					return formData;
				},
				data: { jsonData: $scope.newRules }
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

});