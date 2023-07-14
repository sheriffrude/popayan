var ADICIONAR_ITEM = null;
var $TABLA_ITEMS = null;

function OnLoadAdicionarItem() {
    ConstruirTablaItems();
}

function OnChangeAnio(e, url) {
    var anio = $(e).val();
    if (anio > 0) {
        var parametros = {
            anio: anio
        }
        $.ajax({
            url: url,
            type: "POST",
            dataType: "json",
            data: parametros,
            complete: function (response) {
                var resultado = RequestHttp._ValidateResponse(response);
                if (resultado != null) {
                    if (resultado.state == true) {
                        if (resultado.data == true)
                            Utils._BuilderMessage('warning', resultado.message);
                    } else
                        Utils._BuilderMessage('danger', resultado.message);
                }
            },
            error: function(request, status, error) {
                Utils._BuilderMessage("danger", error);
            }
        });
    }
}

function RecargarTablaItems() {
    if ($TABLA_ITEMS != null)
        $TABLA_ITEMS.draw();
    return false;
}

function ConstruirTablaItems() {
    var $filtro = $("#input-filtro");
    $TABLA_ITEMS = $("#tabla-items").DataTable({
        "ajax": {
            "url": URL_LISTAR_PRESUPUESTO_GENERAL_ITEMS,
            "type": "POST",
            "data": function (d) {
                d.search['value'] = $filtro.val();
                return $.extend({}, d, {
                    "adicional": {}
                });
            },

        },
        "columns": [
            {
                "data": "Id",
                "orderable": false,
                "searchable": false,
                "width": "5%",
                "render": function (data, type, full, meta) {
                    return '<input type="radio" name="radio-item-id" onchange="SeleccionarItem(this)" value="' + data + '" />';
                }
            },
            { "data": "Grupo" },
            { "data": "Nombre" }

        ],
        "drawCallback": function (settings) {
        }
    });
}

function SeleccionarItem(e) {
    var id = $(e).val();
    if ($(e).is(":checked"))
        ADICIONAR_ITEM = id;
}

function OnBeginAdicionarItem(jqXHR, settings) {
    var data = $(this).serializeObject();

    if (ADICIONAR_ITEM == null) {
        Utils._BuilderMessage("warning", "Debe seleccionar un Item para continuar.");
        return false;
    }

    data["PresupuestoGeneralId"] = $("#PresupuestoGeneralId").val();
    data["ItemId"] = ADICIONAR_ITEM;
    settings.data = jQuery.param(data);
    return true;
}

function OnCompleteAdicionarItem(response) {
    var resultado = RequestHttp._ValidateResponse(response);
    if (resultado != null) {
        var tipoMensaje = "danger";
        if (resultado.state == true) {
            tipoMensaje = "success";
            ConsultarItemsPresupuesto();
            Utils._CloseModal();
        }
        Utils._BuilderMessage(tipoMensaje, resultado.message);
    }
}