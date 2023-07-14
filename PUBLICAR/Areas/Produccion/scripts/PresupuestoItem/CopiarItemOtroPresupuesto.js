var CopiarItemOtroPresupuesto = {
    $TABLA_PRESUPUESTOS: null,
    PRESUPUESTO_ID: null,
    $TABLA_ITEMS: null,
    ITEMS: [],
    EMPRESA_ID: null,
    CLIENTE_ID: null,
    OnLoad: function () {
        $("#form_copiar_items_otro_presupuesto").submit(CopiarItemOtroPresupuesto.CrearTabla);
    },
    OnChangeEmpresa: function (e) {
        var empresaId = $(e).val();
        if (Validations._IsNull(empresaId)) {
            $("#ClienteId").prop("disabled", true);
            $("#OrdenTrabajoEstadoId").prop("disabled", true);
            $("#OrdenTrabajoId").prop("disabled", true);
            Utils._BuilderDropDown();
        } else {
            $("#ClienteId").prop("disabled", false);

            var url = URL_CLIENTE_POR_EMPRESA_LISTAR;
            var parametros = {
                empresaId: empresaId
            };

            Utils._GetDropDownList($("#ClienteId"), url, parametros);
        }
        Utils._BuilderDropDown();

        CopiarItemOtroPresupuesto.EMPRESA_ID = empresaId;
    },
    OnChangeCliente: function (e) {
        var clienteId = $(e).val();
        if (Validations._IsNull(clienteId)) {
            $("#OrdenTrabajoEstadoId").prop("disabled", false);
            $("#OrdenTrabajoId").prop("disabled", true);
        } else {
            $("#OrdenTrabajoEstadoId").prop("disabled", false);
        }
        Utils._BuilderDropDown();

        CopiarItemOtroPresupuesto.CLIENTE_ID = clienteId;
    },
    OnChangeOrdenTrabajoEstado: function (e) {
        var ordenTrabajoEstadoId = $(e).val();
        if (Validations._IsNull(ordenTrabajoEstadoId)) {
            $("#OrdenTrabajoId").prop("disabled", true);
        } else {
            $("#OrdenTrabajoId").prop("disabled", false);
            var url = URL_ORDEN_TRABAJO_POR_EMPRESA_CLIENTE_ESTADO_LISTAR;
            var parametros = {
                empresaId: CopiarItemOtroPresupuesto.EMPRESA_ID,
                clienteId: CopiarItemOtroPresupuesto.CLIENTE_ID,
                estadoId: ordenTrabajoEstadoId
            };

            Utils._GetDropDownList($("#OrdenTrabajoId"), url, parametros);
        }
        Utils._BuilderDropDown();
    },
    CrearTabla: function () {
        if (CopiarItemOtroPresupuesto.$TABLA_PRESUPUESTOS != null)
            CopiarItemOtroPresupuesto.$TABLA_PRESUPUESTOS.destroy();

        var empresaId = CopiarItemOtroPresupuesto.EMPRESA_ID;
        var clienteId = CopiarItemOtroPresupuesto.CLIENTE_ID;
        var estadoOrdenTrabajoId = $("#OrdenTrabajoEstadoId").val();
        var ordenTrabajoId = $("#OrdenTrabajoId").val();

        var filtro = $("#search_copiar_items_otro_presupuesto").val();

        CopiarItemOtroPresupuesto.$TABLA_PRESUPUESTOS = $("#tabla_copiar_items_otro_presupuesto_presupuestos").DataTable({
            "ajax": {
                "url": URL_PRESUPUESTO_LISTAR,
                "type": "POST",
                "data": function (d) {
                    d.search["value"] = filtro;
                    d.empresaId = CopiarItemOtroPresupuesto.EMPRESA_ID;;
                    d.clienteId = CopiarItemOtroPresupuesto.CLIENTE_ID;;
                    d.estadoOrdenTrabajoId = estadoOrdenTrabajoId;
                    d.ordenTrabajoId = ordenTrabajoId;
                    return $.extend({}, d, {
                        "adicional": {}
                    });
                }
            },
            "columns": [
                {
                    "data": "Id",
                    "orderable": false,
                    "searchable": false,
                    "width": "5%",
                    "render": function (data, type, full, meta) {
                        return '<div class="container-radio">' +
                            '<input type="radio" name="radio_item_otro_presupuesto" id="radio_item_otro_presupuesto_' + data + '" onclick="CopiarItemOtroPresupuesto.CrearTablaItems(' + data + ', ' + full.VersionId + ')">' +
                            '<label for="radio_item_otro_presupuesto_' + data + '"></label>' +
                            '</div>';
                    }
                },
                { "data": "Id", },
                { "data": "VersionInterna" },
                { "data": "VersionExterna" },
                { "data": "Referencia" },
                { "data": "Cliente" },
                { "data": "Producto" }
            ],
        });
        return false;
    },
    CrearTablaItems: function (presupuestoId, versionId) {
        if (CopiarItemOtroPresupuesto.$TABLA_ITEMS != null)
            CopiarItemOtroPresupuesto.$TABLA_ITEMS.destroy();

        CopiarItemOtroPresupuesto.ITEMS = [];

        CopiarItemOtroPresupuesto.$TABLA_ITEMS = $("#tabla_copiar_items_otro_presupuesto_presupuestos_items").DataTable({
            "destroy": true,
            "ajax": {
                "url": URL_PRESUPUESTO_ITEM_LISTAR,
                "type": "POST",
                "data": function (d) {
                    //d.search["value"] = $filtro.val();
                    d.presupuestoId = presupuestoId;
                    d.presupuestoVersionId = versionId;
                    return $.extend({}, d, {
                        "adicional": {}
                    });
                }
            },
            "columns": [
                {
                    "data": "Id",
                    "orderable": false,
                    "searchable": false,
                    "width": "5%",
                    "render": function (data, type, full, meta) {
                        return '<div class="container-checkbox">' +
                            '<input type="checkbox" id="checkbox_item_otro_presupuesto_' + data + '" value="' + data + '" onclick="CopiarItemOtroPresupuesto.SeleccionarItem(this)">' +
                            '<label for="checkbox_item_otro_presupuesto_' + data + '"></label>' +
                            '</div>';
                    }
                },
                { "data": "Orden", },
                { "data": "Grupo" },
                { "data": "Nombre" },
                { "data": "DescripcionInterna" },
                { "data": "Dias" },
                { "data": "Cantidad" },
                { "data": "ValorUnitarioInterno" },
                { "data": "SubTotalInterno" }
            ],
        });
    },
    SeleccionarItem: function (e) {
        var id = $(e).val();
        var existe = false;
        var cantidadItems = CopiarItemOtroPresupuesto.ITEMS.length;

        if ($(e).is(":checked")) {
            for (var i = 0; i < cantidadItems; i++) {
                if (CopiarItemOtroPresupuesto.ITEMS[i] == id) {
                    exite = true;
                    return false;
                }
            }
            if (!existe)
                CopiarItemOtroPresupuesto.ITEMS.push(id);
        } else {
            for (var i = 0; i < cantidadItems; i++) {
                if (CopiarItemOtroPresupuesto.ITEMS[i] == id) {
                    exite = true;
                    CopiarItemOtroPresupuesto.ITEMS.splice(i, 1);
                    return false;
                }
            }
        }
    },
    CopiarItems: function () {
        var cantidadItems = CopiarItemOtroPresupuesto.ITEMS.length;
        if (cantidadItems <= 0) {
            Utils._BuilderMessage("warning", "Debe seleccionar al menos un item a copiar.");
            return false;
        }

        PresupuestoItemCrear.DuplicarItemsOtroPresupuesto(CopiarItemOtroPresupuesto.ITEMS);
    }
}