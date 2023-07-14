/**
 * OnLoadRetirar
 */
function OnLoadRetirar() {
    $("#FechaRetiro").datepicker();
}

/**
 * OnCompleteRetirarEmpleado
 * @param {any} response
 */
function OnCompleteRetirarEmpleado(response) {
    var data = RequestHttp._ValidateResponse(response);
    if (data != null) {
        if (data.state) {
            Utils._BuilderMessage("success", data.message);
            Utils._CloseModal();
        } else
            Utils._BuilderMessage("danger", data.message);
        RecargarTablaEmpleado();
    }
}