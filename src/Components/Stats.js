import {React,useState,useEffect} from 'react'
import axios from 'axios'

const Stats = ({startDate,endDate}) => {
    console.log(startDate,endDate)
    const [data,setData]=useState({})
    useEffect(()=>{
            axios.get(`https://api.nasa.gov/neo/rest/v1/feed?start_date=${startDate}&end_date=${endDate}&api_key=1s6KY3rFqhhGkYOfOW43C9hP0Kwt7OZVSIqIOZb8`)
        .then((res)=>{
            setData(res.data)
            console.log(data)
        })
        
        
    },[endDate])


  return (
      <p>Stats will be displayed here</p>
    
  )
}

export default Stats