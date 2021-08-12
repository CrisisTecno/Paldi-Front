pdApp.filter('catalogStatus', function () {

    return function(type) {

        switch (type){
            case 'UPLOADED': return 'Cargado';
            case 'IMPORTED': return 'Exitoso';
            case 'EXPIRED': return 'Expirado';
            case 'BAD_FORMAT': return 'Formato incorrecto';
            case 'FAILED': return 'Fallido';
        }
        return '';

    };
});