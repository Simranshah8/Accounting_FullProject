

$("#tabs").tabs();

$(function () {

    var tabs = $("#tabs").tabs();

    tabs.delegate("a.fa-times-circle", "click", function () {
        var panelId = $(this).closest("li").remove().attr("aria-controls");
        $("#" + panelId).remove();
        tabs.tabs("refresh");
        tabCounter = tabCounter - 1;
        TabClick('00');
    });
});
tabCounter = 0;
//sHeight=screen.availHeight-30
var sHeight = $(window).height(); //retrieve current document height

var rand = function () {
    return Math.random().toString(36).substr(2); // remove `0.`
};
var isOldBrowser = "true"


function addTabs(tabTitle, tabContent) {

    //$('#waitingDialog').modal('show');
   // document.getElementById("tabs").style.cursor = "wait";

    sHeight = $(window).height() - 5; //screen.availHeight-220

    tabId = "Tab-" + rand();
    var tabs = $("#tabs").tabs();
    var ul = tabs.find("ul");
    $("<li class='nav-item ui-tabs-active ui-state-active' role='presentation'><a id='al-" + tabId + "' class='nav-link active' role='tab' aria-controls='pills-second' aria-selected='false' OnClick='TabClick(\""+tabId+"\")' href='#" + tabId + "'>" + tabTitle + "</a><a href='#' class='fas fa-times-circle'></a></li>").appendTo(ul);
    $("<div id='" + tabId + "'><iframe id='Frm_" + tabId + "' src='" + tabContent + "' width='100%'></iframe></div>").appendTo(tabs);
    //$("<div id='" + tabId + "' class='embed-responsive embed-responsive-1by1' min-height='4500px'><iframe id='Frm_" + tabId + "' src='" + tabContent + "' width='100%' class='embed-responsive-item'></iframe></div>").appendTo(tabs);

    //if (isOldBrowser == "true") {
    //    resizeIframe("Frm_" + tabId)
    //}
    jQuery("#Frm_" + tabId).bind('load', function ()
    {
       // document.getElementById("Frm_" + tabId).contentWindow.document.getElementsByTagName("body")[0].style.overflow = "hidden";
        
        if (isOldBrowser == "true") {
           // resizeIframe("Frm_" + tabId)
        }
        document.getElementById("tabs").style.cursor = "default";
        //$('#waitingDialog').modal('hide');
        
    });
    if (tabTitle == "Dashboard") {
        tabs.find('span.ui-icon-close').remove();
    }
    tabs.tabs("refresh");
    $("#tabs").tabs({ active: tabCounter });
    tabCounter++;

    TabClick(tabId);
    //var frameTopBanner = parent.topbanner
    //frameTopBanner.reLoadTime();

    //var frmName = "#Frm_" + tabId;
    //var iframeWindow = document.getElementById(frmName).contentWindow;
    //iframeWindow.postMessage({ action: 'update', data: globalGenConfig }, '*');

}
var appVersion = navigator.appVersion.substr(0, 4)
if (parseFloat(appVersion) >= 5) {
    var tabs = $("#tabs").tabs({ heightStyle: "screen" });
}



function TabClick(id)
{
    id = "al-" + id;
    var allTabs = $("#tabs").tabs().find("ul").find(".nav-link");
    var isFirst = true;
    angular.forEach(allTabs, function (tab) {
        tab.classList.remove("active");
        if (id == tab.id) {
            tab.classList.add("active");
        } else if (isFirst == true && id == "al-00") {
            tab.classList.add("active");
            isFirst = false;
        }
    });
    
}
function confirmResponse(x) {
    if (x) {
        var frameTopBanner = parent.topbanner
        frameTopBanner.reLoadTime();
        window.location.reload();
    }
}
function refreshActiveTab() {
    //waitingDialog({ message: 'Loading...' });
    var curTab = $("#tabs").tabs('option', 'active');
    var element = $("#tabs").find(".ui-tabs-panel")[curTab];
    var activeTabID = ($(element).attr("id"));
    $("#Frm_" + activeTabID).attr("src", $("#Frm_" + activeTabID).attr("src"));
    //jQuery("#Frm_" + activeTabID).bind('load', function () { closeWaitingDialog(); });
}
function getActiveTabID() {
    var rTab = $("#tabs").tabs('option', 'active');
    var element = $("#tabs").find(".ui-tabs-panel")[curTab];
    var activeTabID = ($(element).attr("id"));
    return activeTabID;
}
function closeActiveTab() {
    tabID = getActiveTabID();
    $('#tabs').tabs();
    $('#tabs a[href="#' + tabID + '"]').click();
    $("#tabs").tabs("refresh")
}
function resizeIframe(frm) {
    height = screen.availHeight;
    document.getElementById(frm).style.height = height + "px";
};

function openMenuWindow(title, arg) {
    addTabs(title, arg);   
}


$(document).ready(function ()
{
    addTabs("Dashboard", base_url + "Dashboard/common/AdminDashboard");
    //addTabs("Student", base_url + "Academic/Transaction/AddStudent")

    //$(window).resize(function () {
    //    sHeight = $(window).height() - 40;

    //    $(".tabPanel").height(sHeight);
    //});
});

function GetDataTableForExport() {
    var curTab = $("#tabs").tabs('option', 'active');
    var element = $("#tabs").find(".ui-tabs-panel")[curTab];
    var activeTabID = ($(element).attr("id"));

    //var tbl = document.getElementById("Frm_" + activeTabID).contentWindow.document.getElementById("datatable");
    var frm = document.getElementById("Frm_" + activeTabID).contentWindow;
    var tbl = frm.document.getElementById("datatable");

    return tbl;
        
}

function NewLink()
{
    alert('new link');
}


