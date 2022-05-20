export default {
    resources: {
      upload: {
        success: () => {
          swal({
            title: EXECUTION_ENV!="EXTERNAL"?"Recurso Cargado":"Resource Uploaded",
            text: EXECUTION_ENV!="EXTERNAL"?"El archivo fue cargado correctamente": "The resource was loaded correctly",
            type: "success",
            confirmButtonText: EXECUTION_ENV!="EXTERNAL"?"Aceptar":"Accept",
          });
        },
        error: () => {
          swal({
            title: "Error",
            text: EXECUTION_ENV!="EXTERNAL"?"Algo salió mal":"Something went wrong",
            type: "error",
            confirmButtonText: EXECUTION_ENV!="EXTERNAL"?"Aceptar":"Accept",
          });
        }
      },
      retrieve:{
        fail:() => {
          swal({
            title: "Error",
            text: EXECUTION_ENV!="EXTERNAL"?"Archivo Corrupto":"File Corrupted",
            type: "error",
            confirmButtonText: EXECUTION_ENV!="EXTERNAL"?"Aceptar":"Accept",
          });
        }
      },
      erase:{
        success:() => {
          swal({
            title: EXECUTION_ENV!="EXTERNAL"?"Recurso Eliminado":"Resource deleted",
            text:EXECUTION_ENV!="EXTERNAL"?"El Recurso fue eliminado correctamente": " Resource removed successfully",
            type: "success",
            confirmButtonText: EXECUTION_ENV!="EXTERNAL"?"Aceptar":"Accept",
          });
        }
      }
    },
    feedBack:{
        success:() => {
            swal({
              title: "Feedback",
              text: " Feedback Sent successfully",
              type: "success",
              confirmButtonText: "Accept",
            });
          }
        }
    
}