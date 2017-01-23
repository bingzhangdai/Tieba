var globalpage;
var maxpage;
var username;

$(document).ready(() => {
    $.get('ajax/title').done((data) => {
        $('.header .text-muted').text('Reply to: ' + data);
    });
    $.get('ajax/maxposts').done((count) => {
        maxpage = Math.ceil(count / 5);
        if (count == 0) {
            maxpage = 1;
        }
        globalpage = maxpage
        let button = document.createElement('li');
        button.innerHTML = '<a href="javascript:void(0)" onclick="getabstract(globalpage-1)">Prev</a>'
        $('.pagination')[0].appendChild(button)
        for (let i = 0; i < maxpage; i++) {
            let button = document.createElement('li');
            button.innerHTML = '<a href="javascript:void(0)" onclick="getabstract(' + (i + 1) + ')">' + (i + 1) + '</a>'
            $('.pagination')[0].appendChild(button);
        }
        button = document.createElement('li');
        button.innerHTML = '<a href="javascript:void(0)" onclick="getabstract(globalpage+1)">Next</a>'
        $('.pagination')[0].appendChild(button);
        getabstract(globalpage);
    });
    $(function () { $(".popover-options a").popover({
        html: true,
        placement: 'top'
        // trigger: 'hover'
    });});
    $.get('ajax/username').done((name) => {
        username = name;
    });
});

var check = () => {
    if ($('#content').val() == '') {
        $('#blank').html('<div class="alert alert-dismissable alert-warning">\
            <button class="close" type="button" data-dismiss="alert">×</button>\
            <strong>Be aware:</strong> reply cannot be empty.\
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
    $.get('ajax/getpost', {'page': page}).done((d) => {
        $('#abstract').html('');
        var abstract = d3.select('#abstract')
            .selectAll('blockquote')
            .data(d);
        var blockquote = abstract.enter()
            .append('blockquote');
        blockquote.append('p')
            .html((d) => {
                return d.content
                        .replace(/ /g, '&nbsp;')
                        .replace(/</g, '&lt;')
                        .replace(/>/g, '&gt;')
                        .replace(/\n/g, '\<br\>');
            })
            .append('a')
            .attr('class', 'btn btn-sm')
            .attr('style', 'float: right')
            .attr('type', 'button')
            // .attr('onclick', (d) => {
            //     return "deletepost('" + d._id + "')";
            // })
            .attr('href', (d) => {
                return "delete?id=" + d._id;
            })
            .text((d) => {
                let res = "";
                if (d.user == username) {
                    res = "delete"
                }
                return res;
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

var deletepost = (id) => {
    console.log(id)
}