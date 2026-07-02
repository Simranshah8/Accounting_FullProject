app.controller('AssetsMasterController', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'Assets Master';

	$scope.LoadData = function () {
		$('.select2').select2();
		$scope.confirmMSG = GlobalServices.getConfirmMSG();
		$scope.perPageColl = GlobalServices.getPerPageList();

		$scope.currentPages = {
			AssetsMaster: 1,
		};
		$scope.searchData = {
			AssetsMaster: '',
		};
		$scope.perPage = {
			AssetsMaster: GlobalServices.getPerPageRow(),
		};

		$scope.RAMColl = [
			{ id: 1, text: '4GB' },
			{ id: 2, text: '8GB' },
			{ id: 3, text: '12GB' },
			{ id: 4, text: '16GB' },
			{ id: 5, text: '32GB' },
			{ id: 6, text: '64GB' },
			{ id: 7, text: 'N/A' },
		];

		$scope.ROMColl = [
			{ id: 1, text: '64GB' },
			{ id: 2, text: '128GB' },
			{ id: 3, text: '256GB' },
			{ id: 4, text: '512GB' },
			{ id: 5, text: '1TB SSD' },
			{ id: 6, text: '2TB SSD' },
			{ id: 7, text: '500 GB HHD' },
			{ id: 8, text: '1TB  HHD' },
			{ id: 9, text: 'N/A' },
		];


		$scope.StatusColl = [
			{ id: 1, text: 'Active' },
			{ id: 2, text: 'De-Active' }
		];

		$scope.BranchList = [];
		$http({
			method: 'POST',
			url: base_url + "Setup/Security/GetAllBranchList",
			dataType: "json"
		}).then(function (res) {
			if (res.data.IsSuccess && res.data.Data) {
				$scope.BranchList = res.data.Data;
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

		$scope.UnitList = [];
		$http({
			method: 'GET',
			url: base_url + "Inventory/Creation/GetAllUnit",
			dataType: "json"
		}).then(function (res) {
			if (res.data.IsSuccess && res.data.Data) {
				$scope.UnitList = res.data.Data;
			}
		}, function (reason) {
			alert('Failed' + reason);
		});



		$scope.RackList = [];
		$http({
			method: 'GET',
			url: base_url + "Inventory/Creation/GetAllRack",
			dataType: "json"
		}).then(function (res) {
			if (res.data.IsSuccess && res.data.Data) {
				$scope.RackList = res.data.Data;
			}
		}, function (reason) {
			Swal.fire('Failed !' + reason);

		});

		$scope.AssetGroupList = [];
		$http({
			method: 'POST',
			url: base_url + "AssetsManagement/Creation/GetAllAssetGroup",
			dataType: "json"
		}).then(function (res) {

			$scope.loadingstatus = 'stop';
			hidePleaseWait();

			if (res.data.IsSuccess && res.data.Data) {
				$scope.AssetGroupList = res.data.Data;
			} else
				Swal.fire(res.data.ResponseMSG);

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});


		$scope.ProductList = [];
		$http({
			method: 'POST',
			url: base_url + "AssetsManagement/Creation/GetAllAssetsProduct",
			dataType: "json"
		}).then(function (res) {

			$scope.loadingstatus = 'stop';
			hidePleaseWait();

			if (res.data.IsSuccess && res.data.Data) {
				$scope.ProductList = res.data.Data;
			} else
				Swal.fire(res.data.ResponseMSG);

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});


		$scope.AssetTypeList = [];
		$http({
			method: 'POST',
			url: base_url + "AssetsManagement/Creation/GetAllAssetType",
			dataType: "json"
		}).then(function (res) {

			$scope.loadingstatus = 'stop';
			hidePleaseWait();

			if (res.data.IsSuccess && res.data.Data) {
				$scope.AssetTypeList = res.data.Data;
			} else
				Swal.fire(res.data.ResponseMSG);

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

		$scope.ModelList = [];
		$http({
			method: 'POST',
			url: base_url + "AssetsManagement/Creation/GetAllAssetModel",
			dataType: "json"
		}).then(function (res) {

			$scope.loadingstatus = 'stop';
			hidePleaseWait();

			if (res.data.IsSuccess && res.data.Data) {
				$scope.ModelList = res.data.Data;
			} else
				Swal.fire(res.data.ResponseMSG);

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

		$scope.GetAutoAssetCode();
		$scope.newDetails = {
			Name: '',
			Alias: '',
			Code: '',
			Photo: '',
			Notes: '',
			AssetGroupId: null,
			AssetTypeId: null,
			ModelId: null,
			RackId: null,
			SerialNum: null,
			RAMId: null,
			ROMId: null,
			BranchId: null,
			PurchaseRate: 0,
			DepreciationRate: 0,
			StatusId: 1,
			ProductId: null,
			UnitId: null,
			AutoCodeLastPart:'',
			Mode: 'Save'
		};
		$scope.GetAllAssetsmaster();
	//	$scope.GetAutoAssetCode();
	}
	$scope.ClearPhoto = function () {
		$timeout(function () {
			$scope.$apply(function () {
				$scope.newDetails.PhotoData = null;
				$scope.newDetails.Photo_TMP = [];
			});
		});
		$('#Photo').attr('src', '');
	};

	$scope.ClearDetails = function () {
		$scope.ClearPhoto();
		$scope.GetAutoAssetCode();
		$scope.newDetails = {
			Name: '',
			Alias: '',
			Code: '',
			Notes: '',
			PhotoPath: '',
			AssetGroupId: null,
			AssetTypeId: null,
			ModelId: null,
			RackId: null,
			SerialNum: null,
			RAMId: null,
			ROMId: null,
			BranchId: null,
			UnitId: null,
			ProductId: null,
			PurchaseRate: 0,
			DepreciationRate: 0,
			StatusId: 1,
			Mode: 'Save'
		};
	}


	$scope.IsValidAssetsmaster = function () {
		if ($scope.newDetails.Name.isEmpty()) {
			Swal.fire('Please ! Enter Name');
			return false;
		}
		if (!$scope.newDetails.AssetGroupId) {
			Swal.fire('Please ! select a group');
			return false;
		}
		if (!$scope.newDetails.StatusId) {
			Swal.fire('Please ! select a Status');
			return false;
		}

		return true;
	}
	$scope.SaveUpdateAssetsmaster = function () {
		if ($scope.IsValidAssetsmaster() == true) {
			if ($scope.confirmMSG.Accept == true) {
				var saveModify = $scope.newDetails.Mode;
				Swal.fire({
					title: 'Do you want to ' + saveModify + ' the current data?',
					showCancelButton: true,
					confirmButtonText: saveModify,
				}).then((result) => {
					if (result.isConfirmed) {
						$scope.CallSaveUpdateAssetsmaster();
					}
				});
			} else
				$scope.CallSaveUpdateAssetsmaster();

		}
	};
	$scope.CallSaveUpdateAssetsmaster = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		var photo = $scope.newDetails.Photo_TMP;

		var voucherUDFFields = [];
		var voucherKeyVal = {};
		angular.forEach($scope.newDetails.UDFFeildsColl, function (udf) {

			if (udf.NameId && udf.NameId.length > 0) {
				if (udf.FieldType == 2 || udf.FieldType == 22 || udf.FieldType == 23) {
					var ud = {
						SNo: (udf.FieldNo ? udf.FieldNo : udf.SNo),
						Name: udf.Name,
						Value: udf.UDFValueDet ? $filter('date')(udf.UDFValueDet.dateAD, 'yyyy-MM-dd') : '',
						AlValue: udf.UDFValueDet ? udf.UDFValueDet.dateBS : '',
					};
					voucherUDFFields.push(ud);
					voucherKeyVal[udf.NameId] = udf.UDFValueDet ? udf.UDFValueDet.dateBS : '';
				} else if (udf.FieldType == 3 && udf.Source && udf.Source.length > 0) {
					var ud = {
						SNo: (udf.FieldNo ? udf.FieldNo : udf.SNo),
						Name: udf.Name,
						Value: udf.UDFValue,
						AlValue: udf.UDFValueDet ? udf.UDFValueDet.text : '',
					};
					voucherUDFFields.push(ud);
					voucherKeyVal[udf.NameId] = udf.UDFValueDet ? udf.UDFValueDet.text : ''
				}
				else {
					var ud = {
						SNo: (udf.FieldNo ? udf.FieldNo : udf.SNo),
						Name: udf.Name,
						Value: udf.UDFValue
					};
					voucherUDFFields.push(ud);
					voucherKeyVal[udf.NameId] = udf.UDFValue;
				}
			}

		});
		if (voucherUDFFields.length > 0) {
			$scope.newDetails.Attributes = JSON.stringify(voucherUDFFields);
			$scope.newDetails.UDFKeyVal = JSON.stringify(voucherKeyVal);
		} else {
			$scope.newDetails.Attributes = "";
			$scope.newDetails.UDFKeyVal = "";
		}


		$http({
			method: 'Post',
			url: base_url + "AssetsManagement/Creation/SaveAssetsmaster",
			headers: { 'Content-Type': undefined },

			transformRequest: function (data) {
				var formData = new FormData();
				formData.append("jsonData", angular.toJson(data.jsonData));

				if (data.emPhoto && data.emPhoto.length > 0)
					formData.append("photo", data.emPhoto[0]);

				return formData;
			},

			data: { jsonData: $scope.newDetails, emPhoto: photo }
		}).then(function (res) {
			$scope.loadingstatus = "stop";
			hidePleaseWait();
			Swal.fire(res.data.ResponseMSG);
			if (res.data.IsSuccess == true) {
				$scope.ClearDetails();
				$scope.GetAllAssetsmaster();
				//$scope.GetAutoAssetCode();

			}
		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";

		});
	}

	$scope.GetAllAssetsmaster = function () {
		$scope.TableData = [];
		$scope.loadingstatus = "running";
		showPleaseWait();
		$http({
			method: 'POST',
			url: base_url + "AssetsManagement/Creation/GetAllAssetsmaster",
			dataType: "json",
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.TableData = res.data.Data;
			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			Swal.fire('Failed: ' + reason);
		});
	}

	$scope.GetAssetsMasterById = function (refData) {
		$scope.loadingstatus = "running";
		showPleaseWait();
		var para = {
			TranId: refData.TranId
		};
		$http({
			method: 'POST',
			url: base_url + "AssetsManagement/Creation/GetAssetsmasterById",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.newDetails = res.data.Data;
				$scope.newDetails.Mode = 'Modify';
				$scope.MergeCodeWithName($scope.newDetails);

				$scope.newDetails.UDFFeildsColl = [];
				var findAsset = mx($scope.AssetTypeList).where(p1 => p1.AssetTypeId == $scope.newDetails.AssetTypeId);
				if (findAsset) {
					var fst = findAsset.firstOrDefault();
					if (fst)
						$scope.newDetails.UDFFeildsColl = fst.VoucherUDFCol;
				}
				 
				if ($scope.newDetails.Attributes && $scope.newDetails.Attributes.length > 0) {
					var udfFieldsColl = mx(JSON.parse($scope.newDetails.Attributes));
					angular.forEach($scope.newDetails.UDFFeildsColl, function (udd) {
						var findU = udfFieldsColl.firstOrDefault(p1 => p1.SNo == udd.SNo);
						if (findU) {
							if (udd.FieldType == 2) {
								if (findU.Value) {
									udd.UDFValue_TMP = new Date(findU.Value);
								}
							} else if (udd.FieldType == 4) {
								if (findU.Value) {
									udd.UDFValue = parseInt(findU.Value);
								}
							}
							else
								udd.UDFValue = findU.Value;
						}
					});
				}


				$('#custom-tabs-four-profile-tab').tab('show');

			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

	};

	$scope.DelAssetsMasterById = function (refData, ind) {
		Swal.fire({
			title: 'Are you sure you want to delete ' + refData.Name + '?',
			showCancelButton: true,
			confirmButtonText: 'Delete',
		}).then((result) => {
			if (result.isConfirmed) {
				var para = { TranId: refData.TranId };
				$http({
					method: 'POST',
					url: base_url + "AssetsManagement/Creation/DelAssetsmaster",
					dataType: "json",
					data: JSON.stringify(para)
				}).then(function (res) {
					hidePleaseWait();
					$scope.loadingStatus = "stop";

					Swal.fire(res.data.ResponseMSG);
					if (res.data.IsSuccess == true) {
						$scope.GetAllAssetsmaster();
					}
				}, function (reason) {
					Swal.fire('Failed' + reason);
				});
			}
		});
	}

	$scope.GetAutoAssetCode = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$http({
			method: 'POST',
			url: base_url + "AssetsManagement/Creation/GetAutoAssetsMasterCode",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.newDetails.Code = res.data.Data.RId;
				$scope.newDetails.AutoCodeLastPart = res.data.Data.RId;
			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	}

	$scope.MergeCodeWithName = function (beData) {
		if ($scope.newDetails.Name && $scope.newDetails.Name.trim() !== "") {
			var Name = $scope.newDetails.Name.trim();
			var firstChar = Name.charAt(0);
			var lastTwoChar = Name.slice(-1);
			var firstPart = (firstChar + lastTwoChar).toUpperCase();
			if (beData.TranId) {
				$scope.newDetails.Code = firstPart + beData.TranId;
			} else {
				$scope.newDetails.Code = firstPart + $scope.newDetails.AutoCodeLastPart;
            }
			
		} else {
			$scope.newDetails.Code = $scope.CodeLastPart;
		}
	};

	$scope.ChangeAssetType = function () {

		$scope.newDetails.UDFFeildsColl = [];
		var findAsset = mx($scope.AssetTypeList).where(p1 => p1.AssetTypeId == $scope.newDetails.AssetTypeId);
		if (findAsset) {
			var fst = findAsset.firstOrDefault();
			if (fst)
				$scope.newDetails.UDFFeildsColl = fst.VoucherUDFCol;
		}

	}


});


