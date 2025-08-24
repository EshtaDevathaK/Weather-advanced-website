
import Card from '@mui/material/Card';

import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';

import Typography from '@mui/material/Typography';
import  "./InfoBox.css";
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import ThunderstormIcon from '@mui/icons-material/Thunderstorm';


export default function InfoBox({info}){
 
    const INIT_URL =
    "https://images.unsplash.com/photo-1641970304289-77c942a40292?q=80&w=1335&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

  const HOT_URL = 
  "https://images.unsplash.com/photo-1527736848781-72dc3b2ee00f?q=80&w=1417&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
  const COLD_URL = 
  "https://plus.unsplash.com/premium_photo-1732736591323-3a9d10e4d96e?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
  const RAIN_URL = 
  "https://media.istockphoto.com/id/2166330742/photo/mumbai-monsoon-man.jpg?s=612x612&w=0&k=20&c=Sr0Afvr_zrI3eC9UKly9F0JxiOQRMDtpwHuwjATnlkM=";

    return(
        <div className="InfoBox">
           
            <div className="cardContainer">

            {/* From Material UI cards */}
            <Card
  sx={{
    maxWidth: 350,
    borderRadius: "100px",
    boxShadow: "2px 4px 10px rgba(0, 0, 0, 0.2)",
    transition: "all 0.3s ease-in-out",
    "&:hover": {
      transform: "scale(1.02)",
      boxShadow: "4px 6px 15px rgba(0, 0, 0, 0.3)",
    },
  }}
>

      <CardMedia
        sx={{ height: 250}}
        image=
        {
          info.humidity > 80 ? RAIN_URL 
          : info.temp > 15 ? HOT_URL : COLD_URL
          }
       
          title="green iguana"
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          { info.city } {
          info.humidity > 80 ? <ThunderstormIcon/>
          : info.temp > 15 ? <WbSunnyIcon/> : <AcUnitIcon/>
        }
         
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' , fontStyle: "oblique"}}>
          <p>Temparature = {info.temp}&deg;C</p>
          <p>humidity = {info.humidity}</p>
          <p>tempMax = {info.tempMax}&deg;C</p>
          <p>tempMin = {info.tempMin}&deg;C</p>
          <p>The Weather Feels Like <b><i>{info.weather}</i></b> and The Circum.. Goes on  {info.feels_like}&deg;C</p>
        </Typography>
      </CardContent>
     
    </Card>
    </div>
        </div>
    )
}



