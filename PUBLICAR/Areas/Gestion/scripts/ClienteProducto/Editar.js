function onSuccessEditarClienteProducto() {
    setTimeout(function () {
        if ($TABLA_CLIENTE_PRODUCTO != null) {
            $TABLA_CLIENTE_PRODUCTO.draw();
        }
    }, 1000);
}

/**
 * OnCompleteCrearClienteProducto
 * @param {any} response
 */
function OnCompleteEditarClienteProducto(response) {
    var data = RequestHttp._ValidateResponse(response);
    if (data != null) {
        if (data.state == true) {
            Utils._BuilderMessage("success", data.message);
            Utils._CloseModal();
        } else
            Utils._BuilderMessage("danger", data.message);
        onSuccessEditarClienteProducto();
    }
}
