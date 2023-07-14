/**
 * 
 * @param {any} jqXHR
 * @param {any} settings
 */
var FILE = null;

function OnBeginEditarEmpleadoMemorando(jqXHR, settings) {
    var valor = Number($("#IdMemorando").val());
    if (FILE == null && valor == 0) {
        Utils._BuilderMessage("danger", "El Campo Memorando es Obligatorio.");
        return false;
    }

    if (FILE == null) {
        FILE = {
            'Name': "",
            'Path': "",
            'OriginalName': "",
            'Type': ""
        };
    }

    var data = $(this).serializeObject();
    data['Memorando'] = FILE;
    settings.data = jQuery.param(data);
    return true;
}

function OnCompleteEditarEmpleadoMemorando(response) {
    var resultado = RequestHttp._ValidateResponse(response);
    if (resultado != null) {
        {
            var tipoMensaje = "danger";
            if (resultado.state == true) {
                tipoMensaje = "success"
                ResetearTablaEmpleadoMemorando();
                Utils._CloseModal();
            }
            Utils._BuilderMessage(tipoMensaje, resultado.message);
        }
    }
}

function SubirArchivo(e) {
    RequestHttp._UploadFile(e, URL_SUBIR_ARCHIVOS_TEMP, function (result) {
        if (result != null) {
            FILE = {
                'Name': result.Name,
                'Path': result.Path,
                'OriginalName': result.OriginalName,
                'Type': result.Type
            };
        }
    });
}

function cambiarArchivo(e) {
    document.getElementById('archivoParaSubir').style.display = 'block';
    document.getElementById('archivoCargado').style.display = 'none';
    $("#IdMemorando").val(0);
}