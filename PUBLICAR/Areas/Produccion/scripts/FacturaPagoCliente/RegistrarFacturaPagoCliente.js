/**
*VARIABLES GLOBALES
*/
var EMPRESA_ID = null;
var EMPRESA_ID = null;
var PRESUPUESTO_ID = null;
var EMPRESA_ID = null;
var IMPUESTO = [];
var ORDEN = 1;

$(function () {
    $.datepicker.setDefaults($.datepicker.regional["es"]);
    $("#FechaPago").datepicker({
        dateFormat: 'dd/mm/yy',
        firstDay: 1
    }).datepicker("setDate", new Date()).val('');

    Utils._InputFormatPrice();
})

var formatNumber = {
    separador: ",", // separador para los miles
    sepDecimal: '.', // separador para los decimales
    formatear: function (num) {
        num += '';
        var splitStr = num.split(',');
        var splitLeft = splitStr[0];
        var splitRight = splitStr.length > 1 ? this.sepDecimal + splitStr[1] : '';
        var regx = /(\d+)(\d{3})/;
        while (regx.test(splitLeft)) {
            splitLeft = splitLeft.replace(regx, '$1' + this.separador + '$2');
        }
        return this.simbol + splitLeft + splitRight;
    },
    new: function (num, simbol) {
        this.simbol = simbol || '';
        return this.formatear(num);
    }
}

/**
 * Funcion para limpiar todos los elementos de la vista pago a clientes 
 */
function LimpiarTodosCampos() {

    document.getElementById('EmpresaId').selectedIndex = 0;
    Utils._ClearDropDownList($("#ClienteId"));
    Utils._ClearDropDownList($("#PresupuestoId"));
    Utils._ClearDropDownList($("#FacturaId"));

    $("#valor-factura").val("");
    $("#valor-total-factura").val("");
    $("#pendiente-por-pagar").val("");
    $("#valor-total-pagado").val("");

    $("#ValorPagado").val("");
    $("#FechaPago").val("");

    document.getElementById('TipoPagoId').selectedIndex = 0;

    $("#valor-pago").val("");

    $("#total-impuestos").val("");

    $("#valor-real-subtotal").val("");
    $("#valor-real-descuento").val("");
    $("#valor-real-total").val("");

    $("div[name='cajaNombre']").each(function () {
        if ($(this).attr('data-orden')) {
            $(this).empty();
        }
    });

    $("div[name='cajaValor']").each(function () {
        if ($(this).attr('data-orden')) {
            $(this).empty();
        }
    });

    IMPUESTO = [];
}


/**
 * Funcion limpiar campos cuando hay un cambio en un select
 */
function LimpiarCampos() {
    $("#valor-factura").val("");
    $("#valor-total-factura").val("");
    $("#pendiente-por-pagar").val("");
    $("#valor-total-pagado").val("");

    $("#ValorPagado").val("");
    $("#FechaPago").val("");

    document.getElementById('TipoPagoId').selectedIndex = 0;

    $("#valor-pago").val("");

    $("#total-impuestos").val("");

    $("#valor-real-subtotal").val("");
    $("#valor-real-descuento").val("");
    $("#valor-real-total").val("");

    $("div[name='cajaNombre']").each(function () {
        if ($(this).attr('data-orden')) {
            $(this).empty();
        }
    });

    $("div[name='cajaValor']").each(function () {
        if ($(this).attr('data-orden')) {
            $(this).empty();
        }
    });

    IMPUESTO = [];
}





/**
 * Calcular total de pago
 * @param {any} e
 */
function CalcularTotalPago(e) {
    var valorIngresado = parseInt($(e).formatPriceGetVal());
    var valorFactura = parseInt($("#valor-factura").formatPriceGetVal());
    var valorPorPagar = parseInt($("#pendiente-por-pagar").formatPriceGetVal());
    var $valorPago = $("#valor-pago");
    $valorPago.val(formatNumber.new(valorIngresado));
    var facturaId = ($("#FacturaId").val() == "") ? 0 : $("#FacturaId").val();
    if (!facturaId == 0) {
        if (valorPorPagar > 0) {
            if (valorIngresado > valorPorPagar) {
                Utils._BuilderMessage('warning', 'EL VALOR INGRESADO SOBREPASA EL VALOR TOTAL DEL PRESUPUESTO');
                $(e).val("");
                $valorPago.val("");
            }
        } else {
            if (valorPorPagar == 0) {
                Utils._BuilderMessage('warning', 'EL PENDIENTE POR PAGAR ES 0');
                $(e).val("");
                $valorPago.val("");
            }
        }

    } else {
        Utils._BuilderMessage('warning', 'DEBE SELECCIONAR UNA FACTURA');
        $(e).val("");
        $valorPago.val("");
    }

    CalcularRealPagado();
}

/**
 * Agregar un impuesto
 */
function AgregarImpuesto() {
    if (parseInt($("#ValorPagado").formatPriceGetVal()) > 0) {
        if (IMPUESTO != null) {
            var tamanoImpuesto = IMPUESTO.length;

            if (tamanoImpuesto > 0) {
                ORDEN += 1;
            }
        } else {
            impuesto = {
                Nombre: '',
                Valor: 0,
                orden: ORDEN
            }

            IMPUESTO.push(impuesto);
        }


        impuesto = {
            Nombre: '',
            Valor: 0,
            orden: ORDEN
        }

        IMPUESTO.push(impuesto);



        cajaNombre = '<div name="cajaNombre" data-orden="' + ORDEN + '"><label class="control-label">NOMBRE</label> <input type="text" name="nombre-impuesto" class="form-control" onchange="AgregarNombreImpuesto(this, ' + ORDEN + ')"/></div>';
        cajaValor = '<div name="cajaValor" data-orden="' + ORDEN + '"><div class="col-md-12 padding-left-1 padding-right-0 box"><label class="control-label">VALOR IMPUESTO</label></div> ' +
            '<div class="col-md-2 padding-left-1 padding-right-0 box" ><input name="valor-impuesto" class="form-control" data-format-price onkeyup="AgregarValorImpuesto(this, ' + ORDEN + ')" /></div> ' +
            '<div class="col-md-2 padding-left-1  box"><button type="button" class="btn btn-danger btn-md" onclick="EliminarImpuesto(' + ORDEN + ')"><span class="glyphicon glyphicon-remove" aria-hidden="true" ></span></button></div> </div>';

        $("#caja-nombre-Impuesto").prepend(cajaNombre);
        $("#caja-valor-impuesto").prepend(cajaValor);

        console.info(IMPUESTO);
    } else {
        Utils._BuilderMessage('warning', 'DEBE INGRESAR UN VALOR A PAGAR');
    }

    Utils._InputFormatPrice();

}

/**
 * Eliminar impuesto
 * @param {any} orden
 */
function EliminarImpuesto(orden) {


    var tamanoImpuesto = IMPUESTO.length;
    for (i = 0; tamanoImpuesto > i; i++) {
        if (IMPUESTO[i].orden == orden) {
            IMPUESTO.splice(i, 1);
            break;
        };
    }

    $("div[name='cajaNombre']").each(function () {
        if ($(this).attr('data-orden') == orden) {
            $(this).empty();
        }
    });

    $("div[name='cajaValor']").each(function () {
        if ($(this).attr('data-orden') == orden) {
            $(this).empty();
        }
    });

    var valorTotalImpuesto = 0;
    var tamanoImpuesto = IMPUESTO.length;
    for (i = 0; tamanoImpuesto > i; i++) {
        valorTotalImpuesto = (parseInt(valorTotalImpuesto) + parseInt(IMPUESTO[i].Valor));
    }

    $("#total-impuestos").val(formatNumber.new(valorTotalImpuesto));
    CalcularRealPagado();

    console.info(IMPUESTO);

}

/**
 * Agregar el nombre del impuesto
 * @param {any} e
 * @param {any} orden
 */
function AgregarNombreImpuesto(e, orden) {
    var nombreImpuesto = $(e).val();
    if (ExisteNombreImpuesto(nombreImpuesto) == true) {
        var tamanoImpuesto = IMPUESTO.length;
        for (i = 0; tamanoImpuesto > i; i++) {
            if (IMPUESTO[i].orden == orden) {
                IMPUESTO[i].Nombre = nombreImpuesto;
                break;
            };
        }
    } else {
        Utils._BuilderMessage('warning', 'DEBE INGRESAR UN NOMBRE QUE NO SE HAYA USADO');
        var tamanoImpuesto = IMPUESTO.length;
        for (i = 0; tamanoImpuesto > i; i++) {
            if (IMPUESTO[i].orden == orden) {
                IMPUESTO[i].Nombre = "";
                break;
            };
        }
    }

}

/**
 * 
 * @param {any} nombreImpuesto
 */
function ExisteNombreImpuesto(nombreImpuesto) {
    var tamanoImpuesto = IMPUESTO.length;
    for (i = 0; tamanoImpuesto > i; i++) {
        if (IMPUESTO[i].Nombre == nombreImpuesto) {
            return false;
            break;
        };
    }

    return true;
}

/**
 * Agregar el valor del impuesto
 * @param {any} e
 * @param {any} orden
 */
function AgregarValorImpuesto(e, orden) {
    var valorImpuesto = parseInt($(e).formatPriceGetVal());
    var valorPago = parseInt($("#valor-pago").formatPriceGetVal());

    if (valorPago > valorImpuesto) {
        var tamanoImpuesto = IMPUESTO.length;
        for (i = 0; tamanoImpuesto > i; i++) {
            if (IMPUESTO[i].orden == orden) {
                IMPUESTO[i].Valor = valorImpuesto;
                break;
            };
        }

        var valorTotalImpuesto = 0;

        for (i = 0; tamanoImpuesto > i; i++) {
            valorTotalImpuesto = (parseInt(valorTotalImpuesto) + parseInt(IMPUESTO[i].Valor));
        }

        if (valorPago > valorTotalImpuesto) {
            $("#total-impuestos").val(formatNumber.new(valorTotalImpuesto));
            CalcularRealPagado();
        } else {
            Utils._BuilderMessage('warning', 'EL VALOR TOTAL DEL IMPUESTO NO PUEDE SER MAYOR A EL VALOR A PAGAR');
            $(e).val("");
            for (i = 0; tamanoImpuesto > i; i++) {
                if (IMPUESTO[i].orden == orden) {
                    IMPUESTO[i].Valor = 0;
                    break;
                };
            }
            var nuevoValorTotalImpuesto = 0;
            for (i = 0; tamanoImpuesto > i; i++) {
                nuevoValorTotalImpuesto = (parseInt(nuevoValorTotalImpuesto) + parseInt(IMPUESTO[i].Valor));
            }
            $("#total-impuestos").val(formatNumber.new(nuevoValorTotalImpuesto));
            CalcularRealPagado();
        }


    } else {
        Utils._BuilderMessage('warning', 'EL VALOR DEL IMPUESTO NO PUEDE SER MAYOR A EL VALOR A PAGAR');
        $(e).val("");
    }


}



/**
 * Calcular el valor real a pagar
 */
function CalcularRealPagado() {
    var valorPago = parseInt($("#valor-pago").formatPriceGetVal());
    var totalImpuesto = parseInt($("#total-impuestos").formatPriceGetVal());
    totalImpuesto = (totalImpuesto == "") ? 0 : totalImpuesto;
    if (valorPago != 0) {
        if (valorPago == 0) {
            Utils._BuilderMessage('warning', 'DEBE INGRESAR UN VALOR A PAGAR');
        } else {
            $("#valor-real-subtotal").val(formatNumber.new(valorPago));
            $("#valor-real-descuento").val(formatNumber.new(totalImpuesto));
            $("#valor-real-total").val(formatNumber.new(valorPago - totalImpuesto));
        }

    }

}


function OnBeginFormCrearFacturaPagoCliente(jqXHR, settings) {
    var data = $(this).serializeObject();
    var longitudArray = IMPUESTO.length;
    if (longitudArray > 0) {
        var nombreVacio = false;
        for (i = 0; longitudArray > i; i++) {
            if (IMPUESTO[i].Nombre == "") {
                nombreVacio = true;
                break;
            };
        }

        if (nombreVacio == false) {
            data["ListaImpuestos"] = IMPUESTO;
            data.ValorPagado = $("#ValorPagado").formatPriceGetVal();
            settings.data = jQuery.param(data);
            return true;
        } else {

            Utils._BuilderMessage('warning', 'TODOS LOS IMPUESTOS DEBEN LLEVAR NOMBRE');
        }


    } else {
        data.ValorPagado = $("#ValorPagado").formatPriceGetVal();
        settings.data = jQuery.param(data);
        return true;
    }

}

function OnCompleteFacturaPagoFacturaCliente(response) {
    var resultado = RequestHttp._ValidateResponse(response);

    if (resultado != null) {
        var mensaje = "";
        var tipoMensaje = "danger";
        if (resultado.state == true) {
            tipoMensaje = "success"
            mensaje = resultado.message + " " + resultado.data;
            IMPUESTO = [];
            LimpiarTodosCampos();

        }
        Utils._BuilderMessage(tipoMensaje, mensaje);
    }
}





