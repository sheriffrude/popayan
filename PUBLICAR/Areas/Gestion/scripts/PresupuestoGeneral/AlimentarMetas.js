var DATA_MESES = [
    {
        Id: 1,
        Nombre: 'Enero'
    },
    {
        Id: 2,
        Nombre: 'Febrero'
    },
    {
        Id: 3,
        Nombre: 'Marzo'
    },
    {
        Id: 4,
        Nombre: 'Abril'
    },
    {
        Id: 5,
        Nombre: 'Mayo'
    },
    {
        Id: 6,
        Nombre: 'Junio'
    },
    {
        Id: 7,
        Nombre: 'Julio'
    },
    {
        Id: 8,
        Nombre: 'Agosto'
    },
    {
        Id: 9,
        Nombre: 'Septiembre'
    },
    {
        Id: 10,
        Nombre: 'Octubre'
    },
    {
        Id: 11,
        Nombre: 'Noviembre'
    },
    {
        Id: 12,
        Nombre: 'Diciembre'
    }
];

var CANTIDAD_UNIDADES_NEGOCIO = 0;
var CANTIDAD_EMPRESAS = 0;
var PAGINA = 0;
var INICIA = true;

$(function () {
    ConsultarItemsPresupuesto();
});

function ConsultarItemsPresupuesto() {
    $(".tr-grupo, .tr-item").remove();
    $.ajax({
        url: URL_LISTAR_ITEMS_METAS,
        type: "POST",
        dataType: "json",
        complete: function (response) {
            var resultado = RequestHttp._ValidateResponse(response);
            if (resultado != null) {
                if (resultado.state == true) {
                    ConstruirItems(resultado.data);

                    if (INICIA) {
                        ConstruirHeaderMeses();
                        INICIA = false;
                    }
                }
            }
        },
        error: function (request, status, error) {
            Utils._BuilderMessage("danger", error);
        }
    });
}

function ConstruirHeaderMeses() {
    var longitudMeses = DATA_MESES.length;

    for (var i = 1; i <= longitudMeses; i++) {
        var mes = DATA_MESES[i - 1];
        var htmlMes = '<th colspan="6" class="text-center th-titulo" data-mes="' + i + '">' + mes.Nombre + '</th>';
        $("#tabla-alimentar thead tr.tr-titulos").append(htmlMes);

        var subTituloMes = '<th class="text-center th-titulo presupuestado" data-mes="' + i + '">Presupuestado</th>' +
            '<th class="text-center th-titulo presupuestado" data-mes="' + i + '">%</th>' +
            '<th class="text-center th-titulo pagado" data-mes="' + i + '">Pagado</th>' +
            '<th class="text-center th-titulo pagado" data-mes="' + i + '">%</th>' +
            '<th class="text-center th-titulo diferencia" data-mes="' + i + '">Diferencia</th>' +
            '<th class="text-center th-titulo diferencia" data-mes="' + i + '">%</th>';
        $("#tabla-alimentar thead tr.tr-sub-titulos").append(subTituloMes);
    }
}

function ConstruirItems(data) {
    var $tabla_tbody = $("#tabla-alimentar tbody");

    $tabla_tbody.html("");

    var longitudGrupos = data.length;
    var totalItemsMes = 0;
    var longitudMeses = DATA_MESES.length;

    for (var i = 0; i < longitudGrupos; i++) {
        var grupo = data[i];
        var html = '<tr class="tr-grupo">' +
            '<td colspan="3">' + grupo.Nombre + '</td>' +
            '<td>' +
            '<div class="input-group">' +
            '<input type="text" value="100" class="form-control porcentaje" readonly="readonly">' +
            '<label class="input-group-addon">%</label>' +
            '</div>' +
            '</td>';

        for (var j = 1; j <= longitudMeses; j++) {
            html += '<td colspan="6" data-mes="' + i + '">' + grupo.Nombre + '</td>';
        }

        html += "</tr>";

        $tabla_tbody.append(html);

        var items = grupo.Items;
        var longitudItems = items.length;

        var totalItemMes = 0;
        ///Totalizar
        for (var j = 0; j < longitudItems; j++) {
            var item = items[j];
            totalItemMes = (totalItemMes + parseInt(item.ValorMes));
        }

        //Dibujar
        for (var j = 0; j < longitudItems; j++) {
            var item = items[j];
            var valorAnio = (parseInt(item.ValorMes) * 12);
            var class100Porciento = (item.PorcentajeAcumulado != 100) ? "no-100-porciento" : "";
            totalItemsMes = (totalItemsMes + parseInt(item.ValorMes));

            var porcentajeItem = ((parseInt(item.ValorMes) * 100) / totalItemMes).toFixed(2);
            item.PorcentajeItem = porcentajeItem;

            html = '<tr class="tr-item">' +
                '<td>' + item.Nombre + '</td>' +
                '<td>' +
                '<div class="input-group">' +
                '<label class="input-group-addon">$</label>' +
                '<input type="text" class="form-control text-right" data-format-price value="' + item.ValorMes + '" readonly="readonly" />' +
                '</div>' +
                '</td>' +
                '<td>' +
                '<div class="input-group">' +
                '<label class="input-group-addon">$</label>' +
                '<input type="text" class="form-control text-right" data-format-price value="' + valorAnio + '" readonly="readonly" />' +
                '</div>' +
                '</td>' +
                '<td>' +
                '<div class="input-group">' +
                '<input type="text" value="' + porcentajeItem + '" class="form-control" readonly="readonly" />' +
                '<label class="input-group-addon">%</label>' +
                '</div>' +
                '</td>' +
                ConstruirAlimentacionMeses(item) +
                "</tr>";
            $tabla_tbody.append(html);
        }
    }

    $("#input-total-item-mes").val(totalItemsMes);
    $("#input-total-item-anio").val((totalItemsMes * 12));

    Utils._InputFormatPrice();
}

function ConstruirAlimentacionMeses(item) {
    var longitudMeses = DATA_MESES.length;
    var html = "";
    var valoresMeses = item.Meses;
    var valorItem = item.ValorMes;
    var itemId = item.Id;

    for (var i = 1; i <= longitudMeses; i++) {
        var mes = DATA_MESES[i - 1];
        var valorPagado = ConsultarValorMesItem(mes.Id, valoresMeses);
        var porcentajePagado = (parseInt(valorPagado) * 100 / parseInt(valorItem)).toFixed(2);
        var valorDiferencia = parseInt(valorItem) - parseInt(valorPagado);
        var porcentajeDiferencia = (parseInt(valorDiferencia) * 100 / parseInt(valorItem)).toFixed(2);

        var classValorPagado = 'valor-pagado-gris';
        if (valorDiferencia > 0)
            classValorPagado = 'valor-pagado-verde';
        else if (valorDiferencia < 0)
            classValorPagado = 'valor-pagado-rojo';


        html += '<td class="text-center" data-mes="' + i + '">' +
            '<div class="input-group">' +
            '<label class="input-group-addon">$</label>' +
            '<input type="text" class="form-control" value="' + valorItem + '" readonly="readonly" data-format-price data-valor-item data-mes="' + i + '" data-item="' + itemId + '" />' +
            '</div>' +
            '</td>' +
            '<td class="text-center" data-mes="' + i + '">' +
            '<div class="input-group">' +
            '<input type="text" class="form-control porcentaje" value="100" readonly="readonly" data-porcentaje-item data-mes="' + i + '" data-item="' + itemId + '" />' +
            '<label class="input-group-addon">%</label>' +
            '</div>' +
            '</td>' +
            '<td class="text-center" data-mes="' + i + '">' +
            '<div class="input-group">' +
            '<label class="input-group-addon">$</label>' +
            '<input type="text" class="form-control ' + classValorPagado + '" value="' + valorPagado + '" readonly="readonly" data-update="false" data-format-price onfocusin="OnFocusInValorPagado(this, event)" onfocusout="OnFocusOutValorPagado(this, event)" onkeyup="OnKeyUpValorPagado(this, event)" data-valor-pagado data-mes="' + i + '" data-item="' + itemId + '" />' +
            '</div>' +
            '</td>' +
            '<td class="text-center" data-mes="' + i + '">' +
            '<div class="input-group">' +
            '<input type="text" class="form-control porcentaje" value="' + porcentajePagado + '" readonly="readonly" data-porcentaje-pagado data-mes="' + i + '" data-item="' + itemId + '" />' +
            '<label class="input-group-addon">%</label>' +
            '</div>' +
            '</td>' +
            '<td class="text-center" data-mes="' + i + '">' +
            '<div class="input-group">' +
            '<label class="input-group-addon">$</label>' +
            '<input type="text" class="form-control ' + classValorPagado + ' " value="' + valorDiferencia + '" readonly="readonly" data-format-price data-valor-diferencia data-mes="' + i + '" data-item="' + itemId + '" />' +
            '</div>' +
            '</td>' +
            '<td class="text-center" data-mes="' + i + '">' +
            '<div class="input-group">' +
            '<input type="text" class="form-control porcentaje" value="' + porcentajeDiferencia + '" readonly="readonly" data-porcentaje-diferencia data-mes="' + i + '" data-item="' + itemId + '" />' +
            '<label class="input-group-addon">%</label>' +
            '</div>' +
            '</td>';
    }

    return html;
}

function ConsultarValorMesItem(mes, valoresMeses) {
    var valor = 0;
    var longitudValoresMeses = valoresMeses.length;
    for (var i = 0; i < longitudValoresMeses; i++) {
        if (valoresMeses[i].Mes == mes) {
            valor = valoresMeses[i].Valor;
            break;
        }
    }
    return valor;
}

function OnFocusInValorPagado(e, event) {
    event.preventDefault();
    event.stopPropagation();

    $(e).removeAttr('readonly');
}

function OnFocusOutValorPagado(e, event) {
    event.preventDefault();
    event.stopPropagation();

    $(e).attr('readonly', 'readonly');
}

function OnKeyUpValorPagado(e, event) {
    event.preventDefault();
    event.stopPropagation();

    $(e).attr("data-update", true);

    var itemId = $(e).attr("data-item");
    var mesId = $(e).attr("data-mes");

    var valorPagado = $(e).formatPriceGetVal();
    var valorItem = $('[data-valor-item][data-item=' + itemId + '][data-mes=' + mesId + ']').formatPriceGetVal();
    var valorDiferencia = parseInt(valorItem) - parseInt(valorPagado);

    var classValorPagado = 'valor-pagado-gris';
    if (valorDiferencia > 0)
        classValorPagado = 'valor-pagado-verde';
    else if (valorDiferencia < 0)
        classValorPagado = 'valor-pagado-rojo';

    $(e).removeClass('valor-pagado-gris valor-pagado-verde valor-pagado-rojo').addClass(classValorPagado);

    var porcentajePagado = (parseInt(valorPagado) * 100 / parseInt(valorItem)).toFixed(2);
    var porcentajeDiferencia = (parseInt(valorDiferencia) * 100 / parseInt(valorItem)).toFixed(2);

    $('[data-porcentaje-pagado][data-item=' + itemId + '][data-mes=' + mesId + ']').val(porcentajePagado);
    $('[data-porcentaje-diferencia][data-item=' + itemId + '][data-mes=' + mesId + ']').val(porcentajeDiferencia);

    $('[data-valor-diferencia][data-item=' + itemId + '][data-mes=' + mesId + ']').val(valorDiferencia);
    $('[data-valor-diferencia][data-item=' + itemId + '][data-mes=' + mesId + ']').removeClass('valor-pagado-gris valor-pagado-verde valor-pagado-rojo').addClass(classValorPagado);

    Utils._InputFormatPrice();
}

function OnBeginAlimentarPresupuestoGeneral(jqXHR, settings) {
    var data = $(this).serializeObject();

    var itemsAlimentacion = [];

    $("input[data-valor-pagado][data-update='true']").each(function () {
        var itemId = $(this).attr("data-item");
        var mes = $(this).attr("data-mes");
        var valor = $(this).formatPriceGetVal();

        itemsAlimentacion.push({
            ItemId: itemId,
            Mes: mes,
            Valor: valor
        });
    });

    data["ItemsAlimentacion"] = itemsAlimentacion;
    settings.data = jQuery.param(data);
    return true;
}

function OnCompleteAlimentarPresupuestoGeneral(response) {
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