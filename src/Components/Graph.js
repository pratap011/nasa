import {React,useState,useEffect} from 'react'
import axios from 'axios'
import {Bar} from 'react-chartjs-2'
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import "bootstrap/dist/css/bootstrap.min.css";
import '../Graph.css'
import Stats from './Stats';

Chart.register(CategoryScale);

const Graph = () => {
    const b=false;
    const [startDate,setStartDate]=useState();
    const [endDate,setEndDate]=useState();
    const [clicked,setClicked]=useState(false);
    const [data,setData]=useState({dataset:{}})
    const [start,setStart]=useState(false)
    const [chartData,setChartData]=useState({
        labels: [],
        datasets: [
          {
            label: 'My First Dataset',
            data: [],
            fill: true,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.2
          }
        ]
      })
    const [avg,setAvg]=useState();
    const [mindis,setMindis]=useState(0);
    const [vel,setVel]=useState(0);

    useEffect(()=>{
        if(start){
            axios.get(`https://api.nasa.gov/neo/rest/v1/feed?start_date=${startDate}&end_date=${endDate}&api_key=1s6KY3rFqhhGkYOfOW43C9hP0Kwt7OZVSIqIOZb8`)
        .then((res)=>{
            setData({...data,dataset:res.data.near_earth_objects})
        })
        }
        
    },[clicked])

    useEffect(()=>{
        if(start){
            console.log(Object.keys(data.dataset))
        var d=[];
        var aver=[];
        Object.keys(data.dataset).map((o)=>{
            d.push(data.dataset[o].length)
            
                data.dataset[o].map((ev)=>{
                    if(vel==0){
                        setVel(ev["close_approach_data"][0]["relative_velocity"]["kilometers_per_second"])
                    }
                    else if(ev["close_approach_data"][0]["relative_velocity"]["kilometers_per_second"]>vel){
                        setVel(ev["close_approach_data"][0]["relative_velocity"]["kilometers_per_second"])
                    }
                    if(mindis==0){
                        setMindis(ev["close_approach_data"][0]["miss_distance"]["kilometers"])
                    }
                    else if(ev["close_approach_data"][0]["miss_distance"]["kilometers"]<mindis){
                        setMindis(ev["close_approach_data"][0]["miss_distance"]["kilometers"])
                    }
                    aver.push(ev["estimated_diameter"]["kilometers"]["estimated_diameter_max"])


            })
        var s=0
        for(let i=0;i<aver.length;i++){
            s+=aver[i]
        }
        setAvg(s/aver.length)

        })

        setChartData({...chartData,labels:Object.keys(data.dataset)})
        setChartData({labels:Object.keys(data.dataset),datasets:[
            {
              label: 'Asteroids near earth',
              data:d,
              fill: true,
              borderColor: 'rgb(72, 0,0)',
              tension: 0.1
            }
          ]})
        }
      
        

    },[data.dataset])

    const submitHandler=()=>{
        setStart(true);
        setClicked(!clicked);
        return (<h2>Please wait while the data loads</h2>)
    }


  return (
      <div>
        <h1 style={{color:"white"}}>Comparison chart</h1>
        <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-sm-6">
          <div className="card">
            <div className="card-header">Date Input</div>
            <div className="card-body">
              <form>
                <div className="form-group">
                  <label htmlFor="start-date">Start Date:</label>
                  <input
                    type="date"
                    id="start-date"
                    className="form-control"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="end-date">End Date:</label>
                  <input
                    type="date"
                    id="end-date"
                    className="form-control"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>

                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={submitHandler}
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
        {
            chartData.labels.length?<div className='graph'><Bar data={chartData}/>
            {
                avg?<div className="container mt-5">
                <div className="row justify-content-center">
                  <div className="col-sm-6">
                    <div className="card">
                      <div style={{background:"lightblue"}} className="card-header">Other Details</div>
                      <div className="card-body">
                        <ul className="list-group list-group-flush">
                          <li className="list-group-item">
                            Average Distance: <strong>{avg} km</strong>
                          </li>
                          <li className="list-group-item">
                            Maximum Velocity: <strong>{vel} km</strong>
                          </li>
                          <li className="list-group-item">
                            Minimum Distance: <strong>{mindis} km</strong>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>:<p></p>
            }
            </div>:<h2>No Data Yet</h2>
        }
        
      </div>
  )
}

export default Graph