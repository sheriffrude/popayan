var FILE = null;

$(function () {
    $("#FechaNacimiento").datepicker({ maxDate: '0' });
    $("#Foto").val('');
});

function UploadFile(e) {
    RequestHttp._UploadFile(e, URL_UPLOAD_FOTO, function (data) {
        if (data != null) {
            FILE = {
                'Name': data.Name,
                'Path': data.Path,
                'Url': data.Url
            };
            $("#content-foto > img").attr("src", data.Url);
            $("#content-foto").show();
        }
    });
}

function OnBeginCrearPersona(jqXHR, settings) {
    var data = $(this).serializeObject();
    if (FILE == null) {
        Utils._BuilderMessage('danger', 'La Foto es obligatoria.');
        return false;
    }
    data["Foto"] = FILE;
    settings.data = jQuery.param(data);
    return true;
}

function OnCompleteCrearPersona(response) {
    var resultado = RequestHttp._ValidateResponse(response);
    if (resultado != null) {
        if (resultado.state == true) {
            Utils._BuilderMessage('success', resultado.message, 'RedireccionarListarPersonas');
        } else
            Utils._BuilderMessage('danger', resultado.message);
    }
}

function RedireccionarListarPersonas() {
    window.location.href = URL_LISTAR_PERSONAS;
}