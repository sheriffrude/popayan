$(function () {
    AprobacionCancelacionPresupuestoListar.OnLoad();
});

var AprobacionCancelacionPresupuestoListar = {
    $TABLA: null,
    OnLoad: function () {
        this.CrearTabla();
        $("#form-filtro-tabla")[0].reset();
        $("#form-filtro-tabla").submit(this.RecargarTabla);
    },
    CrearTabla: function () {
        var filtro = $("#input-filtro");
        //var $mostrar = $filtro.val();
        //alert(filtro.val());
        console.log(filtro, URL_APROBACION_PRESUPUESTO_LISTAR, $("#Estado").val());
        this.$TABLA = $("#tabla_aprobaciones_presupuestos").DataTable({
            "scrollX": true,
            "ajax": {
                "url": URL_APROBACION_PRESUPUESTO_LISTAR,
                "type": "POST",
                "data": function (d) {
                    d.search["value"] = filtro.val();
                    d.estado = $("#Estado").val();
                    return $.extend({}, d, {
                        "adicional": {}
                    });
                }
            },
            "columns": [
                {
                    "data": "PresupuestoId",
                    "render": function (data, type, full, meta) {
                        var url = URL_PRESUPUESTO_CONSULTAR + '/' + data;
                        var html = '<a href="' + url + '" target="_blank" class="btn btn-secondary" >Abrir # ' + data + '</a>';
                        return html;
                    }
                },
                {
                    "data": "AprobacionCancelacionPresupuestoGrupoUsuarioId",
                    "render": function (data, type, full, meta) {
                        var html = '';
                        if (full.EstadoId == 1) {///Pendiente
                            var url = URL_APROBACION_PRESUPUESTO_RESPONDER + '/' + data;
                            html = '<a href="' + url + '"  data-toggle="modal" data-target="#" class="btn btn-secondary" >Aprobar/Rechazar</a>';
                        }
                        return html;
                    }
                },
                { "data": "VersionInterna" },
                { "data": "VersionExterna" },
                { "data": "PresupuestoTipo" },
                { "data": "Empresa" },
                { "data": "Cliente" },
                { "data": "Producto" },
                { "data": "OrdenTrabajo" },
                { "data": "EnviadoPor" },
                { "data": "FechaHora" },
                {
                    "data": "Estado",
                    "render": function (data, type, full, meta) {
                        var html = '<label>' + data + '</label>';
                        var url = URL_JERARQUIA_APROBACION_PRESUPUESTO_LISTAR + '/' + full.PresupuestoId;
                        html += '<a href="' + url + '" class="btn btn-secondary" data-size="lg" data-toggle="modal" data-target="#" data-execute-onload="AprobacionCancelacionPresupuestoListarJerarquia.Onload" >Ver Jerarquía</a>';
                        return html;
                    }
                },
            ],
            "drawCallback": function (settings) {
                Utils._BuilderModal();
            }
        });
    },
    RecargarTabla: function () {
        AprobacionCancelacionPresupuestoListar.$TABLA.draw();
        return false;
    },
    RecargarTablaPage: function () {
        AprobacionCancelacionPresupuestoListar.$TABLA.draw("Page");
        return false;
    },
    ResetearFiltroTabla: function () {
        $("#form-filtro-tabla")[0].reset();
        AprobacionCancelacionPresupuestoListar.RecargarTabla();
        Utils._BuilderDropDown();
    },
}