

app.controller('SalesPriceController', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'Allow Godown';

	$scope.LoadData = function () {
		$('.select2').select2({
			allowClear: true,
			openOnEnter: true
		});
		$scope.confirmMSG = GlobalServices.getConfirmMSG();
		$scope.searchData = {
			AllowProductGroup: '',
		};

		$scope.newPrice = {
			RateTypeId: null,
			GroupId: null,
			BrandId:null,
			ApplicableFrom_TMP:new Date(),
		};

		$scope.RateTypeColl = [];
		$http({
			method: 'GET',
			url: base_url + "Inventory/Creation/GetAllSalesRateTypes",
			dataType: "json"
		}).then(function (res) {
			if (res.data.IsSuccess && res.data.Data) {
				var dtColl = res.data.Data;
				angular.forEach(dtColl, function (dt) {
					if (dt.IsActive == true)
						$scope.RateTypeColl.push(dt);
				});
			}
		}, function (reason) {
			alert('Failed' + reason);
		});

		$scope.ProductGroupColl = [];
		$http({
			method: 'GET',
			url: base_url + "Inventory/Creation/GetAllProductGroup",
			dataType: "json"
			//data:JSON.stringify(para)
		}).then(function (res) {
			if (res.data.IsSuccess && res.data.Data) {
				$scope.ProductGroupColl = res.data.Data;
			}
		}, function (reason) {
			alert('Failed' + reason);
		});

		$scope.ProductBrandColl = [];
		$http({
			method: 'GET',
			url: base_url + "Inventory/Creation/GetAllProductBrand",
			dataType: "json"
			//data:JSON.stringify(para)
		}).then(function (res) {			  
			if (res.data.IsSuccess && res.data.Data) {
				$scope.ProductBrandColl = res.data.Data;
			} 
		}, function (reason) {
			alert('Failed' + reason);
		});

		$scope.SalesPriceList = [];
	}

	$scope.ClearData = function () {

		$scope.SalesPriceList = [];
		$scope.newPrice = {
			RateTypeId: null,
			GroupId: null,
			BrandId: null,
			ApplicableFrom_TMP: new Date(),

		};
	}

	$scope.AddRow = function (curRow, ind) {
		var copyRow = angular.copy(curRow);
		if ($scope.SalesPriceList.length > ind + 1) {

			$scope.SalesPriceList.splice(ind + 1, 0, copyRow);
		} else {
			$scope.SalesPriceList.push(copyRow)
		}
    }
	$scope.GetSalesPrice = function () {

		if ($scope.newPrice.RateTypeId > 0 && $scope.newPrice.GroupId > 0) {
			$scope.loadingstatus = "running";
			showPleaseWait();

			var para = {
				RateTypeId: $scope.newPrice.RateTypeId,
				GroupId: $scope.newPrice.GroupId,
				BrandId: $scope.newPrice.BrandId,
			};

			$http({
				method: 'POST',
				url: base_url + "Inventory/Creation/GetSalesPrice",
				dataType: "json",
				data: JSON.stringify(para)
			}).then(function (res) {
				hidePleaseWait();
				$scope.loadingstatus = "stop";
				if (res.data.IsSuccess && res.data.Data) {
					$scope.SalesPriceList = res.data.Data;
				} else {
					Swal.fire(res.data.ResponseMSG);
				}

			}, function (reason) {
				Swal.fire('Failed' + reason);
			});
        }
		
	};
	 
	$scope.SaveSalesPrice = function ()
	{
		$scope.loadingstatus = "running";
		showPleaseWait();

		var applicableFrom = $filter('date')(new Date($scope.newPrice.ApplicableFromDet.dateAD), 'yyyy-MM-dd');

		angular.forEach($scope.SalesPriceList, function (sp) {
			sp.ApplicableFrom = applicableFrom;
		});

		$http({
			method: 'POST',
			url: base_url + "Inventory/Creation/SaveSalesPrice",
			headers: { 'Content-Type': undefined },

			transformRequest: function (data) {

				var formData = new FormData();
				formData.append("jsonData", angular.toJson(data.jsonData));

				return formData;
			},
			data: { jsonData: $scope.SalesPriceList }
		}).then(function (res) {

			$scope.loadingstatus = "stop";
			hidePleaseWait();

			Swal.fire(res.data.ResponseMSG);

		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";

		});


	}

});