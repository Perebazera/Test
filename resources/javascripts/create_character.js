$(document).ready(function () {
    $('.g-recaptcha').bind('mouseover', function () {
        $('.ReCaptchaButtonContainer .BigButtonOver').css('visibility', 'visible');
        $('.ReCaptchaButtonContainer .BigButtonText').css('top', '1px');
        $('.ReCaptchaButtonContainer .BigButtonText').css('left', '1px');
    });
    $('.g-recaptcha').bind('mouseout', function () {
        $('.ReCaptchaButtonContainer .BigButtonOver').css('visibility', 'hidden');
        $('.ReCaptchaButtonContainer .BigButtonText').css('top', '0px');
        $('.ReCaptchaButtonContainer .BigButtonText').css('left', '0px');
    });
});
var ServerList = new Array();
var Options = new Array();
var PreselectWorld = '';
function GetIEVersion() {
    UserAgent = window.navigator.userAgent;
    MSIE = UserAgent.indexOf("MSIE ");
    if (MSIE > 0) {
        return parseInt(UserAgent.substring(MSIE + 5, UserAgent.indexOf(".", MSIE)));
    } else {
        return null;
    } }
function InitializeCharacterCreator(PreselectServerType, PreselectServerLocation, PreselectPvP) {
    IEVersion = GetIEVersion();
    if (IEVersion !== null && IEVersion < 7) {
        return;
    }
    document.getElementById("plain_world_box").style.display = "none";
    if (document.getElementById('filterbox_servertype') != null) { document.getElementById("filterbox_servertype").style.display = ""; }
    document.getElementById("filterbox_location").style.display = "";
    document.getElementById("filterbox_pvp").style.display = "";
    var PreselectPvP = 'open';
    var PreselectServerType = 'REG';
    if (PreselectWorld.length > 0) {
        var Server = GetServerByName(PreselectWorld);
        if (Server != null) {
            PreselectServerLocation = Server[1];
            PreselectPvP = Server[2];
            if (Server[3] == 0) {
                PreselectServerType = 'REG';
            } else {
                PreselectServerType = 'DEV';
            }
        }
    } else {
        PreselectWorld = undefined;
    }
    if (document.getElementById('filterbox_servertype') != null) {
        document.getElementById(GetFilterOptionId('server_type', PreselectServerType)).checked = 'checked';
    }
    document.getElementById(GetFilterOptionId('server_location', PreselectServerLocation)).checked = 'checked';
    document.getElementById(GetFilterOptionId('server_pvp_type', PreselectPvP)).checked = 'checked';
    UpdateServerList(null, PreselectWorld);
}
function GetFilterOptionId(GroupID, Name) {
    return 'option_' + GroupID + '_' + Name;
}
function GetServerOptionId(WorldName) {
    return 'server_' + WorldName;
}
function CreateFilterOption(GroupID, Value, Label) {
    OptionID = GetFilterOptionId(GroupID, Value);
    OptionData = new Object();
    OptionData.GroupID = GroupID;
    OptionData.Value = Value;
    Options[OptionID] = OptionData;
    document.write('<div class="OptionContainer"><label for="' + OptionID + '"  id="' + OptionID + '_label">');
    if (GroupID == 'server_pvp_type') {
        document.write('<img class="ServerInformationIcon" src="' + JS_DIR_IMAGES + 'global/content/' + OptionID + '.gif" alt="Server PVP Type" value="' + Value + '" /><br/>');
    } else if (GroupID == 'server_location') {
        document.write('<img class="WorldLocationIcon" src="' + JS_DIR_IMAGES + 'global/content/' + OptionID.toLowerCase() + '.png" alt="World Location" /><br/>');
    }
    document.write('<input type="radio" name="' + GroupID + '" id="' + OptionID + '" onClick="UpdateServerList(this)" value="' + Value + '" />' + Label + '</label></div>');
}
function GetActiveFilterOption(GroupID) {
    for (var key in Options) {
        if (Options[key].GroupID == GroupID && document.getElementById(key).checked) {
            return Options[key].Value;
        }
    }
    return '';
}
function SelectWorld(World) {
    var Option = document.getElementById(GetServerOptionId(World));
    if (Option != null) {
        Option.checked = 'checked';
        if (document.getElementById('suggested_world_div') != null) {
            var SuggestedWorldDiv = document.getElementById('suggested_world_div');
            SuggestedWorldDiv.innerHTML = World;
        }
    }
}
function SelectRandomWorld() {
    var AvailableServers = GetSelectableServers();
    var RandomServerIndex = Math.floor(Math.random() * (AvailableServers.length));
    if (RandomServerIndex < 0 || RandomServerIndex > AvailableServers.length)
        RandomServerIndex = 0;
        SelectWorld(AvailableServers[RandomServerIndex]);
}
function ClearServerList() {
    WorldsBox = document.getElementById("world_list_tr");
    while (WorldsBox.firstChild != null) {
        WorldsBox.removeChild(WorldsBox.firstChild);
    }
}
function GetSelectableServers() {
    var ServerTypeButton = 'REG';
    if (document.getElementById('filterbox_servertype') != null) {
        ServerTypeButton = GetActiveFilterOption("server_type");
    }
    var LocationButton = GetActiveFilterOption("server_location");
    var PvpTypeButton = GetActiveFilterOption("server_pvp_type");
    MatchedServers = new Array();
    for (var key in ServerList) {
        if (ServerTypeButton == 'REG' && ServerList[key][4] == 0) {
            if ((LocationButton == ServerList[key][1] || LocationButton == 'all') && (PvpTypeButton == ServerList[key][2] || PvpTypeButton == 'all')) {
                MatchedServers.push(ServerList[key][0]);
            }
        } else if (ServerTypeButton == 'DEV' && ServerList[key][4] > 0) {
            if ((LocationButton == ServerList[key][1] || LocationButton == 'all')) {
                MatchedServers.push(ServerList[key][0]);
            }
        } else if (ServerTypeButton == 'BE' && ServerList[key][6] > 0) {
            if ((LocationButton == ServerList[key][1] || LocationButton == 'all') && (PvpTypeButton == ServerList[key][2] || PvpTypeButton == 'all')) {
                MatchedServers.push(ServerList[key][0]);
            }
        }
    }
    return MatchedServers;
}
function GetServerByName(ServerName) {
    for (var Index in ServerList) {
        if (ServerList[Index][0] == ServerName) {
            return ServerList[Index];
        }
    }
    return null;
}
function UpdateServerList(a_Caller, PreselectWorld) {
    ClearServerList();
    l_BRA_Exception = false;
    if (document.getElementById('option_server_location_BRA').checked == true) {
        l_BRA_Exception = true;
    } else if (a_Caller != null && a_Caller.id != undefined && a_Caller.id == 'option_server_location_BRA') {
            l_BRA_Exception = true;
        }
    if (l_BRA_Exception == true) {
        //$('#option_server_pvp_type_hardcore').prop('disabled', true);
        //$('#option_server_pvp_type_hardcore_label').css('color', 'grey');
    if ($('#option_server_pvp_type_hardcore').prop('checked') == false && $('#option_server_pvp_type_open').prop('checked') == false && $('#option_server_pvp_type_optional').prop('checked') == false && $('#option_server_pvp_type_retro').prop('checked') == false && $('#option_server_pvp_type_retrohardcore').prop('checked') == false) { $('#option_server_pvp_type_optional').prop('checked', true) }
} else {
    //$('#option_server_pvp_type_hardcore').prop('disabled', false);
    //$('#option_server_pvp_type_hardcore_label').css('color', '#5A2800');
}
    var MatchedServers = GetSelectableServers();
    if (MatchedServers.length > 0) {
        WorldsBox.disabled = '';
    }
    var MAX_NUM_COLUMNS = 3;
    var MAX_ONE_COLUMN_LENGTH = 5;
    var NumServers = MatchedServers.length;
    var NumColumns; var NumRows;
    if (Math.floor(NumServers / MAX_ONE_COLUMN_LENGTH) <= MAX_NUM_COLUMNS) {
        NumColumns = Math.ceil(NumServers / MAX_ONE_COLUMN_LENGTH);
        NumRows = MAX_ONE_COLUMN_LENGTH;
    } else {
        NumColumns = MAX_NUM_COLUMNS;
        NumRows = Math.ceil(NumServers / NumColumns);
    }
    for (var Col = 0; Col < NumColumns; ++Col) {
        TableCell = document.createElement('td');
        TableCell.setAttribute('style', 'border-style: none');
        TableCell.align = 'center';
        WorldsBox.appendChild(TableCell);
        for (var Row = 0; Row < NumRows; ++Row) {
            var ServerIndex = Row + Col * NumRows; if (ServerIndex < NumServers) {
                var Radio = '<input type="radio" name="world" id="' + GetServerOptionId(MatchedServers[ServerIndex]) + '" value="' + GetServerOptionId(MatchedServers[ServerIndex]) + '" /> '; var Label = '<label for="' + GetServerOptionId(MatchedServers[ServerIndex]) + '" >' + MatchedServers[ServerIndex] + '</label>'; var AdditionalInfo = ''; var Additional = GetServerByName(MatchedServers[ServerIndex]); var l_AdditionalInfoDiv = ''; var l_AdditionalInfoDivBattlEye = ''; if (Additional[3] > 0) { var l_AdditionalInfoImage = '<img style="border:0px;" src="' + JS_DIR_IMAGES + 'global/content/info.gif" alt="special offer" />'; var l_AdditionalInfoHeadline = '<b>Premium game world:</b>'; var l_AdditionalInfoText = ''; l_AdditionalInfoText += '<p>'; l_AdditionalInfoText += 'This game world is for premium players only.'; l_AdditionalInfoText += '</p>'; l_AdditionalInfoDiv = '<span style="position:relative;top:0px;margin-left:5px;" >' + BuildHelperDivLink(GetServerOptionId(MatchedServers[ServerIndex]) + '_helper', l_AdditionalInfoImage, l_AdditionalInfoHeadline, l_AdditionalInfoText, 'premiumserver'); l_AdditionalInfoDiv += '<span id="' + GetServerOptionId(MatchedServers[ServerIndex]) + '_helper" ></span></span>'; }
                if (Additional[4] > 0) {
                    var l_AdditionalInfoImage = '<img style="border:0px;" src="' + JS_DIR_IMAGES + 'global/content/info.gif" alt="special offer" />';
                    var l_AdditionalInfoHeadline = '<b>Experimental game world:</b>';
                    var l_AdditionalInfoText = '<p>Experimental game worlds are special game worlds that are sometimes used by CipSoft as proving grounds for new features or other tests.</p>'; l_AdditionalInfoText += '<p>Characters on these game worlds can be played normally, though they may be affected by restrictions if tests take place.</p>'; l_AdditionalInfoText += '<p>Experimental game worlds are locked. This means characters from all game worlds can move there, however, from a locked game world, characters can only move to another locked one.</p>'; l_AdditionalInfoText += '<p>For details on experimental game worlds please see the corresponding manual section.</p>'; l_AdditionalInfoDiv = '<span style="position:relative;top:0px;margin-left:5px;" >' + BuildHelperDivLink(GetServerOptionId(MatchedServers[ServerIndex]) + '_helper', l_AdditionalInfoImage, l_AdditionalInfoHeadline, l_AdditionalInfoText, 'experimentalserver'); l_AdditionalInfoDiv += '<span id="' + GetServerOptionId(MatchedServers[ServerIndex]) + '_helper" ></span></span>'; }
                if (Additional[5] > 0) {
                    var l_AdditionalInfoImage = '';
                    var l_AdditionalInfoHeadline = '<b>Staff Present in Game World</b>';
                    var l_AdditionalInfoText = ''; if (Additional[6] > 0) {
                        l_AdditionalInfoImage += '<image style="border:0px;" src="' + JS_DIR_IMAGES + 'global/content/icon_battleyeinitial.gif" />';
                        l_AdditionalInfoText += '<p>On this game world, Staff blocks cheats from the game. The game world has been protected by Staff since its release.</p>';
                        l_AdditionalInfoDivBattlEye += '<span style="position:relative;top:0px;margin-left:5px;" >' + BuildHelperDivLink(GetServerOptionId(MatchedServers[ServerIndex]) + '_helper2', l_AdditionalInfoImage, l_AdditionalInfoHeadline, l_AdditionalInfoText, 'battleye'); l_AdditionalInfoDivBattlEye += '<span id="' + GetServerOptionId(MatchedServers[ServerIndex]) + '_helper2" ></span></span>';
                    } else {
                        l_AdditionalInfoImage += '<img style="border:0px;" src="' + JS_DIR_IMAGES + 'global/content/icon_battleye.gif" alt="special offer" />';
                        l_AdditionalInfoText += '<p>On this game world, Staff blocks cheats from the game. The game world has been protected by Staff since its release.';
                        l_AdditionalInfoDivBattlEye += '<span style="position:relative;top:0px;margin-left:5px;" >' + BuildHelperDivLink(GetServerOptionId(MatchedServers[ServerIndex]) + '_helper2', l_AdditionalInfoImage, l_AdditionalInfoHeadline, l_AdditionalInfoText, 'battleye'); l_AdditionalInfoDivBattlEye += '<span id="' + GetServerOptionId(MatchedServers[ServerIndex]) + '_helper2" ></span></span>'; }
                }
                var RadioDiv = '<div style="width: 15em; position: relative; text-align: left;" >' + Radio + Label + l_AdditionalInfoDiv + l_AdditionalInfoDivBattlEye + '</div>'; TableCell.innerHTML += RadioDiv;
            } else {
                TableCell.innerHTML += "\u00A0" + '<br />';
            }
        }
    }
    if (PreselectWorld != undefined) {
        SelectWorld(PreselectWorld);
    } else {
        SelectRandomWorld();
    }
    if (document.getElementById('filterbox_servertype') != null) {
        if (document.getElementById('option_server_type_DEV').checked == true) {
            document.getElementById('filterbox_pvp').style.display = 'none';
            document.getElementById('development_server_warning').style.display = 'block';
        } else {
            document.getElementById('filterbox_pvp').style.display = 'block';
            document.getElementById('development_server_warning').style.display = 'none';
        }
    }
}
function OpenSuggestNameWindow() {
    window.open(JS_DIR_ACCOUNT + "content/newaccount/suggestname.php?subtopic=subscription", "SuggestName", "width=580px, height=480px, scrollbars=yes");
}
var g_TournamentServerType = 'NotRestricted';
var g_Location = 'EUR';
function SetTournamentServerType(a_TournamentServerType) {
    g_TournamentServerType = a_TournamentServerType;
    $('.GameWorld').hide(); $('.GameWorld input').prop('disabled', true);
    $('.' + g_Location + '.' + a_TournamentServerType).show();
    $('.' + g_Location + '.' + a_TournamentServerType + ' input').prop('disabled', false);
}
function SetLocation(a_Location) {
    g_Location = a_Location;
    $('.GameWorld').hide();
    $('.GameWorld input').prop('disabled', true);
    $('.' + a_Location + '.' + g_TournamentServerType).show();
    $('.' + a_Location + '.' + g_TournamentServerType + ' input').prop('disabled', false);
}
