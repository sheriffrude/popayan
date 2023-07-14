/**
 * OnChangeEsSubProducto
 * @param {any} e
 */
function OnChangeEsSubProducto(e) {
    if ($(e).is(":checked"))
        $("#contenedor-producto").removeClass("hide");
    else
        $("#contenedor-producto").addClass("hide");
}

/**
 * OnChangeCrearCliente
 * @param {any} e
 * @param {any} urlProductos
 */
function OnChangeCrearCliente(e, urlProductos) {
    var id = $(e).val();
    var $elementListProductos = $("#ProductoId");

    if (Validations._IsNull(id)) {
        Utils._ClearDropDownList($elementListProductos);
    } else {
        var parameters = {
            id: id
        };
        Utils._GetDropDownList($elementListProductos, urlProductos, parameters);
    }
}

/**
 * OnChangeCrearProducto
 * @param {any} e
 */
function OnChangeCrearProducto(e) {
    if ($(e).is(":checked") === true) {
        $("#contenedor-producto").removeClass("hide");
        $("#contenedor-fee").addClass("hide");
    } else {
        $("#contenedor-producto").addClass("hide");
        $("#contenedor-producto").val(0);
        $("#contenedor-fee").removeClass("hide");
    }
}

/**
 * OnBeginCrearClienteProducto
 * @param {any} jqXHR
 * @param {any} settings
 */
function OnBeginCrearClienteProducto(jqXHR, settings) {
    if ($("#checkbox-es-subproducto").is(":checked")) {
        var subProducto = $("#ProductoId").val();
        if (Validations._IsNull(subProducto)) {
            Utils._BuilderMessage("danger", "Debe seleccionar un Producto.");
            return false;
        }
    }
    return true;
}

/**
 * OnCompleteCrearClienteProducto
 * @param {any} response
 */
function OnCompleteCrearClienteProducto(response) {
    var data = RequestHttp._ValidateResponse(response);
    if (data != null) {
        if (data.state == true) {
            Utils._BuilderMessage("success", data.message);
            Utils._CloseModal();
        } else
            Utils._BuilderMessage("danger", data.message);
        RecargarTablaClienteProductos();
    }
}
