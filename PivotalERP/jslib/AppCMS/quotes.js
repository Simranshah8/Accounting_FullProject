app.controller('QuotesController', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'Quotes';

	OnClickDefault();
	$scope.LoadData = function () {
		 

		$scope.confirmMSG = GlobalServices.getConfirmMSG();
		$scope.perPageColl = GlobalServices.getPerPageList();

		$scope.currentPages = {
			Quotes: 1,
		};

		$scope.searchData = {
			Quotes: '',
		};

		$scope.perPage = {
			Quotes: GlobalServices.getPerPageRow(),
		};

		$scope.newQuotes = {
			QuotesId: null,
			Title: '',			
			ForDate_TMP: null,
			Photo: null,
			PhotoPath: null,
			Mode: 'Save'
		};

		$scope.GetAllQuotesList();
	}

	function OnClickDefault() {
		document.getElementById('quotes-form').style.display = "none";

		document.getElementById('open-form-btn').onclick = function () {
			document.getElementById('table-listing').style.display = "none";
			document.getElementById('quotes-form').style.display = "block";
			$scope.ClearQuotes();

		}
		document.getElementById('back-to-list').onclick = function () {
			document.getElementById('table-listing').style.display = "block";
			document.getElementById('quotes-form').style.display = "none";
			$scope.ClearQuotes();
			$scope.GetAllQuotesList();
		}
	};
	$scope.ClearQuotesPhoto = function () {
		$timeout(function () {
			$scope.$apply(function () {
				$scope.newQuotes.PhotoData = null;
				$scope.newQuotes.Photo_TMP = [];
			});
		});
		$('#imgPhoto').attr('src', '');
		$('#imgPhoto1').attr('src', '');
	};


	$scope.ClearQuotes = function () {

		$timeout(function () {
			$scope.ClearQuotesPhoto();
			$scope.newQuotes = {
				QuotesId: null,
				QuotesTitle: '',
				ForDate_TMP: null,
				Photo: null,
				PhotoPath: null,
				Mode: 'Save'
			};
		});		
	}

	$scope.IsValidQuotes = function () {
		if ($scope.newQuotes.Title.isEmpty()) {
			Swal.fire('Please ! Enter Title');
			return false;
		}
		return true;
	}

	$scope.SaveUpdateQuotes = function () {
		if ($scope.IsValidQuotes() == true) {
			if ($scope.confirmMSG.Accept == true) {
				var saveModify = $scope.newQuotes.Mode;
				Swal.fire({
					title: 'Do you want to ' + saveModify + ' the current data?',
					showCancelButton: true,
					confirmButtonText: saveModify,
				}).then((result) => {
					/* Read more about isConfirmed, isDenied below */
					if (result.isConfirmed) {
						$scope.CallSaveUpdateQuotes();
					}
				});
			} else
				$scope.CallSaveUpdateQuotes();
		}
	};

	

	$scope.CallSaveUpdateQuotes = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();

		var photo = $scope.newQuotes.Photo_TMP;

		if ($scope.newQuotes.ForDateDet) {
			$scope.newQuotes.ForDate = $filter('date')(new Date($scope.newQuotes.ForDateDet.dateAD), 'yyyy-MM-dd');
		} else
			$scope.newQuotes.ForDate = null;

		$http({
			method: 'POST',
			url: base_url + "AppCMS/Creation/SaveQuotes",
			headers: { 'Content-Type': undefined },
			transformRequest: function (data) {
				var formData = new FormData();
				formData.append("jsonData", angular.toJson(data.jsonData));
				
				if (data.stPhoto && data.stPhoto.length > 0)
					formData.append("photo", data.stPhoto[0]);
				return formData;
			},
			data: { jsonData: $scope.newQuotes, stPhoto:photo }
		}).then(function (res) {

			$scope.loadingstatus = "stop";
			hidePleaseWait();

			Swal.fire(res.data.ResponseMSG);

			if (res.data.IsSuccess == true) {
				$scope.ClearQuotes();
				
			}

		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
		});
	}

	$scope.GetAllQuotesList = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$scope.QuotesList = [];

		$http({
			method: 'POST',
			url: base_url + "AppCMS/Creation/GetAllQuotesList",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.QuotesList = res.data.Data;

			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

	}

	$scope.GetQuotesById = function (refData) {
		$scope.loadingstatus = "running";
		showPleaseWait();
		var para = {
			QuotesId: refData.QuotesId
		};
		$http({
			method: 'POST',
			url: base_url + "AppCMS/Creation/GetQuotesById",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.newQuotes = res.data.Data;
				$scope.newQuotes.Mode = 'Modify';


				if ($scope.newQuotes.ForDate)
					$scope.newQuotes.ForDate_TMP = new Date($scope.newQuotes.ForDate);

				document.getElementById('table-listing').style.display = "none";
				document.getElementById('quotes-form').style.display = "block";

			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	};


	$scope.DelQuotesById = function (refData) {
		Swal.fire({
			title: 'Do you want to delete the selected data?',
			showCancelButton: true,
			confirmButtonText: 'Delete',
		}).then((result) => {
			/* Read more about isConfirmed, isDenied below */
			if (result.isConfirmed) {
				$scope.loadingstatus = "running";
				showPleaseWait();
				var para = {
					QuotesId: refData.QuotesId
				};
				$http({
					method: 'POST',
					url: base_url + "AppCMS/Creation/DelQuotes",
					dataType: "json",
					data: JSON.stringify(para)
				}).then(function (res) {
					hidePleaseWait();
					$scope.loadingstatus = "stop";
					if (res.data.IsSuccess) {
						$scope.GetAllQuotesList();
					} else {
						Swal.fire(res.data.ResponseMSG);
					}
				}, function (reason) {
					Swal.fire('Failed' + reason);
				});			}
		});
	};

	$scope.ShowPersonalImg = function (item) {
		$scope.viewImg = {
			ContentPath: ''
		};
		if (item.ImagePath && item.ImagePath.length > 0) {
			$scope.viewImg.ContentPath = item.ImagePath;
			$('#PersonalImg').modal('show');
		} else
			Swal.fire('No Image Found');

	};

});