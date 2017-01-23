const emoji1 = [
    '😀','😄','😂','😛','😗',
    '😒','😝','😜','😦','😉',
    '😠','😽','🙊','🙈','🐱',
    '🐰','🦎','🐟','🐙','🐚'
]

const emoji2 = [
    '👩','👳','👰','🙅','👭',
    '🎈','🎁','🎨','💎','🎵',
    '🍕','🍟','🥞','🥙','☕',
    '🚗','🚜','✈','🌍','🚦'
]

const emoji = (id, emoji) => {
    d3.select('#' + id)
        .selectAll('div')
        .data(emoji)
        .enter()
        .append('a')
        .attr('type', 'button')
        .attr('class', 'btn')
        .attr('onclick', (d) => {
            // either is okay
            return "$('#content').val($('#content').val()+'" + d + "')";
            // return 'putemoji("' + d + '")';
        })
        .text((d) => {
            return d;
        })
}

const putemoji = (emoji) => {
    $('#content').val($('#content').val() + emoji);
}

