export const getProducts = () => async(dispatch) => {
  // we can also use axcios instead of this
  try{
    //  const data = await fetch("/getproducts" , {
     const data = await fetch(`${process.env.REACT_APP_BACKEND_URL}/getproducts` , {
        method: "GET",
        headers: {
            "Content-Type" : "application/json"
        }
     });

     const res = await data.json();
    //  console.log(res);
     dispatch({type: "SUCCESS_GET_PRODUCTS" , payload: res});

  }catch(error) {
    dispatch({type: "FAIL_GET_PRODUCTS" , payload: error.response});
  }
}


