import axios from "axios";

const Hello = () => {
    return (
        <>
            <h1>CA Austin on Duty</h1>
            <button onClick={()=>{
                axios.get("http://localhost:8080/test").then((res) => {
                    alert(`backend sent: ${res.data.message}`);
                })
            }}>Make a get request to backend</button>
        </>
    );
  }
  
  export default Hello;
  