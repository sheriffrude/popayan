/**
 * Object PresupuestoItemAsociadoEditar
 */
var PresupuestoItemAsociadoEditar = {

    /**
     * GuardarCambios
     */
    GuardarCambios: function () {
        if (PresupuestoItemAsociadoListar.LISTA_ITEMS_ASOCIADOS_MODIFICADOS.length == 0) {
            Utils._BuilderMessage("warning", "No ha realizado ningún cambio en los asociados del ítem.");
            return false;
        }

        var parametros = {
            presupuestoId: PresupuestoConsultar.PRESUPUESTO_ID,
            itemId: PresupuestoItemAsociadoListar.ITEM_ID,
            listaAsociados: PresupuestoItemAsociadoListar.LISTA_ITEMS_ASOCIADOS_MODIFICADOS
        };
        RequestHttp._Post(URL_LISTA_PRESUPUESTO_ITEM_ASOCIADOS_EDITAR, parametros, null, function (response) {
            if (!Validations._IsNull(response)) {
                if (response.state) {
                    Utils._BuilderMessage("success", response.message);
                    PresupuestoItemAsociadoListar.LISTA_ITEMS_ASOCIADOS_MODIFICADOS = [];

                    PresupuestoItemAsociadoListar.RecargarPaginaTabla();
                    PresupuestoItemListar.RecargarPaginaTabla();
                } else {
                    Utils._BuilderMessage("danger", response.message);
                }

            }
        });
    },

    /**
     * GuardarCambiosTemporales
     * @param {any} itemAsociadoId
     */
    GuardarCambiosTemporales: function (itemAsociadoId) {
        var impuestos = $("select.select_impuestos_item_asociado[data-item-asociado-id='" + itemAsociadoId + "']").val();
        impuestos = (impuestos == null) ? [] : impuestos;

        var existeItemAosciado = false;
        var data = {
            Id: itemAsociadoId,
            Nombre: $("input.input_nombre_item_asociado[data-item-asociado-id='" + itemAsociadoId + "']").val(),
            Descripcion: $("textarea.textarea_descripcion_item_asociado[data-item-asociado-id='" + itemAsociadoId + "']").val(),
            ProveedorId: $(".select_proveedor_item_asociado[data-item-asociado-id='" + itemAsociadoId + "']").val(),
            Dias: $("input.input_dias_item_asociado[data-item-asociado-id='" + itemAsociadoId + "']").val(),
            Cantidad: $("input.input_cantidad_item_asociado[data-item-asociado-id='" + itemAsociadoId + "']").val(),
            ValorUnitario: $("input.input_valor_unitario_item_asociado[data-item-asociado-id='" + itemAsociadoId + "']").formatPriceGetVal(),
            SubTotal: $("input.input_sub_total_item_asociado[data-item-asociado-id='" + itemAsociadoId + "']").formatPriceGetVal(),
            //Falta Porcentaje Anticipos
            Impuestos: impuestos,
            Volumen: $("input.input_volumen_item_asociado[data-item-asociado-id='" + itemAsociadoId + "']").val(),
            Costo: $("input.input_costo_item_asociado[data-item-asociado-id='" + itemAsociadoId + "']").formatPriceGetVal(),
        }

        for (var i = 0; i < PresupuestoItemAsociadoListar.LISTA_ITEMS_ASOCIADOS_MODIFICADOS.length; i++) {
            if (PresupuestoItemAsociadoListar.LISTA_ITEMS_ASOCIADOS_MODIFICADOS[i].Id == itemAsociadoId) {
                existeItemAosciado = true;
                PresupuestoItemAsociadoListar.LISTA_ITEMS_ASOCIADOS_MODIFICADOS[i] = data;
            }
        }

        if (!existeItemAosciado)
            PresupuestoItemAsociadoListar.LISTA_ITEMS_ASOCIADOS_MODIFICADOS.push(data);

        //if (AUTOGUARDADO)
        //    PresupuestoItemAsociadoEditar.GuardarCambios();

        PresupuestoItemAsociadoEditar.CalcularSubTotal(itemAsociadoId);
    },

    /**
     * OnKeyUpNombre
     * @param {any} e
     * @param {any} itemAsociadoId
     */
    OnKeyUpNombre: function (e, itemAsociadoId) {
        PresupuestoItemAsociadoEditar.GuardarCambiosTemporales(itemAsociadoId);
    },

    /**
     * OnKeyUpDescripcion
     * @param {any} e
     * @param {any} itemAsociadoId
     */
    OnKeyUpDescripcion: function (e, itemAsociadoId) {
        PresupuestoItemAsociadoEditar.GuardarCambiosTemporales(itemAsociadoId);
    },

    /**
     * OnChangeProveedor
     * @param {any} e
     * @param {any} itemAsociadoId
     */
    OnChangeProveedor: function (e, itemAsociadoId) {
        PresupuestoItemAsociadoEditar.GuardarCambiosTemporales(itemAsociadoId);
    },

    /**
     * OnKeyUpDias
     * @param {any} e
     * @param {any} itemAsociadoId
     */
    OnKeyUpDias: function (e, itemAsociadoId) {
        PresupuestoItemAsociadoEditar.GuardarCambiosTemporales(itemAsociadoId);
    },

    /**
     * OnKeyUpCantidad
     * @param {any} e
     * @param {any} itemAsociadoId
     */
    OnKeyUpCantidad: function (e, itemAsociadoId) {
        PresupuestoItemAsociadoEditar.GuardarCambiosTemporales(itemAsociadoId);
    },

    /**
     * OnKeyUpValorUnitario
     * @param {any} e
     * @param {any} itemAsociadoId
     */
    OnKeyUpValorUnitario: function (e, itemAsociadoId) {
        PresupuestoItemAsociadoEditar.GuardarCambiosTemporales(itemAsociadoId);
    },

    /**
     * OnChangeImpuestos
     * @param {any} e
     * @param {any} itemAsociadoId
     */
    OnChangeImpuestos: function (e, itemAsociadoId) {
        PresupuestoItemAsociadoEditar.GuardarCambiosTemporales(itemAsociadoId);
    },

    /**
     * CalcularsubTotal
     * @param {any} itemAsociadoId
     */
    CalcularSubTotal: function (itemAsociadoId) {
        var dias = $("input.input_dias_item_asociado[data-item-asociado-id='" + itemAsociadoId + "']").val();
        var cantidad = $("input.input_cantidad_item_asociado[data-item-asociado-id='" + itemAsociadoId + "']").val();
        var valorUnitario = $(".input_valor_unitario_item_asociado[data-item-asociado-id='" + itemAsociadoId + "']").formatPriceGetVal();

        var subTotal = (dias * cantidad * valorUnitario).toFixed(2);
        $("input.input_sub_total_item_asociado[data-item-asociado-id='" + itemAsociadoId + "']").val(subTotal).formatPrice();

        //Adiciona o actualiza el valor en el array PresupuestoItemAsociadoListar.LISTA_ITEMS_ASOCIADOS_MODIFICADOS
        var existeItemAsociado = false;
        for (var i = 0; i < PresupuestoItemAsociadoListar.LISTA_ITEMS_ASOCIADOS_MODIFICADOS.length; i++) {
            if (PresupuestoItemAsociadoListar.LISTA_ITEMS_ASOCIADOS_MODIFICADOS[i].Id == itemAsociadoId) {
                existeItemAsociado = true;
                PresupuestoItemAsociadoListar.LISTA_ITEMS_ASOCIADOS_MODIFICADOS[i].subTotal = subTotal;
            }
        }

        if (!existeItemAsociado) {
            var data = {
                Id: itemAsociadoId,
                SubTotal: subTotal
            }
            PresupuestoItemAsociadoListar.LISTA_ITEMS_ASOCIADOS_MODIFICADOS.push(data);
        }

        PresupuestoItemAsociadoEditar.CalcularCosto(itemAsociadoId);
    },

    /**
     * OnKeyUpVolumen
     * @param {any} e
     * @param {any} itemAsociadoId
     */
    OnKeyUpVolumen: function (e, itemAsociadoId) {
        PresupuestoItemAsociadoEditar.GuardarCambiosTemporales(itemAsociadoId);
    },

    /**
     * CalcularCosto
     * @param {any} itemAsociadoId
     */
    CalcularCosto: function (itemAsociadoId) {
        var subTotal = $("input.input_sub_total_item_asociado[data-item-asociado-id='" + itemAsociadoId + "']").formatPriceGetVal();
        var volumen = $("input.input_volumen_item_asociado[data-item-asociado-id='" + itemAsociadoId + "']").val();
        var costo = parseFloat(subTotal - (subTotal * (volumen / 100)));

        $("input.input_costo_item_asociado[data-item-asociado-id='" + itemAsociadoId + "']").val(costo).formatPrice();

        //Adiciona o actualiza el valor en el array LISTA_ITEMS_MODIFICADOS
        var existeItemAsociado = false;
        for (var i = 0; i < PresupuestoItemAsociadoListar.LISTA_ITEMS_ASOCIADOS_MODIFICADOS.length; i++) {
            if (PresupuestoItemAsociadoListar.LISTA_ITEMS_ASOCIADOS_MODIFICADOS[i].Id == itemAsociadoId) {
                existeItemAsociado = true;
                PresupuestoItemAsociadoListar.LISTA_ITEMS_ASOCIADOS_MODIFICADOS[i].costo = costo;
            }
        }

        if (!existeItemAsociado) {
            var data = {
                Id: itemAsociadoId,
                Costo: costo
            }
            PresupuestoItemAsociadoListar.LISTA_ITEMS_ASOCIADOS_MODIFICADOS.push(data);
        }
    },
}