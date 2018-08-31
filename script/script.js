const GITHUB_API_URL = 'https://api.github.com/users/';

let $sendButton = $('#sendButton');
let firstNickname, secondNickname;

let comparatorObject = {
    firstUpdated: false,
    secondUpdated: false,
    winner: 0   //-1 => first, 0 => tie, 1 => seconod
};

function User(login, avatar, publicRepos, gists, loc)
{
    this.login = login;
    this.avatar = avatar;
    this.publicRepos = publicRepos;
    this.gists = gists;
    this.loc = loc;
}

$sendButton.on('click', (e) => {
    e.preventDefault();

    $users = $('.form-row input');
    firstNickname = $users.get(0).value;
    secondNickname = $users.get(1).value;
    // alert(firstNickname + "   " + secondNickname);
    // let newEl = document.createElement("p");
    // let txt = firstNickname + "    " + secondNickname;
    // newEl.appendChild(document.createTextNode(txt));
    // document.querySelector('.container').appendChild(newEl);
    // ******************

    appendScriptCode(firstNickname);
    appendScriptCode(secondNickname);
    
});

function updateUserPosition(userJSON)
{
    let user = getUser(userJSON);

    let $players = $('#comparison').children(); //.player
    let player;

    if (comparatorObject.firstUpdated && comparatorObject.secondUpdated)
    {
        comparatorObject.firstUpdated = comparatorObject.secondUpdated = false;
    }

    if (!comparatorObject.firstUpdated)
    {
        player = $players.get(0); //.childNodes
        comparatorObject.firstUpdated = true;
    }
    else if(!comparatorObject.secondUpdated)
    {
        player = $players.get(1); //.childNodes
        comparatorObject.secondUpdated = true;
    }
    // alert($players.get(0).childElementCount);
    
    let $avatarEl = $(player).find('div.circle');
    $avatarEl.css({backgroundImage: 'url(' + user.avatar + ')'});
    let $loginEl = $(player).find('h2.nickname'); //$($(player).children('h2').get(0));
    $loginEl.text(user.login);
    let $descriptionEl = $(player).find('p.description');
    let description = '<strong>Public repositories</strong>: ' + user.publicRepos + '<br>';
    description += '<strong>Gists</strong>: ' + user.gists + '<br>';
    description += '<strong>Location</strong>: ' + user.loc;
    $descriptionEl.html(description);

    // document.getElementsByClassName('nickname')[0].innerHTML = user.login;


}

function getUser(userJSON)
{
    // let privReposAmount = (typeof userJSON.data.total_private_repos === "undefined") ? 0 : userJSON.data.total_private_repos;
    let user = new User(userJSON.data.login, userJSON.data.avatar_url, userJSON.data.public_repos, userJSON.data.public_gists, userJSON.data.location);
    return user;
    // console.log(user);
    // console.log(userJSON.data);
}

function appendScriptCode(nickname)
{
    let scriptCode = GITHUB_API_URL + nickname + '?callback=updateUserPosition';
    $('body').append('<script src="' + scriptCode + '"></script>');
}