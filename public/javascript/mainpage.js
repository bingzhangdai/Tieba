const setactive = () => {
    $('#signbutton').addClass('active');
};

const setinactive = () => {
    $('#signbutton').removeClass('active');
};

var globalpage = 1;
var maxpage;

$(document).ready(() => {
    $.get('ajax/username').done((data) => {
        $('.header .text-muted').text('Welcome ' + data);
    });
    $.get('ajax/maxpage').done((count) => {
        maxpage = Math.ceil(count / 7);
        if (count == 0) {
            maxpage = 1;
        }
        let button = document.createElement('li');
        button.innerHTML = '<a href="javascript:void(0)" onclick="getabstract(globalpage-1)">Prev</a>'
        $('.pagination')[0].appendChild(button)
        for (let i = 0; i < maxpage; i++) {
            let button = document.createElement('li');
            button.innerHTML = '<a href="javascript:void(0)" onclick="getabstract(' + (i + 1) + ')">' + (i + 1) + '</a>'
            $('.pagination')[0].appendChild(button)
        }
        button = document.createElement('li');
        button.innerHTML = '<a href="javascript:void(0)" onclick="getabstract(globalpage+1)">Next</a>'
        $('.pagination')[0].appendChild(button);
        getabstract(globalpage);
    });
});

var check = () => {
    if ($('#title').val() == '' || $('#content').val() == '') {
        $('#blank').html('<div class="alert alert-dismissable alert-warning">\
            <button class="close" type="button" data-dismiss="alert">×</button>\
            <strong>Be aware:</strong> you should fill all the blanks.\
          </div>')
        return false;
    }
    return true;
}

function getabstract(page) {
    let oripage = page;
    page = page < 1 ? 1 : page > maxpage ? maxpage : page;
    globalpage = page;
    if (oripage < 1 || oripage > maxpage)
        return;
    // d3.selectAll('li').attr('class', '');
    $('.pagination li').removeClass('active');
    $($('.pagination li')[page]).addClass('active');
    $.get('ajax/getabstract', {'page': page}).done((d) => {
        $('#abstract').html('');
        var abstract = d3.select('#abstract')
            .selectAll('blockquote')
            .data(d);
        var blockquote = abstract.enter()
            .append('blockquote');
        blockquote.append('p').append('a')
            .attr('title', 'open the link to reply')
            .attr('href', (d) => {
                return 'reply?id=' + d._id;
            })
            .text((d) => {
                return d.title + ': ' + d.content;
            })
        blockquote.append('small')
            .text((d) => {
                return 'By ' + d.user;
            })
            .append('cite')
            .text((d) => {
                return ' (' + new Date(d.time).toLocaleString() + ')';
            })
        abstract.exit().remove();
            
    });
}

