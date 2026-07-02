app.controller('TicketController', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'Ticket';
	OnClickDefault();
	$scope.LoadData = function () {
		$scope.confirmMSG = GlobalServices.getConfirmMSG();
		$scope.perPageColl = GlobalServices.getPerPageList();
		$scope.Ticket_Files_TMP = null;
		$scope.Ticket_Files_Data = null;
		$scope.RequirementColl = [
			{ id: 1, text: 'General' },
			{ id: 2, text: 'Requirement' },
			{ id: 3, text: 'Bug' },
			{ id: 4, text: 'Repeated Bug' },
			{ id: 5, text: 'Suggestion' },
			{ id: 6, text: 'Training' },
			{ id: 7, text: 'Year Closing' },
			{ id: 8, text: 'Data Migration' },
			{ id: 9, text: 'IRD Verification' },
			{ id: 10, text: 'CBMS API' },

		];

		$scope.currentPages = {
			Ticket: 1,
			OpenTicket: 1,
			InProgress: 1,
			OnHold: 1,
			Completed: 1,
			Closed:1
		};

		$scope.searchData = {
			Ticket: '',
			OpenTicket: '',
			InProgress: '',
			OnHold: '',
			Completed: '',
			Closed:'',
		};

		$scope.perPage = {
			Ticket: GlobalServices.getPerPageRow(),
			OpenTicket: GlobalServices.getPerPageRow(),
			InProgress: GlobalServices.getPerPageRow(),
			OnHold: GlobalServices.getPerPageRow(),
			Completed: GlobalServices.getPerPageRow(),
			Closed: GlobalServices.getPerPageRow(),
		};

		$scope.newTicket = {
			TicketId: null,
			Title: '',
			Description: '',
			RequirementTypeId:null,
			Mode: 'Submit'
		};
		$scope.GetAllTicketList();

		$scope.newComment = {
			Comment: ''
		};
		$scope.newFeedback = {			 
			Comment: ''
		};
	}
	
	function OnClickDefault() {
		document.getElementById('ticket-form').style.display = "none";
		document.getElementById('open-form-btn').onclick = function () {
			document.getElementById('table-listing').style.display = "none";
			document.getElementById('ticket-form').style.display = "block";
		}
		document.getElementById('back-to-list').onclick = function () {
			document.getElementById('table-listing').style.display = "block";
			document.getElementById('ticket-form').style.display = "none";
		}
	};
	
	$scope.ClearTicket = function () {
		$scope.newTicket = {
			Title: '',
			Description: '',
			RequirementTypeId: null,
			Mode: 'Submit'
		};
	}

	$scope.IsValidTicket = function () {

		if (!$scope.newTicket.RequirementTypeId || $scope.newTicket.RequirementTypeId==0) {
			Swal.fire('Please ! Select Ticket For.');
			return false;
		}

		if ($scope.newTicket.RequirementProblem.isEmpty()) {
			Swal.fire('Please ! Enter Heading');
			return false;
		}
		if ($scope.newTicket.Description.isEmpty()) {
			Swal.fire('Please ! Enter Description');
			return false;
		}
		return true;
	}
	 
	$scope.SaveUpdateTicket = function () {
		if ($scope.IsValidTicket() == true) {
			if ($scope.confirmMSG.Accept == true) {
				var saveModify = $scope.newTicket.Mode;
				Swal.fire({
					title: 'Do you want to ' + saveModify + ' the current data?',
					showCancelButton: true,
					confirmButtonText: saveModify,
				}).then((result) => {
					/* Read more about isConfirmed, isDenied below */
					if (result.isConfirmed) {
						$scope.CallSaveUpdateTicket();
					}
				});
			} else
				$scope.CallSaveUpdateTicket();

		}
	};

	$scope.CallSaveUpdateTicket = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		var AttachmentColl = [];
		angular.forEach($scope.newTicket.Ticket_Files_TMP, function (fd) {
			AttachmentColl.push(fd);
		});

		$http({
			method: 'POST',
			url: base_url + "Support/Creation/SaveGenerateTicket",
			headers: { 'Content-Type': undefined },
			transformRequest: function (data) {
				var formData = new FormData();
				formData.append("jsonData", angular.toJson(data.jsonData));
				if (data.files) {
					for (var i = 0; i < data.files.length; i++) {
						if (data.files[i].File)
							formData.append("file" + i, data.files[i].File);
						else
							formData.append("file" + i, data.files[i]);
					}
				}
				return formData;
			},
			data: { jsonData: $scope.newTicket, files: AttachmentColl }
		}).then(function (res) {
			$scope.loadingstatus = "stop";
			hidePleaseWait();
			Swal.fire(res.data.ResponseMSG);
			if (res.data.IsSuccess == true) {
				$scope.ClearTicket();
				$scope.GetAllTicketList();
			}
		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
		});
	}

	$scope.GetAllTicketList = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$scope.TickSumm = {
			Total: 0,
			Open: 0,
			Hold:0,
			InProgress: 0,
			Completed: 0,
			Closed:0
		};
		$scope.TicketList = [];
		$scope.TicketList_Open = [];
		$scope.TicketList_Hold = [];
		$scope.TicketList_InProgress = [];
		$scope.TicketList_Completed = [];
		$scope.TicketList_Closed = [];

		$http({
			method: 'POST',
			url: base_url + "Support/Creation/GetTicketLst",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			//if (res.data.IsSuccess && res.data.Data) {
			if (res.data.Data)
			{
				$scope.TicketList = res.data.Data;
				$scope.TickSumm.Total = $scope.TicketList.length;
				angular.forEach($scope.TicketList, function (tk) {

					if (tk.TicketStatus == 'Open') {
						$scope.TicketList_Open.push(tk);
						$scope.TickSumm.Open += 1;
					}
					else if (tk.TicketStatus == 'In Progress') {
						$scope.TicketList_InProgress.push(tk);
						$scope.TickSumm.InProgress += 1;
					}
					else if (tk.TicketStatus == 'Hold' || tk.TicketStatus == 'On Hold') {
						$scope.TicketList_Hold.push(tk);
						$scope.TickSumm.Hold += 1;
					}
					if (tk.TicketStatus == 'Closed')
					{
						if (tk.CustomerApprovedAt == null || tk.CustomerApprovedAt == undefined) {
							tk.TicketStatus = 'Completed'
							$scope.TickSumm.Completed += 1;
							$scope.TicketList_Completed.push(tk);
						} else {
							$scope.TickSumm.Closed += 1;
							$scope.TicketList_Closed.push(tk);
                        }							
                    }
				});

			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

	}

	$scope.GetClassForStatus = function (tk) {
		if (tk.TicketStatus == 'Closed') {
			return "text-success";
		}
		if (tk.TicketStatus == 'Completed') {
			return "text-success";
		}
		else if (tk.TicketStatus == 'In Progress')
			return "text-warning";
		else if (tk.TicketStatus == 'Open')
			return "text-danger";
		else
			return "text-success";
    }
	$scope.TicketStatusClass = function (tk) {
		if (tk.TicketStatus == 'Closed') {			
				return "closebg";
		}
		if (tk.TicketStatus == 'Completed') {			
				return "ticketsinfobg";		 
		}
		else if (tk.TicketStatus == 'In Progress')
			return "inprogressbg";
		else if (tk.TicketStatus == 'Open')
			return "openticketsbg";
		else
			return "ticketsinfobg";
	}

	$scope.TicketHisColl = [];

	$scope.openCommentModal = function (C) {
		$scope.newComment = {};
		$scope.newComment.CustomerName = C.CustomerName;
		$scope.newComment.TicketId = C.TicketId;
	
		$scope.TicketHisColl = [];

		$scope.loadingstatus = "running";
		showPleaseWait();

		var para = {
			TranId: C.TicketId
		};

		$http({
			method: 'POST',
			url: base_url + "Support/Creation/GetTicketHistory",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			//if (res.data.IsSuccess && res.data.Data) {
			if (res.data.Data) {
				$scope.TicketHisColl = res.data.Data;
				$('#commentmodal').modal('show');

			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	}

	//**********************Ticket Comment************************
	$scope.SaveTicketComment = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$http({
			method: 'POST',
			url: base_url + "Support/Creation/SaveTicketComment",
			headers: { 'Content-Type': undefined },
			transformRequest: function (data) {
				var formData = new FormData();
				formData.append("jsonData", angular.toJson(data.jsonData));
				return formData;
			},
			data: { jsonData: $scope.newComment }
		}).then(function (res) {
			$scope.loadingstatus = "stop";
			hidePleaseWait();
			Swal.fire(res.data.ResponseMSG);
			if (res.data.IsSuccess == true) {				 
				$('#commentmodal').modal('hide');
			}
		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
		});
	}


	$scope.openApprovedModal = function (C) {
		$scope.newFeedback = {};
		$scope.newFeedback.CustomerName = C.CustomerName;
		$scope.newFeedback.TicketId = C.TicketId;
		$('#approvalmodal').modal('show');
	}

	//**********************Ticket Comment************************
	$scope.SaveTicketApproved = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$http({
			method: 'POST',
			url: base_url + "Support/Creation/SaveTicketApproved",
			headers: { 'Content-Type': undefined },
			transformRequest: function (data) {
				var formData = new FormData();
				formData.append("jsonData", angular.toJson(data.jsonData));
				return formData;
			},
			data: { jsonData: $scope.newFeedback }
		}).then(function (res) {
			$scope.loadingstatus = "stop";
			hidePleaseWait();
			Swal.fire(res.data.ResponseMSG);
			if (res.data.IsSuccess == true) {
				$scope.GetAllTicketList();
				$('#approvalmodal').modal('hide');
			}
		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
		});
	}


	$scope.TicketHisColl = [];
	$scope.GetTicketHis = function (tranId) {

		

	}
});