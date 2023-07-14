var tablaSalarios = null;

var ListarSalarioIntegral = function () {
    return {
        
        urlListar: "",
        urlAgregar: "",
        urlEditar: "",

        //Carga inicial que recibe las url de cada CRUD
        init: function (listar){//, agregar, editar) {
            //this.urlListar = listar;
            //this.urlAgregar = agregar;
            //this.urlEditar = editar;
           
            ListarSalarioIntegral.construirTabla();
        },

        reconstruirTabla: function () {
            tablaSalarios.draw();
        },

        ResetearTablaPais: function () {
            $("#input-filtro").val("");
            this.reconstruirTabla();
        },

        //Construye la tabla de salarios integrales
        construirTabla: function () {
            var filtro = $("#input-filtro");
            tablaSalarios = $("#tabla-salario-integral").DataTable({
                "ajax": {
                    "url": urlListar,
                    "type": "POST",
                    "data": function (d) {
                        d.search['value'] = filtro.val();
                        return $.extend({}, d, {
                            "adicional": {}
                        });
                    },

                }, "columns": [
                    {
                        "data": "Periodo"
                    },
                    { "data": "Anio" },
                    { "data": "Valor" },
                    { "data": "Estado" },
                    {
                        "data": "Id",
                        "orderable": false,
                        "searchable": false,
                        "width": "5%",
                        "render": function (data, type, full, meta) {
                            return '<a href="' + urlEditar + '?id=' + data + '" data-toggle="modal" data-target="#" class="btn btn-parametrizacion btn-sm" >Editar</a>';
                        }
                    }
                ],
                "drawCallback": function (settings) {
                    Utils._BuilderModal();
                }
            });
        }
    }
}();

$(function () {
    ListarSalarioIntegral.init();
});

