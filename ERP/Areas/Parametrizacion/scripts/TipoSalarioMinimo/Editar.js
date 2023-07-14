/**
 * 
 * @param {any} jqXHR
 * @param {any} settings
 */
function OnBeginEditarTipoSalarioMinimo(jqXHR, settings) {
    var data = $(this).serializeObject();
    var valor = $('#Ano').datepicker({ dateFormat: 'dd-mm-yy' }).val();
    data['Ano'] = "01/01/" + valor;
    settings.data = jQuery.param(data);
    return true;
}

function OnCompleteEditarTipoSalarioMinimo(response) {
    var resultado = RequestHttp._ValidateResponse(response);
    if (resultado != null) {
        var tipoMensaje = "danger";
        if (resultado.state == true) {
            tipoMensaje = "success"
            ResetearTablaTipoSalarioMinimo();
            Utils._CloseModal();
        }
        Utils._BuilderMessage(tipoMensaje, resultado.message);
    }
}