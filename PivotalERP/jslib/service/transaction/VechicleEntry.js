app.controller('VehicleEntry', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'Vehicle Entry';


	$scope.LoadData = function () {
		$('.select2').select2();
		$scope.confirmMSG = GlobalServices.getConfirmMSG();

		$scope.TranSearchOptions = [{ text: 'Reg.No.', value: 'V.RegdNo', searchType: 'text' }, { text: 'VinNo', value: 'V.VinNo', searchType: 'text' }, { text: 'EngineNo', value: 'V.EngineNo', searchType: 'text' }, { text: 'ChSrlNo', value: 'V.ChSrlNo', searchType: 'text' }, { text: 'EntryNo', value: 'V.AutoNumber', searchType: 'text' }];
		$scope.paginationOptions = {
			pageNumber: 1,
			pageSize: GlobalServices.getPerPageRow(),
			sort: null,
			SearchType: 'text',
			SearchCol: '',
			SearchVal: '',
			SearchColDet: $scope.TranSearchOptions[0],
			pagearray: [],
			pageOptions: [5, 10, 20, 30, 40, 50]
		};
	 
		$scope.beData =
		{
			TranId: 0,
			EntryNo: '',
			VinNo: '',
			EntryDate_TMP: new Date(),
			VechicleTypeId: null,
			VechicleColorId: null,
			VechicleModelId: null,
			RegdNo: '',
			EngineNo: '',
			ChSrlNo: '',
			CodeNo: '',
			KeyNo: '',
			MFGYear: 0,
			Transporter: '',
			ShipmentNo: '',
			DeliveryNo: '',
			LRNo: '',
			LRDate: null,
			LRDriver: '',
			LRDriverLicNo: '',
			ReceivedByName: '',
			LastRunningKM: 0,
			LastRunningHR: 0,
			Remarks: '',
			AutoInWard: false,
			ChargerNo: '',
			BatteryNo: '',
			ReceivedKM: 0,
			ReceivedHR:0,
			DetailsColl: [],
			PartyLedgerId: null,
			DocumentColl: [],
		};

		$scope.UDFFeildsColl = [];
		var para11 = {
			EntityId: EntityId
		};
		$http({
			method: 'POST',
			url: base_url + "Setup/Security/getUDFByEntitId",
			dataType: "json",
			data: JSON.stringify(para11)
		}).then(function (res) {
			if (res.data.IsSuccess && res.data.Data) {
				$scope.UDFFeildsColl = res.data.Data;

				angular.forEach($scope.UDFFeildsColl, function (uff) {

					if (uff.DataType == 9) {
						if (uff.DefaultValue == "true")
							uff.Value = true;
						else
							uff.Value = false;
					}

				});
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

		$scope.VechicleTypelist = [];
		$http({
			method: 'GET',
			url: base_url + "Service/Transaction/GetAllVehicleType",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.VechicleTypelist = res.data.Data;
			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});


		$scope.VechicleModelList = [];
		$http({
			method: 'GET',
			url: base_url + "Service/Transaction/GetAllVehicleModel",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.VechicleModelList = res.data.Data;
			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});


		$scope.VechicleColorlist = [];
		$http({
			method: 'GET',
			url: base_url + "Service/Transaction/GetAllVehicleColor",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.VechicleColorlist = res.data.Data;
			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
		 

		$scope.beData.DetailsColl.push({});
		$scope.getVoucherNo();
	}

	$scope.getVehicleFields = function () {

		if ($scope.beData.TranId > 0) {


		} else {
			$scope.loadingstatus = "running";
			showPleaseWait();

			$scope.beData.DetailsColl = [];
			$http({
				method: 'GET',
				url: base_url + "Service/Transaction/GetVEFields?VehicleTypeId=" + $scope.beData.VehicleTypeId,
				dataType: "json"
			}).then(function (res) {
				hidePleaseWait();
				$scope.loadingstatus = "stop";
				if (res.data.IsSuccess && res.data.Data) {
					$scope.beData.DetailsColl = res.data.Data;

					angular.forEach($scope.beData.DetailsColl, function (det) {
						det.FieldId = det.SNo;
					});

				} else {
					Swal.fire(res.data.ResponseMSG);
				}
			}, function (reason) {
				Swal.fire('Failed' + reason);
			});
        }
		 
    }
	
	 $scope.reloadVoucherDate = function () {

        const container = angular.element(document.getElementById('dvDTVoucher'));
        container.empty(); // Clear the container

        $timeout(function () {
            const newElement = angular.element('<input type="text"  class="form-control form-control-sm" date-picker ng-model="beData.VoucherDate_TMP" date-detail="beData.VoucherDateDet" confirm-action="getVoucherNoOnly()" title ="{{(SelectedVoucher.DateStyle==1 ? beData.VoucherDateDet.dateBS : (beData.VoucherDateDet.dateAD |dateFormat))}}" date-style="SelectedVoucher.DateStyle" id ="dtVoucherDate" voucherid ="SelectedVoucher.VoucherId" >');
            //container.append($compile(newElement)($scope));

            container.append(newElement);
            $compile(newElement)($scope);
        });
    };

	$scope.getVoucherNo = function () {
		$http({
			method: 'POST',
			url: base_url + "Service/Transaction/getVENo",
			dataType: "json",
			//data: JSON.stringify(para)
		}).then(function (resLD) {
			 
			$scope.loadingstatus = 'stop';
			hidePleaseWait(); 
			if ($scope.beData.TranId > 0) {

			} else {
				if (resLD.data.IsSuccess && resLD.data.Data) {
					$scope.beData.AutoNumber = resLD.data.Data.RId;
				}
			}
		}, function (reason) {
			alert('Failed' + reason);
		});
	}
  
	$scope.ClearVehicleEntry = function () {
		$scope.beData =
		{
			TranId: 0,
			EntryNo: '',
			VinNo: '',
			DateOfSale: new Date(),
			VechicleTypeId: null,
			VechicleColorId: null,
			VechicleModelId: null,
			RegdNo: '',
			EngineNo: '',
			ChSrlNo: '',
			CodeNo: '',
			KeyNo: '',
			MFGYear: '',
			Transporter: '',
			ShipmentNo: '',
			DeliveryNo: '',
			LRNo: '',
			LRDate: new Date(),
			LRDriver: '',
			LRDriverLicNo: '',
			ReceivedByName: '',
			LastRunningKM: '',
			LastRunningHR: '',
			Remarks: '',
			ChargerNo: '',
			BatteryNo: '',
			ReceivedKM: 0,
			ReceivedHR: 0,
			DetailsColl: [],
			PartyLedgerId: null,
		};
		$scope.beData.DetailsColl.push({});

		angular.forEach($scope.UDFFeildsColl, function (uf) {
			uf.Value = '';
			uf.AlterNetValue = '';
		});

		$scope.getVoucherNo();
	}


	/*----------------------CRUD star-----------------*/
	$scope.IsValidVehicleEntry = function () {
		if ($scope.beData.EngineNo.isEmpty()) {
			Swal.fire('Please ! Enter EntryNo');
			return false;
		}
		return true;
	}

	$scope.AddVehicleEntry = function () {
		if ($scope.IsValidVehicleEntry() == true) {
			if ($scope.confirmMSG.Accept == true) {
				var saveModify = $scope.beData.Mode;
				Swal.fire({
					title: 'Do you want to ' + saveModify + ' the current data?',
					showCancelButton: true,
					confirmButtonText: saveModify,
				}).then((result) => {
					if (result.isConfirmed) {
						$scope.CallSaveUpdateVehicleEntry();
					}
				});
			} else
				$scope.CallSaveUpdateVehicleEntry();
		}
	};

	$scope.CallSaveUpdateVehicleEntry = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();

		var filesColl = $scope.beData.AttechFiles;
		$scope.beData.AttechFiles = [];

		if ($scope.beData.DateOfSaleDet) {
			$scope.beData.DateOfSale = $filter('date')(new Date($scope.beData.DateOfSaleDet.dateAD), 'yyyy-MM-dd');
		}


		if ($scope.beData.EntryDateDet) {
			$scope.beData.EntryDate = $filter('date')(new Date($scope.beData.EntryDateDet.dateAD), 'yyyy-MM-dd');
		}

		if ($scope.beData.LRDateDet) {
			$scope.beData.LRDate = $filter('date')(new Date($scope.beData.LRDateDet.dateAD), 'yyyy-MM-dd');
		}

		angular.forEach($scope.beData.DetailsColl, function (det) {
			if (det.FieldType == 'Date') {
				if (det.FieldValueDet) {
					det.FieldValue = $filter('date')(new Date(det.FieldValueDet.dateAD), 'yyyy-MM-dd');
                }
            }
		});

		$scope.beData.LastRunningHR = $scope.beData.ReceivedHR;
		$scope.beData.LastRunningKM = $scope.beData.ReceivedKM;


		var voucherUDFFields = [];
		var voucherKeyVal = {};
		$scope.beData.UserDefineFieldsColl = [];
		angular.forEach($scope.UDFFeildsColl, function (udf) {

			if (udf.NameId && udf.NameId.length > 0) {
				var uVal = {
					UDFId: udf.Id,
					Value: udf.UDFValue,
					AlterNetValue: '',
				};
				if (udf.FieldType == 2 || udf.FieldType == 22 || udf.FieldType == 23) {
					var ud = {
						SNo: (udf.FieldNo ? udf.FieldNo : udf.SNo),
						Name: udf.Name,
						Value: udf.UDFValueDet ? $filter('date')(udf.UDFValueDet.dateAD, 'yyyy-MM-dd') : '',
						AlValue: udf.UDFValueDet ? udf.UDFValueDet.dateBS : '',
					};
					uVal.AlterNetValue = ud.AlValue;
					voucherUDFFields.push(ud);
					voucherKeyVal[udf.NameId] = udf.UDFValueDet ? udf.UDFValueDet.dateBS : '';
				} else if (udf.FieldType == 3 && udf.Source && udf.Source.length > 0) {
					var ud = {
						SNo: (udf.FieldNo ? udf.FieldNo : udf.SNo),
						Name: udf.Name,
						Value: udf.UDFValue,
						AlValue: udf.UDFValueDet ? udf.UDFValueDet.text : '',
					};
					uVal.AlterNetValue = ud.AlValue;
					voucherUDFFields.push(ud);
					voucherKeyVal[udf.NameId] = udf.UDFValueDet ? udf.UDFValueDet.text : ''
				}
				else {
					var ud = {
						SNo: (udf.FieldNo ? udf.FieldNo : udf.SNo),
						Name: udf.Name,
						Value: udf.UDFValue
					};
					uVal.AlterNetValue = ud.Value;
					voucherUDFFields.push(ud);
					voucherKeyVal[udf.NameId] = udf.UDFValue;
				}

				$scope.beData.UserDefineFieldsColl.push(uVal);
			}

		});
		if (voucherUDFFields.length > 0) {
			$scope.beData.Attributes = JSON.stringify(voucherUDFFields);
			$scope.beData.UDFKeyVal = JSON.stringify(voucherKeyVal);
		} else {
			$scope.beData.Attributes = "";
			$scope.beData.UDFKeyVal = "";
		}

		$http({
			method: 'POST',
			url: base_url + "Service/Transaction/SaveVechicleEntry",
			headers: { 'Content-Type': undefined },
			transformRequest: function (data) {
				var formData = new FormData();
				formData.append("jsonData", angular.toJson(data.jsonData));

				if (data.files) {
					for (var i = 0; i < data.files.length; i++) {
						formData.append("file" + i, data.files[i]);
					}
				}

				return formData;
			},
			data: { jsonData: $scope.beData, files: filesColl}
		}).then(function (res) {
			$scope.loadingstatus = "stop";
			hidePleaseWait();
			Swal.fire(res.data.ResponseMSG);
			if (res.data.IsSuccess == true) {
				$scope.ClearVehicleEntry();
			}
		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
		});
	}



	$scope.SearchDataColl = [];
	$scope.SearchData = function () {

		$scope.loadingstatus = 'running';
		showPleaseWait();
		$scope.paginationOptions.TotalRows = 0;

		var sCol = $scope.paginationOptions.SearchColDet;

		var para = {
			branchId: ($scope.SelectedBranch ? $scope.SelectedBranch.BranchId : null),
			costClassId: ($scope.SelectedCostClass ? $scope.SelectedCostClass.CostClassId : null),
			filter: {
				DateFrom: null,
				DateTo: null,
				PageNumber: $scope.paginationOptions.pageNumber,
				RowsOfPage: $scope.paginationOptions.pageSize,
				SearchCol: (sCol ? sCol.value : ''),
				SearchVal: $scope.paginationOptions.SearchVal,
				SearchType: (sCol ? sCol.searchType : 'text')
			}
		};

		$http({
			method: 'POST',
			url: base_url + "Service/Transaction/GetVehicleLst",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			$scope.loadingstatus = 'stop';
			hidePleaseWait();

			if (res.data.IsSuccess && res.data.Data) {
				$scope.SearchDataColl = res.data.Data;
				$scope.paginationOptions.TotalRows = res.data.TotalCount;
				$('#searVoucherRightBtn').modal('show');

			} else
				alert(res.data.ResponseMSG);

		}, function (reason) {
			alert('Failed' + reason);
		});


	};

	$scope.ReSearchData = function (pageInd) {
		if (pageInd && pageInd >= 0)
			$scope.paginationOptions.pageNumber = pageInd;
		else if (pageInd == -1)
			$scope.paginationOptions.pageNumber = 1;

		$scope.loadingstatus = 'running';
		showPleaseWait();
		$scope.paginationOptions.TotalRows = 0;
		var sCol = $scope.paginationOptions.SearchColDet;

		var para = {
			branchId: ($scope.SelectedBranch ? $scope.SelectedBranch.BranchId : null),
			costClassId: ($scope.SelectedCostClass ? $scope.SelectedCostClass.CostClassId : null),
			filter: {
				DateFrom: null,
				DateTo: null,
				PageNumber: $scope.paginationOptions.pageNumber,
				RowsOfPage: $scope.paginationOptions.pageSize,
				SearchCol: (sCol ? sCol.value : ''),
				SearchVal: $scope.paginationOptions.SearchVal,
				SearchType: (sCol ? sCol.searchType : 'text')
			}
		};

		$http({
			method: 'POST',
			url: base_url + "Service/Transaction/GetVehicleLst",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			$scope.loadingstatus = 'stop';
			hidePleaseWait();

			if (res.data.IsSuccess && res.data.Data) {
				$scope.SearchDataColl = res.data.Data;
				$scope.paginationOptions.TotalRows = res.data.TotalCount;

			} else
				alert(res.data.ResponseMSG);

		}, function (reason) {
			alert('Failed' + reason);
		});

	}
	$scope.PrintVoucher = function (tranId) {
		$scope.lastTranId = tranId;
		$scope.Print();
	}


	$scope.GetTransactionById = function (tran) {
		$timeout(function () {

			if (tran.TranId && tran.TranId > 0) {
				var para = {
					tranId: tran.TranId
				};
				$http({
					method: 'POST',
					url: base_url + "Service/Transaction/GetVEById",
					dataType: "json",
					data: JSON.stringify(para)
				}).then(function (res) {
					$timeout(function () {
						if (res.data.IsSuccess && res.data.Data) {
							$scope.beData = res.data.Data;

							if ($scope.beData.DateOfSale)
								$scope.beData.DateOfSale_TMP = new Date($scope.beData.DateOfSale);

							if ($scope.beData.EntryDate)
								$scope.beData.EntryDate_TMP = new Date($scope.beData.EntryDate);

							if ($scope.beData.LRDate)
								$scope.beData.LRDate_TMP = new Date($scope.beData.LRDate);

							angular.forEach($scope.beData.DetailsColl, function (det) {
								if (det.FieldType == 'YesNo') {
									if (det.FieldValue) {
										if (det.FieldValue == 'true' || det.FieldValue == 'TRUE')
											det.FieldValue = true;
										else
											det.FieldValue = false;
									} else
										det.FieldValue = false;
                                }
							});

							angular.forEach($scope.UDFFeildsColl, function (uf) {
								uf.Value = '';
								uf.AlterNetValue = '';
							});

							if ($scope.beData.Attributes && $scope.beData.Attributes.length > 0) {
								var udfFieldsColl = mx(JSON.parse($scope.beData.Attributes));
								angular.forEach($scope.UDFFeildsColl, function (udd) {
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

							$('#searVoucherRightBtn').modal('hide');
						} else
							Swal.fire(res.data.ResponseMSG);
					});
				}, function (reason) {
					Swal.fire('Failed' + reason);
				});
			}
		});
	}

	$scope.DelTransactionById = function (tran) {
		Swal.fire({
			title: 'Are you sure you want to delete selected transaction ' + tran.VoucherNo + '?',
			showCancelButton: true,
			confirmButtonText: 'Delete',
			//message: 'Are you sure to delete selected Branch :-' + beData.Name,
		}).then((result) => {
			if (result.isConfirmed) {
				$scope.loadingstatus = "running";
				showPleaseWait();
				var para = {
					tranId: tran.TranId
				};
				$http({
					method: 'POST',
					url: base_url + "Service/Transaction/DelVehicleEntry",
					dataType: "json",
					data: JSON.stringify(para)
				}).then(function (res) {
					hidePleaseWait();
					$scope.loadingstatus = "stop";
					Swal.fire(res.data.ResponseMSG);
					if (res.data.IsSuccess == true) {
						$scope.ClearData();
						$scope.ReSearchData(-1);
					}
				}, function (reason) {
					Swal.fire('Failed' + reason);

				});
			}

		});
	}



	$scope.AddMoreFiles = function (files, des) {
		if (files) {
			if (files != null) {
				angular.forEach(files, function (file) {
					$scope.beData.DocumentColl.push({
						File: file,
						Name: file.name,
						Type: file.type,
						Size: file.size,
						Description: des,
						Path: null
					});
				})
				$scope.attachFile = null;
				$scope.docDescription = '';
				$('#flMoreFiles').val('');
			}
		}
	};

	$scope.delAttachmentFiles = function (ind) {
		if ($scope.beData.DocumentColl) {
			if ($scope.beData.DocumentColl.length > 0) {
				$scope.beData.DocumentColl.splice(ind, 1);
			}
		}
	}

	$scope.ShowPersonalImg = function (item) {
		$scope.viewImg = {
			ContentPath: '',
			FileType: null
		};

		if (item.DocPath && item.DocPath.length > 0) {
			$scope.viewImg.ContentPath = item.DocPath;
			$scope.viewImg.FileType = 'pdf';  // Assuming DocPath is for PDFs
			document.getElementById('pdfViewer').src = item.DocPath;
			$('#PersonalImg').modal('show');
		} else if (item.PhotoPath && item.PhotoPath.length > 0) {
			$scope.viewImg.ContentPath = item.PhotoPath;
			$scope.viewImg.FileType = 'image';  // Assuming PhotoPath is for images
			$('#PersonalImg').modal('show');
		} else if (item.File) {
			var blob = new Blob([item.File], { type: item.File?.type });
			$scope.viewImg.ContentPath = URL.createObjectURL(blob);
			$scope.viewImg.FileType = item.File.type.startsWith('image/') ? 'image' : 'pdf';

			if ($scope.viewImg.FileType === 'pdf') {
				document.getElementById('pdfViewer').src = $scope.viewImg.ContentPath;
			}

			$('#PersonalImg').modal('show');
		} else {
			Swal.fire('No Image Found');
		}
	};

});