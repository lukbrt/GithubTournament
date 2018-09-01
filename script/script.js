const GITHUB_API_URL = 'https://api.github.com/users/';

let $players = $('#comparison').children('.player');
let $sendButton = $('#sendButton');
let firstNickname, secondNickname;

let comparatorObject = {
    firstUpdated: false,
    secondUpdated: false,
    firstUser: 0,
    secondUser: 0,
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

    if (firstNickname !== "")
    {
        appendScriptCode(firstNickname);
    }
    if (secondNickname !== "")
    {
        appendScriptCode(secondNickname);
    }

    let $form = $('.form-row');
    let $compareEl = $('#comparison');
    $form.hide().fadeOut(300);
    $compareEl.hide().slideDown(500, function () {
        $(this).fadeIn(400);
        $form.delay(500).fadeIn(800);
    });
    
});

function updateUserPosition(userJSON)
{
    let user = getUser(userJSON);
    let player;

    if (comparatorObject.firstUpdated && comparatorObject.secondUpdated)
    {
        comparatorObject.firstUpdated = comparatorObject.secondUpdated = false;
        comparatorObject.firstUser = comparatorObject.secondUser = 0;

        reset();
    }

    if (!comparatorObject.firstUpdated)
    {
        player = $players.get(0); //.childNodes
        comparatorObject.firstUpdated = true;
        comparatorObject.firstUser = user;
        $('#vs').css('transform', 'translate(-45%, -180%)');
    }
    else if(!comparatorObject.secondUpdated)
    {
        player = $players.get(1); //.childNodes
        comparatorObject.secondUpdated = true;
        comparatorObject.secondUser = user;

        comparatorObject.winner = determineWinner();
        markWinner();

        $('#vs').css('transform', 'translate(-48%, -210%)');
    }
    
    let $avatarEl = $(player).find('div.circle');
    $avatarEl.css({backgroundImage: 'url(' + user.avatar + ')'});
    let $loginEl = $(player).find('h2.nickname'); //$($(player).children('h2').get(0));
    $loginEl.text(user.login);
    let $descriptionEl = $(player).find('p.description');
    let description = '<strong>Public repositories</strong>: ' + user.publicRepos + '<br>';
    description += '<strong>Gists</strong>: ' + user.gists + '<br>';
    description += '<strong>Location</strong>: ' + user.loc;
    $descriptionEl.html(description);
}

function getUser(userJSON)
{
    // let privReposAmount = (typeof userJSON.data.total_private_repos === "undefined") ? 0 : userJSON.data.total_private_repos;
    let user = new User(userJSON.data.login, userJSON.data.avatar_url, userJSON.data.public_repos, userJSON.data.public_gists, userJSON.data.location);
    return user;
}

function appendScriptCode(nickname)
{
    let scriptCode = GITHUB_API_URL + nickname + '?callback=updateUserPosition';
    $('body').append('<script src="' + scriptCode + '"></script>');
}

function determineWinner()
{
    let firstScore = comparatorObject.firstUser.publicRepos + comparatorObject.firstUser.gists;
    let secondScore = comparatorObject.secondUser.publicRepos + comparatorObject.secondUser.gists;
    if (firstScore > secondScore)
    {
        return -1;
    }
    else if (firstScore < secondScore)
    {
        return 1;
    }
    else
    {
        return 0;
    }
}

//TODO
function markWinner()
{
    let winnerEl;
    $vs = $('#vs p');

    if (comparatorObject.winner === 1)
    {
        winnerEl = $players.get(1);
        $vs.css({
            backgroundImage: 'linear-gradient(105deg, aquamarine 0%, aquamarine 50%, #FFAE37 50%, #FFAE37 100%)'
        });
    }
    else if (comparatorObject.winner == -1)
    {
        winnerEl = $players.get(0);
        $vs.css({
            backgroundImage: 'linear-gradient(105deg, #FFAE37 0%, #FFAE37 50%, aquamarine 50%, aquamarine 100%)'
        });
        
    }

    $(winnerEl).find('h2.nickname').addClass('winner');

    $vs.css({border: 'none'});
}

function reset() 
{
    $('#vs p').css({
        borderRight: '3px solid rgba(0, 92, 46, .2)',
        borderTop: '3px solid rgba(0, 92, 46, .2)',
        backgroundImage: 'none'
    });

    $('h2.nickname').each(function(i) {
        let $currentEl = $(this);
        if ($currentEl.hasClass('winner'))
            $currentEl.removeClass('winner');
    })
}