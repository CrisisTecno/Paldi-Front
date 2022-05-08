export default {
    resources: {
      upload: {
        success: () => {
          swal({
            title: "Resource Uploaded",
            text: "The resource was loaded correctly",
            type: "success",
            confirmButtonText: "Accept",
          });
        },
        error: () => {
          swal({
            title: "Error",
            text: "Something went wrong",
            type: "error",
            confirmButtonText: "Accept",
          });
        }
      },
      retrieve:{
        fail:() => {
          swal({
            title: "Error",
            text: "File Corrupted",
            type: "error",
            confirmButtonText: "Accept",
          });
        }
      },
      erase:{
        success:() => {
          swal({
            title: "Resource deleted",
            text: " Resource removed successfully",
            type: "success",
            confirmButtonText: "Accept",
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