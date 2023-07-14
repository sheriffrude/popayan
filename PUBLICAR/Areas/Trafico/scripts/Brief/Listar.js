var $TABLA_LISTA_BRIEF = null;

function OnLoadListarBrief() {
    ConstruirTablaListaBrief();
}

function ConstruirTablaListaBrief() {
    $TABLA_LISTA_BRIEF = $("#tabla-Listar_Brief").DataTable({
        "ajax": {
            "url": URL_LISTAR_LISTAR_BRIEF,
            "type": "POST",
            "data": function (d) {
                d.search['value'] = '';
                d.otId = $("#OtId").val();
                return $.extend({}, d, {
                    "adicional": {}
                });
            },
        }, "columns": [
            { "data": "Producto" },
            { "data": "DesarrolladoPor" },
            { "data": "FechaCreacion" },
            { "data": "FechaEntrega" },
            {
                "data": "BriefId",
                "render": function (data, type, full, meta) {
                    return '<button type="button" class="btn btn-secondary" onclick="DescargarBrief(' + data + ')" >Descargar</button>';
                }
            },
            {
                "data": "Estado",
                "orderable": false,
                "width": "10%",
                "render": function (data, type, full, meta) {
                    var resultado = "";
                    resultado = '<div class="btn-group">' +
                        '<button type= "button" class="btn btn-default dropdown-toggle" data-toggle="dropdown"> Acciones <span class="caret"></span ></button>' +
                        '<ul class="dropdown-menu">' +
                        '<li><a href="' + URL_VER_BRIEF + '?id=' + full.OtId + '&idEmpresa=' + full.EmpresaId + '&idBrief=' + full.BriefId + '" data-toggle="modal" data-target="#" data-size="all" >Ver detalle</a></li>' +
                        '<li><a href="' + URL_CREAR_VERSION_BRIEF + '?id=' + full.OtId + '&idEmpresa=' + full.EmpresaId + '&idBrief=' + full.BriefId + '" data-toggle="modal" data-execute-onload="OnLoadCrearVersionBrief" data-target="#" data-size="all">Nueva versión</a></li>';
                    if (full.UrlArchivo != null)
                        resultado += '<li><a href="' + full.UrlArchivo + '" target="_blank">Descargar Archivo Adjunto</a></li></ul></div>';
                    else
                        resultado += '</ul></div>';
                    return resultado;
                }
            }
        ],
        "drawCallback": function (settings) {
            Utils._BuilderModal();

        }
    });
}

function DescargarBrief(id) {
    var parameters = {
        BriefId: id,
        BaseUrl: ForDefault._UrlBase
    };
    ReportsP._Download("PDF", "Trafico/Brief/Brief.trdp", parameters);
}