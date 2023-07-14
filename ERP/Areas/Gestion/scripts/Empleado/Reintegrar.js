/**
 * OnLoadReintegrar
 */
function OnLoadReintegrar() {
    $("#FechaReintegro").datepicker();
}

/**
 * OnCompleteReintegrarEmpleado
 * @param {any} response
 */
function OnCompleteReintegrarEmpleado(response) {
    var data = RequestHttp._ValidateResponse(response);
    if (data != null) {
        if (data.state) {
            Utils._BuilderMessage("success", data.message);
            Utils._CloseModal();
        }
        else
            Utils._BuilderMessage("danger", data.message);
        RecargarTablaEmpleado();
    }
}