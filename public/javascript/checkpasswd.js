var warning = (() => {
    let warn = $('#warning');
    return {
        hide: () => {warn.hide(); return true;},
        show: () => {warn.show(); return false;}
    }
})();

window.onload = () => {
    warning.hide();
};

var check = () => {
    if ($('#password1').val() != $('#password2').val()) {
        return warning.show();
    }
    return true;
}