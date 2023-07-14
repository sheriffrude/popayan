/**
 * OnBeginCrearProspecto
 * @param {any} jqXHR
 * @param {any} settings
 */
function OnBeginEditarProspecto(jqXHR, settings) {
    var data = $(this).serializeObject();
    settings.data = jQuery.param(data);
    return true;
}

/**
 * OnCompleteCrearProspecto
 * @param {any} response
 */
function OnCompleteEditarProspecto(response) {
    var resultado = RequestHttp._ValidateResponse(response);
    if (resultado != null) {
        if (resultado.state == true)
        {
            Utils._BuilderMessage("success", resultado.message);
            RecargarTablaProspectos();
            Utils._CloseModal();
        }
        else
            Utils._BuilderMessage("danger", resultado.message);
    }
}