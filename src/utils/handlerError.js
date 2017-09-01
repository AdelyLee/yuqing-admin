/**
 * Created by lyc on 17-9-1.
 */
export const handlerError = (error, vue) => {
    let {response, message} = error;
    if (response) {
        let {code, message} = response.data;
        if (code === 401) {
            vue.$confirm(message, '错误', {type: 'error'}).then(() => {
                vue.$router.push('/login');
            });
        } else if (code === 'error') {
            vue.$confirm(message, '错误', {type: 'error'});
        } else {
            vue.$confirm(message, '错误', {type: 'error'});
        }
    } else {
        vue.$confirm(message, '错误', {type: 'error'});
    }
}
