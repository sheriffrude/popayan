var DATA_ITEMS = [];
var $TABLA_ITEMS = null;

$(function () {
    ConstruirTablaItems();
});

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
            error: function (request, status, error) {
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
                    var checked = (ExisteItem(data) == true) ? 'checked="checked"' : null;
                    return '<input type="checkbox" onchange="OnChangeCheckboxItem(this)" value="' + data + '" ' + checked + ' />';
                }
            },
            { "data": "Grupo" },
            { "data": "Nombre" },
            { "data": "Tipo" },

            {
                "data": "Id",
                "orderable": false,
                "searchable": false,
                "width": "5%",
                "render": function (data, type, full, meta) {
                    var valorMes = 0;
                    var longitudDataItems = DATA_ITEMS.length;
                    for (var i = 0; i < longitudDataItems; i++) {
                        if (DATA_ITEMS[i]['Id'] == data) {
                            valorMes = DATA_ITEMS[i]['ValorMes'];
                        }
                    }
                    var disabled = (ExisteItem(data) == true) ? null : 'disabled="disabled"';
                    return '<input type="text" class="form-control" name="input-valor-mes-item" value="' + valorMes + '" onkeyup="OnChangeValorMesItem(this)" data-item="' + data + '" ' + disabled + ' />';
                }
            }

        ],
        "drawCallback": function (settings) {
            //Utils._BuilderModal();
        }
    });
}

function ExisteItem(id) {
    var longitudDataItems = DATA_ITEMS.length;
    for (var i = 0; i < longitudDataItems; i++) {
        if (DATA_ITEMS[i]['Id'] == id)
            return true;
    }
    return false;
}

function OnChangeCheckboxItem(e) {
    var id = $(e).val();
    var disabled = true;
    var $valorMesItem = $(e).closest("tr").find("input[name='input-valor-mes-item']");

    if ($(e).is(":checked")) {
        AdicionarItem(id);
        disabled = false;
    } else {
        EliminarItem(id);
        $valorMesItem.val(0);
    }

    $valorMesItem.prop('disabled', disabled);
}

function AdicionarItem(id) {
    if (!ExisteItem(id)) {
        var item = {
            Id: id,
            ValorMes: 0
        };
        DATA_ITEMS.push(item);
    }
}

function EliminarItem(id) {
    var longitudDataItems = DATA_ITEMS.length;
    for (var i = 0; i < longitudDataItems; i++) {
        if (DATA_ITEMS[i]['Id'] == id) {
            DATA_ITEMS.splice(i, 1);
            return false;
        }
    }
}

function OnChangeValorMesItem(e) {
    
    var valorMes = $(e).val();
    console.log(valorMes);
    var id = $(e).attr("data-item");
    var longitudDataItems = DATA_ITEMS.length;

    for (var i = 0; i < longitudDataItems; i++) {
        if (DATA_ITEMS[i]['Id'] == id) {
            DATA_ITEMS[i]['ValorMes'] = valorMes;
            break;
        }
    }
}

function OnBeginCrearPresupuestoGeneral(jqXHR, settings) {
    var data = $(this).serializeObject();
    data["Items"] = DATA_ITEMS;
    settings.data = jQuery.param(data);
    return true;
}

function OnCompleteCrearPresupuestoGeneral(response) {
    var resultado = RequestHttp._ValidateResponse(response);
    if (resultado != null) {
        var tipoMensaje = "danger";
        if (resultado.state == true)
            tipoMensaje = "success";
        Utils._BuilderMessage(tipoMensaje, resultado.message);
    }
}