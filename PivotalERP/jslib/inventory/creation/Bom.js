app.controller('BOMController', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'BOMController';

	$scope.LoadData = function () {
		$('.select2').select2();
		$scope.confirmMSG = GlobalServices.getConfirmMSG();
		$scope.paginationOptions = {
			pageNumber: 1,
			pageSize: GlobalServices.getPerPageRow(),
			sort: null,
			SearchType: 'text',
			SearchCol: '',
			SearchVal: '',
			SearchColDet: null,
			pagearray: [],
			pageOptions: [5, 10, 20, 30, 40, 50]
		};
	/*	$scope.perPageColl = GlobalServices.getPerPageList();*/

		$scope.beData = {
			TranId: 0,
			ProductId: null,
			Name: '',
			Description: '',
			Qty: 0,
			UnitId: null,
			GodownId: null,
			VoucherId: null,
			BomType: 3,
			IsActive: true,
			ValidFrom: null,
			ValidTo:null,
			ItemDetailsColl: [],
			TotalQty:0,
			TotalAmount:0,
			ShowValidDate:false,
			ShowAmount:false,
			ShowQty:false,
			Mode:'Save'
		};		 
		$scope.beData.ItemDetailsColl.push({
			RowType: 1,
			CanEditQty: true,
			CanEditRate: true,
			CanEditAmt: true,
			ProductType:2,
		});

		$scope.BOMProductTypes = [];
		$http({
			method: 'GET',
			url: base_url + "/V1/StaticValues/GetBOMProductType",
			dataType: "json"
		}).then(function (res) {
			$scope.BOMProductTypes = res.data;
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

		$scope.BOMTypes = [];
		$http({
			method: 'GET',
			url: base_url + "/V1/StaticValues/GetBOMType",
			dataType: "json"
		}).then(function (res) {
			$scope.BOMTypes = res.data;
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

		$scope.BOMRowTypes = [];
		$http({
			method: 'GET',
			url: base_url + "/V1/StaticValues/GetBOMRowType",
			dataType: "json"
		}).then(function (res) {
			$scope.BOMRowTypes = res.data;
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

		$scope.GodownColl = [];
		$http({
			method: 'GET',
			url: base_url + "Inventory/Creation/GetUserWiseGodown",
			dataType: "json"
		}).then(function (res) {
			if (res.data.IsSuccess && res.data.Data) {
				$scope.GodownColl = res.data.Data;				 
			} 
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

		$scope.VoucherTypeList = []; 
		$http({
			method: 'GET',
			url: base_url + "Account/Creation/GetVoucherListByType?voucherTypeColl=14,17,35,65" ,
			dataType: "json",
		}).then(function (res) {
			if (res.data.IsSuccess && res.data.Data) {
				$scope.VoucherTypeList = res.data.Data;
				$scope.ChangeBomType();
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

		$scope.UnitColl = []; 
		$http({
			method: 'GET',
			url: base_url + "Inventory/Creation/GetAllUnit",
			dataType: "json"
		}).then(function (res) {
			if (res.data.IsSuccess && res.data.Data) {				
				$scope.UnitColl = res.data.Data;
			}
		}, function (reason) {
			alert('Failed' + reason);
		});

	}

	$scope.ProductSelectionChange = function (itemDet) {

	}
	$scope.RProductSelectionChange = function (itemDet) {
		if (itemDet.productDetail) {
			itemDet.UnitId = itemDet.productDetail.BaseUnitId;
        }
    }

	
	$scope.ChangeBomType = function () {

		if ($scope.beData.BomType == 1)
			$scope.beData.VoucherType = 14;
		else if ($scope.beData.BomType == 2)
			$scope.beData.VoucherType = 14;
		else if ($scope.beData.BomType == 3)
			$scope.beData.VoucherType = 65;
		else if ($scope.beData.BomType == 4)
			$scope.beData.VoucherType = 17;
		else
			$scope.beData.VoucherType = 35;
	}
	$scope.ChangeRowType = function (itemDet) {

    }
	$scope.ChangeItemRow = function (itemDet, col) {
		if (col == 'qty') {
			itemDet.Amount = itemDet.Qty * itemDet.Rate;
		} else if (col == 'rate') {
			itemDet.Amount = itemDet.Qty * itemDet.Rate;
		} else if (col == 'amt') {
			if (itemDet.Qty > 0) {
				itemDet.Rate = itemDet.Amount / itemDet.Qty;
            }
        }
    }

	$scope.AddAdditionalCostRow = function (ind,curRow) {
		if ($scope.beData.ItemDetailsColl) {

			if (curRow.RowType == 1 && isEmptyNum(curRow.ProductId) == 0)  {
				return;
			}
			else if (curRow.RowType == 2 && isEmptyNum(curRow.LedgerId) == 0) {
				return;
			}
			else if ((curRow.RowType == 3 || curRow.RowType==4) && (!curRow.Notes || curRow.Notes.length==0) ) {
				return;
			}

			if ($scope.beData.ItemDetailsColl.length > ind + 1) {
				$scope.beData.ItemDetailsColl.splice(ind + 1, 0, {
					RowType: 1,
					CanEditQty: true,
					CanEditRate: true,
					CanEditAmt: true,
					ProductType:2,
				})
			} else {
				$scope.beData.ItemDetailsColl.push({
					RowType: 1,
					CanEditQty: true,
					CanEditRate: true,
					CanEditAmt: true,
					ProductType:2,
				})
			}
		}
	};
	$scope.delAdditionalCostRow = function (ind, curRow) {
		if ($scope.beData.ItemDetailsColl) {
			if ($scope.beData.ItemDetailsColl.length > 1) {
				$scope.beData.ItemDetailsColl.splice(ind, 1);
			}
		}
	};

	$scope.ClearData = function () {

		$scope.newMaster = {
			TranId: 0
		};

		$scope.beData = {
			TranId: 0,
			ProductId: null,
			Name: '',
			Description: '',
			Qty: 0,
			UnitId: null,
			GodownId: null,
			VoucherId: null,
			BomType: 3,
			IsActive: true,
			ValidFrom: null,
			ValidTo: null,
			ItemDetailsColl: [],
			TotalQty: 0,
			TotalAmount: 0,
			ShowValidDate: false,
			ShowAmount: false,
			ShowQty: false,
			Mode: 'Save'
		};
		$scope.beData.ItemDetailsColl.push({
			RowType: 1, CanEditQty: true,
			CanEditRate: true,
			CanEditAmt: true, });
	}
	$scope.Clear = function () {
		if (!$scope.beData.SaveClear || $scope.beData.SaveClear == false) {

			Swal.fire({
				title: 'Are you sure?',
				text: " clear current data !",
				icon: 'info',
				showCancelButton: true,
				confirmButtonColor: '#3085d6',
				cancelButtonColor: '#d33',
				confirmButtonText: 'Yes !'

			}).then((result) => {
				/* Read more about isConfirmed, isDenied below */
				if (result.isConfirmed) {
					$scope.ClearData();
				}
			});

		} else {
			$scope.ClearData();
		}

		//if (isValidForClear == true) {

		//}
	};

	$scope.SaveBOM = function () {

		if ($scope.IsValidData() == true) {

			var saveModify = $scope.beData.TranId > 0 ? 'Modify' : 'Save';
			Swal.fire({
				title: 'Do you want to ' + saveModify + ' the current data?',
				showCancelButton: true,
				confirmButtonText: saveModify,
			}).then((result) => {
				/* Read more about isConfirmed, isDenied below */
				if (result.isConfirmed) {
					$scope.loadingstatus = "running";
					showPleaseWait();

					var filesColl = $scope.beData.AttechFiles;
					$scope.beData.AttechFiles = [];

					$http({
						method: 'POST',
						url: base_url + "Inventory/Creation/SaveBOM",
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
						data: { jsonData: $scope.GetData(), files: filesColl }
					}).then(function (res) {

						$scope.loadingstatus = "stop";
						hidePleaseWait();

						if (res.data.IsSuccess == true) {
							$scope.beData.SaveClear = true;
							$scope.lastTranId = res.data.Data.RId;							 
							$scope.Clear();
						}
						else {
							Swal.fire(res.data.ResponseMSG);
						}

					}, function (errormessage) {
						hidePleaseWait();
						$scope.loadingstatus = "stop";

					});
				}
			});
			 
		}


	}

	$scope.IsValidData = function () {

		if (!$scope.beData.Name || $scope.beData.Name.length == 0) {
			Swal.fire("Please ! Enter BOM Name");
			return false;
		}

		if ($scope.beData.BomType != 2)
		{
			if (isEmptyNum($scope.beData.ProductId) == 0) {
				Swal.fire("Please ! Select Product");
				return false;
			}

			if (isEmptyNum($scope.beData.Qty) == 0) {
				Swal.fire("Please ! Enter Qty.");
				return false;
			}
		}
		
		return true;
	}

	$scope.SetData = function (tran) {

		$scope.beData = {
			TranId: isEmptyNum(tran.TranId),
			ProductId: tran.ProductId,
			Name: tran.Name,
			Description: tran.Description,
			Qty: tran.Qty,
			UnitId: tran.UnitId,
			GodownId: tran.GodownId,
			VoucherId: tran.VoucherId,
			BomType: tran.BomType,
			IsActive: tran.IsActive,
			ValidFrom: tran.ValidFrom,
			ValidFrom_TMP:(tran.ValidFrom ?  new Date(tran.ValidFrom) : null),
			ValidTo: (tran.ValidTo ? new Date(tran.ValidTo) : null),
			ValidTo_TMP: (tran.ValidTo ? new Date(tran.ValidTo) : null),
			ItemDetailsColl: [],
			TotalQty: tran.TotalQty,
			TotalAmount: tran.TotalAmount,
			ShowValidDate: tran.ShowValidDate,
			ShowAmount: tran.ShowAmount,
			ShowQty: tran.ShowQty,
		};

		angular.forEach(tran.ItemDetailsColl, function (itemDet) {
			var newItemAllocation = {
				RowType: itemDet.RowType,
				ProductId: itemDet.ProductId,
				LedgerId: itemDet.LedgerId,
				GodownId: itemDet.GodownId,
				UnitId: itemDet.UnitId,
				ProductType: itemDet.ProductType,
				Qty: itemDet.Qty,
				Rate: itemDet.Rate,
				Amount: itemDet.Amount,
				RatePer: itemDet.RatePer,
				Notes: itemDet.Notes,
				Description: itemDet.Description,
				Formula: itemDet.Formula,
				CanEditQty: itemDet.CanEditQty,
				CanEditRate: itemDet.CanEditRate,
				CanEditAmt: itemDet.CanEditAmt,
			};
			$scope.beData.ItemDetailsColl.push(newItemAllocation);
		});

    }
	$scope.GetData = function () {
		var tran = {
			TranId: isEmptyNum($scope.beData.TranId),
			ProductId: $scope.beData.ProductId,
			Name: $scope.beData.Name,
			Description: $scope.beData.Description,
			Qty: isEmptyAmt($scope.beData.Qty),
			UnitId: $scope.beData.UnitId,
			GodownId: $scope.beData.GodownId,
			VoucherId: $scope.beData.VoucherId,
			BomType: $scope.beData.BomType,
			IsActive: $scope.beData.IsActive,
			ValidFrom: $scope.beData.ValidFromDet ? $filter('date')(new Date($scope.beData.ValidFromDet.dateAd), 'yyyy-MM-dd') : null,
			ValidTo: $scope.beData.ValidToDet ? $filter('date')(new Date($scope.beData.ValidToDet), 'yyyy-MM-dd') : null,
			ItemDetailsColl: [],			
			TotalAmount: $scope.beData.TotalAmount,
			ShowValidDate: $scope.beData.ShowValidDate,
			ShowAmount: $scope.beData.ShowAmount,
			ShowQty: $scope.beData.ShowQty,
		};

		angular.forEach($scope.beData.ItemDetailsColl, function (itemDet) {
			var newItemAllocation = {
				RowType: itemDet.RowType,
				ProductId: itemDet.ProductId,
				LedgerId: itemDet.LedgerId,
				GodownId: itemDet.GodownId,
				UnitId: itemDet.UnitId,
				ProductType: itemDet.ProductType,
				Qty:isEmptyAmt(itemDet.Qty),
				Rate: isEmptyAmt(itemDet.Rate),
				Amount: isEmptyAmt(itemDet.Amount),
				RatePer: isEmptyAmt(itemDet.RatePer),
				Notes: itemDet.Notes,
				Description: itemDet.Description,
				Formula: itemDet.Formula,
				CanEditQty: itemDet.CanEditQty,
				CanEditRate: itemDet.CanEditRate,
				CanEditAmt: itemDet.CanEditAmt,
			};
			tran.ItemDetailsColl.push(newItemAllocation);
		});

		return tran;
    }

	$scope.SearchDataColl = [];
	$scope.SearchData = function () {

		$scope.loadingstatus = 'running';
		showPleaseWait();
		$scope.paginationOptions.TotalRows = 0;

		var sCol = $scope.paginationOptions.SearchColDet;

		var para = {
			voucherId: ($scope.SelectedVoucher ? $scope.SelectedVoucher.VoucherId : null),
			costClassId: ($scope.SelectedCostClass ? $scope.SelectedCostClass.CostClassId : null),
			voucherType: VoucherType,
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
			url: base_url + "Inventory/Creation/GetAllBOM",
			dataType: "json",
			//data: JSON.stringify(para)
		}).then(function (res) {
			$scope.loadingstatus = 'stop';
			hidePleaseWait();
			if (res.data.IsSuccess && res.data.Data) {
				$scope.SearchDataColl = res.data.Data;
				$scope.paginationOptions.TotalRows = res.data.Data.length;
				$('#searVoucherRightBtn').modal('show');
			} else
				alert(res.data.ResponseMSG);

		}, function (reason) {
			alert('Failed' + reason);
		});


	};


	$scope.GetTransactionById = function (tran) {
		if (tran.TranId && tran.TranId > 0) {

			$scope.loadingstatus = "running";
			showPleaseWait();

			var para = {
				tranId: tran.TranId
			};

			$scope.newMaster = {
				TranId: tran.TranId
			};
			$scope.ClearData();
			$timeout(function () {
				$http({
					method: 'POST',
					url: base_url + "Inventory/Creation/GetBomById",
					dataType: "json",
					data: JSON.stringify(para)
				}).then(function (res) {
					$timeout(function () {
						if (res.data.IsSuccess && res.data.Data) {
							var tran = res.data.Data;

							$scope.SetData(tran);
							hidePleaseWait();
							$scope.loadingstatus = "stop";
							$('#searVoucherRightBtn').modal('hide');
						} else
							Swal.fire(res.data.ResponseMSG);
					});
				}, function (reason) {
					Swal.fire('Failed' + reason);
				});
			}, 100);

		}
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
					url: base_url + "Inventory/Creation/DeleteBOM",
					dataType: "json",
					data: JSON.stringify(para)
				}).then(function (res) {
					hidePleaseWait();
					$scope.loadingstatus = "stop";
					Swal.fire(res.data.ResponseMSG);
					if (res.data.IsSuccess == true) {
						$scope.ClearData();
					}
				}, function (reason) {
					Swal.fire('Failed' + reason);

				});
			}

		});
	}

	$scope.pageChangeHandler = function (num) {
		console.log('page changed to ' + num);
	};

	$scope.AuditLogColl = [];
	$scope.ShowAuditLog = function () {

		$scope.AuditLogColl = {};
		if ($scope.newMaster.TranId > 0) {

			$scope.loadingstatus = "running";
			showPleaseWait();

			GlobalServices.getAuditLog(EntityId, $scope.newMaster.TranId).then(function (res1) {
				$scope.loadingstatus = "stop";
				hidePleaseWait();
				if (res1.data.IsSuccess && res1.data.Data) {
					$scope.AuditLogColl = res1.data.Data;
					$('#frmAuditHis').modal('show');
				}
			}, function (reason) {
				Swal.fire('Failed' + reason);
			});

		}
	}

});