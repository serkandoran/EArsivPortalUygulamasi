import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom'


const HomePage = () => {
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  const [data,setData] = useState([])
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(()=>{
    protectEndPoints()
  },[])
  function protectEndPoints() {
    let token = Cookies.get("Token")
    
    axios.get('http://localhost:5184/api/document/protect', {
      withCredentials: true,
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
    .then((res) => {
      let userRole = res.data
      let sessionData = {
        isLogged: true,
        role: userRole
      }
      dispatch({
        type: "UPDATE_AUTH",
        payload: sessionData
      })
    })
    .catch((err) => {
      console.log(err);
      navigate('/')
    })
  }

  const handleStart = (e)=>{
    setStart(parseInt(e.target.value))
  }
  const handleEnd = (e)=>{
    setEnd(parseInt(e.target.value))
  }
  const submitForm = (e)=>{
    e.preventDefault()
    let token = Cookies.get("Token");
    axios.post('http://localhost:5184/api/document/getdocuments',
      {
        startYear:start,
        endYear:end
      },
      {
         withCredentials:true,
         headers:{
            "Authorization":`Bearer ${token}`
         }
      }
   )
   .then((res)=>{
      setData(res.data)
   })
   .catch((err)=>console.log(err))
  }
  return <form className="row g-3 w-75 border border-secondary-subtle mt-5 m-auto p-5 rounded-2">
    <div className='d-flex align-items-center gap-3 w-100'>
      <div className="col-md-4">
        <label htmlFor="inputState" className="form-label">Başlangıç</label>
        <select value={start} onChange={handleStart} id="inputState" className="form-select" >
          <option disabled></option>
          <option value="1996">1996</option>
          <option value="1997">1997</option>
          <option value="1998">1998</option>
          <option value="1999">1999</option>
          <option value="2000">2000</option>
          <option value="2001">2001</option>
          <option value="2002">2002</option>
          <option value="2003">2003</option>
          <option value="2004">2004</option>
          <option value="2005">2005</option>
          <option value="2006">2006</option>
          <option value="2007">2007</option>
          <option value="2008">2008</option>
          <option value="2009">2009</option>
          <option value="2010">2010</option>
          <option value="2011">2011</option>
          <option value="2012">2012</option>
          <option value="2013">2013</option>
          <option value="2014">2014</option>
          <option value="2015">2015</option>
          <option value="2016">2016</option>
          <option value="2017">2017</option>
          <option value="2018">2018</option>
          <option value="2019">2019</option>
          <option value="2020">2020</option>
          <option value="2021">2021</option>
          <option value="2022">2022</option>
          <option value="2023">2023</option>
          <option value="2024">2024</option>
        </select>
      </div>
      <div className="col-md-4">
        <label htmlFor="inputState" className="form-label">Bitiş</label>
        <select value={end} onChange={handleEnd} id="inputState" className="form-select" >
          <option disabled></option>
          <option value="1996">1996</option>
          <option value="1997">1997</option>
          <option value="1998">1998</option>
          <option value="1999">1999</option>
          <option value="2000">2000</option>
          <option value="2001">2001</option>
          <option value="2002">2002</option>
          <option value="2003">2003</option>
          <option value="2004">2004</option>
          <option value="2005">2005</option>
          <option value="2006">2006</option>
          <option value="2007">2007</option>
          <option value="2008">2008</option>
          <option value="2009">2009</option>
          <option value="2010">2010</option>
          <option value="2011">2011</option>
          <option value="2012">2012</option>
          <option value="2013">2013</option>
          <option value="2014">2014</option>
          <option value="2015">2015</option>
          <option value="2016">2016</option>
          <option value="2017">2017</option>
          <option value="2018">2018</option>
          <option value="2019">2019</option>
          <option value="2020">2020</option>
          <option value="2021">2021</option>
          <option value="2022">2022</option>
          <option value="2023">2023</option>
          <option value="2024">2024</option>
        </select>
      </div>
      <div onClick={submitForm} className="col-12 w-100 btn-block mt-auto">
        <button className="btn btn-primary">Arama Yap</button>
      </div>
    </div>

    {
      data.map((el,idx)=>{
        return <div key={idx} className="list-group cursor-pointer">
          <a href="/" target="_blank" className="list-group-item list-group-item-action disable-a">
            <div className="d-flex w-100 justify-content-between">
              <h5 className="mb-1">{el.documentDescription}</h5>
            </div>
            <p className="mb-1">Tarih: {el.documentCreatedDate}</p>
          </a>
      </div> 
      }) 
    }

</form>
}

export default HomePage