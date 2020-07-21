
export const validarUsuario = () => {
    var emailUser = localStorage.getItem('email');
    if( emailUser == null || emailUser == '')
        return false;
    return true;
}