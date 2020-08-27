
$("form").submit(function () {
    var formID = $(this).attr('id');
    var formNm = $('#' + formID);

    $.ajax({
        type: "POST",
        url: 'mail.php',
        data: formNm.serialize(),
        success: function (data) {
            $('#'+formID)[0].reset();
            $('#'+formID +' .result').html("Your message has been sent. Thank :)");
        },
        error: function (jqXHR, text, error) {
            $(formNm).html(error);
        }
    });
    return false;
});