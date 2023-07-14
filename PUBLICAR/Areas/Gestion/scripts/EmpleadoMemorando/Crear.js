/**
 * 
 * @param {any} jqXHR
 * @param {any} settings
 */
var FILE = null;

function OnBeginCrearEmpleadoMemorando(jqXHR, settings) {
    if (FILE == null) { Utils._BuilderMessage("danger", "El Campo Memorando es Obligatorio."); return false;}
    var data = $(this).serializeObject();
    data['Memorando'] = FILE;
    settings.data = jQuery.param(data);
    return true;
}

function OnCompleteCrearEmpleadoMemorando(response) {
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