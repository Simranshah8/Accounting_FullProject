app.controller('DairyPurchaseController', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'Dairy Purchase';

	OnClickDefault();
	$scope.LoadData = function () {
		$('.select2').select2();
		$scope.confirmMSG = GlobalServices.getConfirmMSG();
		$scope.perPageColl = GlobalServices.getPerPageList();
	  
		$scope.currentPages = {
			Partywise: 1,
			Shift:1

		};

		$scope.searchData = {
			Partywise: '',
			Shift: '',
		};

		$scope.perPage = {
			Partywise: GlobalServices.getPerPageRow(),
			Shift: GlobalServices.getPerPageRow(),
		};
		 
		$scope.ProductColl = [];
		$http({
			method: 'GET',
			url: base_url + "Inventory/Creation/GetProductListByType?ProductType=6",
			dataType: "json"
			//data:JSON.stringify(para)
		}).then(function (res) {
			if (res.data.IsSuccess && res.data.Data) {
				$scope.ProductColl = res.data.Data;
				$scope.ProductColl_Qry = mx(res.data.Data);
			}
		}, function (reason) {
			alert('Failed' + reason);
		});

		$scope.CurData = {
			ProductId: null,
			PartyId: null,
			FAT: 0, SNF: 0, TS: 0, Topping: 0, MaxRate: 0
		};
		$scope.GetAllPartyWiseList();

		$scope.CurPartyWiseColl = [];
		$scope.CurPartyWiseColl.push({});
		

	};

	$scope.GetAllPartyWiseList = function () {

		showPleaseWait();
		$scope.AllPartyWiseColl = [];
		$http({
			method: 'POST',
			url: base_url + "Inventory/Transaction/GetAllDairyPS",
			dataType: "json"
			//data:JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			if (res.data.IsSuccess && res.data.Data) {
				$scope.AllPartyWiseColl = res.data.Data;
			}
		}, function (reason) {
			alert('Failed' + reason);
		});
    }
	$scope.deletePartyWise = function (refData, ind) {
		Swal.fire({
			title: 'Are you sure you want to delete ' + refData.PartyName + '?',
			showCancelButton: true,
			confirmButtonText: 'Delete',
			//message: 'Are you sure to delete selected Branch :-' + beData.Name,
		}).then((result) => {
			if (result.isConfirmed) {
				var para = {
					ProductId: refData.ProductId,
					PartyId: refData.PartyId
				}
				$http({
					method: 'POST',
					url: base_url + "Inventory/Transaction/DelDairyPurchaseSetup",
					dataType: "json",
					data: JSON.stringify(para)
				}).then(function (res) {
					hidePleaseWait();
					$scope.loadingStatus = "stop";

					Swal.fire(res.data.ResponseMSG);
					if (res.data.IsSuccess == true) {
						$scope.AllPartyWiseColl.splice(ind, 1);
					}
				}, function (reason) {
					Swal.fire('Failed' + reason);
				});
			}

		});
    }
	$scope.ChangeProduct = function () {
		showPleaseWait();
		$scope.PartywiseList = [];
		var para = {
			ProductId: $scope.CurData.ProductId,
			PartyId: null,
			ShowLog:true
        }
		$http({
			method: 'POST',
			url: base_url + "Inventory/Transaction/GetDairyPurchaseSetup",
			dataType: "json",
			data:JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				var rd = res.data.Data;
				$scope.CurData.FAT = rd.FAT;
				$scope.CurData.SNF = rd.SNF;
				$scope.CurData.TS = rd.TS;
				$scope.CurData.Topping = rd.Topping;
				$scope.CurData.MaxRate = rd.MaxRate;
				$scope.CurData.LogDateColl = rd.LogDateColl;

			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

    }

	$scope.SaveProductWise = function () {

		if ($scope.CurData.ProductId > 0) {
			showPleaseWait();

			var tmpDataColl = [];
			tmpDataColl.push($scope.CurData);

			$http({
				method: 'POST',
				url: base_url + "Inventory/Transaction/SaveDairyPurchaseSetup",
				dataType: "json",
				data: JSON.stringify(tmpDataColl)
			}).then(function (res) {
				hidePleaseWait();
				$scope.loadingstatus = "stop";
				Swal.fire(res.data.ResponseMSG);

			}, function (reason) {
				Swal.fire('Failed' + reason);
			});
        }
		
	}
	$scope.AddRowInTable = function (ind) {
		if ($scope.CurPartyWiseColl) {
			if ($scope.CurPartyWiseColl.length > ind + 1) {
				$scope.CurPartyWiseColl.splice(ind + 1, 0, {});
			} else {
				$scope.CurPartyWiseColl.push({});
			}
		}
	}

	$scope.delRowFromTable = function (ind) {
		if ($scope.CurPartyWiseColl) {
			if ($scope.CurPartyWiseColl.length > 1) {
				$scope.CurPartyWiseColl.splice(ind, 1);
			}
		}
	}

	$scope.SavePartyWise = function () {

		var tmpDataColl = [];
		angular.forEach($scope.CurPartyWiseColl, function (pw) {
			if (pw.PartyId > 0 && pw.ProductId > 0) {
				tmpDataColl.push(pw);
			}
		});

		if (tmpDataColl.length > 0) {

			showPleaseWait(); 

			$http({
				method: 'POST',
				url: base_url + "Inventory/Transaction/SaveDairyPurchaseSetup",
				dataType: "json",
				data: JSON.stringify(tmpDataColl)
			}).then(function (res) {
				hidePleaseWait();
				$scope.loadingstatus = "stop";
				Swal.fire(res.data.ResponseMSG);

				if (res.data.IsSuccess == true)
					$scope.GetAllPartyWiseList();

			}, function (reason) {
				Swal.fire('Failed' + reason);
			});
		}

	}
	 

	function OnClickDefault() {
		document.getElementById('tableform').style.display = "none";
		document.getElementById('shiftform').style.display = "none";
		document.getElementById('tableformById').style.display = "none";

		document.getElementById('addpartywise').onclick = function () {
			document.getElementById('tableform').style.display = "block";
			document.getElementById('showtable').style.display = "none";
			 
		}

		document.getElementById('backpartywise').onclick = function () {
			document.getElementById('tableform').style.display = "none";
			document.getElementById('showtable').style.display = "block";
		 
		}
		document.getElementById('backpartywiseById').onclick = function () {
			document.getElementById('tableformById').style.display = "none";
			document.getElementById('showtable').style.display = "block";
		 
		}

		document.getElementById('addshift').onclick = function () {
			document.getElementById('shiftform').style.display = "block";
			document.getElementById('showshifttable').style.display = "none";
			 
		}

		document.getElementById('backshift').onclick = function () {
			document.getElementById('shiftform').style.display = "none";
			document.getElementById('showshifttable').style.display = "block";
			 
		}
	};

	$scope.ValidLedAllocationColl = [];
	$scope.IsValidTran = function () {
		$scope.ValidLedAllocationColl = [];
		if ($scope.IsValidData() == true) {

			$scope.loadingstatus = "running";
			showPleaseWait();

			$http({
				method: 'POST',
				url: base_url + "Global/IsValidVoucher",
				headers: { 'Content-Type': undefined },

				transformRequest: function (data) {

					var formData = new FormData();
					formData.append("EntityId", EntityId);
					formData.append("jsonData", angular.toJson(data.jsonData));
					return formData;
				},
				data: { jsonData: $scope.GetData() }
			}).then(function (res) {

				$scope.loadingstatus = "stop";
				hidePleaseWait();
				if (res.data.IsSuccess == true) {
					if (res.data.Data && res.data.Data.length > 0) {
						$scope.ValidLedAllocationColl = JSON.parse(res.data.Data);
						$('#frmMDLLedAllocation').modal('show');
					} else {
						Swal.fire(res.data.ResponseMSG);
					}
				} else {
					Swal.fire(res.data.ResponseMSG);
				}
			}, function (errormessage) {
				hidePleaseWait();
				$scope.loadingstatus = "stop";
			});

		}
	}


	$scope.TranRelation = {};
	$scope.ShowTransactionRelation = function () {

		$scope.TranRelation = {};
		if ($scope.beData.TranId > 0) {

			$scope.loadingstatus = "running";
			showPleaseWait();

			var para = {
				TranId: $scope.beData.TranId,
				VoucherType: VoucherType,
			};

			$http({
				method: 'POST',
				url: base_url + "Global/GetTranRelation",
				dataType: "json",
				data: JSON.stringify(para)
			}).then(function (res1) {
				$scope.loadingstatus = "stop";
				hidePleaseWait();
				if (res1.data.IsSuccess && res1.data.Data) {
					var tranData = res1.data.Data;
					if (tranData.length > 0) {
						$scope.TranRelation.Parent = res1.data.Data[0];
						$scope.TranRelation.ChieldColl = [];
						angular.forEach(tranData, function (td) {
							if (td.LevelId > 1)
								$scope.TranRelation.ChieldColl.push(td);
						});

						$('#frmMDLTranRelation').modal('show');
					}

				}
			}, function (reason) {
				Swal.fire('Failed' + reason);
			});


		}
	}
	
	
    $scope.CopyData = null;
    $scope.CopyTran = function () {
        $scope.CopyData = null;
        if ($scope.beData) {
            if ($scope.beData.TranId > 0)
            {
                $scope.CopyData = $scope.GetData();
                $scope.CopyData.TranId = 0;
            }
        }
    }
    $scope.PasteTran = function () {
        if ($scope.CopyData) {
            $scope.ClearData();
            $timeout(function () {
                $scope.SetData($scope.CopyData);
                $scope.CopyData = null;
                //$scope.getVoucherNo();
            });            
        }        
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

	$scope.ClearUPartyWise = function () {
		$scope.newDetById = {
			ProductId: null,
			PartyId: null,
			FAT: 0,
			SNF: 0,
			TS: 0,
			Topping: 0,
			MaxRate: 0,
		};
    }
	$scope.GetDairyPurchaseSetupById = function (beData) {
		showPleaseWait();
		$scope.newDetById = {};
		var para = {
			ProductId: beData.PartyId,
			PartyId: beData.ProductId || null,
			ShowLog: false
		}
		$http({
			method: 'POST',
			url: base_url + "Inventory/Transaction/GetDairyPurchaseSetup",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.ClearUPartyWise();
				$scope.newDetById = res.data.Data;
				
				document.getElementById('tableformById').style.display = "block";
				document.getElementById('showtable').style.display = "none";

			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	}

	$scope.UpdatePartyWise = function () {

		var dataItem = {
			ProductId: $scope.newDetById.ProductId,
			PartyId: $scope.newDetById.PartyId,
			FAT: $scope.newDetById.FAT,
			SNF: $scope.newDetById.SNF,
			TS: $scope.newDetById.TS,
			Topping: $scope.newDetById.Topping,
			MaxRate: $scope.newDetById.MaxRate
		};

		var tmpDataColl = [dataItem];

		$scope.loadingstatus = "running";
		showPleaseWait();

		$http({
			method: 'POST',
			url: base_url + "Inventory/Transaction/SaveDairyPurchaseSetup",
			dataType: "json",
			data: JSON.stringify(tmpDataColl), 
			headers: { "Content-Type": "application/json" }
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			Swal.fire(res.data.ResponseMSG);

			if (res.data.IsSuccess) {
				$scope.ClearUPartyWise();
				$scope.GetAllPartyWiseList();
			}

		}, function (err) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			Swal.fire("Failed: " + err);
		});
	};



});

